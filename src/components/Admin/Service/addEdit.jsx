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

const ServiceCreateUpdate = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Fetch URL parameters (to check if we're editing)

  const [previewImages, setPreviewImages] = useState([]);
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [existingServiceData, setExistingServiceData] = useState(null);

  const serviceId = searchParams.get("id"); // Fetch service ID from URL

  useEffect(() => {
    // Fetch existing service data if we're in edit mode
    if (serviceId) {
      axios.get(`/api/maincategory?slug=${serviceId}`).then((response) => {
        const service = response.data.Service;

        // Ensure you're getting the complete service data
        if (service) {
          setExistingServiceData(service);
          setContent(service.content || ""); // Default empty content if not available

          setPreviewImages([`${service?.image || ""}`]);
        }
      }).catch((error) => {
        console.error("Error fetching service data:", error);
      });
    }
  }, [serviceId]);

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(5, "name must be at least 5 characters")
      .max(100, "name must not exceed 100 characters")
      .required("name is required"),
    metaTitle: Yup.string()
      .min(5, "MetaTitle must be at least 5 characters")
      .max(100, "MetaTitle must not exceed 100 characters")
      .required("MetaTitle is required"),

    slug: Yup.string()
      .matches(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens")
      .required("Slug is required"),

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
      formData.append("name", values.name);
      formData.append("metaDescription", values.metaDescription);
      formData.append("metaTitle", values.metaTitle);

      formData.append("slug", values.slug);
      formData.append("content", content);



      if (existingServiceData && serviceId != "") {
        formData.append("id", existingServiceData?.id);

      }

      // Add image file if available
      if (previewImages.length > 0) {
        const imageFile = previewImages[0]; // Assuming only one image is uploaded
        const imageBlob = await fetch(imageFile).then((res) => res.blob());
        formData.append("file", imageBlob, "featuredImage.jpg"); // Ensure correct file name and extension
      }

      const response = await axios.post(`/api/maincategory`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(serviceId ? "Service updated successfully:" : "Service created successfully:", response.data);

      // Reset form and redirect to services list
      resetForm();
      setContent("");
      setKeywords([]);
      router.push("/admin/service"); // Redirect after successful form submission
    } catch (error) {
      alert(error.response?.data.error || error.message)
      console.error("Error creating/updating service:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="max-w-4xl mx-auto p-6">
        <Formik
          initialValues={{

            name: existingServiceData?.name || "",
            metaTitle: existingServiceData?.metaTitle || "",
            metaDescription: existingServiceData?.metaDescription || "",

            slug: existingServiceData?.slug || "",

            content: existingServiceData?.content || "",

          }}
          validationSchema={validationSchema}
          enableReinitialize={serviceId != "" ? true : false} // Allow reinitialization when `initialValues` change

          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Field
                  type="text"
                  name="name"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                  placeholder="Enter service title"
                />
                {errors.name && touched.name && (
                  <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">MetaTitle</label>
                <Field
                  type="text"
                  name="metaTitle"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                  placeholder="Enter service title"
                />
                {errors.metaTitle && touched.metaTitle && (
                  <div className="text-red-500 text-sm mt-1">{errors.metaTitle}</div>
                )}
              </div>


              <div>
                <label className="block text-sm font-medium mb-2">MetaDescription</label>
                <Field
                  type="text"
                  name="metaDescription"
                  className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                  placeholder="Enter service title"
                />
                {errors.metaDescription && touched.metaDescription && (
                  <div className="text-red-500 text-sm mt-1">{errors.metaDescription}</div>
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



              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <input
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="border rounded-lg py-2 px-4"
                />
                {previewImages.length > 0 && (
                  <div className="mt-2">
                    <Image
                      src={previewImages[0]}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium mb-2">Content</label>
                <ReactQuill value={content} onChange={handleQuillChange} />
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
                    {serviceId ? "Updating..." : "Publishing..."}
                  </div>
                ) : (
                  serviceId ? "Update Service" : "Publish Service"
                )}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ServiceCreateUpdate;
