import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The body of a post.
 *
 * Deliberately short on options. Every block type here has a renderer in
 * `components/portable-text.tsx` and a style in `.prose-doc`; anything added
 * to this list without both of those renders as nothing at all, silently.
 *
 * There is no `code-input` plugin: a `codeBlock` with a language string and a
 * text field is enough, and it lets the existing Shiki highlighter in
 * `lib/highlight.ts` do the work — the same one that paints the docs, so a
 * fence on the blog and a fence in the docs are the same object.
 */
export const blockContent = defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      // h1 is the page title, and h4 is deeper than the contents rail goes.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bulleted", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          defineArrayMember({
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule
                    .required()
                    .uri({ scheme: ["http", "https", "mailto"], allowRelative: true }),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({
      name: "codeBlock",
      title: "Code",
      type: "object",
      fields: [
        defineField({
          name: "language",
          title: "Language",
          type: "string",
          initialValue: "shellscript",
          // Exactly the grammars loaded in lib/highlight.ts. Anything else
          // falls back to plain text rather than throwing the build, but the
          // author should not have to discover that by shipping.
          options: {
            list: [
              { title: "Shell", value: "shellscript" },
              { title: "Shell session", value: "shellsession" },
              { title: "JSON", value: "json" },
              { title: "YAML", value: "yaml" },
              { title: "SQL", value: "sql" },
              { title: "Protobuf", value: "protobuf" },
              { title: "nginx", value: "nginx" },
              { title: "Python", value: "python" },
              { title: "Go", value: "go" },
              { title: "INI", value: "ini" },
              { title: "Plain text", value: "text" },
            ],
          },
        }),
        defineField({
          name: "code",
          title: "Code",
          type: "text",
          rows: 12,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "filename",
          title: "Filename",
          type: "string",
          description: "Optional. Shown above the block, in mono.",
        }),
      ],
      preview: {
        select: { language: "language", code: "code", filename: "filename" },
        prepare: ({ language, code, filename }) => ({
          title: filename || `${language ?? "text"} block`,
          subtitle: (code ?? "").split("\n")[0],
        }),
      },
    }),
    defineArrayMember({
      name: "figure",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description:
            "What the image says, for a reader who cannot see it. Leave empty only if the image is pure decoration.",
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
  ],
});
