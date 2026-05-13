import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import AppProviders from "@/components/AppProviders";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "VerbMaster",
  description: "Practice English irregular verbs",
  manifest: "/manifest.webmanifest",
  applicationName: "VerbMaster",
  appleWebApp: {
    capable: true,
    title: "VerbMaster",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#0052CC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className={roboto.className}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
