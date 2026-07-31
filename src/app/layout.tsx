"use client";


import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import "../styles/index.css";
import "../styles/prism-vsc-dark-plus.css";
import "../styles/satoshi.css";
import "../styles/style.css";
import ToasterContext from "./api/contex/ToasetContex";
import { useEffect, useState } from "react";
import PreLoader from "@/components/Common/PreLoader";
import { AuthProvider } from "@/ContextApi/AuthContext";
import { GlobalConfigProvider, useGlobalConfig } from "@/types/GlobalConfigContext";
import Head from 'next/head';
import { SnackbarProvider } from "@/ContextApi/SnackBarContext";
import ScrollToTopOnRouteChange from "@/components/Common/ScrollToTopOnRouteChange";
import Script from 'next/script';

export default function RootLayout({
  children,

}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(false);


  useEffect(() => {
    // setTimeout(() => setLoading(false), 100);
  },);

  return (
    <html suppressHydrationWarning={true} className="!scroll-smooth" lang="en">

      {/* <head /> will contain the components returned by the nearest parent
      head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head

      <head /> */}

      <head>
        {/* Add the global Google Analytics script hereee */}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How much does Sawamani Cost?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The Cost of Sawamani at Mehandipur Balaji Varies Depending on the type of Prasad.

Mehandipur Balaji Sawamani Cost
1. Churma (51 Kg): ₹6,100
2. Kheer Puri (51 Kg): ₹7,100
3. Halwa Puri (51 Kg): ₹8,100
4. Laddu Puri (51 Kg): ₹8,400`
                  }
                },
                {
                  "@type": "Question",
                  "name": "How Much Is Sawamani in Kg?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "An Offering of a Sawamani at Mehandipur Balaji Usually Stands at 51 Kilograms Which Is Also the Average Weight of the Different Kinds of Prasad Like Churma, Kheer Puri, Halwa Puri, and Laddu Puri."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How to Book Mehandipur Balaji Sawamani Online?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `To Book Mehandipur Balaji Sawamani Online, Follow These Simple Steps:

1. Visit Our Website – Go to Mehandipur Balaji Website.
2. Go to the Sawamani Online Section – Click on the "Sawamani Online Booking" Option Available on the Homepage.
3. Choose Your Sawamani Type – Select from the Available Offerings Like Ladoo Sawamani, Churma Sawamani, or Halwapuri.
4. Fill in Your Details – Provide Your Name, Contact Number, and Any Specific Requirements.
5. Proceed with Online Payment – Make a Secure Payment Through the Provided Options.
6. Receive Instant Confirmation – After a Successful Booking, You Will Get a Confirmation Via Sms or Email.

By Mehandipur Balaji Sawamani Online Booking, You Can Ensure a Hassle-Free Experience and Participate in the Divine Offering with Ease.`
                  }
                },
                {
                  "@type": "Question",
                  "name": "Mehandipur Balaji Sawamani Contact Number?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `For Sawamani Online Booking and Other Services, Please Use the Contact Details Provided Below. 
📞 Contact Number: +91 8559833140
📧 Email: Info@mahandipurbalaji.in
🏠 Address: Shree Shiv Misthan Bhandar, Shop Number 1.b, Mehandipur Balaji Ram Mandir Wali Line, Dausa, Rajasthan`
                  }
                },
                {
                  "@type": "Question",
                  "name": "What Is the Price of Sawamani Prasad?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": `The Price of Each ‘Sawamani Prasad’ May Differ Considering the Type Which Includes Puri Sabzi, Halwa Puri or Laddu.

Mehandipur Balaji Sawamani Cost
1. Churma (51 Kg): ₹6,100
2. Kheer Puri (51 Kg): ₹7,100
3. Halwa Puri (51 Kg): ₹8,100
4. Laddu Puri (51 Kg): ₹8,400`
                  }
                }
              ]
            })
          }}
        />





        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <meta name="robots" content="index, follow" />


        {/* Google Ads (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17265381931"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-17265381931');
            `,
          }}
        />
        {/* Google Ads Conversion */}
        <Script
          id="gtag-conversion"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              gtag('event', 'conversion', {
                'send_to': 'AW-17265381931/fBc4CKiihIYbEKuk46hA',
                'value': 1.0,
                'currency': 'INR'
              });
            `,
          }}
        />




        {/* Your other meta tags or external scripts */}
      </head>

      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-PFPJ5VR4"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>

        {loading ? (
          <PreLoader />
        ) : (
          <SessionProvider>
            <SnackbarProvider>
              <AuthProvider>

                <ThemeProvider
                  attribute="class"
                  enableSystem={false}
                  defaultTheme="light"
                >

                  <ToasterContext />
                  <GlobalConfigProvider>
                    <ScrollToTopOnRouteChange />

                    {children}

                  </GlobalConfigProvider>
                </ThemeProvider>
              </AuthProvider>
            </SnackbarProvider>
          </SessionProvider>
        )}
      </body>
    </html>
  );
}
