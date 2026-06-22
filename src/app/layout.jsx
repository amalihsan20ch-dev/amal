import "./globals.css";
import OutboxBoot from "@/components/OutboxBoot";
import { SITE } from "@/lib/site";

const DESC =
  "جمعية إنسانية تطوعية تقدّم العون والإغاثة والرعاية الصحية والاجتماعية للفئات الأشد حاجة في جبلة وريفها والمحافظات السورية.";

export const metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s · ${SITE.shortName}` },
  description: DESC,
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: SITE.shortName },
  icons: { icon: "/favicon.ico", apple: "/icons/apple-touch-icon.png" },
  openGraph: {
    type: "website", locale: "ar_AR", siteName: SITE.name,
    title: SITE.name, description: DESC, url: SITE.url,
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: SITE.name }],
  },
  twitter: { card: "summary", title: SITE.name, description: DESC, images: ["/icons/icon-512.png"] },
};

export const viewport = {
  themeColor: "#205C90",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, // steadier on low-end browsers
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="font-sans antialiased">
        <OutboxBoot />
        {children}
      </body>
    </html>
  );
}
