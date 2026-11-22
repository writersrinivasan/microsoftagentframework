import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { KeyProvider } from "@/lib/keystore";
import { Navbar } from "@/components/Navbar";
import { KeyDialog } from "@/components/KeyDialog";
import { Tutor } from "@/components/Tutor";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const grotesk = Space_Grotesk({ variable: "--font-grotesk", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MAF Academy — Microsoft Agent Framework Workshop",
  description: "Interactive learning materials and a live sandbox for building AI agents with Microsoft Agent Framework (Python).",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} ${mono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <div className="aurora" />
        <KeyProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-white/10 py-6 text-center text-xs text-white/40">
            MAF Academy · Microsoft Agent Framework hands-on workshop · labs verified on agent-framework-core 1.26
          </footer>
          <KeyDialog />
          <Tutor />
        </KeyProvider>
      </body>
    </html>
  );
}
