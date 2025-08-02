import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";
import Navbar from "@/components/ui/navbar";
import Footer from "@/components/ui/footer";

export const metadata = {
  title: "Sistema de Gestión",
  description: "Sistema de gestión para vehículos, productos y libros diarios",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
      <ToastProvider>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </ToastProvider>
      </body>
    </html>
  );
}
