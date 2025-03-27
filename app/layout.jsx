import { ToastProvider } from "@/components/ui/toast";
import "./globals.css";

export const metadata = {
  title: "Sistema de Gestión",
  description: "Sistema de gestión para vehículos, productos y libros diarios",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
      <ToastProvider>
        {children}
      </ToastProvider>
      </body>
    </html>
  );
}
