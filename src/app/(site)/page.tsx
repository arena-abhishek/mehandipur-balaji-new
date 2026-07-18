
import { getAllPosts, getConfigData } from "@/utils/markdown";
import { Metadata } from "next";
import HomeComponet from "@/components/Home";
import { getGlobalConfig } from "@/types/GlobalConfigContext";
export async function generateMetadata(): Promise<Metadata> {
  // Fetch data from the global config API
  const config = await getConfigData(); // Assume this function fetches config from an API

  // Set dynamic values from the fetched config or use default values
  const dynamicTitle = config?.title || "Sawamani Online Booking at Mehandipur Balaji";
  const dynamicDescription = config?.website_description || "Mehandipur Balaji Provided Sawamani Online Booking Service in Balaji Dham Online Booking is available at Balaji Dham Call Now 91 8559833140";
  const dynamicOgImage = config?.ogImage || "/images/og-image.jpg";
  const twitterTitle = config?.twitter_title || dynamicTitle;
  // const twitter_site = config?.twitter_site || process.env.NEXT_PUBLIC_API_URL;
  const twitter_des = config?.twitter_description || dynamicDescription;
  const twitter_image = config?.twitter_image || "/images/og-image.jpg";





  return {
    title: dynamicTitle,
    robots: "index, follow",
    description: dynamicDescription,
    openGraph: {
      title: dynamicTitle,
      description: dynamicDescription,
      images: dynamicOgImage,
    },
    twitter: {
      card: twitterTitle,
      title: "Blog Not Found",
      description: twitter_des,
      images: [twitter_image],
    },

  };
}
export default function Home() {



  return (

    <HomeComponet />

  );
}
