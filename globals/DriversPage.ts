import type { GlobalConfig } from "payload";

export const DriversPage: GlobalConfig = {
  slug: "drivers-page",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      required: true,
      defaultValue: "Our drivers",
    },
    {
      name: "heroDescription",
      type: "text",
      defaultValue: "The next generation of motorsport talent",
    },
    {
      name: "heroBackgroundImage",
      type: "text",
      defaultValue: "/images/drivers/hero.webp",
    },
  ],
};
