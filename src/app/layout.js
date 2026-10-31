import { Geist, Geist_Mono, Saira_Stencil_One } from "next/font/google";

import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartProvider from "@/components/cart/CartProvider";
import ToastProvider from "@/components/toast/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sairaStencil = Saira_Stencil_One({
  variable: "--font-saira-stencil",
  subsets: ["latin"],
  weight: "400",
});

export const metadata = {
  title: "Pokébua",
  description: "Kjøp, selg og bytt Pokémon-kort hos Pokébua.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="no"
      className={`${geistSans.variable} ${geistMono.variable} ${sairaStencil.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ToastProvider>
          <CartProvider>
            <Navbar />

            <main id="main-content" tabIndex={-1} className="flex-1">
              {children}
            </main>

            <Footer />
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
