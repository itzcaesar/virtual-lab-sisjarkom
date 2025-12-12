import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Virtual Lab: The Digital Trinity",
  description: "Simulasi lab komputer interaktif untuk pembelajaran Hardware, OS, dan Network",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
