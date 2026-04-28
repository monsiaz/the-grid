import type { Field } from "payload";

type Options = {
  name: string;
  label?: string;
  required?: boolean;
  description?: string;
};

/**
 * A Payload text field wired to the `LogoPicker` admin component.
 * Stores a public URL (Vercel Blob) to a SVG or PNG logo.
 * Files are uploaded as-is — no WebP conversion, no resizing.
 */
export function logoField({ name, label, required, description }: Options): Field {
  return {
    name,
    type: "text",
    required,
    label,
    admin: {
      description,
      components: {
        Field: "@/components/admin/LogoPicker",
      },
    },
  };
}
