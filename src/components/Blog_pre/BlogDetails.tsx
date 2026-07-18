"use client";

import React from "react";
import { format } from "date-fns";
import Image from "next/image";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Newsletter from "@/components/Blog_pre/Newsletter";

type BlogDetailsProps = {
  title: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  tags?: string[];
};

const BlogDetails: React.FC<BlogDetailsProps> = ({ title, content, coverImage, publishedAt, tags }) => {
  return (
    <>
      <Breadcrumb pageName={title} />

      <section className="pb-10 pt-2 dark:bg-dark lg:pb-20">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            <div className="w-full px-4">
              <div
                className="wow fadeInUp relative z-20 mb-[60px] h-[300px] overflow-hidden rounded md:h-[400px] lg:h-[500px]"
                data-wow-delay=".1s"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}/api${coverImage}`}
                  alt={title}
                  width={1288}
                  height={800}
                  className="w-full h-auto object-cover"
                  loading="lazy" // Enable lazy loading for better performance
                />

                <div className="absolute left-0 top-0 z-10 flex h-full w-full items-end bg-gradient-to-t from-dark-700 to-transparent">
                  <div className="flex flex-wrap items-center p-4 pb-4 sm:p-8">
                    <div className="mb-4 flex items-center">
                      <p className="mr-5 flex items-center text-sm font-medium text-white md:mr-6">
                        <span className="mr-3">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="fill-current"
                          >
                            <path d="..." />
                          </svg>
                        </span>
                        {format(new Date(publishedAt), "dd MMM yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="-mx-4 flex flex-wrap">
                <div className="w-full px-4 ">
                  <div className="blog-details xl:pr-10">
                    <div>
                      <style>
                        {`
      .same-heading-styles h1,
      .same-heading-styles h2,
      .same-heading-styles h3,
      .same-heading-styles h4,
      .same-heading-styles h5,
      .same-heading-styles h6 {
        font-size: 16px !important;
        font-weight: 500 !important;
        margin: 0.5rem 0 !important;
        line-height: 1.9 !important;
      }
    `}
                      </style>

                      <div
                        className="prose max-w-none text-justify same-heading-styles"
                        style={{
                          fontSize: '16px',
                          lineHeight: '1.6',
                        }}
                        dangerouslySetInnerHTML={{ __html: content }}
                      />
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogDetails;
