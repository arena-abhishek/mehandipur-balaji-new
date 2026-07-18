

import ECommerce from "@/components/Admin/Dashboard/E-commerce";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import "../../styles/index.css";
import "../../styles/prism-vsc-dark-plus.css";
import "../../styles/satoshi.css"
import "../../styles/style.css"
export default function Home() {

  return (
    <>
      <DefaultLayout>
        <ECommerce />
      </DefaultLayout>
    </>
  );
}
