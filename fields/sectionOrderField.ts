import type { ArrayField } from "payload";

type SectionOption = {
  label: string;
  value: string;
};

export function createSectionOrderField(
  label: string,
  options: SectionOption[],
): ArrayField {
  return {
    name: "sectionOrder",
    type: "array",
    label,
    defaultValue: options.map(({ value }) => ({ sectionId: value })),
    admin: {
      description:
        "Réordonnez les sections par glisser-déposer. L'ordre sauvegardé est répercuté sur la page publique après revalidation.",
      initCollapsed: true,
    },
    fields: [
      {
        name: "sectionId",
        type: "select",
        required: true,
        options,
        admin: {
          description:
            "Sélectionnez la section à afficher à cette position. Chaque section doit idéalement apparaître une seule fois.",
        },
      },
    ],
  };
}
