"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import "react-quill/dist/quill.snow.css"; // Import React-Quill styles

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const PageCreateForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [content, setContent] = useState(""); // State to hold editor content (HTML)
  const [existingBlogData, setExistingBlogData] = useState(null);

  useEffect(() => {
    if (blogId) {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/pages?slug=${blogId}`)
        .then((response) => {
          const blog = response.data.page;
          if (blog) {
            setExistingBlogData(blog);
            setContent(blog.content || ""); // Load existing content
          }
        })
        .catch((error) => {
          console.error("Error fetching blog data:", error);
        });
    }
  }, [blogId]);

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .min(4, "Title must be at least 4 characters")
      .max(100, "Title must not exceed 100 characters")
      .required("Title is required"),
    slug: Yup.string()
      .matches(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers, and hyphens"
      )
      .required("Slug is required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("slug", values.slug);
      formData.append("content", content); // Add content (HTML) to the form data

      if (existingBlogData && blogId) {
        formData.append("id", existingBlogData.id);
      }

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/pages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      setContent("");
      router.replace("/admin/adminPages");
    } catch (error) {
      window.alert(error.response?.data.error || error.message);
      console.error("Error creating blog:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="max-w-4xl mx-auto p-6">
        <Formik
          enableReinitialize
          initialValues={{
            title: existingBlogData?.title || "",
            slug: existingBlogData?.slug || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
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

              {/* Content Input */}
              <div>
  <label className="block text-sm font-medium mb-2">Content</label>
  <ReactQuill
    value={content} // Content state
    onChange={setContent} // Update state on change
    className="rounded-[7px] bg-white"
    modules={{
      toolbar: {
        handlers: {
          // Custom image handler
          image: function () {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.click();

            input.onchange = async () => {
              const file = input.files[0];

              // Process the image (e.g., upload or crop)
              const url = await uploadImageToServer(file); // Replace with your upload logic

              const range = this.quill.getSelection(); // Get current cursor position
              this.quill.insertEmbed(range.index, "image", url); // Insert the uploaded image
            };
          },
        },
      },
      toolbar: [
        // Toolbar options
        ["bold", "italic", "underline", "strike"], // Text formatting
        ["blockquote", "code-block"], // Block quotes and code
        [{ header: 1 }, { header: 2 }], // Headers
        [{ list: "ordered" }, { list: "bullet" }], // Lists
        [{ script: "sub" }, { script: "super" }], // Subscript / Superscript
        [{ indent: "-1" }, { indent: "+1" }], // Indentation
        [{ direction: "rtl" }], // Right-to-left
        [{ size: ["small", false, "large", "huge"] }], // Font sizes
        [{ header: [1, 2, 3, 4, 5, 6, false] }], // Headers
        ["link", "image", "video"], // Media options
        ["clean"], // Clear formatting
      ],
    }}
    formats={[
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "indent",
      "link",
      "image", // Allows image embedding
      "video", // Allows video embedding
    ]}
  />
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
                  blogId ? "Update Page Post" : "Publish Page Post"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PageCreateForm;
