"use client";

import SingleBlog from "@/components/Blog_pre/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import React, { Key, useEffect, useState } from "react";
import { getAllPosts, getservice } from "@/utils/markdown";
import PreLoader from "@/components/Common/PreLoader";
import SingleFeature from "@/components/Features/SingleFeature";
import About from "@/components/About";
import CallToAction from "@/components/CallToAction";
import HomeBlogSection from "@/components/Blog_pre/HomeBlogSection";
import Contact from "@/components/Contact";

const ServiceClientPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const fetchedPosts = await getservice(["title", "content", "icon", "coverImage", "slug"]);
      setPosts(fetchedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, []);

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Breadcrumb pageName="Service Grids" />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container">
          {loading ? (<PreLoader />) : <div className="-mx-4 flex flex-wrap justify-center">
            <div className=" flex flex-wrap ">
              {posts.map((key: unknown, i: Key | null | undefined) => (
                <SingleFeature key={i} feature={key} />
              ))}
            </div>
          </div>}
        </div>
        <About />
        <CallToAction />
        {/* Uncomment and use once config.blogs is verified */}
        {/* <HomeBlogSection posts={posts} /> */}
        <Contact isShowText={false} />
      </section>
    </>
  );
};

export default ServiceClientPage;
