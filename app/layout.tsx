import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
    title: "UltraTech Executive Intelligence | V8",
    description: "Advanced executive intelligence platform for UltraTech Cement",
};

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={cn(
                inter.variable,
                manrope.variable,
                "font-sans min-h-screen bg-obsidian text-slate-200 antialiased selection:bg-gold/30"
            )}>
                {children}
            </body>
        </html>
    );
}
