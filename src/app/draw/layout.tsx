import type { ReactNode } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export default function DrawLayout({ children }: { children: ReactNode }) {
  return (
    <div className={playfair.className} style={{ fontFamily: "inherit" }}>
      {children}
    </div>
  );
}
