import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KET | Quantum Circuit Profiler",
  description: "Visualize entanglement growth and complexity in the browser",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="app-container">
          <Navbar />

          {children}

          <footer style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border-light)', marginTop: 'auto' }}>
            &copy; {new Date().getFullYear()} AxionSoftware Inc. Built for the Quantum Computing Community.
          </footer>
        </div>
      </body>
    </html>
  );
}
