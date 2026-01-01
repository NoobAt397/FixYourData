import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FixMyData - CSV Data Cleaning Tool",
  description: "Upload messy CSV files and clean them with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
