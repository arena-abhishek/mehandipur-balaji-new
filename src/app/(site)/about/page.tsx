import About from "@/components/About";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Team from "@/components/Team";
import axios from "axios";
import { Metadata } from "next";

export async function generateMetadata({ }): Promise<Metadata> {
  try {
    // Fetching dynamic data (replace with your API endpoint)
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/config?id=${process.env.NEXT_PUBLIC_CONFIG_ID}`);
    const data = response.data.config;

    // console.log("Fetched Metadata:", data);

    return {
      robots: "index, follow",
      title: data.aboutPageMetaTitle || "About Page",
      description: data.aboutPageMetaDescription || "About Page",
      openGraph: {
        title: data.aboutPageMetaTitle || "About Page",
        description: data.aboutPageMetaDescription || "About Page",


      },
      twitter: {
        card: data.aboutPageMetaTitle || "About Page",
        site: data.aboutPageMetaDescription || "About Page",
      },
    };
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return {
      title: "About Page",
      description: "About Page",
    };
  }
}


const AboutPage = () => {
  return (
    <main>
      <Breadcrumb pageName="About Us Page" />
      <About />
      {/* <Team /> */}
    </main>
  );
};

export default AboutPage;
