"use client";
import "react-quill/dist/quill.snow.css"; // ✅ Required for formatting
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FieldProps } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

// ✅ Load Quill without SSR
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

// ✅ Custom Quill Toolbar (supports h1-h6, full HTML formatting)
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

interface Config {
  bookingMetaPageTitle: string;
  bookingMetaPageDescription: string;
  aboutPageContent: string;
  aboutPageMetaTitle: string;
  aboutPageMetaDescription: string;
}

const ConfigForm2 = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [config, setConfig] = useState<Config | null>(null);
  const configId = process.env.NEXT_PUBLIC_CONFIG_ID;

  useEffect(() => {
    if (configId) {
      axios
        .get(`/api/config?id=${configId}`)
        .then((response) => {
          const config = response.data.config;
          if (config) setConfig(config);
        })
        .catch((error) => console.error("Error fetching config:", error));
    }
  }, [configId]);

  const validationSchema = Yup.object({
    bookingMetaPageTitle: Yup.string().required("Required"),
    bookingMetaPageDescription: Yup.string().required("Required"),
    aboutPageContent: Yup.string().required("Required"),
    aboutPageMetaTitle: Yup.string().required("Required"),
    aboutPageMetaDescription: Yup.string().required("Required"),
  });

  const handleSubmit = async (values: Config) => {
    try {
      const formData = new FormData();
      formData.append("bookingMetaPageTitle", values.bookingMetaPageTitle);
      formData.append("bookingMetaPageDescription", values.bookingMetaPageDescription);
      formData.append("aboutPageContent", values.aboutPageContent);
      formData.append("aboutPageMetaTitle", values.aboutPageMetaTitle);
      formData.append("aboutPageMetaDescription", values.aboutPageMetaDescription);
      formData.append("id", configId || "1");

      const response = await axios.post(
        `/api/config`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log("Config updated successfully:", response.data);
      router.push("/admin/service");
    } catch (error) {
      console.error("Error updating config:", error);
    } finally {
      window.location.reload();
    }
  };

  return (
    config && (
      <Formik
        initialValues={{
          bookingMetaPageTitle: config.bookingMetaPageTitle || "",
          bookingMetaPageDescription: config.bookingMetaPageDescription || "",
          aboutPageContent: config.aboutPageContent || "",
          aboutPageMetaTitle: config.aboutPageMetaTitle || "",
          aboutPageMetaDescription: config.aboutPageMetaDescription || "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6">
            {/* Booking Meta Page Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Booking Meta Page Title</label>
              <Field
                type="text"
                name="bookingMetaPageTitle"
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Enter Booking Meta Page Title"
              />
              <ErrorMessage name="bookingMetaPageTitle" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Booking Meta Page Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Booking Meta Page Description</label>
              <Field
                type="text"
                name="bookingMetaPageDescription"
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Enter Booking Meta Page Description"
              />
              <ErrorMessage name="bookingMetaPageDescription" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* About Page Content */}
            <div>
              <label className="block text-sm font-medium mb-2">About Page Content</label>
              <Field name="aboutPageContent">
                {({ field, form }: FieldProps) => (
                  <div className="border rounded-md overflow-hidden">
                    <ReactQuill
                      theme="snow"
                      value={field.value || ""}
                      onChange={(value) => form.setFieldValue("aboutPageContent", value)}
                      modules={modules}
                      formats={formats}
                      className="bg-white"
                    />
                  </div>
                )}
              </Field>
              <ErrorMessage name="aboutPageContent" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* About Page Meta Title */}
            <div>
              <label className="block text-sm font-medium mb-2">About Page Meta Title</label>
              <Field
                type="text"
                name="aboutPageMetaTitle"
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Enter About Page Meta Title"
              />
              <ErrorMessage name="aboutPageMetaTitle" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* About Page Meta Description */}
            <div>
              <label className="block text-sm font-medium mb-2">About Page Meta Description</label>
              <Field
                type="text"
                name="aboutPageMetaDescription"
                className="w-full rounded-lg border border-gray-300 p-2"
                placeholder="Enter About Page Meta Description"
              />
              <ErrorMessage name="aboutPageMetaDescription" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ConfigForm2;
