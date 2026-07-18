"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import axios from "axios"; // Axios for making API calls
import { useRouter } from "next/navigation"; // For App Router (New)

const WebsiteBlogService = () => {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [services, setServices] = useState([]);
  const [config, setConfig] = useState(null); // To store config data
  const [initialValues, setInitialValues] = useState({ blogs: [], services: [] }); // Initial values for form

  useEffect(() => {
    // Fetch the config data
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/config?id=${process.env.NEXT_PUBLIC_CONFIG_ID}`)
      .then((response) => {
        const configData = response.data.config;
        setConfig(configData); // Set config data
        console.log(`configData ${configData}`)

        // Set the initial form values (services and blogs associated with config)
        const selectedBlogIds = configData.blogs.map((item: any) => item.blogId);
        const selectedServiceIds = configData.services.map((item: any) => item.serviceId);

        setInitialValues({
          blogs: selectedBlogIds,
          services: selectedServiceIds
        });

        // Fetch blogs and services
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blog`)
          .then((blogResponse) => setBlogs(blogResponse.data.blogs))
          .catch((error) => console.error("Error fetching blogs:", error));

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/service`)
          .then((serviceResponse) => setServices(serviceResponse.data.services))
          .catch((error) => console.error("Error fetching services:", error));
      })
      .catch((error) => console.error("Error fetching config:", error));
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append("id", process.env.NEXT_PUBLIC_CONFIG_ID || '1');
      formData.append("blogs", values.blogs.join(","));
      formData.append("services", values.services.join(","));

      // Submit the form data via PUT request
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/config`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Config updated successfully:", response.data);
      router.push("/admin/service"); // Redirect after successful form submission
    } catch (error) {
      console.error("Error updating config:", error);
    }
  };

  return (
    config ? (
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form className="space-y-6">
            {/* Blogs Multi-Select Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Blogs</label>
              <Field
                as="select"
                name="blogs"
                multiple
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setFieldValue("blogs", selectedOptions);
                }}
              >
                {blogs.map((blog: any) => (
                  <option key={blog.id} value={blog.id}>
                    {blog.title}
                  </option>
                ))}
              </Field>
            </div>

            {/* Services Multi-Select Dropdown */}
            <div>
              <label className="block text-sm font-medium mb-2">Select Services</label>
              <Field
                as="select"
                name="services"
                multiple
                className="w-full rounded-[7px] border-[1.5px] border-stroke bg-white py-2.5 pl-4 pr-4 text-dark focus:border-primary focus-visible:outline-none"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setFieldValue("services", selectedOptions);
                }}
              >
                {services.map((service: any) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </Field>
            </div>

            {/* Update Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-primary text-white py-2.5 px-4 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Config
              </button>
            </div>
          </Form>
        )}
      </Formik>
    ) : (
      <p>Loading...</p> // Show loading message until the config is fetched
    )
  );
};

export default WebsiteBlogService;
