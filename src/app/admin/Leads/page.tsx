import NextBreadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";


import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import TableOne from "@/components/Admin/Tables/TableOne";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const Leads = () => {


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
        <TableOne />
      </div>
    </DefaultLayout>
  );
};

export default Leads;
