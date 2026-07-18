import NextBreadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";

import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Pages from "@/components/Admin/FAQ";

export const metadata: Metadata = {
  title: "Next.js Settings Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
};

const FAQ = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
      <NextBreadcrumb
          separator={<span> | </span>}
          activeClasses='text-amber-500'
          containerClasses='flex py-5 ' 
          listClasses='hover:underline mx-2 font-bold'
          capitalizeLinks
        />

        <Pages/>
      </div>
    </DefaultLayout>
  );
};

export default FAQ;
