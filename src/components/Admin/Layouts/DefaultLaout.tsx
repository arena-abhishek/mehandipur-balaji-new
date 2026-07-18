"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Admin/Sidebar";
import Header from "@/components/Admin/Header";
import { useRouter } from "next/navigation";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);  // State to track login status
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        // Check if the token exists in sessionStorage
        const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null;

        if (token) {
          // If the token exists, set login status as true
          setIsLoggedIn(true);
        } else {
          // If no token, set login status as false and redirect to sign-in page
          setIsLoggedIn(false);
          router.push("/admin/signin"); // Redirect to the sign-in page
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsLoggedIn(false);
        router.push("/admin/signin"); // Redirect on error as well
      }
    };

    // Call checkAuthentication when the component mounts
    checkAuthentication();
  }, [router]);

  if (isLoggedIn === null) {
    // Still checking if user is logged in, show a loading state
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Page Wrapper */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Content Area */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Header (only displayed when logged in) */}
          {isLoggedIn && (
            <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} isAuthenticated={isLoggedIn} />
          )}

          {/* Main Content */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
