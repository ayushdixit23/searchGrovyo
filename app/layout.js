import { Plus_Jakarta_Sans } from 'next/font/google'

const plus_jakarta_sans = Plus_Jakarta_Sans({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus_jakarta_sans',
})
import "./globals.css";
import { AuthContextProvider } from "./utils/AuthWrapper";
import { SocketContextProvider } from "./utils/SocketWrapper";
import Providers from "./redux/Providers";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import Script from "next/script";
// import AgoraRTCProviders from "./component/client";

export const metadata = {
  title: "Grovyo",
  description: "Created by Grovyo Platforms Private Ltd",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-GFZQDF58V2" />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
        window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-GFZQDF58V2');
        `}
        </Script>


      </head>
      <body className={`${plus_jakarta_sans.className}`}>
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
                {/* <AgoraRTCProviders>{children}</AgoraRTCProviders> */}
                {children}
              </SocketContextProvider>
            </Providers>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
