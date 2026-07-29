"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const CategoryCreateForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [previewImages, setPreviewImages] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [existingCategoryData, setExistingCategoryData] = useState(null);

  const CategoryId = searchParams.get("id");

  // Fetch main categories for dropdown
  useEffect(() => {
    const fetchMainCategories = async () => {
      try {
        const response = await axios.get(`/api/maincategory`);
        setMainCategories(response.data.services);
      } catch (error) {
        console.error("Error fetching main categories:", error);
      }
    };

    fetchMainCategories();
  }, []);

  useEffect(() => {
    if (CategoryId) {
      axios
        .get(`/api/category?id=${CategoryId}`)
        .then((response) => {
          const category = response.data.Category;

          if (category) {
            setExistingCategoryData({
              ...category,
              mainCategoryName: category?.mainCategory?.name || "",
              mainCategoryId: category?.mainCategory?.id || "",
              weightType: category?.weightType || "kg", // Default to kg
            });

            setPreviewImages([category?.image || ""]);
          }
        })
        .catch((error) => {
          console.error("Error fetching Category data:", error);
        });
    }
  }, [CategoryId]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    weight: Yup.number().required("Weight is required"),
    price: Yup.number().required("Price is required"),
    mainCategoryId: Yup.string().required("Please select a main category"),
    weightType: Yup.string().required("Weight Type is required"),
  });

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      const image = URL.createObjectURL(files[0]);
      setPreviewImages([image]);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("Submitted values:", values);

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("weight", values.weight);
      formData.append("weightType", values.weightType);
      formData.append("price", values.price);
      formData.append("mainCategoryId", values.mainCategoryId);

      if (CategoryId) {
        formData.append("id", CategoryId); // For updating
      }

      // ✅ Only append image if a new one is selected
      if (previewImages.length > 0) {
        if (previewImages[0].startsWith("blob:")) {
          // New image: Convert to blob and append
          const imageFile = previewImages[0];
          const imageBlob = await fetch(imageFile)
            .then((res) => res.blob())
            .catch((err) => {
              console.error("Image Blob Error:", err);
            });

          formData.append("file", imageBlob, "featuredImage.jpg");
        } else {
          // Existing image: Append existing image path
          formData.append("existingImage", previewImages[0]);
        }
      }

      const apiUrl = `/api/category`;

      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Category saved successfully:", response.data);

      resetForm();
      router.push("/admin/subcategory");
    } catch (error) {
      console.error("Error creating/updating Category:", error.response?.data || error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="max-w-4xl mx-auto p-6">
        <Formik
          enableReinitialize={true}
          initialValues={{
            name: existingCategoryData?.name || "",
            weight: existingCategoryData?.weight || "",
            weightType: existingCategoryData?.weightType || "kg",  // Default weight type
            price: existingCategoryData?.price || "",
            mainCategoryId: existingCategoryData?.mainCategoryId || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <Field
                  type="text"
                  name="name"
                  className="w-full border px-4 py-2 rounded-md"
                  placeholder="Enter name"
                />
                {errors.name && touched.name && <div className="text-red-500">{errors.name}</div>}
              </div>

              {/* Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Weight</label>
                  <Field
                    type="number"
                    name="weight"
                    className="w-full border px-4 py-2 rounded-md"
                    placeholder="Enter weight"
                  />
                  {errors.weight && touched.weight && (
                    <div className="text-red-500">{errors.weight}</div>
                  )}
                </div>

                {/* Weight Type Dropdown */}
                <div>
                  <label className="block text-sm font-medium mb-2">Weight Type</label>
                  <Field
                    as="select"
                    name="weightType"
                    className="w-full border px-4 py-2 rounded-md"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="g">Grams (g)</option>
                    {/* <option value="lb">Pounds (lb)</option>
                    <option value="oz">Ounces (oz)</option> */}
                  </Field>
                  {errors.weightType && touched.weightType && (
                    <div className="text-red-500">{errors.weightType}</div>
                  )}
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-2">Price (₹)</label>
                <Field
                  type="number"
                  name="price"
                  className="w-full border px-4 py-2 rounded-md"
                  placeholder="Enter price"
                />
                {errors.price && touched.price && <div className="text-red-500">{errors.price}</div>}
              </div>

              {/* Main Category Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-2">Main Category</label>
                <Field
                  as="select"
                  name="mainCategoryId"
                  className="w-full border px-4 py-2 rounded-md"
                >
                  <option value="">Select a main category</option>
                  {mainCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {errors.mainCategoryId && touched.mainCategoryId && (
                  <div className="text-red-500">{errors.mainCategoryId}</div>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {previewImages.length > 0 && (
                  <div className="mt-2">
                    <Image src={previewImages[0]} alt="Preview" width={100} height={100} />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-opacity-90"
              >
                {isSubmitting ? "Saving..." : CategoryId ? "Update Category" : "Add Category"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CategoryCreateForm;
