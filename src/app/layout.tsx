import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/styles/_base.scss";
import "@/styles/_reset.scss";
import "@/styles/background/stars.scss";

import Header from "@/components/layouts/Header";
import { Container } from "@mui/material";
import { MessageProvider } from "@/hooks/message";
import { AuthProvider } from "@/hooks/auth";
import RecoilRootWrapper from "@/components/layouts/RecoilRootWrapper";

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
          <MessageProvider>
            <AuthProvider>
              <div id="stars"></div>
              <div id="stars2"></div>
              <div id="stars3"></div>
              <Container fixed className="main-wrap galaxy-bg">
                <Header />
                <div className="main-content">{children}</div>
              </Container>
            </AuthProvider>
          </MessageProvider>
        </RecoilRootWrapper>
      </body>
    </html>
  );
};
export default RootLayout;
