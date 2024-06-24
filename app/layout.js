import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from "./utils/AuthWrapper";
import { SocketContextProvider } from "./utils/SocketWrapper";
import Providers from "./redux/Providers";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Grovyo",
  description: "Created by Grovyo Platforms Private Ltd",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthContextProvider>
            <Providers>
              <SocketContextProvider>
                <Toaster />
                {children}
              </SocketContextProvider>
            </Providers>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
