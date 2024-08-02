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

        {/* <!-- Hotjar Tracking Code for Site 5081115 (name missing) --> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
                (function(h,o,t,j,a,r){
                  h.hj = h.hj || function(){(h.hj.q = h.hj.q || []).push(arguments)};
                  h._hjSettings={hjid:5081115,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
          }}
        />

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
