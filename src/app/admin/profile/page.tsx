import NextBreadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import ProfileBox from "@/components/Admin/ProfileBox";

export const metadata: Metadata = {
  title: "Next.js Profile Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Profile page for NextAdmin Dashboard Kit",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
      <NextBreadcrumb
          separator={<span> | </span>}
          activeClasses='text-amber-500'
          containerClasses='flex py-5 ' 
          listClasses='hover:underline mx-2 font-bold'
          capitalizeLinks
        />

        <ProfileBox />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
