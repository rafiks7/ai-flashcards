import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import NavBar from "./nav.js";
import Footer from "./footer.js";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Flashcards",
  description: "AI-generated educational flashcards",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
