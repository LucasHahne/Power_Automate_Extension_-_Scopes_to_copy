// src/utils/jsonExpressionPath.ts
// Pure helpers for turning a clicked line in the Power Automate run-history
// Monaco JSON viewer into a Power Automate `outputs('Action')?[...]` expression.
//
// `.view-line` rows are positioned absolutely (DOM order != visual order), so
// we sort by `top` and join the full editor text from the DOM. Path resolution
// prefers a character-offset walk of that JSON (needed for nested arrays that
// share a single line, e.g. `["Product A", "PN-1001"]`). Indent-walking is
// only the fallback when the joined text is not parseable.

export type PathSegment = string | number;

export interface ViewLine {
  /** Number of leading whitespace characters (indentation depth marker). */
  indent: number;
  /** Trimmed line text. */
  content: string;
  /** Normalized (nbsp -> space) full line text, including indentation. */
  raw: string;
  /** Absolute `top` in px, used to restore visual order. */
  top: number;
  /** The originating `.view-line` element. */
  element: HTMLElement;
}

type Classification =
  | { type: "key"; key: string }
  | { type: "element" }
  | { type: "closer" }
  | { type: "other" };

const KEY_RE = /^"((?:[^"\\]|\\.)*)"\s*:/;

/** Monaco renders indentation and gaps as non-breaking spaces; JSON.parse rejects them. */
function normalizeWhitespace(text: string): string {
  return text.replace(/\u00a0/g, " ");
}

function parseTop(styleTop: string): number {
  const n = parseFloat(styleTop);
  return Number.isFinite(n) ? n : 0;
}

function unescapeJsonString(inner: string): string {
  try {
    return JSON.parse(`"${inner}"`) as string;
  } catch {
    return inner;
  }
}

/** Escapes a value for use inside a single-quoted Power Automate expression literal. */
function escapeSingleQuoted(value: string): string {
  return value.replace(/'/g, "''");
}

/**
 * Collects Monaco `.view-line` rows inside a container (prefer the full
 * `.monaco-editor` so off-screen lines still in the DOM are included),
 * sorted into visual (top-to-bottom) order.
 */
export function collectViewLines(container: Element): ViewLine[] {
  const els = Array.from(
    container.querySelectorAll<HTMLElement>(".view-line"),
  );

  const lines: ViewLine[] = [];
  for (const el of els) {
    const raw = normalizeWhitespace(el.textContent ?? "");
    const content = raw.trim();
    if (content.length === 0) continue;
    const indent = raw.length - raw.trimStart().length;
    lines.push({ indent, content, raw, top: parseTop(el.style.top), element: el });
  }

  lines.sort((a, b) => a.top - b.top);
  return lines;
}

function classify(content: string): Classification {
  const m = KEY_RE.exec(content);
  if (m) return { type: "key", key: unescapeJsonString(m[1]) };

  const first = content[0];
  if (first === "}" || first === "]") return { type: "closer" };
  // Object/array element opener (`{`, `[`) or a scalar array element (`"a",`, `1,`, `true`).
  if (first !== undefined && content.length > 0) return { type: "element" };
  return { type: "other" };
}

/**
 * Index of an array element line among its same-indent siblings, counting only
 * element starts (object/array openers and scalar items) that precede it.
 */
function arrayIndexOf(lines: ViewLine[], elementIdx: number, indent: number): number {
  let index = 0;
  for (let i = elementIdx - 1; i >= 0; i--) {
    const ln = lines[i];
    if (ln.indent < indent) break; // reached the enclosing array opener
    if (ln.indent > indent) continue; // inside a previous sibling
    if (classify(ln.content).type === "element") index++;
  }
  return index;
}

/** Finds the nearest preceding line with a strictly smaller indent. */
function findParentIndex(lines: ViewLine[], from: number, indent: number): number {
  for (let i = from - 1; i >= 0; i--) {
    if (lines[i].indent < indent) return i;
  }
  return -1;
}

/**
 * True when a line opens an array: bare `[` or a key whose value starts with `[`
 * (e.g. `"value": [`). Object openers (`{`, `"body": {`) return false.
 */
function isArrayOpener(content: string): boolean {
  const keyMatch = KEY_RE.exec(content);
  const valuePart = (keyMatch ? content.slice(keyMatch[0].length) : content).trim();
  return valuePart.startsWith("[");
}

/**
 * True when `elementIdx` is a child of an array opener. Root `{` / object-valued
 * `{` under a key are not array elements and must not contribute a `[n]` segment.
 */
function isInsideArray(lines: ViewLine[], elementIdx: number): boolean {
  const parentIdx = findParentIndex(
    lines,
    elementIdx,
    lines[elementIdx].indent,
  );
  if (parentIdx === -1) return false;
  return isArrayOpener(lines[parentIdx].content);
}

/**
 * When an object or array opener sits on its own line at the same indent as its
 * key (`"body":` / `{`, `"values":` / `[`), indentation alone cannot link them.
 * Walk back for that key.
 */
function findPrecedingKeyAtIndent(
  lines: ViewLine[],
  from: number,
  indent: number,
): number {
  for (let i = from - 1; i >= 0; i--) {
    if (lines[i].indent < indent) return -1;
    if (lines[i].indent > indent) continue;
    const c = classify(lines[i].content);
    if (c.type === "key") return i;
    // Another element/closer at this indent means this `{` is not that key's value.
    return -1;
  }
  return -1;
}

/** Path segment contributed by an element line, or null if it should be skipped. */
function elementPathSegment(
  lines: ViewLine[],
  elementIdx: number,
): PathSegment | null {
  if (isInsideArray(lines, elementIdx)) {
    return arrayIndexOf(lines, elementIdx, lines[elementIdx].indent);
  }
  // Standalone `{` / `[` under a same-indent key (`"body":` / `{`, `"values":` / `[`).
  const trimmed = lines[elementIdx].content.trimStart();
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    const keyIdx = findPrecedingKeyAtIndent(
      lines,
      elementIdx,
      lines[elementIdx].indent,
    );
    if (keyIdx !== -1) {
      const k = classify(lines[keyIdx].content);
      if (k.type === "key") return k.key;
    }
  }
  return null;
}

/**
 * Resolves the JSON path (relative to the outermost visible container) for the
 * clicked line, using indentation to reconstruct ancestry.
 *
 * Returns an empty path when the click is on the root output itself (e.g. a
 * Compose that yields a bare string) — callers format that as `outputs('Action')`.
 */
export function resolveExpressionPath(
  lines: ViewLine[],
  clickedIndex: number,
): PathSegment[] | null {
  if (clickedIndex < 0 || clickedIndex >= lines.length) return null;

  let idx = clickedIndex;
  let cls = classify(lines[idx].content);

  // Clicking a lone closer: resolve to the container it closes (its opener).
  if (cls.type === "closer") {
    const openerIdx = findMatchingOpener(lines, idx);
    if (openerIdx === -1) return null;
    idx = openerIdx;
    cls = classify(lines[idx].content);
  }

  const path: PathSegment[] = [];
  let curIndent: number;

  if (cls.type === "key") {
    path.unshift(cls.key);
    curIndent = lines[idx].indent;
  } else if (cls.type === "element") {
    // Root-level value with no enclosing key/array (bare string/number/object/array
    // as the whole action output) → empty path → outputs('Action').
    if (findParentIndex(lines, idx, lines[idx].indent) === -1) {
      return [];
    }
    const seg = elementPathSegment(lines, idx);
    if (seg !== null) path.unshift(seg);
    curIndent = lines[idx].indent;
  } else {
    return null;
  }

  let searchFrom = idx;
  while (true) {
    const p = findParentIndex(lines, searchFrom, curIndent);
    if (p === -1) break;

    const opener = lines[p];
    const ocls = classify(opener.content);
    if (ocls.type === "key") {
      path.unshift(ocls.key);
    } else if (ocls.type === "element") {
      const seg = elementPathSegment(lines, p);
      if (seg !== null) path.unshift(seg);
    }
    curIndent = opener.indent;
    searchFrom = p;
  }

  return path;
}

/** For a closer line, the nearest preceding line at the same indent that opens a container. */
function findMatchingOpener(lines: ViewLine[], closerIdx: number): number {
  const indent = lines[closerIdx].indent;
  for (let i = closerIdx - 1; i >= 0; i--) {
    if (lines[i].indent < indent) return -1;
    if (lines[i].indent > indent) continue;
    const t = classify(lines[i].content).type;
    if (t === "key" || t === "element") return i;
  }
  return -1;
}

/**
 * Builds the Power Automate expression from an action name and a resolved path.
 * Example: `outputs('Get_worksheets')?['body']?['value']?[0]?['name']`.
 *
 * For Initialize/Set/… variable actions, prefers `variables('varName')` (plus any
 * path under `value`) when the variable name can be read from the visible JSON.
 */
export function formatExpression(
  actionName: string,
  path: PathSegment[],
  lines: ViewLine[] = [],
): string {
  if (isVariableAction(actionName)) {
    const varName = findVariableName(lines);
    if (varName) {
      return appendPath(`variables('${escapeSingleQuoted(varName)}')`, pathAfterValue(path));
    }
  }
  return appendPath(`outputs('${escapeSingleQuoted(actionName)}')`, path);
}

function appendPath(root: string, path: PathSegment[]): string {
  let expr = root;
  for (const seg of path) {
    expr +=
      typeof seg === "number" ? `?[${seg}]` : `?['${escapeSingleQuoted(seg)}']`;
  }
  return expr;
}

/** True for actions whose runtime value is referenced via variables('name'). */
export function isVariableAction(actionName: string): boolean {
  const n = actionName.toLowerCase();
  return (
    n.startsWith("initialize_variable") ||
    n.startsWith("set_variable") ||
    n.startsWith("increment_variable") ||
    n.startsWith("decrement_variable") ||
    n.startsWith("append_to_array_variable") ||
    n.startsWith("append_to_string_variable")
  );
}

/** Reads `"name": "…"` from visible lines (Initialize/Set variable output shape). */
export function findVariableName(lines: ViewLine[]): string | null {
  for (const ln of lines) {
    const m = /^"name"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(ln.content);
    if (m) return unescapeJsonString(m[1]);
  }
  return null;
}

/**
 * Drops everything through the last `value` segment so remaining segments are
 * relative to the variable itself (e.g. `['variables',0,'value',0]` → `[0]`).
 * If `value` is absent (clicked name / whole variable), returns [].
 */
export function pathAfterValue(path: PathSegment[]): PathSegment[] {
  let valueIdx = -1;
  for (let i = 0; i < path.length; i++) {
    if (path[i] === "value") valueIdx = i;
  }
  if (valueIdx === -1) return [];
  return path.slice(valueIdx + 1);
}

/**
 * Best-effort repair of partially loaded JSON: appends missing closing quotes
 * and brackets (and drops a dangling trailing comma) so the text can be parsed.
 */
export function closeIncompleteJson(text: string): string {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === "{" || c === "[") stack.push(c);
    else if (c === "}" || c === "]") stack.pop();
  }

  let out = text;
  if (inString) out += '"';
  out = out.replace(/\s+$/, "");
  if (out.endsWith(",")) out = out.slice(0, -1);
  for (let i = stack.length - 1; i >= 0; i--) {
    out += stack[i] === "{" ? "}" : "]";
  }
  return out;
}

/** Reconstructs a parseable JSON string from the view-lines (best-effort). */
export function reconstructJson(lines: ViewLine[]): string {
  return closeIncompleteJson(lines.map((l) => l.raw).join("\n"));
}

type WalkResult = PathSegment[] | "skip" | "error";

function isWs(c: string | undefined): boolean {
  return c === " " || c === "\t" || c === "\n" || c === "\r";
}

/**
 * JSON path at a character offset in a complete (or closable) JSON document.
 * Clicking a key name includes that key; clicking `[` / `{` yields the path to
 * that container; clicking a nested array item includes every index.
 *
 * Returns `null` when the text cannot be walked as JSON.
 */
export function jsonPathAtOffset(text: string, offset: number): PathSegment[] | null {
  return walkJsonPathAtOffset(text, offset, true);
}

function walkJsonPathAtOffset(
  text: string,
  offset: number,
  retryOnError: boolean,
): PathSegment[] | null {
  if (!text) return null;
  const n = text.length;
  if (offset < 0) offset = 0;
  if (offset > n) offset = n;

  let i = 0;

  const skipWs = () => {
    while (i < n && isWs(text[i])) i++;
  };

  const inSpan = (start: number, end: number): boolean => {
    if (offset === n) return end === n || (start < n && end === n);
    if (start === end) return offset === start;
    return offset >= start && offset < end;
  };

  const readString = (): string | null => {
    if (text[i] !== '"') return null;
    i++;
    let inner = "";
    while (i < n) {
      const c = text[i];
      if (c === "\\") {
        inner += c + (text[i + 1] ?? "");
        i += text[i + 1] === undefined ? 1 : 2;
        continue;
      }
      if (c === '"') {
        i++;
        return unescapeJsonString(inner);
      }
      inner += c;
      i++;
    }
    return null;
  };

  const parseLiteral = (path: PathSegment[], start: number): WalkResult => {
    if (text.startsWith("true", i)) i += 4;
    else if (text.startsWith("false", i)) i += 5;
    else if (text.startsWith("null", i)) i += 4;
    else {
      const slice = text.slice(i);
      const m = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(slice);
      if (!m) return "error";
      i += m[0].length;
    }
    return inSpan(start, i) ? path : "skip";
  };

  const parseStringValue = (path: PathSegment[], start: number): WalkResult => {
    if (readString() === null) return "error";
    return inSpan(start, i) ? path : "skip";
  };

  const parseObject = (path: PathSegment[], start: number): WalkResult => {
    i++;
    skipWs();
    if (text[i] === "}") {
      i++;
      return inSpan(start, i) ? path : "skip";
    }
    while (i < n) {
      skipWs();
      if (text[i] === "}") {
        i++;
        return inSpan(start, i) ? path : "skip";
      }
      if (text[i] !== '"') return "error";
      const keyStart = i;
      const key = readString();
      if (key === null) return "error";
      const keyEnd = i;
      skipWs();
      if (text[i] !== ":") return "error";
      i++;
      const childPath = path.concat(key);
      if (inSpan(keyStart, keyEnd)) return childPath;
      const hit = parseValue(childPath);
      if (hit === "error") return "error";
      if (hit !== "skip") return hit;
      skipWs();
      if (text[i] === ",") {
        if (offset === i) return childPath;
        i++;
        continue;
      }
      if (text[i] === "}") {
        i++;
        return inSpan(start, i) ? path : "skip";
      }
      return "error";
    }
    return "error";
  };

  const parseArray = (path: PathSegment[], start: number): WalkResult => {
    i++;
    skipWs();
    if (text[i] === "]") {
      i++;
      return inSpan(start, i) ? path : "skip";
    }
    let index = 0;
    while (i < n) {
      skipWs();
      if (text[i] === "]") {
        i++;
        return inSpan(start, i) ? path : "skip";
      }
      const childPath = path.concat(index);
      const valueStart = i;
      const hit = parseValue(childPath);
      if (hit === "error") return "error";
      if (hit !== "skip") return hit;
      if (offset >= valueStart && offset < i) return childPath;
      skipWs();
      if (text[i] === ",") {
        if (offset === i) return childPath;
        i++;
        index++;
        continue;
      }
      if (text[i] === "]") {
        i++;
        return inSpan(start, i) ? path : "skip";
      }
      return "error";
    }
    return "error";
  };

  const parseValue = (path: PathSegment[]): WalkResult => {
    skipWs();
    if (i >= n) return "error";
    const start = i;
    const c = text[i];
    if (c === "{") return parseObject(path, start);
    if (c === "[") return parseArray(path, start);
    if (c === '"') return parseStringValue(path, start);
    if (c === "t" || c === "f" || c === "n" || c === "-" || (c >= "0" && c <= "9")) {
      return parseLiteral(path, start);
    }
    return "error";
  };

  const result = parseValue([]);
  if (result === "error") {
    if (retryOnError) {
      const repaired = closeIncompleteJson(text);
      if (repaired !== text) return walkJsonPathAtOffset(repaired, offset, false);
    }
    return null;
  }
  if (result === "skip") return [];
  return result;
}

function stripTrailingComma(s: string): string {
  return s.replace(/,\s*$/, "");
}

function clampOffsetInLine(line: ViewLine, offsetInLine: number): number {
  if (!Number.isFinite(offsetInLine)) return line.indent;
  if (offsetInLine < line.indent) return line.indent;
  if (offsetInLine > line.raw.length) return line.raw.length;
  return offsetInLine;
}

/**
 * Extra path segments for JSON nested on the clicked line itself (compact
 * arrays such as `["Product A", "PN-1001", "Yes", "125"],`).
 */
function inlinePathSegments(line: ViewLine, offsetInLine: number): PathSegment[] {
  const offsetInContent = offsetInLine - line.indent;
  const content = line.content;
  if (offsetInContent < 0 || content.length === 0) return [];

  const keyMatch = KEY_RE.exec(content);
  if (keyMatch) {
    const afterKey = content.slice(keyMatch[0].length);
    const ws = afterKey.length - afterKey.trimStart().length;
    const valueStart = keyMatch[0].length + ws;
    if (offsetInContent <= keyMatch[0].length) return [];
    const valuePart = stripTrailingComma(afterKey.trimStart());
    if (!valuePart) return [];
    return jsonPathAtOffset(valuePart, Math.max(0, offsetInContent - valueStart)) ?? [];
  }

  const stripped = stripTrailingComma(content);
  if (!stripped) return [];
  const rel = Math.min(Math.max(0, offsetInContent), Math.max(0, stripped.length - 1));
  return jsonPathAtOffset(stripped, rel) ?? [];
}

/**
 * Resolves the expression path for a clicked view-line, using the character
 * offset inside that line so nested values that share a row still get indexes.
 *
 * Prefers walking the joined DOM JSON; falls back to indent ancestry plus any
 * inline nested path on the clicked line.
 */
export function resolveClickedExpressionPath(
  lines: ViewLine[],
  clickedIndex: number,
  offsetInLine: number = 0,
): PathSegment[] | null {
  if (clickedIndex < 0 || clickedIndex >= lines.length) return null;

  const line = lines[clickedIndex];
  const clamped = clampOffsetInLine(line, offsetInLine);
  const fullText = lines.map((l) => l.raw).join("\n");
  let abs = 0;
  for (let i = 0; i < clickedIndex; i++) {
    abs += lines[i].raw.length + 1;
  }
  abs += clamped;

  const fromJson = jsonPathAtOffset(fullText, abs);
  if (fromJson !== null) return fromJson;

  const indentPath = resolveExpressionPath(lines, clickedIndex);
  if (!indentPath) return null;
  return indentPath.concat(inlinePathSegments(line, clamped));
}
