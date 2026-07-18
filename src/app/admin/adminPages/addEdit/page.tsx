import NextBreadcrumb from "../../../../components/Admin/Breadcrumbs/Breadcrumb";
// import BlogsAddEdit from "@/components/Admin/Blogs/addEdit"
import PageCreateForm from "../../../../components/Admin/Pages/addEdit"


import { Metadata } from "next";
import DefaultLayout from "../../../../components/Admin/Layouts/DefaultLaout";

export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const page = () => {
  return (
    <DefaultLayout>
      {/* <Breadcrumb pageName="Create Blog Page" /> */}
      <NextBreadcrumb
        separator={<span> | </span>}
        activeClasses='text-amber-500'
        containerClasses='flex py-5 '
        listClasses='hover:underline mx-2 font-bold'
        capitalizeLinks
      />

      <div className="flex flex-col gap-10">
        <PageCreateForm />
      </div>
    </DefaultLayout>
  );
};

export default page;
