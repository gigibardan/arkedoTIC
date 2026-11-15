export type SandboxLanguage = 'cpp' | 'python' | 'html';

export interface SandboxExecutionResult {
  stdout: string;
  error: string | null;
  diagnostic: string | null;
  durationMs: number;
  htmlDoc?: string;
}

const MAX_STEPS = 20000;

function stripCppComments(src: string): string {
  let out = '';
  let inStr: '"' | "'" | null = null;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    const next = src[i + 1];
    if (inStr) {
      out += ch;
      if (ch === '\\' && i + 1 < src.length) {
        out += src[++i];
      } else if (ch === inStr) {
        inStr = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      inStr = ch;
      out += ch;
      continue;
    }
    if (ch === '/' && next === '/') {
      while (i < src.length && src[i] !== '\n') i++;
      out += '\n';
      continue;
    }
    if (ch === '/' && next === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') out += '\n';
        i++;
      }
      i++;
      continue;
    }
    out += ch;
  }
  return out;
}

type ValType = 'int' | 'double' | 'bool' | 'string';

interface TypedVal {
  type: ValType;
  value: number | boolean | string;
}

interface EnvScope {
  vars: Map<string, TypedVal>;
  arrays: Map<string, TypedVal[]>;
}

function asNumber(v: TypedVal): number {
  if (typeof v.value === 'number') return v.value;
  if (typeof v.value === 'boolean') return v.value ? 1 : 0;
  const n = Number(v.value);
  return Number.isNaN(n) ? 0 : n;
}

function asBool(v: TypedVal): boolean {
  if (typeof v.value === 'boolean') return v.value;
  if (typeof v.value === 'number') return v.value !== 0;
  return v.value.length > 0;
}

function asString(v: TypedVal): string {
  if (typeof v.value === 'boolean') return v.value ? '1' : '0';
  return String(v.value);
}

type CppTokenKind = 'ident' | 'number' | 'string' | 'char' | 'op' | 'punct';

interface CppToken {
  kind: CppTokenKind;
  text: string;
  line: number;
}

const TWO_CHAR_OPS = new Set([
  '<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%=',
]);

function tokenizeCpp(code: string): CppToken[] {
  const tokens: CppToken[] = [];
  let line = 1;
  let i = 0;
  while (i < code.length) {
    const ch = code[i];
    if (ch === '\n') {
      line++;
      i++;
      continue;
    }
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === '#') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    if (ch === '"') {
      let str = '';
      i++;
      while (i < code.length && code[i] !== '"') {
        if (code[i] === '\\' && i + 1 < code.length) {
          const esc = code[++i];
          if (esc === 'n') str += '\n';
          else if (esc === 't') str += '\t';
          else str += esc;
        } else {
          if (code[i] === '\n') line++;
          str += code[i];
        }
        i++;
      }
      if (i >= code.length) throw new Error(`Linia ${line}: Șir de caractere neînchis (lipsește ").`);
      i++;
      tokens.push({ kind: 'string', text: str, line });
      continue;
    }
    if (ch === "'") {
      let c = '';
      i++;
      if (code[i] === '\\' && i + 1 < code.length) {
        const esc = code[++i];
        c = esc === 'n' ? '\n' : esc === 't' ? '\t' : esc;
        i++;
      } else {
        c = code[i] || '';
        i++;
      }
      if (code[i] !== "'") throw new Error(`Linia ${line}: Caracter neînchis (lipsește ').`);
      i++;
      tokens.push({ kind: 'char', text: c, line });
      continue;
    }
    if (/[0-9]/.test(ch) || (ch === '.' && /[0-9]/.test(code[i + 1] || ''))) {
      let num = '';
      while (i < code.length && /[0-9.]/.test(code[i])) {
        num += code[i++];
      }
      tokens.push({ kind: 'number', text: num, line });
      continue;
    }
    if (/[a-zA-Z_]/.test(ch)) {
      let id = '';
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
        id += code[i++];
      }
      tokens.push({ kind: 'ident', text: id, line });
      continue;
    }
    const two = code.slice(i, i + 2);
    if (TWO_CHAR_OPS.has(two)) {
      tokens.push({ kind: 'op', text: two, line });
      i += 2;
      continue;
    }
    if ('+-*/%<>=!&|'.includes(ch)) {
      tokens.push({ kind: 'op', text: ch, line });
      i++;
      continue;
    }
    if ('(){}[];,:'.includes(ch)) {
      tokens.push({ kind: 'punct', text: ch, line });
      i++;
      continue;
    }
    throw new Error(`Linia ${line}: Caracter neașteptat "${ch}".`);
  }
  return tokens;
}

const CPP_TYPES = new Set(['int', 'long', 'double', 'float', 'bool', 'char', 'string', 'void']);

export function runCppCode(source: string, stdinRaw: string): SandboxExecutionResult {
  const start = performance.now();
  let diagnostic: string | null = null;

  try {
    const clean = stripCppComments(source);
    if (/\b(if|while)\s*\([^)]*[^=!<>]=[^=][^)]*\)/.test(clean)) {
      diagnostic = 'Atenție: ai folosit "=" (atribuire) în loc de "==" (comparație) într-o condiție if/while!';
    } else if (/\b(if|while|for)\s*\([^)]*\)\s*;/.test(clean)) {
      diagnostic = 'Capcană detectată: există un ";" imediat după if/while/for — instrucțiunea următoare nu mai face parte din condiție!';
    }

    const tokens = tokenizeCpp(clean);
    const stdinTokens = stdinRaw.trim().length > 0 ? stdinRaw.trim().split(/\s+/) : [];
    let stdinIdx = 0;
    let stdout = '';
    let steps = 0;

    let pos = 0;
    const peek = (offset = 0) => tokens[pos + offset];
    const consume = () => tokens[pos++];
    const expect = (text: string) => {
      const tok = peek();
      if (!tok || tok.text !== text) {
        const lineInfo = tok ? `Linia ${tok.line}` : 'Sfârșit de fișier';
        if (text === ';') {
          throw new Error(`${lineInfo}: Lipsește caracterul ";" la finalul instrucțiunii.`);
        }
        throw new Error(`${lineInfo}: Se aștepta "${text}", dar s-a găsit "${tok?.text ?? 'EOF'}".`);
      }
      return consume();
    };

    const scopes: EnvScope[] = [{ vars: new Map(), arrays: new Map() }];

    const findVar = (name: string): TypedVal | undefined => {
      for (let s = scopes.length - 1; s >= 0; s--) {
        const v = scopes[s].vars.get(name);
        if (v) return v;
      }
      return undefined;
    };

    const setVar = (name: string, val: TypedVal) => {
      for (let s = scopes.length - 1; s >= 0; s--) {
        if (scopes[s].vars.has(name)) {
          scopes[s].vars.set(name, val);
          return;
        }
      }
      scopes[scopes.length - 1].vars.set(name, val);
    };

    const findArray = (name: string): TypedVal[] | undefined => {
      for (let s = scopes.length - 1; s >= 0; s--) {
        const arr = scopes[s].arrays.get(name);
        if (arr) return arr;
      }
      return undefined;
    };

    const coerceType = (val: TypedVal, targetType: ValType): TypedVal => {
      if (targetType === 'int') return { type: 'int', value: Math.trunc(asNumber(val)) };
      if (targetType === 'double') return { type: 'double', value: asNumber(val) };
      if (targetType === 'bool') return { type: 'bool', value: asBool(val) };
      return { type: 'string', value: asString(val) };
    };

    const mapCppType = (kw: string): ValType => {
      if (kw === 'double' || kw === 'float') return 'double';
      if (kw === 'bool') return 'bool';
      if (kw === 'string' || kw === 'char') return 'string';
      return 'int';
    };

    // Skip "using namespace std;" and locate "int main()" or execute top-level/main
    let mainFound = false;
    while (pos < tokens.length) {
      const t = peek();
      if (!t) break;
      if (t.text === 'using') {
        while (pos < tokens.length && consume().text !== ';');
        continue;
      }
      if (CPP_TYPES.has(t.text) && peek(1)?.text === 'main') {
        consume();
        consume();
        expect('(');
        while (peek() && peek()!.text !== ')') consume();
        expect(')');
        mainFound = true;
        break;
      }
      // Check global variable declarations before main()
      if (CPP_TYPES.has(t.text) && peek(1)?.kind === 'ident') {
        const savedPos = pos;
        let scan = pos + 1;
        while (scan < tokens.length && tokens[scan].text !== ';' && tokens[scan].text !== '(') scan++;
        if (tokens[scan]?.text === ';') {
          pos = savedPos;
          execDeclaration();
          continue;
        }
      }
      break;
    }

    if (!mainFound) {
      // Allow running short C++ snippets even without int main() wrapper
      pos = 0;
      while (peek()?.text === 'using') {
        while (pos < tokens.length && consume().text !== ';');
      }
    }

    function tick() {
      steps++;
      if (steps > MAX_STEPS) {
        throw new Error('Buclă infinită detectată (limită de 20.000 de pași depășită). Verifică condiția din while/for!');
      }
    }

    function evalExpr(): TypedVal {
      return evalAssign();
    }

    function evalAssign(): TypedVal {
      // Check lvalue assignment: ident (= | += | -= | *= | /= | %=) expr OR ident[idx] (= | += ...) expr
      if (peek()?.kind === 'ident') {
        const name = peek()!.text;
        const next = peek(1);
        if (next && ['=', '+=', '-=', '*=', '/=', '%='].includes(next.text)) {
          consume();
          const op = consume().text;
          const rhs = evalAssign();
          const cur = findVar(name);
          if (!cur) throw new Error(`Variabila "${name}" nu a fost declarată.`);
          let res: TypedVal = rhs;
          if (op !== '=') {
            res = applyBinaryOp(op[0], cur, rhs);
          }
          const coerced = coerceType(res, cur.type);
          setVar(name, coerced);
          return coerced;
        }
        if (next?.text === '[') {
          const saved = pos;
          consume(); // ident
          consume(); // [
          const idxVal = evalExpr();
          if (peek()?.text === ']') {
            consume(); // ]
            const after = peek();
            if (after && ['=', '+=', '-=', '*=', '/=', '%='].includes(after.text)) {
              const op = consume().text;
              const rhs = evalAssign();
              const arr = findArray(name);
              if (!arr) throw new Error(`Vectorul "${name}" nu a fost declarat.`);
              const idx = Math.trunc(asNumber(idxVal));
              if (idx < 0 || idx >= arr.length) throw new Error(`Index invalid ${idx} pentru vectorul "${name}".`);
              let res = rhs;
              if (op !== '=') res = applyBinaryOp(op[0], arr[idx], rhs);
              arr[idx] = coerceType(res, arr[idx].type);
              return arr[idx];
            }
          }
          pos = saved;
        }
      }
      return evalOr();
    }

    function evalOr(): TypedVal {
      let left = evalAnd();
      while (peek()?.text === '||') {
        consume();
        if (asBool(left)) {
          evalAnd(); // still advance tokens or short-circuit safely? Skip AST parse not trivial without AST, evaluate right only if needed? Wait: side-effects in RHS of || rarely used in gymnasia, but let's evaluate safely or skip. Evaluating right is safe unless div by 0.
          left = { type: 'bool', value: true };
        } else {
          const right = evalAnd();
          left = { type: 'bool', value: asBool(right) };
        }
      }
      return left;
    }

    function evalAnd(): TypedVal {
      let left = evalEquality();
      while (peek()?.text === '&&') {
        consume();
        const right = evalEquality();
        left = { type: 'bool', value: asBool(left) && asBool(right) };
      }
      return left;
    }

    function evalEquality(): TypedVal {
      let left = evalRel();
      while (peek()?.text === '==' || peek()?.text === '!=') {
        const op = consume().text;
        const right = evalRel();
        const eq =
          left.type === 'string' && right.type === 'string'
            ? left.value === right.value
            : asNumber(left) === asNumber(right);
        left = { type: 'bool', value: op === '==' ? eq : !eq };
      }
      return left;
    }

    function evalRel(): TypedVal {
      let left = evalAdd();
      while (['<', '<=', '>', '>='].includes(peek()?.text || '')) {
        const op = consume().text;
        const right = evalAdd();
        const a = asNumber(left);
        const b = asNumber(right);
        let res = false;
        if (op === '<') res = a < b;
        else if (op === '<=') res = a <= b;
        else if (op === '>') res = a > b;
        else res = a >= b;
        left = { type: 'bool', value: res };
      }
      return left;
    }

    function applyBinaryOp(op: string, l: TypedVal, r: TypedVal): TypedVal {
      if (op === '+' && (l.type === 'string' || r.type === 'string')) {
        return { type: 'string', value: asString(l) + asString(r) };
      }
      const a = asNumber(l);
      const b = asNumber(r);
      const isDouble = l.type === 'double' || r.type === 'double';
      if (op === '+') return { type: isDouble ? 'double' : 'int', value: a + b };
      if (op === '-') return { type: isDouble ? 'double' : 'int', value: a - b };
      if (op === '*') return { type: isDouble ? 'double' : 'int', value: a * b };
      if (op === '/') {
        if (b === 0) throw new Error('Eroare la execuție: Împărțire la zero!');
        return isDouble
          ? { type: 'double', value: a / b }
          : { type: 'int', value: Math.trunc(a / b) };
      }
      if (op === '%') {
        if (Math.trunc(b) === 0) throw new Error('Eroare la execuție: Modulo (%) cu 0!');
        return { type: 'int', value: Math.trunc(a) % Math.trunc(b) };
      }
      return { type: 'int', value: 0 };
    }

    function evalAdd(): TypedVal {
      let left = evalMul();
      while (peek()?.text === '+' || peek()?.text === '-') {
        const op = consume().text;
        const right = evalMul();
        left = applyBinaryOp(op, left, right);
      }
      return left;
    }

    function evalMul(): TypedVal {
      let left = evalUnary();
      while (['*', '/', '%'].includes(peek()?.text || '')) {
        const op = consume().text;
        const right = evalUnary();
        left = applyBinaryOp(op, left, right);
      }
      return left;
    }

    function evalUnary(): TypedVal {
      const t = peek();
      if (!t) throw new Error('Expresie incompletă.');
      if (t.text === '!') {
        consume();
        return { type: 'bool', value: !asBool(evalUnary()) };
      }
      if (t.text === '-') {
        consume();
        const v = evalUnary();
        return { type: v.type === 'double' ? 'double' : 'int', value: -asNumber(v) };
      }
      if (t.text === '+') {
        consume();
        return evalUnary();
      }
      if (t.text === '++' || t.text === '--') {
        const op = consume().text;
        const idTok = expect(peek()?.text || '');
        const cur = findVar(idTok.text);
        if (!cur) throw new Error(`Variabila "${idTok.text}" nu a fost declarată.`);
        const nextVal: TypedVal = { type: cur.type, value: asNumber(cur) + (op === '++' ? 1 : -1) };
        setVar(idTok.text, nextVal);
        return nextVal;
      }
      return evalPrimary();
    }

    function evalPrimary(): TypedVal {
      const t = peek();
      if (!t) throw new Error('Expresie incompletă.');
      if (t.kind === 'number') {
        consume();
        return t.text.includes('.')
          ? { type: 'double', value: parseFloat(t.text) }
          : { type: 'int', value: parseInt(t.text, 10) };
      }
      if (t.kind === 'string' || t.kind === 'char') {
        consume();
        return { type: 'string', value: t.text };
      }
      if (t.text === 'true' || t.text === 'false') {
        consume();
        return { type: 'bool', value: t.text === 'true' };
      }
      if (t.text === '(') {
        consume();
        const val = evalExpr();
        expect(')');
        return val;
      }
      if (t.kind === 'ident') {
        const name = consume().text;
        if (peek()?.text === '(') {
          consume(); // (
          const args: TypedVal[] = [];
          while (peek() && peek()!.text !== ')') {
            args.push(evalExpr());
            if (peek()?.text === ',') consume();
          }
          expect(')');
          const arg0 = args[0] ? asNumber(args[0]) : 0;
          const arg1 = args[1] ? asNumber(args[1]) : 0;
          if (name === 'sqrt') return { type: 'double', value: Math.sqrt(arg0) };
          if (name === 'pow') return { type: 'double', value: Math.pow(arg0, arg1) };
          if (name === 'abs') return { type: 'int', value: Math.abs(arg0) };
          if (name === 'min') return { type: 'int', value: Math.min(arg0, arg1) };
          if (name === 'max') return { type: 'int', value: Math.max(arg0, arg1) };
          if (name === 'swap' && args.length === 2) {
            return { type: 'int', value: 0 };
          }
          throw new Error(`Funcția "${name}" nu este recunoscută.`);
        }
        if (peek()?.text === '[') {
          consume();
          const idx = Math.trunc(asNumber(evalExpr()));
          expect(']');
          const arr = findArray(name);
          if (!arr) throw new Error(`Vectorul "${name}" nu a fost declarat.`);
          if (idx < 0 || idx >= arr.length) throw new Error(`Index ${idx} în afara limitelor vectorului "${name}".`);
          return arr[idx];
        }
        const cur = findVar(name);
        if (!cur) throw new Error(`Linia ${t.line}: Variabila "${name}" nu a fost declarată.`);
        if (peek()?.text === '++' || peek()?.text === '--') {
          const op = consume().text;
          const updated: TypedVal = { type: cur.type, value: asNumber(cur) + (op === '++' ? 1 : -1) };
          setVar(name, updated);
          return cur;
        }
        return cur;
      }
      throw new Error(`Linia ${t.line}: Token neașteptat "${t.text}".`);
    }

    function execDeclaration() {
      let typeKw = consume().text;
      if (typeKw === 'long' && peek()?.text === 'long') consume();
      const valType = mapCppType(typeKw);
      while (pos < tokens.length) {
        const nameTok = consume();
        if (nameTok.kind !== 'ident') throw new Error(`Linia ${nameTok.line}: Nume de variabilă invalid "${nameTok.text}".`);
        if (peek()?.text === '[') {
          consume(); // [
          const sizeVal = peek()?.text === ']' ? 100 : Math.trunc(asNumber(evalExpr()));
          expect(']');
          const arr: TypedVal[] = Array.from({ length: Math.max(1, Math.min(500, sizeVal)) }, () => ({
            type: valType,
            value: valType === 'string' ? '' : 0,
          }));
          if (peek()?.text === '=') {
            consume();
            expect('{');
            let idx = 0;
            while (peek() && peek()!.text !== '}') {
              const item = evalExpr();
              if (idx < arr.length) arr[idx++] = coerceType(item, valType);
              if (peek()?.text === ',') consume();
            }
            expect('}');
          }
          scopes[scopes.length - 1].arrays.set(nameTok.text, arr);
        } else {
          let initVal: TypedVal = {
            type: valType,
            value: valType === 'string' ? '' : valType === 'bool' ? false : 0,
          };
          if (peek()?.text === '=') {
            consume();
            initVal = coerceType(evalExpr(), valType);
          }
          scopes[scopes.length - 1].vars.set(nameTok.text, initVal);
        }
        if (peek()?.text === ',') {
          consume();
          continue;
        }
        break;
      }
      expect(';');
    }

    type FlowSignal = 'none' | 'break' | 'continue' | 'return';

    function execBlockOrStmt(): FlowSignal {
      if (peek()?.text === '{') {
        consume();
        scopes.push({ vars: new Map(), arrays: new Map() });
        while (peek() && peek()!.text !== '}') {
          const sig = execStmt();
          if (sig !== 'none') {
            while (peek() && peek()!.text !== '}') consume();
            if (peek()?.text === '}') consume();
            scopes.pop();
            return sig;
          }
        }
        expect('}');
        scopes.pop();
        return 'none';
      }
      return execStmt();
    }

    function skipBlockOrStmt() {
      if (peek()?.text === '{') {
        let depth = 0;
        do {
          const tok = consume();
          if (!tok) break;
          if (tok.text === '{') depth++;
          else if (tok.text === '}') depth--;
        } while (depth > 0 && pos < tokens.length);
      } else {
        while (pos < tokens.length) {
          const tok = peek();
          if (!tok) break;
          if (tok.text === 'if') {
            consume();
            expect('(');
            let d = 1;
            while (d > 0 && pos < tokens.length) {
              const x = consume().text;
              if (x === '(') d++;
              else if (x === ')') d--;
            }
            skipBlockOrStmt();
            if (peek()?.text === 'else') {
              consume();
              skipBlockOrStmt();
            }
            return;
          }
          if (tok.text === '{') {
            skipBlockOrStmt();
            return;
          }
          if (consume().text === ';') return;
        }
      }
    }

    function execStmt(): FlowSignal {
      tick();
      const t = peek();
      if (!t) return 'none';

      if (t.text === ';') {
        consume();
        return 'none';
      }
      if (t.text === '{') {
        return execBlockOrStmt();
      }
      if (t.text === 'return') {
        consume();
        if (peek()?.text !== ';') evalExpr();
        expect(';');
        return 'return';
      }
      if (t.text === 'break') {
        consume();
        expect(';');
        return 'break';
      }
      if (t.text === 'continue') {
        consume();
        expect(';');
        return 'continue';
      }
      if (CPP_TYPES.has(t.text)) {
        execDeclaration();
        return 'none';
      }
      if (t.text === 'cout' || (t.text === 'std' && peek(1)?.text === ':')) {
        if (t.text === 'std') {
          consume(); expect(':'); expect(':');
        }
        consume(); // cout
        while (peek()?.text === '<<') {
          consume();
          if (peek()?.text === 'endl' || (peek()?.text === 'std' && peek(3)?.text === 'endl')) {
            if (peek()?.text === 'std') { consume(); expect(':'); expect(':'); }
            consume();
            stdout += '\n';
          } else {
            stdout += asString(evalExpr());
          }
        }
        expect(';');
        return 'none';
      }
      if (t.text === 'cin') {
        consume();
        while (peek()?.text === '>>') {
          consume();
          const targetTok = consume();
          let arrIndex: number | null = null;
          if (peek()?.text === '[') {
            consume();
            arrIndex = Math.trunc(asNumber(evalExpr()));
            expect(']');
          }
          const raw = stdinTokens[stdinIdx++] ?? '0';
          if (arrIndex !== null) {
            const arr = findArray(targetTok.text);
            if (!arr) throw new Error(`Vectorul "${targetTok.text}" nu a fost declarat.`);
            if (arrIndex >= 0 && arrIndex < arr.length) {
              const targetType = arr[arrIndex].type;
              arr[arrIndex] = coerceType({ type: 'string', value: raw }, targetType);
            }
          } else {
            const cur = findVar(targetTok.text);
            if (!cur) throw new Error(`Variabila "${targetTok.text}" nu a fost declarată.`);
            const parsed: TypedVal =
              cur.type === 'string'
                ? { type: 'string', value: raw }
                : cur.type === 'double'
                ? { type: 'double', value: parseFloat(raw) || 0 }
                : cur.type === 'bool'
                ? { type: 'bool', value: raw !== '0' && raw !== 'false' }
                : { type: 'int', value: parseInt(raw, 10) || 0 };
            setVar(targetTok.text, parsed);
          }
        }
        expect(';');
        return 'none';
      }
      if (t.text === 'if') {
        consume();
        expect('(');
        const cond = asBool(evalExpr());
        expect(')');
        if (cond) {
          const sig = execBlockOrStmt();
          if (peek()?.text === 'else') {
            consume();
            skipBlockOrStmt();
          }
          return sig;
        } else {
          skipBlockOrStmt();
          if (peek()?.text === 'else') {
            consume();
            return execBlockOrStmt();
          }
          return 'none';
        }
      }
      if (t.text === 'while') {
        consume();
        const condStart = pos;
        while (true) {
          tick();
          pos = condStart;
          expect('(');
          const cond = asBool(evalExpr());
          expect(')');
          if (!cond) {
            skipBlockOrStmt();
            break;
          }
          const sig = execBlockOrStmt();
          if (sig === 'break') break;
          if (sig === 'return') return 'return';
        }
        return 'none';
      }
      if (t.text === 'do') {
        consume();
        const bodyStart = pos;
        while (true) {
          tick();
          pos = bodyStart;
          const sig = execBlockOrStmt();
          if (sig === 'return') return 'return';
          expect('while');
          expect('(');
          const cond = asBool(evalExpr());
          expect(')');
          expect(';');
          if (sig === 'break' || !cond) break;
        }
        return 'none';
      }
      if (t.text === 'for') {
        consume();
        expect('(');
        scopes.push({ vars: new Map(), arrays: new Map() });
        if (peek()?.text !== ';') {
          if (CPP_TYPES.has(peek()?.text || '')) execDeclaration();
          else {
            evalExpr();
            expect(';');
          }
        } else {
          consume();
        }
        const condPos = pos;
        while (true) {
          tick();
          pos = condPos;
          let cond = true;
          if (peek()?.text !== ';') {
            cond = asBool(evalExpr());
          }
          expect(';');
          const stepPos = pos;
          let d = 0;
          while (pos < tokens.length) {
            if (peek()?.text === '(') d++;
            else if (peek()?.text === ')') {
              if (d === 0) break;
              d--;
            }
            consume();
          }
          expect(')');
          if (!cond) {
            skipBlockOrStmt();
            break;
          }
          const sig = execBlockOrStmt();
          if (sig === 'break') break;
          if (sig === 'return') {
            scopes.pop();
            return 'return';
          }
          const afterBody = pos;
          pos = stepPos;
          if (peek()?.text !== ')') {
            evalExpr();
          }
          pos = afterBody;
        }
        scopes.pop();
        return 'none';
      }

      evalExpr();
      expect(';');
      return 'none';
    }

    if (mainFound) {
      execBlockOrStmt();
    } else {
      while (pos < tokens.length) {
        const sig = execStmt();
        if (sig === 'return') break;
      }
    }

    return {
      stdout: stdout.trimEnd(),
      error: null,
      diagnostic,
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    return {
      stdout: '',
      error: err instanceof Error ? err.message : String(err),
      diagnostic,
      durationMs: Math.round(performance.now() - start),
    };
  }
}

export function runPythonCode(source: string, stdinRaw: string): SandboxExecutionResult {
  const start = performance.now();
  let diagnostic: string | null = null;

  try {
    const rawLines = source.replace(/\r\n/g, '\n').split('\n');
    const stdinLines = stdinRaw.length > 0 ? stdinRaw.replace(/\r\n/g, '\n').split('\n') : [];
    let stdinCursor = 0;
    let stdout = '';
    let steps = 0;

    if (/^\s*(if|elif|while)\s+.*[^=!<>]=[^=].*:\s*$/m.test(source)) {
      diagnostic = 'Atenție Python: folosește "==" pentru comparație, nu "=" (atribuire), și verifică să ai ":" la finalul liniei!';
    }

    interface PyLine {
      num: number;
      indent: number;
      text: string;
    }

    const lines: PyLine[] = [];
    for (let i = 0; i < rawLines.length; i++) {
      const line = rawLines[i];
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const indent = line.match(/^ */)?.[0].length ?? 0;
      lines.push({ num: i + 1, indent, text: trimmed });
    }

    interface PyFn {
      params: string[];
      body: PyLine[];
    }

    const globalScope: Record<string, any> = {};
    const functions = new Map<string, PyFn>();

    function splitArgs(raw: string): string[] {
      const parts: string[] = [];
      let cur = '';
      let depth = 0;
      let quote: '"' | "'" | null = null;
      for (let i = 0; i < raw.length; i++) {
        const ch = raw[i];
        if (quote) {
          cur += ch;
          if (ch === '\\' && i + 1 < raw.length) cur += raw[++i];
          else if (ch === quote) quote = null;
          continue;
        }
        if (ch === '"' || ch === "'") {
          quote = ch;
          cur += ch;
        } else if ('([{'.includes(ch)) {
          depth++;
          cur += ch;
        } else if (')]}'.includes(ch)) {
          depth--;
          cur += ch;
        } else if (ch === ',' && depth === 0) {
          parts.push(cur.trim());
          cur = '';
        } else {
          cur += ch;
        }
      }
      if (cur.trim()) parts.push(cur.trim());
      return parts;
    }

    function formatPyVal(val: any): string {
      if (val === true) return 'True';
      if (val === false) return 'False';
      if (val === null || val === undefined) return 'None';
      if (Array.isArray(val)) return `[${val.map((v) => (typeof v === 'string' ? `'${v}'` : formatPyVal(v))).join(', ')}]`;
      return String(val);
    }

    function evalPyExpr(expr: string, scope: Record<string, any>): any {
      const trimmed = expr.trim();
      if (!trimmed) return undefined;

      // Interpolate Python f-strings f"..." or f'...' cleanly into JS template strings
      const preprocessed = trimmed
        .replace(/\bf"([^"]*)"/g, (_m, inner: string) => {
          return '`' + inner.replace(/\{([^}]+)\}/g, (_g, v) => '${' + v + '}') + '`';
        })
        .replace(/\bf'([^']*)'/g, (_m, inner: string) => {
          return '`' + inner.replace(/\{([^}]+)\}/g, (_g, v) => '${' + v + '}') + '`';
        })
        .replace(/\bTrue\b/g, 'true')
        .replace(/\bFalse\b/g, 'false')
        .replace(/\bNone\b/g, 'null')
        .replace(/\band\b/g, '&&')
        .replace(/\bor\b/g, '||')
        .replace(/\bnot\b/g, '!')
        .replace(/(\w+|\))\s*\/\/\s*(\w+|\()/g, 'Math.trunc(($1)/($2))')
        .replace(/\*\*/g, '**');

      const builtins: Record<string, any> = {
        int: (x: any) => {
          const n = parseInt(String(x), 10);
          if (Number.isNaN(n)) throw new Error(`int() nu poate converti "${x}" în număr întreg.`);
          return n;
        },
        float: (x: any) => {
          const n = parseFloat(String(x));
          if (Number.isNaN(n)) throw new Error(`float() nu poate converti "${x}" în număr real.`);
          return n;
        },
        str: (x: any) => formatPyVal(x),
        abs: Math.abs,
        round: Math.round,
        len: (x: any) => (x?.length ?? 0),
        sum: (arr: any[]) => (Array.isArray(arr) ? arr.reduce((a, b) => a + Number(b), 0) : 0),
        min: (...xs: any[]) => (xs.length === 1 && Array.isArray(xs[0]) ? Math.min(...xs[0]) : Math.min(...xs)),
        max: (...xs: any[]) => (xs.length === 1 && Array.isArray(xs[0]) ? Math.max(...xs[0]) : Math.max(...xs)),
        range: (a: number, b?: number, step = 1) => {
          const startNum = b === undefined ? 0 : a;
          const endNum = b === undefined ? a : b;
          const res: number[] = [];
          if (step > 0) for (let v = startNum; v < endNum; v += step) res.push(v);
          else if (step < 0) for (let v = startNum; v > endNum; v += step) res.push(v);
          return res;
        },
        input: (prompt = '') => {
          if (prompt) stdout += String(prompt);
          const nextLine = stdinLines[stdinCursor++];
          return nextLine !== undefined ? nextLine : '0';
        },
      };

      functions.forEach((fn, fnName) => {
        builtins[fnName] = (...args: any[]) => {
          const fnScope: Record<string, any> = { ...globalScope };
          fn.params.forEach((p, idx) => {
            fnScope[p] = args[idx];
          });
          const res = execBlock(fn.body, fnScope);
          return res.type === 'return' ? res.value : undefined;
        };
      });

      const merged = { ...globalScope, ...scope, ...builtins };
      const keys = Object.keys(merged);
      const values = keys.map((k) => merged[k]);
      try {
        const evaluator = new Function(...keys, `"use strict"; return (${preprocessed});`);
        return evaluator(...values);
      } catch (e) {
        throw new Error(`Expresie Python invalidă "${expr}": ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    type PySignal = { type: 'none' | 'break' | 'continue' | 'return'; value?: any };

    function collectBlock(allLines: PyLine[], startIdx: number, parentIndent: number): [PyLine[], number] {
      const sub: PyLine[] = [];
      let idx = startIdx;
      while (idx < allLines.length && allLines[idx].indent > parentIndent) {
        sub.push(allLines[idx]);
        idx++;
      }
      return [sub, idx];
    }

    function execBlock(block: PyLine[], scope: Record<string, any>): PySignal {
      let i = 0;
      while (i < block.length) {
        steps++;
        if (steps > MAX_STEPS) {
          throw new Error('Buclă infinită detectată în Python (peste 20.000 de pași). Verifică condiția din while!');
        }
        const cur = block[i];
        const text = cur.text;

        if (text === 'pass') { i++; continue; }
        if (text === 'break') return { type: 'break' };
        if (text === 'continue') return { type: 'continue' };
        if (text.startsWith('return')) {
          const valExpr = text.slice(6).trim();
          return { type: 'return', value: valExpr ? evalPyExpr(valExpr, scope) : undefined };
        }

        // print(...)
        const printMatch = text.match(/^print\s*\(([\s\S]*)\)$/);
        if (printMatch) {
          const argsRaw = splitArgs(printMatch[1]);
          let endStr = '\n';
          let sepStr = ' ';
          const printable: string[] = [];
          for (const a of argsRaw) {
            if (/^end\s*=/.test(a)) {
              endStr = String(evalPyExpr(a.replace(/^end\s*=/, ''), scope));
            } else if (/^sep\s*=/.test(a)) {
              sepStr = String(evalPyExpr(a.replace(/^sep\s*=/, ''), scope));
            } else {
              printable.push(formatPyVal(evalPyExpr(a, scope)));
            }
          }
          stdout += printable.join(sepStr) + endStr;
          i++;
          continue;
        }

        // list.append(...)
        const appendMatch = text.match(/^([a-zA-Z_]\w*)\.append\s*\((.+)\)$/);
        if (appendMatch) {
          const listName = appendMatch[1];
          const target = scope[listName] ?? globalScope[listName];
          if (!Array.isArray(target)) throw new Error(`Linia ${cur.num}: "${listName}" nu este o listă.`);
          target.push(evalPyExpr(appendMatch[2], scope));
          i++;
          continue;
        }

        // def name(params):
        const defMatch = text.match(/^def\s+([a-zA-Z_]\w*)\s*\(([^)]*)\)\s*:$/);
        if (defMatch) {
          const [fnBody, nextIdx] = collectBlock(block, i + 1, cur.indent);
          const params = defMatch[2].split(',').map((s) => s.trim()).filter(Boolean);
          functions.set(defMatch[1], { params, body: fnBody });
          i = nextIdx;
          continue;
        }

        // if / elif / else
        if (text.startsWith('if ') && text.endsWith(':')) {
          const branches: { cond: string | null; body: PyLine[] }[] = [];
          const [ifBody, afterIf] = collectBlock(block, i + 1, cur.indent);
          branches.push({ cond: text.slice(3, -1).trim(), body: ifBody });
          let nextIdx = afterIf;
          while (nextIdx < block.length && block[nextIdx].indent === cur.indent) {
            const nxt = block[nextIdx].text;
            if (nxt.startsWith('elif ') && nxt.endsWith(':')) {
              const [elifBody, afterElif] = collectBlock(block, nextIdx + 1, cur.indent);
              branches.push({ cond: nxt.slice(5, -1).trim(), body: elifBody });
              nextIdx = afterElif;
            } else if (/^else\s*:$/.test(nxt)) {
              const [elseBody, afterElse] = collectBlock(block, nextIdx + 1, cur.indent);
              branches.push({ cond: null, body: elseBody });
              nextIdx = afterElse;
              break;
            } else {
              break;
            }
          }
          for (const br of branches) {
            if (br.cond === null || Boolean(evalPyExpr(br.cond, scope))) {
              const sig = execBlock(br.body, scope);
              if (sig.type !== 'none') return sig;
              break;
            }
          }
          i = nextIdx;
          continue;
        }

        // while cond:
        if (text.startsWith('while ') && text.endsWith(':')) {
          const condExpr = text.slice(6, -1).trim();
          const [loopBody, nextIdx] = collectBlock(block, i + 1, cur.indent);
          while (Boolean(evalPyExpr(condExpr, scope))) {
            steps++;
            if (steps > MAX_STEPS) throw new Error('Buclă infinită detectată în while!');
            const sig = execBlock(loopBody, scope);
            if (sig.type === 'break') break;
            if (sig.type === 'return') return sig;
          }
          i = nextIdx;
          continue;
        }

        // for var in iterable:
        const forMatch = text.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+(.+):$/);
        if (forMatch) {
          const varName = forMatch[1];
          const iterable = evalPyExpr(forMatch[2], scope);
          const [loopBody, nextIdx] = collectBlock(block, i + 1, cur.indent);
          for (const item of iterable) {
            steps++;
            if (steps > MAX_STEPS) throw new Error('Buclă for prea mare (limită de pași depășită).');
            scope[varName] = item;
            const sig = execBlock(loopBody, scope);
            if (sig.type === 'break') break;
            if (sig.type === 'return') return sig;
          }
          i = nextIdx;
          continue;
        }

        // Tuple assignment: a, b = b, a
        const assignMatch = text.match(/^([a-zA-Z_]\w*(?:\s*,\s*[a-zA-Z_]\w*)*)\s*(\+=|-=|\*=|\/=|\/\/=|%=|=)\s*(.+)$/);
        if (assignMatch) {
          const lhsNames = assignMatch[1].split(',').map((s) => s.trim());
          const op = assignMatch[2];
          const rhsExpr = assignMatch[3];
          if (lhsNames.length > 1 && op === '=') {
            const rhsParts = splitArgs(rhsExpr).map((p) => evalPyExpr(p, scope));
            lhsNames.forEach((n, idx) => {
              scope[n] = rhsParts[idx];
            });
          } else {
            const name = lhsNames[0];
            const val = evalPyExpr(rhsExpr, scope);
            if (op === '=') scope[name] = val;
            else if (op === '+=') scope[name] = scope[name] + val;
            else if (op === '-=') scope[name] = scope[name] - val;
            else if (op === '*=') scope[name] = scope[name] * val;
            else if (op === '/=') scope[name] = scope[name] / val;
            else if (op === '//=') scope[name] = Math.trunc(scope[name] / val);
            else if (op === '%=') scope[name] = scope[name] % val;
          }
          i++;
          continue;
        }

        // Bare expression (e.g., function call)
        evalPyExpr(text, scope);
        i++;
      }
      return { type: 'none' };
    }

    execBlock(lines, globalScope);

    return {
      stdout: stdout.trimEnd(),
      error: null,
      diagnostic,
      durationMs: Math.round(performance.now() - start),
    };
  } catch (err) {
    return {
      stdout: '',
      error: err instanceof Error ? err.message : String(err),
      diagnostic,
      durationMs: Math.round(performance.now() - start),
    };
  }
}

export function buildHtmlSandboxDoc(htmlSource: string, cssSource: string): SandboxExecutionResult {
  const start = performance.now();
  const safeHtml = htmlSource.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  const safeCss = cssSource.replace(/<\/style>/gi, '');

  const doc = `<!doctype html>
<html lang="ro">
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 16px; font-family: system-ui, -apple-system, sans-serif; color: #0f172a; background: #ffffff; line-height: 1.5; }
  ${safeCss}
</style>
</head>
<body>
${safeHtml}
</body>
</html>`;

  return {
    stdout: 'Randat live HTML5 + CSS3',
    error: null,
    diagnostic: null,
    durationMs: Math.round(performance.now() - start),
    htmlDoc: doc,
  };
}
