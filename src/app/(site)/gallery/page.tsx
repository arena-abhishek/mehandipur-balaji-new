import Breadcrumb from "@/components/Common/Breadcrumb";
import Gallery from "@/components/Gallery";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallry page",
  robots: "index, follow",
  description: "Images"
};

const GalleryPage = () => {
  return (
    <>
      <Breadcrumb pageName="Our Gallery" />

      <Gallery />
    </>
  );
};

export default GalleryPage;
