"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import axios from "axios"; // Axios for making API calls
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"; // For App Router (New)
import Image from 'next/image';

const BlogCreateForm = () => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }], // h1 to h6
      ["bold", "italic", "underline", "strike"], // basic styling
      [{ list: "ordered" }, { list: "bullet" }], // lists
      [{ indent: "-1" }, { indent: "+1" }], // indentation
      [{ align: [] }], // text alignment
      ["blockquote", "code-block"], // blocks
      ["link", "image", "video"], // media
      ["clean"] // remove formatting
    ],
  };
  const formats = [
    "header",
    "bold", "italic", "underline", "strike",
    "list", "bullet",
    "indent", "align",
    "blockquote", "code-block",
    "link", "image", "video"
  ];
  const router = useRouter();
  const searchParams = useSearchParams(); // Fetch URL parameters (to check if we're editing)

  const [previewImages, setPreviewImages] = useState([]);
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [existingBlogData, setExistingBlogData] = useState(null);

  const blogId = searchParams.get("id"); // Fetch blog ID from URL

  useEffect(() => {
    // Fetch existing blog data if we're in edit mode
    if (blogId) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blog?slug=${blogId}`).then((response) => {
        const blog = response.data.blog;


        // Ensure you're getting the complete blog data
        if (blog) {
          console.log(`dta of ${blog.tags}`);
          setExistingBlogData(blog);
          setContent(blog.content || ""); // Default empty content if not available
          setKeywords(blog.tags || ""); // Default empty string if no tags are available
          setPreviewImages([blog?.featuredImage || ""]);

          // Correct image URL handling
          // setPreviewImages([`http://localhost:3000/_next/image?url=${blog.imageUrl}`]); // Remove the extra space in the URL
        }
      }).catch((error) => {
        console.error("Error fetching blog data:", error);
      });
    }
  }, [blogId]);


  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must not exceed 100 characters")
      .required("Title is required"),
    slug: Yup.string()
      .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
      .required("Slug is required"),
    metaTitle: Yup.string()
      .max(60, "Meta title should not exceed 60 characters")
      .required("Meta title is required"),
    metaDescription: Yup.string()
      .max(160, "Meta description should not exceed 160 characters")
      .required("Meta description is required"),
  });

  const handleQuillChange = (value) => {
    setContent(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      if (!keywords.includes(inputValue.trim())) {
        setKeywords([...keywords, inputValue.trim()]);
      }
      setInputValue(""); // Clear input field
      e.preventDefault();
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const image = URL.createObjectURL(files[0]); // Create image URL for preview
      setPreviewImages([image]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("metaTitle", values.metaTitle);
      formData.append("metaDescription", values.metaDescription);
      formData.append("content", content);
      formData.append("tags", [JSON.stringify(keywords)]);
      formData.append("authorId", 11); // Replace with dynamic author ID if applicable
      formData.append("status", "published");
      if (existingBlogData != null && blogId != "") {
        formData.append("id", existingBlogData?.id);

      }

      // Add image file if available
      if (previewImages.length > 0) {
        const imageFile = previewImages[0]; // Assuming only one image is uploaded
        const imageBlob = await fetch(imageFile).then((res) => res.blob());
        formData.append("file", imageBlob, "featuredImage.jpg"); // Ensure correct file name and extension
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Blog created successfully:", response.data);

      // Reset form and redirect to admin blogs
      resetForm();
      setContent("");
      setKeywords([]);
      router.push("/admin/adminBlogs"); // Redirect after successful form submission
    } catch (error) {
      console.error("Error creating blog:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="max-w-4xl mx-auto p-6">
        <Formik
          enableReinitialize={blogId != "" ? true : false} // Allow reinitialization when `initialValues` change

          initialValues={{
            title: existingBlogData?.title || "",
            slug: existingBlogData?.slug || "",
            metaTitle: existingBlogData?.metaTitle || "",
            metaDescription: existingBlogData?.metaDescription || "",
            content: existingBlogData?.content || "",
            tags: existingBlogData?.tags, // Join tags as a string
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Field
                  type="text"
                  name="title"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                  placeholder="Enter blog title"
                />
                {errors.title && touched.title && (
                  <div className="text-red-500 text-sm mt-1">{errors.title}</div>
                )}
              </div>

              {/* Slug Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <Field
                  type="text"
                  name="slug"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                  placeholder="enter-slug-here"
                />
                {errors.slug && touched.slug && (
                  <div className="text-red-500 text-sm mt-1">{errors.slug}</div>
                )}
              </div>

              {/* Meta Title Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Meta Title</label>
                <Field
                  type="text"
                  name="metaTitle"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                  placeholder="Enter meta title"
                />
                {errors.metaTitle && touched.metaTitle && (
                  <div className="text-red-500 text-sm mt-1">{errors.metaTitle}</div>
                )}
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Meta Description</label>
                <Field
                  as="textarea"
                  name="metaDescription"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                  placeholder="Enter meta description"
                />
                {errors.metaDescription && touched.metaDescription && (
                  <div className="text-red-500 text-sm mt-1">{errors.metaDescription}</div>
                )}
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="border border-gray-300 rounded-lg p-2 flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-orange-100 text-blue-800 px-2 py-1 rounded-full"
                    >
                      {keyword}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter keyword and press Enter"
                    className="flex-grow border-none focus:ring-0 outline-none"
                  />
                </div>
                {errors.tags && touched.tags && (
                  <div className="text-red-500 text-sm mt-1">{errors.tags}</div>
                )}
              </div>

              {/* Content Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <ReactQuill
                  value={content}
                  modules={modules}
                  formats={formats}
                  onChange={handleQuillChange}
                  theme="snow"
                  placeholder="Write your content here..."
                />
                {errors.content && touched.content && (
                  <div className="text-red-500 text-sm mt-1">{errors.content}</div>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full py-2.5 pl-4 pr-4 border border-stroke rounded-[7px]"
                />
                {previewImages.length > 0 && (
                  <div className="mt-2">
                    <Image src={previewImages[0]} alt="Preview" className="max-w-xs rounded-md" width={100} height={100} />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-2.5 px-4 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="animate-spin h-5 w-5 mr-2" />
                    Publishing...
                  </div>
                ) : (
                  blogId ? "Update Blog Post" : "Publish Blog Post"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default BlogCreateForm;
