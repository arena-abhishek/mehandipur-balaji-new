import NextBreadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import ServiceDetail from "@/components/Admin/Service/detail"

import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <NextBreadcrumb
          separator={<span> | </span>}
          activeClasses='text-amber-500'
          containerClasses='flex py-5 ' 
          listClasses='hover:underline mx-2 font-bold'
          capitalizeLinks
        />

      <div className="flex flex-col gap-10">
<ServiceDetail/>
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
