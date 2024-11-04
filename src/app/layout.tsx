import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/_base.scss";
import "@/styles/_reset.scss";
import "@/styles/background/stars.scss";
import "@/styles/background/intro.scss";

import Header from "@/components/layouts/Header";
import { Container } from "@mui/material";
import { LayoutProvider } from "@/hooks/layout";
import { AuthProvider } from "@/hooks/auth";
import RecoilRootWrapper from "@/components/layouts/RecoilRootWrapper";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css";
import "@/styles/_custom_toast_ui.scss";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Domi's Blog",
  description: "도미의 블로그입니다.",
  icons: {
    icon: "/favicon.png",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RecoilRootWrapper>
          <LayoutProvider>
            <AuthProvider>
              <div id="stars"></div>
              <div id="stars2"></div>
              <div id="stars3"></div>
              <Container fixed className="main-wrap galaxy-bg">
                <Header />
                <div className="main-content">{children}</div>
              </Container>
            </AuthProvider>
          </LayoutProvider>
        </RecoilRootWrapper>
      </body>
    </html>
  );
};
export default RootLayout;
