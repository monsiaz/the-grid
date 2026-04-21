import type { Field } from "payload";

type Options = {
  name: string;
  label?: string;
  required?: boolean;
  description?: string;
  defaultValue?: string;
  localized?: boolean;
};

/**
 * Returns a Payload text field wired to the custom `ImagePicker` admin component.
 *
 * The underlying field stays `type: "text"` so:
 *   - existing CMS values (relative `/images/…` paths AND `https://…blob.vercel-storage.com/…` URLs) keep working,
 *   - the frontend code doesn't change,
 *   - but admins now get a rich picker: thumbnail preview + URL input + browse library + upload to webP/CDN.
 */
export function imageField({
  name,
  label,
  required,
  description,
  defaultValue,
  localized,
}: Options): Field {
  return {
    name,
    type: "text",
    required,
    localized,
    defaultValue,
    label,
    admin: {
      description,
      components: {
        Field: "@/components/admin/ImagePicker",
      },
    },
  };
}
