import DashBoard from "@/components/Admin/Dashboard/E-commerce";
// import { Metadata } from "next";

export const metadata = {
  title:
    "Contact Page | Play SaaS Starter Kit and Boilerplate for Next.js",
  description: "This is contact page description",
};

const ContactPage = () => {

  return (
    <>
      {/* <NextBreadcrumb
        separator={<span> | </span>}
        activeClasses='text-amber-500'
        containerClasses='flex py-5 '
        listClasses='hover:underline mx-2 font-bold'
        capitalizeLinks
      /> */}

      <DashBoard />
    </>
  );
};

export default ContactPage;
