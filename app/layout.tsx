import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "sonner";
import AuthProvider from "@/components/AuthProvider";

const mona = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "propwise",
  description: "AI powered application for interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${mona.variable} min-h-screen bg-black bg-[url('/bg.svg')] antialiased`}
      >
        <AuthProvider />
        <ThemeProvider
          attribute={"class"}
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <Toaster richColors={true} position="bottom-center" />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
