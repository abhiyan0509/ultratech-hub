import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
    title: "UltraTech Executive Intelligence | V10",
    description: "Advanced executive intelligence platform for UltraTech Cement",
};

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(
                inter.variable,
                "font-sans antialiased overflow-x-hidden"
            )}>
                {children}
            </body>
        </html>
    );
}
