import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import PaymentSuccess from "@/components/Payment Page";
import Team from "@/components/Team";
import axios from "axios";
import { Metadata } from "next";


const PagePaymentCallBack = () => {
  return (
    <main>
      <Breadcrumb pageName="Payment Page" />
      <PaymentSuccess />
      {/* <Team /> */}
    </main>
  );
};

export default PagePaymentCallBack;
