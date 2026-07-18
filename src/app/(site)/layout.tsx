"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import "../../styles/index.css";
import "../../styles/prism-vsc-dark-plus.css";
import '../../styles/satoshi.css';
import '../../styles/style.css';
import { useEffect, useState } from "react";
import WhatsAppButton from "@/components/WhatsAppButton";
import ConsultationModal from "@/components/Hero/ConsultationModal";
import { usePathname } from "next/navigation";
import { useGlobalConfig } from "@/types/GlobalConfigContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  const isDashboard = pathname?.startsWith("/dashboard");
  const isBookingForm = pathname?.startsWith("/booking-form");

  // We want to hide components on dashboard and booking-form pages
  const isHideAll = isDashboard || isBookingForm;

  const { metadata } = useGlobalConfig();

  useEffect(() => {
    console.log("what is data metadata ", metadata);
    setTimeout(() => setLoading(false), 0);
  }, [metadata]);

  return (
    <>
      {!isDashboard && <Header />}
      <main>{children}</main>
      {!isDashboard && <Footer mainCategory={metadata.mainCategory} />}

      {(!isHideAll) && (
        <ConsultationModal mainCategory={metadata.mainCategory} />
      )}

      {!isDashboard && <ScrollToTop />}

      {(!isHideAll) && <WhatsAppButton />}
    </>

  );
}
