import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CursorGlow } from "@/components/ui/CursorGlow";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AdMotion | Advertising · Marketing · Branding | Lucknow",
  description:
    "Full-service marketing company specializing in advertising, photography, and film. OOH, cinema, LED van, digital wall wraps & more. Gomti Nagar, Lucknow.",
  openGraph: {
    title: "AdMotion | Advertising · Marketing · Branding",
    description:
      "Innovative outdoor advertising & marketing. One roof across India. Lucknow.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Critical fallback if main CSS chunk fails (avoids white unstyled flash) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `html,body{background-color:#0f0f13;color:#fff;min-height:100dvh}body{font-family:system-ui,sans-serif}`,
          }}
        />
      </head>
      <body className="min-h-dvh antialiased bg-background text-foreground font-sans">
        <CursorGlow />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
