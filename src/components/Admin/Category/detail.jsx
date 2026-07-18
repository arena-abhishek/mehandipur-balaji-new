"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // For App Router (New)
import Image from "next/image";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const BlogDetailAdminPage = () => {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slug, setSlug] = useState(null); // Store slug in state
  const router = useRouter();
  const searchParams = useSearchParams(); // Fetch URL parameters (to check if we're editing)

  const blogId = searchParams.get("slug"); // Fetch blog ID from URL

  // Ensure that router.query is available before accessing the slug
  useEffect(() => {
    // Fetch existing blog data if we're in edit mode
    if (blogId) {
      setSlug(blogId)
    }
  }, [blogId]);// Watch for changes in router.query

  // Fetch the blog data when the slug is available
  useEffect(() => {
    if (slug) {
      console.log("Fetching blog data for slug:", slug); // Debug log to check slug before fetching
      const fetchBlog = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?slug=${slug}`);
          if (!response.ok) {
            throw new Error("Failed to fetch blog details");
          }
          const data = await response.json();
          console.log("Fetched blog data:", data); // Debug log to check fetched data
          setBlog(data.blog);
        } catch (err) {
          console.error("Error fetching blog data:", err); // Debug log to catch any fetch errors
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBlog();
    }
  }, [slug]); // Trigger fetch when slug is available

  const handleEdit = () => {

  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this blog?")) {
      console.log("Delete blog functionality");
    }
  };

  // Only render when the component is mounted on the client
  if (!slug) return <div>Loading..ww.</div>; // Wait until slug is available

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-card">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Blog Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Approx. {Math.ceil(blog.content.split(" ").length / 200)} min read</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${blog.status === "Published" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
              }`}>
              {blog.status}
            </div>
          </div>
        </div>

        {/* Main Image */}
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          {blog.featuredImage && (

            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/api${blog.featuredImage}`}

              // src={blog.featuredImage}
              alt={blog.featuredImageAltText || blog.title}
              className="object-cover"
              fill
              priority
            />
          )}
        </div>

        {/* Content */}
        <div className="prose max-w-none mb-8">
          <p className="text-lg text-gray-700 mb-6">{blog.metaDescription}</p>
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>

        {/* Meta Information */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Meta Title</h3>
              <p className="text-gray-600">{blog.metaTitle}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Meta Description</h3>
              <p className="text-gray-600">{blog.metaDescription}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Slug</h3>
              <p className="text-gray-600">{blog.slug}</p>
            </div>
          </div>
        </div>

        {/* Actions */}

        {/* <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Delete
          </button> */}

      </div>
    </div >
  );
};

export default BlogDetailAdminPage;
