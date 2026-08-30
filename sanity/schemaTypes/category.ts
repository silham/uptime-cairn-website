import { defineField, defineType } from "sanity";

/**
 * A category is a browsable page at /blog/category/<slug>, so it needs a
 * description that reads as a page lead — not a taxonomy label. Keep the set
 * small; every category is a route in the sitemap.
 */
export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description:
        "One sentence. It is the lead on the category page and its meta description.",
      validation: (rule) => rule.required().max(200),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "description" },
  },
});
