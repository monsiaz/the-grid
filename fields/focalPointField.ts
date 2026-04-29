import type { Field } from "payload";

type Options = {
  name?: string;
  label?: string;
  description?: string;
};

export function focalPointField({
  name = "imageFocalPoint",
  label = "Cadrage / point focal",
  description = "Ouvrez la preview pour choisir la zone de l'image à garder visible dans le cadre du site.",
}: Options = {}): Field {
  return {
    name,
    type: "text",
    defaultValue: "50% 50%",
    label,
    admin: {
      description,
      components: {
        Field: "@/components/admin/FocalPointPicker",
      },
    },
  };
}
