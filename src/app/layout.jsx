import "./globals.css";
import OutboxBoot from "@/components/OutboxBoot";

export const metadata = {
  title: "جمعية الأمل والإحسان الخيرية",
  description:
    "جمعية إنسانية تطوعية تقدّم العون والإغاثة والرعاية الصحية والاجتماعية للفئات الأشد حاجة في جبلة وريفها والمحافظات السورية.",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "الأمل والإحسان" },
  icons: { icon: "/favicon.ico", apple: "/icons/apple-touch-icon.png" },
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
