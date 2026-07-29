"use client";

import React, { useState, useEffect } from "react";

const ConsultationModal = ({ mainCategory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceType: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Interval Timer Constants
  const SHOW_MODAL_INTERVAL = 3 * 60 * 1000; // Show modal every 3 minutes

  useEffect(() => {
    const hasSubmitted = localStorage.getItem("hasSubmittedForm");

    // Show popup every interval until form is submitted
    if (!hasSubmitted) {
      const interval = setInterval(() => {
        setIsOpen(true);
      }, SHOW_MODAL_INTERVAL);

      // Show the modal initially after 4 seconds
      const initialTimer = setTimeout(() => {
        setIsOpen(true);
      }, 4000);

      return () => {
        clearTimeout(initialTimer);
        clearInterval(interval);
      };
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!formData.serviceType) newErrors.serviceType = "Please select a service type.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const selectedService = mainCategory.find(
        (service) => service.name === formData.serviceType
      );

      if (!selectedService) {
        alert("Invalid service type selected");
        setIsSubmitting(false);
        return;
      }

      const payload = {
        name: formData.name,
        phone: formData.phone,
        mainCategoryId: selectedService.id,
      };

      const response = await fetch(`/api/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log("Form submitted successfully:", formData);
        localStorage.setItem("hasSubmittedForm", "true");
        handleClose();
        alert("Thank you for your submission!");
        setFormData({ name: "", phone: "", serviceType: "" });
      } else {
        const errorData = await response.json();
        alert(`Failed to submit the form: ${errorData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 animate-fade-in pt-35 pb-10">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative animate-slide-up lg:mt-30">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          ✖️
        </button>

        <h2
          style={{
            fontSize: '1.875rem',            // Tailwind's text-3xl
            fontWeight: 700,                 // Tailwind's font-bold
            textAlign: 'center',             // Tailwind's text-center
            marginBottom: '2rem',            // Tailwind's mb-8
            color: 'rgb(249, 120, 55)',      // Your custom color
            lineHeight: '2.25rem',           // Matches Tailwind's line-height
            fontFamily: "'Noto Sans Devanagari', sans-serif", // Devnagari optimized font
          }}
        >
          मेहंदीपुर बालाजी धाम (सवामणी, अर्जी, और चोला बुकिंग)
        </h2>



        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name"
              className={`w-full px-4 py-3 border ${errors.name ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2`}
              style={{ "--tw-ring-color": "rgb(55, 88, 249)" }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.phone ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2`}
              style={{ "--tw-ring-color": "rgb(55, 88, 249)" }}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.serviceType ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2`}
              style={{ "--tw-ring-color": "rgb(55, 88, 249)" }}
            >
              <option value="">Select Service Type</option>
              {mainCategory.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
            {errors.serviceType && <p className="text-red-500 text-sm">{errors.serviceType}</p>}
          </div>

          <button
            type="submit"
            className={`w-full text-white py-3 px-6 rounded-lg transition-colors duration-200 ${isSubmitting ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
              }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Book Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationModal;
