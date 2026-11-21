import { traceCppCode } from './cppTraceEngine';

export type SandboxLanguage = 'cpp' | 'python' | 'html';

export interface SandboxExecutionResult {
  stdout: string;
  error: string | null;
  diagnostic: string | null;
  durationMs: number;
  htmlDoc?: string;
  totalSteps?: number;
}

const MAX_STEPS = 20000;

export function runCppCode(source: string, stdinRaw: string): SandboxExecutionResult {
  const res = traceCppCode(source, stdinRaw, { captureTrace: false });
  return {
    stdout: res.stdout,
    error: res.error,
    diagnostic: res.diagnostic,
    durationMs: res.durationMs,
    totalSteps: res.totalSteps,
  };
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
