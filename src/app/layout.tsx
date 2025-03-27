import type { Metadata } from "next";
import "./globals.css";
import { Disclaimer } from "@/components/disclaimer";

export const metadata: Metadata = {
  title: 'WeChat Image OCR',
  description: 'A simple tool for extracting text from WeChat images',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-sans antialiased min-h-screen flex flex-col"
      >
        {children}
        <Disclaimer />
      </body>
    </html>
  );
}
