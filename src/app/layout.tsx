import type { Metadata, Viewport } from "next";
import { Intro } from "@/components/intro/Intro";
import { JsonLd } from "@/components/JsonLd";
import { bodyFont, displayFont } from "@/lib/fonts";
import { site } from "@/lib/site";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author.name, url: site.url }],
  creator: site.author.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  formatDetection: { email: false, telephone: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0e1118",
  colorScheme: "dark",
};

const siteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: site.lang,
  },
  {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.author.name,
    jobTitle: site.author.jobTitle,
    url: site.url,
    sameAs: site.author.sameAs,
  },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={site.lang} className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body>
        <Intro />
        <noscript>
          <style>{`[data-intro]{display:none!important}`}</style>
        </noscript>
        <main>{children}</main>
        <JsonLd data={siteJsonLd} />
      </body>
    </html>
  );
}
