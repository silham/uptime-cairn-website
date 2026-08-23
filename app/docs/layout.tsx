import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Documentation", template: "%s — Uptime Cairn docs" },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
