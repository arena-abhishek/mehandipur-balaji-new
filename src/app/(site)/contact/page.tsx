import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";
import { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "Contact Us Page | mehandipur balaji sawamani",
  description: "Contact us page",
};




const ContactPage = () => {
  return (
    <>
      <Breadcrumb pageName="Contact Us" />

      <Contact isShowText={false} />
    </>
  );
};

export default ContactPage; 
