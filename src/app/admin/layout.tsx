"use client";
// import "jsvectormap/dist/css/jsvectormap.css";
// import "flatpickr/dist/flatpickr.min.css";
import "../../styles/satoshi.css";
import "../../styles/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Admin/common/Loader";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  },);



  return (
    <main>

      {loading ? <Loader /> : children}
    </main>

  );
}
