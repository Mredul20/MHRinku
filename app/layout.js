import { Inter } from "next/font/google";
import Script from "next/script";
import { getSeoIntegrations } from "@/lib/pageMeta";
import { getPersonSchema, getLocalBusinessSchema } from "@/lib/schema";
import JsonLdScript from "./components/JsonLdScript";
import "./globals.css";
import { AuthProvider } from "./Providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-display" });
const whatsappUrl = "https://wa.me/8801786029947";

export const revalidate = 3600;

export async function generateMetadata() {
  const { searchConsoleVerification } = await getSeoIntegrations();

  return {
    title: "Mobarak Hossain Rinku | Portfolio",
    description: "Results-driven design and marketing that scales your business.",
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
      apple: "/favicon.png",
    },
    ...(searchConsoleVerification ? { verification: { google: searchConsoleVerification } } : {}),
  };
}

export default async function RootLayout({ children }) {
  const { gtmId } = await getSeoIntegrations();

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased font-display`} suppressHydrationWarning>
        {gtmId && (
          <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`} title="Google Tag Manager" height="0" width="0" className="hidden invisible" />
          </noscript>
        )}
        <AuthProvider>
          <JsonLdScript id="person-schema" data={getPersonSchema()} />
          <JsonLdScript id="local-business-schema" data={getLocalBusinessSchema()} />
          {gtmId && (
            <Script id="google-tag-manager" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
            </Script>
          )}
          {children}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:scale-110 hover:bg-[#20bd5a]"
            aria-label="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="size-7 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.464 3.488A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </a>
        </AuthProvider>
      </body>
    </html>
  );
}
