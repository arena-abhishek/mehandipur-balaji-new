"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function ScrollToTopOnRouteChange() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (typeof window !== "undefined") {
            // Give a small delay to ensure component is mounted
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }, 50);
        }
    }, [pathname, searchParams]);

    return null;
}
