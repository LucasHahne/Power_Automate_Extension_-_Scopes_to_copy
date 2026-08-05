// src/utils/jsonExpressionPath.ts
// Pure helpers for turning a clicked line in the Power Automate run-history
// Monaco JSON viewer into a Power Automate `outputs('Action')?[...]` expression.
//
// The Monaco viewer is virtualized: only visible lines exist in the DOM, they
// are positioned absolutely (DOM order != visual order), and long / deep JSON
// is often only partially loaded. Because of that we resolve the path from the
// visible lines using indentation depth rather than trying to parse the whole
// document from the root.

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
 * Collects the visible Monaco `.view-line` rows inside a `.view-lines` container,
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
 * When an object opener `{` sits on its own line at the same indent as its key
 * (`"body":` / `{`), indentation alone cannot link them. Walk back for that key.
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
  // Standalone object `{` under a same-indent key — use the key, not [0].
  if (lines[elementIdx].content.trimStart().startsWith("{")) {
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

/** Reconstructs a parseable JSON string from the visible lines (best-effort). */
export function reconstructJson(lines: ViewLine[]): string {
  return closeIncompleteJson(lines.map((l) => l.raw).join("\n"));
}
