"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

import Features from "@/components/Features";
import About from "@/components/About";
import CallToAction from "@/components/CallToAction";
import Contact from "@/components/Contact";
import ScrollUp from "../Common/ScrollUp";
import OurServices from "../Service";
import HeroSection from "../Hero";
import HomeBlogSection from "../Blog_pre/HomeBlogSection";
import PreLoader from "../Common/PreLoader";
import { Config } from "@/types/Home";
import { log } from "console";
import { useGlobalConfig } from "@/types/GlobalConfigContext";
import Gallery from "../Gallery";
import BlogCards from "../Blogs";
import TempleSchedule from "../Info";
import Faq from "../Faq";
import ScrollToTopOnRouteChange from "../Common/ScrollToTopOnRouteChange";
// import { updateData } from "@/types/global";



export default function HomeComponet() {
  const [config, setConfig] = useState<Config | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [maincategory, setMaincategory] = useState<any[]>([]);
  const [posts2, setPosts2] = useState<any[]>([]);
  const [posts3, setPosts3] = useState<any>();
  const { whatsappNumber, metadata, setWhatsappNumber, setMetadata } = useGlobalConfig();

  // const updateConfig = () => {

  // };

  useEffect(() => {
    console.log()
  })
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/config?id=${process.env.NEXT_PUBLIC_CONFIG_ID}`
        );

        if (response.data && response.data.config) {
          setConfig(response.data.config);
          // Extract the 'blog' objects
          const blogPosts = response.data.config.blogs.map((entry: any) => entry.blog);
          const blogPosts2 = response.data.config.services.map((entry: any) => entry.service);
          const mainCatroy = response.data.mainCategory?.map((entry: any) => entry) || [];

          // Update state with extracted posts
          setMaincategory(mainCatroy);

          // console.log("MainCategory length:", mainCatroy.length);
          // console.log("MainCategory data:", mainCatroy);
          setPosts(blogPosts);
          setPosts2(blogPosts2);
          setPosts3(response.data.config);
          // updateData(response.data.config);
          setWhatsappNumber(response.data.config.whatsapp_number as any);
          metadata.mainCategory = mainCatroy
          // metadata.facebookLink = posts3.facebookLink

          setMetadata({
            ...metadata,
            mainCategory: mainCatroy,
            title: response.data.config.title as any,
            description: "Updated Description",
            og_url: "/updated-image.jpg",
          });

        }
      } catch (error) {
        console.error("Error fetching config data:", error);
      }
    };

    fetchConfig();
  }, []);

  // if () {
  //   return <p>Loading...</p>; // Display a loading message or spinner
  // }

  return (
    <>
      {/* {!config ? (
        <PreLoader /> // Show PreLoader while config is being fetched
      ) : */}

      <main>
        <ScrollUp />
        <HeroSection existingConfigData={posts3} mainCat={maincategory} />
        {/* <Features posts={posts2} /> */}
        <About />
        <OurServices />
        <Gallery maxImages={8} />
        <BlogCards maxBlogs={4} />

        {/* <TempleSchedule/>÷ */}
        <Contact mainCat={maincategory} isShowText={true} />
        {/* <CallToAction /> */}
        <Faq />
        {/* Uncomment and use once config.blogs is verified */}
        {/* <HomeBlogSection posts={posts} /> */}
        {/* <Contact /> */}
      </main>
      {/* )} */}
    </>
  );
}
