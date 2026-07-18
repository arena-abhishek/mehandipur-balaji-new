"use client";

import SingleBlog from "@/components/Blog_pre/SingleBlog";
import Breadcrumb from "@/components/Common/Breadcrumb";
import React, { useEffect, useState } from "react";
import { getAllPosts } from "@/utils/markdown";
import PreLoader from "@/components/Common/PreLoader";

const BlogClientPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const fetchedPosts = await getAllPosts(["title", "date", "excerpt", "coverImage", "slug","publishedAt"]);
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
      <Breadcrumb pageName="Blog Grids" />

      <section className="pb-10 pt-20 lg:pb-20 lg:pt-[120px]">
        <div className="container">
          {loading ? (<PreLoader />) : <div className="-mx-4 flex flex-wrap justify-center">
            {posts.map((blog, i) => (
              <div key={i} className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3">
                <SingleBlog blog={blog} />
              </div>
            ))}
          </div>}
        </div>
      </section>
    </>
  );
};

export default BlogClientPage;
