import OurServices from "@/components/Service";
// import { Metadata } from "next/types";
import Breadcrumb from "@/components/Common/Breadcrumb";
import BookingDetails from "../Service/details";
// export const metadata: Metadata = {
//   title:
//     "Booking Page",
//   description: "Booking Page",
// };

import { Metadata } from "next";
import axios from "axios";  // For fetching data

interface Props {
  params: { slug: string };  // Add the necessary params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    // Fetching dynamic data (replace with your API endpoint)
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/config?id=${process.env.NEXT_PUBLIC_CONFIG_ID}`);
    const data = response.data.config;

    // console.log("Fetched Metadata:", data);

    return {
      robots: "index, follow",
      title: data.bookingMetaPageTitle || "Booking Page",
      description: data.bookingMetaPageDescription || "Booking Page",
      openGraph: {
        title: data.bookingMetaPageTitle || "Booking Page",
        description: data.og_description || "Booking Page",


      },
      twitter: {
        card: data.bookingMetaPageTitle || "Booking Page",
        site: data.bookingMetaPageDescription || "Booking Page",
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Booking Page",
      description: "Booking Page",
    };
  }
}


const ServicePage = () => {




  return (
    <main>
      <Breadcrumb pageName="Booking" />
      <OurServices />


    </main>
  );
};

export default ServicePage;
