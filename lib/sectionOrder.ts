type SectionOrderRow = {
  sectionId?: string | null;
};

/**
 * Resolve a user-configured section order coming from Payload while staying
 * resilient to partial / legacy data:
 * - keeps only known section ids
 * - removes duplicates
 * - appends any missing default sections at the end
 */
export function resolveSectionOrder<T extends string>(
  configured: SectionOrderRow[] | null | undefined,
  defaults: readonly T[],
): T[] {
  const allowed = new Set<string>(defaults);
  const ordered: T[] = [];

  for (const row of configured ?? []) {
    const id = typeof row?.sectionId === "string" ? row.sectionId : "";
    if (!allowed.has(id)) continue;
    if (ordered.includes(id as T)) continue;
    ordered.push(id as T);
  }

  for (const id of defaults) {
    if (!ordered.includes(id)) ordered.push(id);
  }

  return ordered;
}
