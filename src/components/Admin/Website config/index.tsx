"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import axios from "axios"; // Axios for making API calls
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation"; // For App Router (New)
import Image from 'next/image';

interface Config {
  title: string;
  slug: string;
  icon: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  og_title: string;
  og_description: string;
  og_url: string;
  meta_keywords: string[];
  meta_author: string;
  twitter_card: string;
  twitter_site: string;
  website_title: string;
  website_description: string;
  slogan: string;
  og_image: string;
  facebookLink: string;
  twitterLink: string;
  instagramLink: string;
  linkdingLink: string;
  bottomDescription: string;
  whatsapp_number: string;


}

const ConfigForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Fetch URL parameters (to check if we're editing)

  const [previewImages, setPreviewImages] = useState([]);
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [config, setConfig] = useState<Config | null>(null);


  const configId = process.env.NEXT_PUBLIC_CONFIG_ID; // Fetch service ID from URL

  useEffect(() => {
    // Fetch existing service data if we're in edit mode
    if (configId) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/config?id=${configId}`).then((response) => {
        const config = response.data.config;

        // Ensure you're getting the complete service data
        if (config) {
          setConfig(config);
          setContent(config.content || ""); // Default empty content if not available
          setKeywords(config.tags || []); // Default empty tags if not available
          // setPreviewImages([`${service?.featuredImage || ""}`]);
        }
      }).catch((error) => {
        console.error("Error fetching service data:", error);
      });
    }
  }, [configId]);

  const validationSchema = Yup.object({
    whatsappNumber: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, "Please enter a valid WhatsApp number") // E.164 format validation
      .required("WhatsApp number is required"),
    facebookLink: Yup.string()
      .url("Please enter a valid Facebook URL")
      .required("Facebook link is required"), // Optional: Remove `.required()` if not mandatory

    // twitterLink: Yup.string()
    //   .url("Please enter a valid Twitter URL")
    //   .required("Twitter link is required"),

    // instagramLink: Yup.string()
    //   .url("Please enter a valid Instagram URL")
    //   .required("Instagram link is required"),

    // linkedinLink: Yup.string()
    //   .url("Please enter a valid LinkedIn URL")
    //   .required("LinkedIn link is required"),

    // bottomDescription: Yup.string()
    //   .min(10, "Description should be at least 10 characters long")
    //   .max(300, "Description cannot exceed 300 characters")
    //   .required("Bottom description is required"),
    title: Yup.string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must not exceed 100 characters")
      .required("Title is required"),

    description: Yup.string()
      .min(10, "Description must be at least 10 characters")
      .required("Description is required"),

    og_title: Yup.string()
      .max(60, "OG Title must not exceed 60 characters")
      .required("OG Title is required"),

    og_description: Yup.string()
      .max(160, "OG Description must not exceed 160 characters")
      .required("OG Description is required"),

    og_url: Yup.string()
      .url("Please provide a valid URL")
      .required("OG URL is required"),

    // meta_keywords: Yup.array().of(Yup.string()),

    // meta_description: Yup.string()
    //   .max(160, "Meta Description must not exceed 160 characters")
    //   .required("Meta Description is required"),

    // meta_author: Yup.string()
    //   .max(100, "Meta Author must not exceed 100 characters")
    //   .required("Meta Author is required"),

    twitter_card: Yup.string()
      .oneOf(["summary", "summary_large_image"], "Invalid Twitter Card Type")
      .required("Twitter Card is required"),

    // twitter_site: Yup.string()
    //   .url("Please provide a valid URL for Twitter Site")
    //   .required("Twitter Site is required"),

    website_title: Yup.string()
      .min(5, "Website Title must be at least 5 characters")
      .max(100, "Website Title must not exceed 100 characters")
      .required("Website Title is required"),

    website_description: Yup.string()
      .min(10, "Website Description must be at least 10 characters")
      .required("Website Description is required"),

    // slogan: Yup.string()
    //   .max(100, "Slogan must not exceed 100 characters")
    //   .required("Slogan is required"),

    og_image: Yup.string()
      .url("Please provide a valid image URL")
      .nullable(),

    whatsapp_number: Yup.string()
      .matches(/^\+?\d{1,4}[\d\s-]{7,15}$/, "Please provide a valid WhatsApp number")
      .nullable(),
  });

  const handleQuillChange = (value: React.SetStateAction<string>) => {
    setContent(value);
  };

  const handleKeyDown = () => {
    // if (e.key === "Enter" && inputValue.trim()) {
    //   if (!keywords.includes(inputValue.trim())) {
    //     setKeywords([...keywords, inputValue.trim()]);
    //   }
    //   setInputValue(""); // Clear input field
    //   e.preventDefault();
    // }
  };

  // const handleRemoveKeyword = (keywordToRemove) => {
  //   setKeywords(keywords.filter((keyword) => keyword !== keywordToRemove));
  // };

  // const handleImageChange = (e) => {
  //   const files = e.target.files;
  //   if (files && files[0]) {
  //     const image = URL.createObjectURL(files[0]); // Create image URL for preview
  //     setPreviewImages([image]);
  //   }
  // };

  const handleSubmit = async (values: {
    bottomDescription: string | Blob;
    linkdingLink: string | Blob;
    instagramLink: string | Blob;
    twitterLink: string | Blob;
    facebookLink: string | Blob; title: string | Blob; icon: string | Blob; metaTitle: string | Blob; metaDescription: string | Blob; description: string | Blob; og_title: string | Blob; og_description: string | Blob; og_url: string | Blob; meta_author: string | Blob; twitter_card: string | Blob; twitter_site: string | Blob; website_title: string | Blob; website_description: string | Blob; slogan: string | Blob; og_image: string | Blob; whatsapp_number: string | Blob;
  }) => {
    try {
      const formData = new FormData();

      formData.append("title", values.title);
      // formData.append("slug", values.slug);
      formData.append("icon", values.icon);
      formData.append("metaTitle", values.metaTitle);
      formData.append("metaDescription", values.metaDescription);
      formData.append("description", values.description);
      formData.append("og_title", values.og_title);
      formData.append("og_description", values.og_description);
      formData.append("og_url", values.og_url);

      // For array fields, like meta_keywords, you can append them individually
      // values.meta_keywords.forEach((keyword, index) => {
      //   formData.append(`meta_keywords[${index}]`, keyword);
      // });

      // formData.append("meta_author", values.meta_author);
      formData.append("twitter_card", values.twitter_card);
      // formData.append("twitter_site", values.twitter_site);
      formData.append("website_title", values.website_title);
      formData.append("website_description", values.website_description);
      formData.append("slogan", values.slogan);
      formData.append("og_image", values.og_image);
      formData.append("whatsapp_number", values.whatsapp_number);
      formData.append("facebookLink", values.facebookLink);
      formData.append("twitterLink", values.twitterLink);
      formData.append("instagramLink", values.instagramLink);
      formData.append("linkdingLink", values.linkdingLink);
      formData.append("bottomDescription", values.bottomDescription);


      formData.append("id", process.env.NEXT_PUBLIC_CONFIG_ID || '1');


      // Add image file if available
      if (previewImages.length > 0) {
        const imageFile = previewImages[0]; // Assuming only one image is uploaded
        const imageBlob = await fetch(imageFile).then((res) => res.blob());
        formData.append("file", imageBlob, "featuredImage.jpg"); // Ensure correct file name and extension
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/config`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(configId ? "Service updated successfully:" : "Service created successfully:", response.data);

      // Reset form and redirect to services list
      // resetForm();
      setContent("");
      setKeywords([]);
      router.push("/admin/service"); // Redirect after successful form submission
    } catch (error) {
      console.error("Error creating/updating service:", error);
    } finally {
      // setSubmitting(false);
      window.location.reload();

    }
  };

  return (
    config && (
      <Formik
        initialValues={{
          title: config.title || "",
          slug: config.slug || "",
          icon: config.icon || "",
          metaTitle: config.metaTitle || "",
          metaDescription: config.metaDescription || "",
          description: config.description || "",
          og_title: config.og_title || "",
          og_description: config.og_description || "",
          og_url: config.og_url || "",
          meta_keywords: config.meta_keywords || [],
          meta_author: config.meta_author || "",
          twitter_card: config.twitter_card || "summary",
          twitter_site: config.twitter_site || "",
          website_title: config.website_title || "",
          website_description: config.website_description || "",
          slogan: config.slogan || "",
          og_image: config.og_image || "",
          whatsapp_number: config.whatsapp_number || "",
          facebookLink: config.facebookLink || "",
          twitterLink: config.twitterLink || "",
          instagramLink: config.instagramLink || "",
          linkdingLink: config.linkdingLink || "",
          bottomDescription: config.bottomDescription || "",



        }}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Title Field */}


            <div>
              <label className="block text-sm font-medium mb-2">Whatspp Number</label>
              <Field
                type="text"
                name="whatsapp_number"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter whatsapp number"
              />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm mt-1">{errors.whatsapp_number}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Facebook Link</label>
              <Field
                type="text"
                name="facebookLink"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter Facebook Link"
              />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm mt-1">{errors.facebookLink}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Twitter Link</label>
              <Field
                type="text"
                name="twitterLink"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter Twitter Linkr"
              />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm mt-1">{errors.twitterLink}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Instagram Link</label>
              <Field
                type="text"
                name="instagramLink"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter Instagram Link"
              />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm mt-1">{errors.instagramLink}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Linkding Link</label>
              <Field
                type="text"
                name="linkdingLink"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter linkding link"
              />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm mt-1">{errors.linkdingLink}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bottom Description</label>
              <Field
                type="text"
                name="bottomDescription"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter Bottom Description"
              />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm mt-1">{errors.bottomDescription}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website title</label>
              <Field
                type="text"
                name="website_title"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter meta author"
              />
              {errors.website_title && touched.website_title && (
                <div className="text-red-500 text-sm mt-1">{errors.website_title}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website Descriptions</label>
              <Field
                type="text"
                name="website_description"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter meta author"
              />
              {errors.website_description && touched.website_description && (
                <div className="text-red-500 text-sm mt-1">{errors.website_description}</div>
              )}
            </div>
            {/* <div>
              <label className="block text-sm font-medium mb-2">Slogan</label>
              <Field
                type="text"
                name="slogan"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter meta author"
              />
              {errors.slogan && touched.slogan && (
                <div className="text-red-500 text-sm mt-1">{errors.slogan}</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Field
                type="text"
                name="title"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter service title"
              />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm mt-1">{errors.title}</div>
              )}
            </div> */}

            {/* Slug Field */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <Field
                type="text"
                name="slug"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter slug"
              />
              {errors.slug && touched.slug && (
                <div className="text-red-500 text-sm mt-1">{errors.slug}</div>
              )}
            </div> */}

            {/* Icon Field */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <Field
                type="text"
                name="icon"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter icon"
              />
              {errors.icon && touched.icon && (
                <div className="text-red-500 text-sm mt-1">{errors.icon}</div>
              )}
            </div> */}

            {/* Meta Title Field */}
            {/* <div>
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
            </div> */}

            {/* Meta Description Field */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <Field
                type="text"
                name="metaDescription"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter meta description"
              />
              {errors.metaDescription && touched.metaDescription && (
                <div className="text-red-500 text-sm mt-1">{errors.metaDescription}</div>
              )}
            </div> */}

            {/* Description Field */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Field
                type="text"
                name="description"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter description"
              />
              {errors.description && touched.description && (
                <div className="text-red-500 text-sm mt-1">{errors.description}</div>
              )}
            </div> */}

            {/* OG Title Field */}
            <div>
              <label className="block text-sm font-medium mb-2">OG Title</label>
              <Field
                type="text"
                name="og_title"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter OG Title"
              />
              {errors.og_title && touched.og_title && (
                <div className="text-red-500 text-sm mt-1">{errors.og_title}</div>
              )}
            </div>

            {/* OG Description Field */}
            <div>
              <label className="block text-sm font-medium mb-2">OG Description</label>
              <Field
                type="text"
                name="og_description"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter OG Description"
              />
              {errors.og_description && touched.og_description && (
                <div className="text-red-500 text-sm mt-1">{errors.og_description}</div>
              )}
            </div>

            {/* OG URL Field */}
            <div>
              <label className="block text-sm font-medium mb-2">OG URL</label>
              <Field
                type="text"
                name="og_url"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter OG URL"
              />
              {errors.og_url && touched.og_url && (
                <div className="text-red-500 text-sm mt-1">{errors.og_url}</div>
              )}
            </div>

            {/* Meta Keywords Field */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Meta Keywords</label>
              <Field
                type="text"
                name="meta_keywords"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter meta keywords"
              />
              {errors.meta_keywords && touched.meta_keywords && (
                <div className="text-red-500 text-sm mt-1">{errors.meta_keywords}</div>
              )}
            </div> */}

            {/* Meta Author Field */}
            {/* <div>
              <label className="block text-sm font-medium mb-2">Meta Author</label>
              <Field
                type="text"
                name="meta_author"
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                placeholder="Enter meta author"
              />
              {errors.meta_author && touched.meta_author && (
                <div className="text-red-500 text-sm mt-1">{errors.meta_author}</div>
              )}
            </div> */}

            {/* Other fields like twitter_card, twitter_site, website_title, website_description, slogan, og_image, whatsapp_number */}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2.5 px-4 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Config"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

    )
  );
};

export default ConfigForm;