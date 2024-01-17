import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthSession from "@components/AuthSession";
import Notification from "@components/Notification";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peanut Closet 쇼핑몰",
  description: "Nextjs 로 만든 shopping-mall",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthSession>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <Notification />
        </body>
      </html>
    </AuthSession>
  );
}
