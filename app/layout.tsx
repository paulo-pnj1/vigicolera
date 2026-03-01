import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../src/components/Navbar";

export const metadata: Metadata = {
  title: "VigiColera",
  description: "Sistema de Monitorização de Cólera",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className="antialiased">
          <div className="p-4 mt-4">
          {children}
        </div>
        
      
      </body>
    </html>
  );
}
