"use client";

import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Newsletter from "@/components/Blog_pre/Newsletter";

type PagesDetails = {
  title: string;
  content: string;
  // coverImage: string;
  // publishedAt: string;
  // tags?: string[];
};

const Pages: React.FC<PagesDetails> = ({ title, content }) => {
  return (
    <>
      <Breadcrumb pageName={title} />

      <section className="pb-10 dark:bg-dark lg:pb-20">
        {/* <div className=""> */}
        <div className="flex justify-center">
          <div className="w-full max-w-7xl px-4">
            <div className="flex justify-center">
              <div className="w-full lg:w-8/12">
                <div className="blog-details xl:pr-10 mx-auto">
                  <div dangerouslySetInnerHTML={{ __html: content }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </section>
    </>
  );
};

export default Pages;
