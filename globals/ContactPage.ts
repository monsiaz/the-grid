import type { GlobalConfig } from "payload";

export const ContactPage: GlobalConfig = {
  slug: "contact-page",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      required: true,
      defaultValue: "Get in touch",
    },
    {
      name: "heroDescription",
      type: "text",
      defaultValue: "We would love to hear from you",
    },
    {
      name: "heroBackgroundImage",
      type: "text",
      defaultValue: "/images/contact/hero.webp",
    },
  ],
};
