// app/booking/page.tsx (or wherever your page file is)
import Breadcrumb from "@/components/Common/Breadcrumb";
import { BookingForm } from "@/components/AuthModal/bookingFormModel";
import axios from "axios";

import { Metadata } from "next/types";

export async function generateMetadata({ }: Props): Promise<Metadata> {
  try {
    // Fetching dynamic data (replace with your API endpoint)


    // console.log("Fetched Metadata:", data);

    return {
      robots: "index, follow",
      title: "Booking Form",
      description: "Booking Form",
      openGraph: {
        title: "Booking Form",
        description: "Booking Form",


      },
      // twitter: {
      //   card: "Booking Form",
      //   site: "Booking Form",
      // },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "Booking Page",
      description: "Booking Page",
    };
  }
}

type Props = {
  params: { id: string };
};


export default async function BookingFormPage({ params }: Props) {



  return (
    <main>
      <Breadcrumb pageName="Booking-Form" />
      <BookingForm id={params} />
      {/* <div className="mb-100px"></div> */}
    </main>
  );
}
