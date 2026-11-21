export type CppValType = 'int' | 'double' | 'bool' | 'string';

export interface CppTypedVal {
  type: CppValType;
  value: number | boolean | string;
}

export interface TraceVarSnapshot {
  name: string;
  type: CppValType;
  value: string;
  prevValue: string | null;
  changed: boolean;
  scopeLabel: string;
}

export interface TraceArraySnapshot {
  name: string;
  type: CppValType;
  values: (number | string | boolean)[];
  activeLength: number;
  readIndices: number[];
  writeIndices: number[];
}

export type TraceStepKind =
  | 'init'
  | 'input'
  | 'assign'
  | 'cond'
  | 'loop'
  | 'output'
  | 'array'
  | 'call'
  | 'return';

export interface TraceStep {
  step: number;
  line: number;
  kind: TraceStepKind;
  tag: string;
  explanationRo: string;
  explanationEn: string;
  vars: TraceVarSnapshot[];
  arrays: TraceArraySnapshot[];
  stdout: string;
  stdinCursor: number;
  callStack: string[];
}

export interface CppTraceResult {
  stdout: string;
  error: string | null;
  diagnostic: string | null;
  durationMs: number;
  totalSteps: number;
  truncated: boolean;
  stdinTokens: string[];
  steps: TraceStep[];
}

export interface CppTracePreset {
  id: string;
  titleRo: string;
  titleEn: string;
  descRo: string;
  descEn: string;
  defaultStdin: string;
  code: string;
}

export const CPP_TRACE_PRESETS: CppTracePreset[] = [
  {
    id: 'swap-3-pahare',
    titleRo: '01. Regula celor 3 pahare (Interschimbare)',
    titleEn: '01. Three-Glasses Variable Swap',
    descRo: 'Urmărește pas cu pas cum variabila auxiliară aux păstrează valoarea lui a în timpul interschimbării.',
    descEn: 'Watch step by step how aux preserves a during a classic variable swap.',
    defaultStdin: '12 45',
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b, aux;
    cin >> a >> b;
    aux = a;
    a = b;
    b = aux;
    cout << a << " " << b << endl;
    return 0;
}`,
  },
  {
    id: 'oglindit-palindrom',
    titleRo: '02. Oglindit & Verificare Palindrom (%10, /10)',
    titleEn: '02. Reversed Number & Palindrome Check',
    descRo: 'Extrage ultima cifră cu n % 10, construiește oglinditul și compară cu copia originală.',
    descEn: 'Extract each digit via n % 10, build the reversed number, and compare with original copy.',
    defaultStdin: '12321',
    code: `#include <iostream>
using namespace std;

int main() {
    int n, copie, ogl = 0, c;
    cin >> n;
    copie = n;
    while (n > 0) {
        c = n % 10;
        ogl = ogl * 10 + c;
        n = n / 10;
    }
    if (ogl == copie)
        cout << "PALINDROM (" << ogl << ")";
    else
        cout << "NU (" << ogl << ")";
    return 0;
}`,
  },
  {
    id: 'euclid-cmmdc',
    titleRo: '03. Algoritmul lui Euclid (CMMDC)',
    titleEn: '03. Euclidean GCD Algorithm',
    descRo: 'Vezi cum restul împărțirii (a % b) reduce rapid numerele până când b devine 0.',
    descEn: 'See how modulo remainders (a % b) converge cleanly until b reaches 0.',
    defaultStdin: '48 18',
    code: `#include <iostream>
using namespace std;

int main() {
    int a, b, r;
    cin >> a >> b;
    while (b != 0) {
        r = a % b;
        a = b;
        b = r;
    }
    cout << "CMMDC = " << a << endl;
    return 0;
}`,
  },
  {
    id: 'numar-prim',
    titleRo: '04. Test Număr Prim (Optimizat O(√n))',
    titleEn: '04. Prime Number Check (O(√n))',
    descRo: 'Verifică divizorii până la d * d <= n și oprește căutarea imediat cu break la primul divizor.',
    descEn: 'Check divisors up to d * d <= n and stop early with break upon finding a factor.',
    defaultStdin: '29',
    code: `#include <iostream>
using namespace std;

int main() {
    int n, d;
    bool prim = true;
    cin >> n;
    if (n < 2) prim = false;
    for (d = 2; d * d <= n; d++) {
        if (n % d == 0) {
            prim = false;
            break;
        }
    }
    if (prim) cout << "PRIM";
    else cout << "COMPUS";
    return 0;
}`,
  },
  {
    id: 'bubble-sort',
    titleRo: '05. Bubble Sort (Vizualizare Vector cu Bare)',
    titleEn: '05. Bubble Sort (Live Array Bar Visualizer)',
    descRo: 'Observă cum barele din vector își schimbă locul prin swap(v[i], v[i+1]) până devin sortate crescător.',
    descEn: 'Watch array bars swap live via swap(v[i], v[i+1]) until fully sorted.',
    defaultStdin: '6 42 15 88 23 9 54',
    code: `#include <iostream>
using namespace std;

int main() {
    int n, i, v[20];
    bool sortat;
    cin >> n;
    for (i = 0; i < n; i++) {
        cin >> v[i];
    }
    do {
        sortat = true;
        for (i = 0; i < n - 1; i++) {
            if (v[i] > v[i + 1]) {
                swap(v[i], v[i + 1]);
                sortat = false;
            }
        }
    } while (!sortat);

    for (i = 0; i < n; i++) {
        cout << v[i] << " ";
    }
    return 0;
}`,
  },
  {
    id: 'cautare-binara',
    titleRo: '06. Căutare Binară în Vector Sortat O(log n)',
    titleEn: '06. Binary Search in Sorted Array O(log n)',
    descRo: 'Urmărește intervalul [st, dr] și mijlocul mij cum înjumătățesc spațiul de căutare la fiecare pas.',
    descEn: 'Watch [st, dr] and mid halve the search range on every iteration.',
    defaultStdin: '7 4 11 19 25 38 52 70 38',
    code: `#include <iostream>
using namespace std;

int main() {
    int n, x, i, v[20];
    cin >> n;
    for (i = 0; i < n; i++) cin >> v[i];
    cin >> x;

    int st = 0, dr = n - 1, poz = -1;
    while (st <= dr) {
        int mij = (st + dr) / 2;
        if (v[mij] == x) {
            poz = mij;
            break;
        } else if (v[mij] < x) {
            st = mij + 1;
        } else {
            dr = mij - 1;
        }
    }
    cout << "Pozitie = " << poz << endl;
    return 0;
}`,
  },
  {
    id: 'fibonacci-iterativ',
    titleRo: '07. Șirul lui Fibonacci (Iterativ)',
    titleEn: '07. Iterative Fibonacci Sequence',
    descRo: 'Calculează primele N numere Fibonacci actualizând f1, f2 și f3 fără memorie suplimentară.',
    descEn: 'Compute the first N Fibonacci numbers by sliding f1, f2, and f3.',
    defaultStdin: '7',
    code: `#include <iostream>
using namespace std;

int main() {
    int n, i;
    int f1 = 1, f2 = 1, f3;
    cin >> n;
    cout << f1 << " " << f2 << " ";
    for (i = 3; i <= n; i++) {
        f3 = f1 + f2;
        cout << f3 << " ";
        f1 = f2;
        f2 = f3;
    }
    return 0;
}`,
  },
  {
    id: 'functii-referinta',
    titleRo: '08. Funcții cu Referință (&) și Recursivitate',
    titleEn: '08. Functions by Reference (&) & Recursion',
    descRo: 'Urmărește Stiva de Apeluri (Call Stack) pentru o funcție recursivă și modificarea prin referință &.',
    descEn: 'Inspect the live Call Stack for recursion alongside pass-by-reference (&) updates.',
    defaultStdin: '5 12',
    code: `#include <iostream>
using namespace std;

int fact(int k) {
    if (k <= 1) return 1;
    return k * fact(k - 1);
}

void dubleaza(int &x) {
    x = x * 2;
}

int main() {
    int a, b;
    cin >> a >> b;
    int f = fact(a);
    dubleaza(b);
    cout << "fact=" << f << " b2=" << b << endl;
    return 0;
}`,
  },
];

const MAX_STEPS = 20000;
const MAX_TRACE_FRAMES = 1200;
const MAX_CALL_DEPTH = 64;

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
    if ('+-*/%<>=!&|?:.'.includes(ch)) {
      tokens.push({ kind: 'op', text: ch, line });
      i++;
      continue;
    }
    if ('(){}[];,'.includes(ch)) {
      tokens.push({ kind: 'punct', text: ch, line });
      i++;
      continue;
    }
    throw new Error(`Linia ${line}: Caracter neașteptat "${ch}".`);
  }
  return tokens;
}

const CPP_TYPES = new Set(['int', 'long', 'double', 'float', 'bool', 'char', 'string', 'void']);
const CPP_MODIFIERS = new Set(['const', 'unsigned', 'signed', 'short']);

interface VarSlot {
  val: CppTypedVal;
  scopeLabel: string;
}

interface ArrayBox {
  type: CppValType;
  items: CppTypedVal[];
  maxTouchedIndex: number;
}

interface EnvScope {
  label: string;
  vars: Map<string, VarSlot>;
  arrays: Map<string, ArrayBox>;
}

interface CppParamDef {
  name: string;
  type: CppValType;
  isRef: boolean;
  isArray: boolean;
}

interface CppFunctionDef {
  name: string;
  returnType: CppValType | 'void';
  params: CppParamDef[];
  bodyStartPos: number;
}

type LValueRef =
  | { kind: 'var'; slot: VarSlot; name: string }
  | { kind: 'arr'; arr: ArrayBox; name: string; index: number };

function asNumber(v: CppTypedVal): number {
  if (typeof v.value === 'number') return v.value;
  if (typeof v.value === 'boolean') return v.value ? 1 : 0;
  const n = Number(v.value);
  return Number.isNaN(n) ? 0 : n;
}

function asBool(v: CppTypedVal): boolean {
  if (typeof v.value === 'boolean') return v.value;
  if (typeof v.value === 'number') return v.value !== 0;
  return v.value.length > 0;
}

function asString(v: CppTypedVal): string {
  if (typeof v.value === 'boolean') return v.value ? '1' : '0';
  return String(v.value);
}

function formatSnapshotVal(v: CppTypedVal): string {
  if (v.type === 'bool') return asBool(v) ? 'true (1)' : 'false (0)';
  if (v.type === 'string') return `"${String(v.value)}"`;
  return String(v.value);
}

export function traceCppCode(
  source: string,
  stdinRaw: string,
  options: { captureTrace?: boolean } = {}
): CppTraceResult {
  const captureTrace = options.captureTrace !== false;
  const start = performance.now();
  let diagnostic: string | null = null;
  const stdinTokens = stdinRaw.trim().length > 0 ? stdinRaw.trim().split(/\s+/) : [];

  try {
    const clean = stripCppComments(source);
    if (/\b(if|while)\s*\([^)]*[^=!<>]=[^=][^)]*\)/.test(clean)) {
      diagnostic = 'Atenție: ai folosit "=" (atribuire) în loc de "==" (comparație) într-o condiție if/while!';
    } else if (/\b(if|while|for)\s*\([^)]*\)\s*;/.test(clean)) {
      diagnostic = 'Capcană detectată: există un ";" imediat după if/while/for — instrucțiunea următoare nu mai face parte din condiție!';
    }

    const tokens = tokenizeCpp(clean);
    let stdinIdx = 0;
    let stdout = '';
    let totalSteps = 0;
    let truncated = false;
    const steps: TraceStep[] = [];

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

    const callFrameStack: EnvScope[][] = [[{ label: 'global', vars: new Map(), arrays: new Map() }]];
    const callNameStack: string[] = ['main()'];
    const functionsMap = new Map<string, CppFunctionDef>();

    const currentScopes = () => callFrameStack[callFrameStack.length - 1];
    const globalScope = () => callFrameStack[0][0];

    const findVarSlot = (name: string): VarSlot | undefined => {
      const frame = currentScopes();
      for (let s = frame.length - 1; s >= 0; s--) {
        const v = frame[s].vars.get(name);
        if (v) return v;
      }
      if (callFrameStack.length > 1) {
        return globalScope().vars.get(name);
      }
      return undefined;
    };

    const findArrayBox = (name: string): ArrayBox | undefined => {
      const frame = currentScopes();
      for (let s = frame.length - 1; s >= 0; s--) {
        const arr = frame[s].arrays.get(name);
        if (arr) return arr;
      }
      if (callFrameStack.length > 1) {
        return globalScope().arrays.get(name);
      }
      return undefined;
    };

    const coerceType = (val: CppTypedVal, targetType: CppValType): CppTypedVal => {
      if (targetType === 'int') return { type: 'int', value: Math.trunc(asNumber(val)) };
      if (targetType === 'double') return { type: 'double', value: asNumber(val) };
      if (targetType === 'bool') return { type: 'bool', value: asBool(val) };
      return { type: 'string', value: asString(val) };
    };

    const mapCppType = (kw: string): CppValType => {
      if (kw === 'double' || kw === 'float') return 'double';
      if (kw === 'bool') return 'bool';
      if (kw === 'string' || kw === 'char') return 'string';
      return 'int';
    };

    const isTypeStart = (idx = pos): boolean => {
      const t = tokens[idx];
      if (!t) return false;
      if (CPP_TYPES.has(t.text)) return true;
      if (CPP_MODIFIERS.has(t.text) && tokens[idx + 1] && (CPP_TYPES.has(tokens[idx + 1].text) || CPP_MODIFIERS.has(tokens[idx + 1].text))) {
        return true;
      }
      return false;
    };

    const consumeTypeKeywords = (): CppValType | 'void' => {
      while (peek() && CPP_MODIFIERS.has(peek()!.text)) consume();
      const kw = consume().text;
      if (kw === 'long' && peek()?.text === 'long') consume();
      if (kw === 'void') return 'void';
      return mapCppType(kw);
    };

    // Snapshot change tracking
    let prevVarMap = new Map<string, string>();
    let pendingArrayReads = new Map<string, Set<number>>();
    let pendingArrayWrites = new Map<string, Set<number>>();

    const markArrayRead = (name: string, idx: number) => {
      if (!captureTrace) return;
      if (!pendingArrayReads.has(name)) pendingArrayReads.set(name, new Set());
      pendingArrayReads.get(name)!.add(idx);
    };

    const markArrayWrite = (name: string, idx: number) => {
      if (!captureTrace) return;
      if (!pendingArrayWrites.has(name)) pendingArrayWrites.set(name, new Set());
      pendingArrayWrites.get(name)!.add(idx);
    };

    const recordStep = (
      line: number,
      kind: TraceStepKind,
      tag: string,
      explanationRo: string,
      explanationEn: string
    ) => {
      if (!captureTrace) return;
      if (steps.length >= MAX_TRACE_FRAMES) {
        truncated = true;
        pendingArrayReads.clear();
        pendingArrayWrites.clear();
        return;
      }

      const vars: TraceVarSnapshot[] = [];
      const seenNames = new Set<string>();
      const nextVarMap = new Map<string, string>();

      const collectFromScopes = (scopeList: EnvScope[], prefix: string) => {
        for (const sc of scopeList) {
          sc.vars.forEach((slot, name) => {
            const key = `${prefix}${sc.label}:${name}`;
            const curStr = formatSnapshotVal(slot.val);
            const prev = prevVarMap.has(key) ? prevVarMap.get(key)! : null;
            const changed = prev === null || prev !== curStr;
            nextVarMap.set(key, curStr);
            if (!seenNames.has(name) || callFrameStack.length === 1) {
              vars.push({
                name: callFrameStack.length > 1 && prefix ? `${prefix}${name}` : name,
                type: slot.val.type,
                value: curStr,
                prevValue: prev,
                changed,
                scopeLabel: slot.scopeLabel,
              });
              seenNames.add(name);
            }
          });
        }
      };

      const topFrame = currentScopes();
      collectFromScopes(topFrame, '');
      if (callFrameStack.length > 1) {
        collectFromScopes([globalScope()], 'global::');
      }
      prevVarMap = nextVarMap;

      const arrays: TraceArraySnapshot[] = [];
      const collectedArrNames = new Set<string>();
      const scanArrayScope = (sc: EnvScope) => {
        sc.arrays.forEach((box, name) => {
          if (collectedArrNames.has(name)) return;
          collectedArrNames.add(name);
          const reads = Array.from(pendingArrayReads.get(name) || []);
          const writes = Array.from(pendingArrayWrites.get(name) || []);
          const activeLen = Math.min(box.items.length, Math.max(1, box.maxTouchedIndex + 1));
          arrays.push({
            name,
            type: box.type,
            values: box.items.slice(0, activeLen).map((it) => it.value),
            activeLength: activeLen,
            readIndices: reads,
            writeIndices: writes,
          });
        });
      };
      for (let s = topFrame.length - 1; s >= 0; s--) scanArrayScope(topFrame[s]);
      if (callFrameStack.length > 1) scanArrayScope(globalScope());

      pendingArrayReads.clear();
      pendingArrayWrites.clear();

      steps.push({
        step: steps.length + 1,
        line,
        kind,
        tag,
        explanationRo,
        explanationEn,
        vars,
        arrays,
        stdout,
        stdinCursor: stdinIdx,
        callStack: [...callNameStack],
      });
    };

    function tick() {
      totalSteps++;
      if (totalSteps > MAX_STEPS) {
        throw new Error('Buclă infinită detectată (limită de 20.000 de pași depășită). Verifică condiția din while/for!');
      }
    }

    // ------------------------------------------------------------------
    // First Pass at Top-Level: parse using, global vars, function defs & main
    // ------------------------------------------------------------------
    let mainBodyPos: number | null = null;
    const topLevelLooseStatements: number[] = [];

    while (pos < tokens.length) {
      const t = peek();
      if (!t) break;
      if (t.text === 'using') {
        while (pos < tokens.length && consume().text !== ';');
        continue;
      }
      if (isTypeStart()) {
        const savedPos = pos;
        const retType = consumeTypeKeywords();
        const nameTok = peek();
        if (nameTok && nameTok.kind === 'ident' && peek(1)?.text === '(') {
          const fnName = consume().text;
          expect('(');
          const params: CppParamDef[] = [];
          while (peek() && peek()!.text !== ')') {
            if (isTypeStart()) {
              const pType = consumeTypeKeywords();
              let isRef = false;
              if (peek()?.text === '&') {
                isRef = true;
                consume();
              }
              const pName = peek()?.kind === 'ident' ? consume().text : `arg${params.length}`;
              let isArray = false;
              if (peek()?.text === '[') {
                isArray = true;
                consume();
                while (peek() && peek()!.text !== ']') consume();
                expect(']');
              }
              params.push({
                name: pName,
                type: pType === 'void' ? 'int' : pType,
                isRef,
                isArray,
              });
            } else {
              consume();
            }
            if (peek()?.text === ',') consume();
          }
          expect(')');
          if (peek()?.text === ';') {
            // Forward prototype
            consume();
            continue;
          }
          if (peek()?.text === '{') {
            const bodyPos = pos;
            // Skip balanced braces to continue top-level scan
            let depth = 0;
            do {
              const b = consume();
              if (!b) break;
              if (b.text === '{') depth++;
              else if (b.text === '}') depth--;
            } while (depth > 0 && pos < tokens.length);

            if (fnName === 'main') {
              mainBodyPos = bodyPos;
            } else {
              functionsMap.set(fnName, {
                name: fnName,
                returnType: retType,
                params,
                bodyStartPos: bodyPos,
              });
            }
            continue;
          }
        }
        // Global variable declaration
        pos = savedPos;
        if (mainBodyPos === null && peek(1)?.kind === 'ident') {
          execDeclaration('global');
          continue;
        }
      }

      // Loose top-level statements (if user pasted snippet without int main)
      topLevelLooseStatements.push(pos);
      if (peek()?.text === '{') {
        let d = 0;
        do {
          const x = consume();
          if (!x) break;
          if (x.text === '{') d++;
          else if (x.text === '}') d--;
        } while (d > 0 && pos < tokens.length);
      } else {
        while (pos < tokens.length && consume().text !== ';');
      }
    }

    // ------------------------------------------------------------------
    // Expression Evaluator (supports dryRun short-circuiting!)
    // ------------------------------------------------------------------
    function evalExpr(dryRun = false): CppTypedVal {
      return evalAssign(dryRun);
    }

    function applyBinaryOp(op: string, l: CppTypedVal, r: CppTypedVal): CppTypedVal {
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
        return isDouble ? { type: 'double', value: a / b } : { type: 'int', value: Math.trunc(a / b) };
      }
      if (op === '%') {
        const bi = Math.trunc(b);
        if (bi === 0) throw new Error('Eroare la execuție: Modulo (%) cu 0!');
        return { type: 'int', value: Math.trunc(a) % bi };
      }
      return { type: 'int', value: 0 };
    }

    function evalAssign(dryRun = false): CppTypedVal {
      if (peek()?.kind === 'ident') {
        const name = peek()!.text;
        const next = peek(1);
        if (next && ['=', '+=', '-=', '*=', '/=', '%='].includes(next.text)) {
          consume();
          const op = consume().text;
          const rhs = evalAssign(dryRun);
          if (dryRun) return rhs;
          const slot = findVarSlot(name);
          if (!slot) throw new Error(`Variabila "${name}" nu a fost declarată.`);
          let res: CppTypedVal = rhs;
          if (op !== '=') res = applyBinaryOp(op[0], slot.val, rhs);
          slot.val = coerceType(res, slot.val.type);
          return slot.val;
        }
        if (next?.text === '[') {
          const saved = pos;
          consume(); // ident
          consume(); // [
          const idxVal = evalExpr(dryRun);
          if (peek()?.text === ']') {
            consume(); // ]
            const after = peek();
            if (after && ['=', '+=', '-=', '*=', '/=', '%='].includes(after.text)) {
              const op = consume().text;
              const rhs = evalAssign(dryRun);
              if (dryRun) return rhs;
              const arr = findArrayBox(name);
              if (!arr) throw new Error(`Vectorul "${name}" nu a fost declarat.`);
              const idx = Math.trunc(asNumber(idxVal));
              if (idx < 0 || idx >= arr.items.length) {
                throw new Error(`Index invalid ${idx} pentru vectorul "${name}".`);
              }
              let res = rhs;
              if (op !== '=') res = applyBinaryOp(op[0], arr.items[idx], rhs);
              arr.items[idx] = coerceType(res, arr.type);
              if (idx > arr.maxTouchedIndex) arr.maxTouchedIndex = idx;
              markArrayWrite(name, idx);
              return arr.items[idx];
            }
          }
          pos = saved;
        }
      }
      return evalTernary(dryRun);
    }

    function evalTernary(dryRun = false): CppTypedVal {
      const cond = evalOr(dryRun);
      if (peek()?.text === '?') {
        consume();
        const truthy = dryRun ? true : asBool(cond);
        const trueVal = evalExpr(dryRun || !truthy);
        expect(':');
        const falseVal = evalTernary(dryRun || truthy);
        return truthy ? trueVal : falseVal;
      }
      return cond;
    }

    function evalOr(dryRun = false): CppTypedVal {
      let left = evalAnd(dryRun);
      while (peek()?.text === '||') {
        consume();
        const shortCircuit = dryRun || asBool(left);
        const right = evalAnd(shortCircuit);
        if (!dryRun) {
          left = { type: 'bool', value: asBool(left) || asBool(right) };
        }
      }
      return left;
    }

    function evalAnd(dryRun = false): CppTypedVal {
      let left = evalEquality(dryRun);
      while (peek()?.text === '&&') {
        consume();
        const shortCircuit = dryRun || !asBool(left);
        const right = evalEquality(shortCircuit);
        if (!dryRun) {
          left = { type: 'bool', value: asBool(left) && asBool(right) };
        }
      }
      return left;
    }

    function evalEquality(dryRun = false): CppTypedVal {
      let left = evalRel(dryRun);
      while (peek()?.text === '==' || peek()?.text === '!=') {
        const op = consume().text;
        const right = evalRel(dryRun);
        if (!dryRun) {
          const eq =
            left.type === 'string' && right.type === 'string'
              ? left.value === right.value
              : asNumber(left) === asNumber(right);
          left = { type: 'bool', value: op === '==' ? eq : !eq };
        }
      }
      return left;
    }

    function evalRel(dryRun = false): CppTypedVal {
      let left = evalAdd(dryRun);
      while (['<', '<=', '>', '>='].includes(peek()?.text || '')) {
        const op = consume().text;
        const right = evalAdd(dryRun);
        if (!dryRun) {
          const a = asNumber(left);
          const b = asNumber(right);
          let res = false;
          if (op === '<') res = a < b;
          else if (op === '<=') res = a <= b;
          else if (op === '>') res = a > b;
          else res = a >= b;
          left = { type: 'bool', value: res };
        }
      }
      return left;
    }

    function evalAdd(dryRun = false): CppTypedVal {
      let left = evalMul(dryRun);
      while (peek()?.text === '+' || peek()?.text === '-') {
        const op = consume().text;
        const right = evalMul(dryRun);
        if (!dryRun) left = applyBinaryOp(op, left, right);
      }
      return left;
    }

    function evalMul(dryRun = false): CppTypedVal {
      let left = evalUnary(dryRun);
      while (['*', '/', '%'].includes(peek()?.text || '')) {
        const op = consume().text;
        const right = evalUnary(dryRun);
        if (!dryRun) left = applyBinaryOp(op, left, right);
      }
      return left;
    }

    function evalUnary(dryRun = false): CppTypedVal {
      const t = peek();
      if (!t) throw new Error('Expresie incompletă.');
      if (t.text === '!') {
        consume();
        const v = evalUnary(dryRun);
        return dryRun ? { type: 'bool', value: false } : { type: 'bool', value: !asBool(v) };
      }
      if (t.text === '-') {
        consume();
        const v = evalUnary(dryRun);
        return dryRun ? v : { type: v.type === 'double' ? 'double' : 'int', value: -asNumber(v) };
      }
      if (t.text === '+') {
        consume();
        return evalUnary(dryRun);
      }
      if (t.text === '++' || t.text === '--') {
        const op = consume().text;
        const lval = parseLValueIfSimple(dryRun);
        if (!lval) throw new Error(`Linia ${t.line}: Operand invalid pentru ${op}.`);
        if (dryRun) return { type: 'int', value: 0 };
        if (lval.kind === 'var') {
          const nextVal: CppTypedVal = {
            type: lval.slot.val.type,
            value: asNumber(lval.slot.val) + (op === '++' ? 1 : -1),
          };
          lval.slot.val = nextVal;
          return nextVal;
        } else {
          const curItem = lval.arr.items[lval.index];
          const nextVal: CppTypedVal = {
            type: curItem.type,
            value: asNumber(curItem) + (op === '++' ? 1 : -1),
          };
          lval.arr.items[lval.index] = nextVal;
          markArrayWrite(lval.name, lval.index);
          return nextVal;
        }
      }
      return evalPrimary(dryRun);
    }

    function parseLValueIfSimple(dryRun = false): LValueRef | null {
      const t = peek();
      if (!t || t.kind !== 'ident') return null;
      const name = consume().text;
      if (peek()?.text === '[') {
        consume();
        const idx = Math.trunc(asNumber(evalExpr(dryRun)));
        expect(']');
        if (dryRun) return { kind: 'arr', arr: { type: 'int', items: [], maxTouchedIndex: 0 }, name, index: 0 };
        const arr = findArrayBox(name);
        if (!arr) throw new Error(`Vectorul "${name}" nu a fost declarat.`);
        if (idx < 0 || idx >= arr.items.length) {
          throw new Error(`Index ${idx} în afara limitelor vectorului "${name}".`);
        }
        return { kind: 'arr', arr, name, index: idx };
      }
      if (dryRun) return { kind: 'var', slot: { val: { type: 'int', value: 0 }, scopeLabel: 'dry' }, name };
      const slot = findVarSlot(name);
      if (!slot) throw new Error(`Linia ${t.line}: Variabila "${name}" nu a fost declarată.`);
      return { kind: 'var', slot, name };
    }

    function callUserFunction(fn: CppFunctionDef, callLine: number): CppTypedVal {
      if (callFrameStack.length >= MAX_CALL_DEPTH) {
        throw new Error(`Linia ${callLine}: Adâncime maximă de recursivitate (${MAX_CALL_DEPTH}) depășită în "${fn.name}".`);
      }
      expect('(');
      const boundVars = new Map<string, VarSlot>();
      const boundArrays = new Map<string, ArrayBox>();
      const argPreviews: string[] = [];

      let paramIdx = 0;
      while (peek() && peek()!.text !== ')') {
        const param = fn.params[paramIdx];
        if (param?.isArray) {
          const argTok = consume();
          const box = findArrayBox(argTok.text);
          if (!box) throw new Error(`Linia ${callLine}: Vectorul "${argTok.text}" nu a fost declarat.`);
          boundArrays.set(param.name, box);
          argPreviews.push(`${argTok.text}[]`);
        } else if (param?.isRef) {
          const lval = parseLValueIfSimple(false);
          if (!lval || lval.kind !== 'var') {
            throw new Error(`Linia ${callLine}: Parametrul referință "&${param.name}" necesită o variabilă.`);
          }
          boundVars.set(param.name, lval.slot);
          argPreviews.push(`&${lval.name}=${lval.slot.val.value}`);
        } else {
          const val = evalExpr(false);
          if (param) {
            boundVars.set(param.name, {
              val: coerceType(val, param.type),
              scopeLabel: fn.name,
            });
            argPreviews.push(String(val.value));
          }
        }
        paramIdx++;
        if (peek()?.text === ',') consume();
      }
      expect(')');

      const returnPos = pos;
      const fnScope: EnvScope = {
        label: fn.name,
        vars: boundVars,
        arrays: boundArrays,
      };
      callFrameStack.push([fnScope]);
      callNameStack.push(`${fn.name}(${argPreviews.join(', ')})`);

      recordStep(
        callLine,
        'call',
        `CALL ${fn.name}`,
        `Apel funcție: ${fn.name}(${argPreviews.join(', ')})`,
        `Function call: ${fn.name}(${argPreviews.join(', ')})`
      );

      pos = fn.bodyStartPos;
      let retVal: CppTypedVal = { type: fn.returnType === 'void' ? 'int' : fn.returnType, value: 0 };
      const outcome = execBlockOrStmt();
      if (outcome.signal === 'return' && outcome.returnVal !== undefined) {
        retVal = fn.returnType === 'void' ? outcome.returnVal : coerceType(outcome.returnVal, fn.returnType);
      }

      callNameStack.pop();
      callFrameStack.pop();
      pos = returnPos;

      recordStep(
        callLine,
        'return',
        `RET ${fn.name}`,
        `Întoarcere din funcția ${fn.name}${fn.returnType !== 'void' ? ` cu valoarea ${retVal.value}` : ''}`,
        `Returned from ${fn.name}${fn.returnType !== 'void' ? ` with value ${retVal.value}` : ''}`
      );

      return retVal;
    }

    function evalPrimary(dryRun = false): CppTypedVal {
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
        const val = evalExpr(dryRun);
        expect(')');
        return val;
      }
      if (t.kind === 'ident') {
        // Handle special builtins before consuming args if swap
        if (t.text === 'swap' && peek(1)?.text === '(' && !dryRun) {
          consume(); // swap
          consume(); // (
          const lv1 = parseLValueIfSimple(false);
          expect(',');
          const lv2 = parseLValueIfSimple(false);
          expect(')');
          if (!lv1 || !lv2) {
            throw new Error(`Linia ${t.line}: swap(a, b) necesită două variabile sau elemente de vector.`);
          }
          const getLv = (lv: LValueRef): CppTypedVal =>
            lv.kind === 'var' ? lv.slot.val : lv.arr.items[lv.index];
          const setLv = (lv: LValueRef, v: CppTypedVal) => {
            if (lv.kind === 'var') {
              lv.slot.val = coerceType(v, lv.slot.val.type);
            } else {
              lv.arr.items[lv.index] = coerceType(v, lv.arr.type);
              markArrayWrite(lv.name, lv.index);
            }
          };
          const v1 = getLv(lv1);
          const v2 = getLv(lv2);
          setLv(lv1, v2);
          setLv(lv2, v1);
          return { type: 'int', value: 0 };
        }

        const name = consume().text;
        // Method call on string (e.g., s.length() / s.size())
        if (peek()?.text === '.' && peek(1)?.kind === 'ident') {
          consume(); // .
          const method = consume().text;
          expect('(');
          const mArgs: CppTypedVal[] = [];
          while (peek() && peek()!.text !== ')') {
            mArgs.push(evalExpr(dryRun));
            if (peek()?.text === ',') consume();
          }
          expect(')');
          if (dryRun) return { type: 'int', value: 0 };
          const slot = findVarSlot(name);
          const strVal = slot ? asString(slot.val) : '';
          if (method === 'length' || method === 'size') {
            return { type: 'int', value: strVal.length };
          }
          if (method === 'substr') {
            const sIdx = mArgs[0] ? Math.trunc(asNumber(mArgs[0])) : 0;
            const len = mArgs[1] ? Math.trunc(asNumber(mArgs[1])) : undefined;
            return { type: 'string', value: len !== undefined ? strVal.substr(sIdx, len) : strVal.slice(sIdx) };
          }
          throw new Error(`Linia ${t.line}: Metoda "${method}" nu este suportată.`);
        }

        if (peek()?.text === '(') {
          const userFn = functionsMap.get(name);
          if (userFn && !dryRun) {
            return callUserFunction(userFn, t.line);
          }
          consume(); // (
          const args: CppTypedVal[] = [];
          while (peek() && peek()!.text !== ')') {
            args.push(evalExpr(dryRun));
            if (peek()?.text === ',') consume();
          }
          expect(')');
          if (dryRun) return { type: 'int', value: 0 };
          const arg0 = args[0] ? asNumber(args[0]) : 0;
          const arg1 = args[1] ? asNumber(args[1]) : 0;
          if (name === 'sqrt') return { type: 'double', value: Math.sqrt(arg0) };
          if (name === 'pow') return { type: 'double', value: Math.pow(arg0, arg1) };
          if (name === 'abs') return { type: 'int', value: Math.abs(arg0) };
          if (name === 'min') return { type: 'int', value: Math.min(arg0, arg1) };
          if (name === 'max') return { type: 'int', value: Math.max(arg0, arg1) };
          if (name === 'swap') return { type: 'int', value: 0 };
          throw new Error(`Linia ${t.line}: Funcția "${name}" nu este recunoscută.`);
        }

        if (peek()?.text === '[') {
          consume();
          const idx = Math.trunc(asNumber(evalExpr(dryRun)));
          expect(']');
          if (dryRun) return { type: 'int', value: 0 };
          const slot = findVarSlot(name);
          if (slot && slot.val.type === 'string') {
            const s = asString(slot.val);
            return { type: 'string', value: s[idx] ?? '' };
          }
          const arr = findArrayBox(name);
          if (!arr) throw new Error(`Vectorul "${name}" nu a fost declarat.`);
          if (idx < 0 || idx >= arr.items.length) {
            throw new Error(`Index ${idx} în afara limitelor vectorului "${name}".`);
          }
          if (idx > arr.maxTouchedIndex) arr.maxTouchedIndex = idx;
          markArrayRead(name, idx);
          return arr.items[idx];
        }

        if (dryRun) {
          if (peek()?.text === '++' || peek()?.text === '--') consume();
          return { type: 'int', value: 0 };
        }
        const cur = findVarSlot(name);
        if (!cur) throw new Error(`Linia ${t.line}: Variabila "${name}" nu a fost declarată.`);
        if (peek()?.text === '++' || peek()?.text === '--') {
          const op = consume().text;
          const oldVal = cur.val;
          cur.val = { type: oldVal.type, value: asNumber(oldVal) + (op === '++' ? 1 : -1) };
          return oldVal;
        }
        return cur.val;
      }
      throw new Error(`Linia ${t.line}: Token neașteptat "${t.text}".`);
    }

    function execDeclaration(scopeName?: string): string[] {
      const line = peek()?.line || 1;
      const valTypeRaw = consumeTypeKeywords();
      const valType: CppValType = valTypeRaw === 'void' ? 'int' : valTypeRaw;
      const declaredNames: string[] = [];
      const activeScope = currentScopes()[currentScopes().length - 1];
      const label = scopeName || activeScope.label || 'local';

      while (pos < tokens.length) {
        const nameTok = consume();
        if (nameTok.kind !== 'ident') {
          throw new Error(`Linia ${nameTok.line}: Nume de variabilă invalid "${nameTok.text}".`);
        }
        if (peek()?.text === '[') {
          consume(); // [
          const sizeVal = peek()?.text === ']' ? 100 : Math.trunc(asNumber(evalExpr()));
          expect(']');
          const cap = Math.max(1, Math.min(500, sizeVal));
          const items: CppTypedVal[] = Array.from({ length: cap }, () => ({
            type: valType,
            value: valType === 'string' ? '' : valType === 'bool' ? false : 0,
          }));
          let maxTouched = 4; // show a clean initial window or initialized count
          if (peek()?.text === '=') {
            consume();
            expect('{');
            let idx = 0;
            while (peek() && peek()!.text !== '}') {
              const item = evalExpr();
              if (idx < items.length) {
                items[idx] = coerceType(item, valType);
                markArrayWrite(nameTok.text, idx);
                maxTouched = idx;
                idx++;
              }
              if (peek()?.text === ',') consume();
            }
            expect('}');
          } else {
            maxTouched = Math.min(cap - 1, 0);
          }
          activeScope.arrays.set(nameTok.text, {
            type: valType,
            items,
            maxTouchedIndex: maxTouched,
          });
          declaredNames.push(`${nameTok.text}[]`);
        } else {
          let initVal: CppTypedVal = {
            type: valType,
            value: valType === 'string' ? '' : valType === 'bool' ? false : 0,
          };
          if (peek()?.text === '=') {
            consume();
            initVal = coerceType(evalExpr(), valType);
          }
          activeScope.vars.set(nameTok.text, { val: initVal, scopeLabel: label });
          declaredNames.push(`${nameTok.text}=${initVal.value}`);
        }
        if (peek()?.text === ',') {
          consume();
          continue;
        }
        break;
      }
      expect(';');
      if (scopeName !== 'global') {
        recordStep(
          line,
          'init',
          'MEM ALLOC',
          `Declarare în memorie: ${declaredNames.join(', ')}`,
          `Memory declaration: ${declaredNames.join(', ')}`
        );
      }
      return declaredNames;
    }

    type StmtOutcome = {
      signal: 'none' | 'break' | 'continue' | 'return';
      returnVal?: CppTypedVal;
    };

    function execBlockOrStmt(scopeLabel = 'bloc'): StmtOutcome {
      if (peek()?.text === '{') {
        consume();
        currentScopes().push({ label: scopeLabel, vars: new Map(), arrays: new Map() });
        while (peek() && peek()!.text !== '}') {
          const out = execStmt();
          if (out.signal !== 'none') {
            while (peek() && peek()!.text !== '}') consume();
            if (peek()?.text === '}') consume();
            currentScopes().pop();
            return out;
          }
        }
        expect('}');
        currentScopes().pop();
        return { signal: 'none' };
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

    function execStmt(): StmtOutcome {
      tick();
      const t = peek();
      if (!t) return { signal: 'none' };
      const line = t.line;

      if (t.text === ';') {
        consume();
        return { signal: 'none' };
      }
      if (t.text === '{') {
        return execBlockOrStmt('bloc');
      }
      if (t.text === 'return') {
        consume();
        let retVal: CppTypedVal | undefined;
        if (peek()?.text !== ';') {
          retVal = evalExpr();
        }
        expect(';');
        recordStep(
          line,
          'return',
          'RETURN',
          retVal ? `Instrucțiune return ${retVal.value};` : 'Finalizare funcție (return;)',
          retVal ? `Statement return ${retVal.value};` : 'Return from function'
        );
        return { signal: 'return', returnVal: retVal };
      }
      if (t.text === 'break') {
        consume();
        expect(';');
        recordStep(line, 'loop', 'BREAK', 'Ieșire forțată din buclă / switch (break;)', 'Loop / switch exit (break;)');
        return { signal: 'break' };
      }
      if (t.text === 'continue') {
        consume();
        expect(';');
        recordStep(line, 'loop', 'CONTINUE', 'Salt la iterația următoare (continue;)', 'Jump to next iteration (continue;)');
        return { signal: 'continue' };
      }
      if (isTypeStart()) {
        execDeclaration();
        return { signal: 'none' };
      }

      if (t.text === 'cout' || (t.text === 'std' && peek(1)?.text === ':')) {
        if (t.text === 'std') {
          consume();
          expect(':');
          expect(':');
        }
        consume(); // cout
        let chunk = '';
        while (peek()?.text === '<<') {
          consume();
          if (peek()?.text === 'endl' || (peek()?.text === 'std' && peek(3)?.text === 'endl')) {
            if (peek()?.text === 'std') {
              consume();
              expect(':');
              expect(':');
            }
            consume();
            stdout += '\n';
            chunk += '\\n';
          } else {
            const printed = asString(evalExpr());
            stdout += printed;
            chunk += printed;
          }
        }
        expect(';');
        recordStep(
          line,
          'output',
          'STDOUT',
          `Afișare pe ecran: ${chunk.trim() || '(linie nouă)'}`,
          `Printed to console: ${chunk.trim() || '(newline)'}`
        );
        return { signal: 'none' };
      }

      if (t.text === 'cin' || (t.text === 'std' && peek(1)?.text === ':' && peek(3)?.text === 'cin')) {
        if (t.text === 'std') {
          consume();
          expect(':');
          expect(':');
        }
        consume(); // cin
        const readLog: string[] = [];
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
            const arr = findArrayBox(targetTok.text);
            if (!arr) throw new Error(`Vectorul "${targetTok.text}" nu a fost declarat.`);
            if (arrIndex < 0 || arrIndex >= arr.items.length) {
              throw new Error(`Index invalid ${arrIndex} pentru vectorul "${targetTok.text}".`);
            }
            arr.items[arrIndex] = coerceType({ type: 'string', value: raw }, arr.type);
            if (arrIndex > arr.maxTouchedIndex) arr.maxTouchedIndex = arrIndex;
            markArrayWrite(targetTok.text, arrIndex);
            readLog.push(`${targetTok.text}[${arrIndex}] ← ${raw}`);
          } else {
            const cur = findVarSlot(targetTok.text);
            if (!cur) throw new Error(`Variabila "${targetTok.text}" nu a fost declarată.`);
            const parsed: CppTypedVal =
              cur.val.type === 'string'
                ? { type: 'string', value: raw }
                : cur.val.type === 'double'
                ? { type: 'double', value: parseFloat(raw) || 0 }
                : cur.val.type === 'bool'
                ? { type: 'bool', value: raw !== '0' && raw !== 'false' }
                : { type: 'int', value: parseInt(raw, 10) || 0 };
            cur.val = parsed;
            readLog.push(`${targetTok.text} ← ${parsed.value}`);
          }
        }
        expect(';');
        recordStep(
          line,
          'input',
          'STDIN READ',
          `Citire din intrare (cin): ${readLog.join(', ')}`,
          `Read from stdin (cin): ${readLog.join(', ')}`
        );
        return { signal: 'none' };
      }

      if (t.text === 'if') {
        consume();
        expect('(');
        const condLine = t.line;
        const cond = asBool(evalExpr());
        expect(')');
        recordStep(
          condLine,
          'cond',
          cond ? 'COND TRUE' : 'COND FALSE',
          cond
            ? 'Condiția if este ADEVĂRATĂ — se execută ramura pozitivă.'
            : 'Condiția if este FALSĂ — se sare peste ramură.',
          cond
            ? 'if condition evaluated TRUE — entering branch.'
            : 'if condition evaluated FALSE — skipping branch.'
        );
        if (cond) {
          const out = execBlockOrStmt('if');
          if (peek()?.text === 'else') {
            consume();
            skipBlockOrStmt();
          }
          return out;
        } else {
          skipBlockOrStmt();
          if (peek()?.text === 'else') {
            consume();
            return execBlockOrStmt('else');
          }
          return { signal: 'none' };
        }
      }

      if (t.text === 'switch') {
        consume();
        expect('(');
        const switchVal = asNumber(evalExpr());
        expect(')');
        expect('{');
        currentScopes().push({ label: 'switch', vars: new Map(), arrays: new Map() });
        let matched = false;
        let fallthrough = false;
        let out: StmtOutcome = { signal: 'none' };
        while (peek() && peek()!.text !== '}') {
          const curTok = peek()!;
          if (curTok.text === 'case') {
            consume();
            const caseVal = asNumber(evalExpr());
            expect(':');
            if (fallthrough || (!matched && switchVal === caseVal)) {
              matched = true;
              fallthrough = true;
            }
          } else if (curTok.text === 'default') {
            consume();
            expect(':');
            if (!matched) {
              matched = true;
              fallthrough = true;
            }
          } else if (fallthrough) {
            const st = execStmt();
            if (st.signal === 'break') {
              fallthrough = false;
            } else if (st.signal !== 'none') {
              out = st;
              break;
            }
          } else {
            // skip statement belonging to unentered case
            while (peek() && peek()!.text !== 'case' && peek()!.text !== 'default' && peek()!.text !== '}') {
              if (peek()!.text === '{') {
                skipBlockOrStmt();
              } else {
                consume();
              }
            }
          }
        }
        while (peek() && peek()!.text !== '}') consume();
        expect('}');
        currentScopes().pop();
        return out;
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
          recordStep(
            line,
            'loop',
            cond ? 'LOOP TRUE' : 'LOOP EXIT',
            cond ? 'Condiția while este ADEVĂRATĂ — continuă iterația.' : 'Condiția while este FALSĂ — se iese din buclă.',
            cond ? 'while condition is TRUE — executing loop body.' : 'while condition is FALSE — exiting loop.'
          );
          if (!cond) {
            skipBlockOrStmt();
            break;
          }
          const out = execBlockOrStmt('while');
          if (out.signal === 'break') break;
          if (out.signal === 'return') return out;
        }
        return { signal: 'none' };
      }

      if (t.text === 'do') {
        consume();
        const bodyStart = pos;
        while (true) {
          tick();
          pos = bodyStart;
          const out = execBlockOrStmt('do-while');
          if (out.signal === 'return') return out;
          const whileTok = expect('while');
          expect('(');
          const cond = asBool(evalExpr());
          expect(')');
          expect(';');
          recordStep(
            whileTok.line,
            'loop',
            cond ? 'DO-WHILE TRUE' : 'DO-WHILE EXIT',
            cond
              ? 'Condiția do-while este ADEVĂRATĂ — se repetă bucla.'
              : 'Condiția do-while este FALSĂ — bucla s-a încheiat.',
            cond ? 'do-while condition is TRUE — repeating.' : 'do-while condition is FALSE — finished.'
          );
          if (out.signal === 'break' || !cond) break;
        }
        return { signal: 'none' };
      }

      if (t.text === 'for') {
        consume();
        expect('(');
        currentScopes().push({ label: 'for', vars: new Map(), arrays: new Map() });
        if (peek()?.text !== ';') {
          if (isTypeStart()) {
            execDeclaration('for');
          } else {
            do {
              evalExpr();
              if (peek()?.text === ',') consume();
              else break;
            } while (true);
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
          recordStep(
            line,
            'loop',
            cond ? 'FOR CHECK OK' : 'FOR EXIT',
            cond ? 'Condiția for este ADEVĂRATĂ — intrăm în corp.' : 'Condiția for este FALSĂ — încheiem bucla.',
            cond ? 'for condition is TRUE — running body.' : 'for condition is FALSE — exiting for-loop.'
          );
          if (!cond) {
            skipBlockOrStmt();
            break;
          }
          const out = execBlockOrStmt('for-body');
          if (out.signal === 'break') break;
          if (out.signal === 'return') {
            currentScopes().pop();
            return out;
          }
          const afterBody = pos;
          pos = stepPos;
          if (peek()?.text !== ')') {
            do {
              evalExpr();
              if (peek()?.text === ',') consume();
              else break;
            } while (true);
            recordStep(
              line,
              'loop',
              'FOR STEP',
              'Actualizare pas buclă for (incrementare/decrementare).',
              'for-loop step update.'
            );
          }
          pos = afterBody;
        }
        currentScopes().pop();
        return { signal: 'none' };
      }

      // General expression statement (e.g., a = b + 1;, swap(v[i], v[j]);, i++;)
      const stmtTextTokens: string[] = [];
      const stmtStart = pos;
      let scan = stmtStart;
      while (scan < tokens.length && tokens[scan].text !== ';') {
        stmtTextTokens.push(tokens[scan].text);
        scan++;
      }
      const hadArrayWritesBefore = pendingArrayWrites.size;
      evalExpr();
      expect(';');
      const hasArrayOp = pendingArrayWrites.size > hadArrayWritesBefore || stmtTextTokens.includes('swap');
      recordStep(
        line,
        hasArrayOp ? 'array' : 'assign',
        hasArrayOp ? 'ARRAY WRITE' : 'MEM WRITE',
        `Executat: ${stmtTextTokens.join(' ')}`,
        `Executed: ${stmtTextTokens.join(' ')}`
      );
      return { signal: 'none' };
    }

    if (mainBodyPos !== null) {
      pos = mainBodyPos;
      execBlockOrStmt('main');
    } else if (topLevelLooseStatements.length > 0) {
      for (const sPos of topLevelLooseStatements) {
        pos = sPos;
        const out = execStmt();
        if (out.signal === 'return') break;
      }
    }

    return {
      stdout: stdout.trimEnd(),
      error: null,
      diagnostic,
      durationMs: Math.round(performance.now() - start),
      totalSteps,
      truncated,
      stdinTokens,
      steps,
    };
  } catch (err) {
    return {
      stdout: '',
      error: err instanceof Error ? err.message : String(err),
      diagnostic,
      durationMs: Math.round(performance.now() - start),
      totalSteps: 0,
      truncated: false,
      stdinTokens,
      steps: [],
    };
  }
}
