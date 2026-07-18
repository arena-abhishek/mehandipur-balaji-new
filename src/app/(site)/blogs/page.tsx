import BlogCards from "@/components/Blogs";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title:
    "Blog Page",
  description: "New Blog",
  robots: "index, follow",
};

const Blog = () => {




  return (
    <>
      <Breadcrumb pageName="Our Blogs" />
      <BlogCards />

    </>
  );
};

export default Blog;
