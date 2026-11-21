import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: { default: "Erik Fitness and Rehab — Consultorio digital de fisioterapia", template: "%s · Erik Fitness and Rehab" },
  description: "Prototipo de demostración de un consultorio digital de fisioterapia en Saltillo: agenda, portal del paciente, expediente digital y pagos. Desarrollado por 844 Digital.",
  robots: { index: false, follow: false },
};
export const viewport: Viewport = { themeColor: "#0b1b33", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
