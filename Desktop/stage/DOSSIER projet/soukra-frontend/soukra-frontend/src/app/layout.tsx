import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}