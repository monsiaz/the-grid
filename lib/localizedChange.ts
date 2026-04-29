type AnyRecord = Record<string, unknown>;

function collectPathValues(node: unknown, segments: string[]): unknown[] {
  if (segments.length === 0) return [node];
  const [head, ...rest] = segments;

  if (head === "[]") {
    if (!Array.isArray(node)) return [];
    return node.flatMap((item) => collectPathValues(item, rest));
  }

  if (!node || typeof node !== "object") return [];
  return collectPathValues((node as AnyRecord)[head], rest);
}

function normalizeComparable(values: unknown[]): string {
  return JSON.stringify(
    values
      .map((value) => (typeof value === "string" ? value.trim() : value))
      .filter((value) => value !== undefined && value !== null && value !== ""),
  );
}

export function hasLocalizedTextChange({
  doc,
  previousDoc,
  paths,
}: {
  doc: unknown;
  previousDoc?: unknown;
  paths: string[];
}) {
  if (!previousDoc) return true;

  return paths.some((path) => {
    const segments = path.split(".");
    const current = normalizeComparable(collectPathValues(doc, segments));
    const previous = normalizeComparable(collectPathValues(previousDoc, segments));
    return current !== previous;
  });
}
