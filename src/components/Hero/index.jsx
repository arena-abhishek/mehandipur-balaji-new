"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";  // Import Framer Motion

const HeroSection = ({ existingConfigData, mainCat }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    // email: Yup.string().email("Enter a valid email").required("Email is required"),
    serviceType: Yup.string().required("Service type is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
      .required("Phone is required"),
  });

  const initialValues = {
    name: "",
    email: "",
    serviceType: "",
    phone: "",
  };

  const handleSubmit = async (values, { resetForm, setErrors, setSubmitting }) => {
    setIsSubmitting(true);

    try {
      // Map serviceType to mainCategoryId
      const selectedService = mainCat.find(
        (service) => service.name === values.serviceType
      );

      if (!selectedService) {
        alert("Invalid service type selected");
        setIsSubmitting(false);
        return;
      }

      // Prepare the request payload
      const payload = {
        name: values.name,
        phone: values.phone,
        mainCategoryId: selectedService.id, // ✅ Use the correct field name
      };

      console.log("Submitting payload:", payload);

      const response = await fetch(`/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Thank you! Your form has been submitted successfully. 🙏");

        resetForm();
      } else {
        const result = await response.json();
        alert(`Failed to submit: ${result.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error. Please try again.");
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500 lg:px-5 sm:px-8 lg:mt-28  ">

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Desktop View - Hanuman Ji Image */}
        <motion.div
          className="hidden lg:block relative mt-10"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src="/images/logo/pic-hunuman ji.webp"
            alt="Hanuman Ji"
            // layout="fill"
            width={200}
            height={300}
            objectFit="contain"
            className="w-full h-full"
          />
        </motion.div>

        {/* Mobile View - Hanuman Ji & Jai Shri Ram */}
        <motion.div
          className="lg:hidden flex flex-col items-center justify-center w-auto px-1 mb-10 mt-20"
          initial={{ opacity: 0, y: 70 }}
          animate={{ opacity: 2, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Hanuman Ji Image with Bottom Shadow */}
          {/* <div className="flex justify-center w-full"> */}
          {/* <div classNa  me="relative"> */}
          <Image
            src="/images/logo/pic-hunuman ji.webp"
            alt="Hanuman Ji"
            width={200}
            height={200}
            objectFit="contain"
            className="w-full h-auto drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]"
          // Tailwind drop shadow for bottom effect
          />
          {/* </div> */}
          {/* </div> */}

          {/* Jai Shri Ram Text */}
          <div className="text-center">
            <h1 className="font-bold text-white mb-3 text-2xl mb-4">।। जय श्री मेहंदीपुर बालाजी धाम ।।</h1>
            <p className="font-normal text-white mb-5 text-lg mb-1">
              अब अपनी सवामणी, चोला या अरजी की बुकिंग सिर्फ 1 मिनट में करें!
            </p>

            <a
              href="tel:+91 8559833140"
              className="inline-block bg-orange-500 hover:bg-orange-700 text-white font-bold py-5 px-8 rounded-lg transition duration-300 shadow-lg"
            >
              📞 CALL NOW
            </a>
          </div>
        </motion.div>


        {/* Form Section with Animation */}
        <motion.div
          className="hidden lg:flex flex-col justify-center items-center w-full max-w-lg bg-white p-10 rounded-xl shadow-lg mb-20 mt-10"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
            Mehandipur Balaji Sawamani, Arji, Chola Booking
          </h2>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleChange }) => (
              <Form className="space-y-6 w-full">
                <div>
                  <label className="block text-gray-700 mb-2">Name *</label>
                  <Field
                    type="text"
                    name="name"
                    placeholder="Enter Name"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  />
                  <ErrorMessage name="name" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Phone *</label>
                  <Field
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  />
                  <ErrorMessage name="phone" component="p" className="text-red-500 text-sm mt-1" />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Service Type *</label>
                  <Field as="select" name="serviceType" className="w-full px-4 py-3 rounded-lg border border-gray-300">
                    <option value="">Select Service Type</option>
                    {mainCat?.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="serviceType" component="p" className="text-red-500 text-sm mt-1" />
                </div>


                {/* 
                <div>
                  <label className="block text-gray-700 mb-2">Email *</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1" />
                </div> */}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {isSubmitting ? "Booking..." : "Book Now"}
                </button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
