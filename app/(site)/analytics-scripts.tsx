// Analytics hook. The template ships with no tracking at all.
//
// To add your own, render it here with next/script, for example Google
// Analytics 4:
//
//   import Script from 'next/script';
//   <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" strategy="afterInteractive" />
//   <Script id="ga4" strategy="afterInteractive">{`
//     window.dataLayer = window.dataLayer || [];
//     function gtag(){dataLayer.push(arguments);}
//     gtag('js', new Date());
//     gtag('config', 'G-XXXXXXX');
//   `}</Script>
//
// It is mounted once in app/(site)/layout.tsx, so it covers every public page.
export default function AnalyticsScripts() {
  return null;
}
