import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "THE GRID",
  description: "THE GRID motorsport agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
