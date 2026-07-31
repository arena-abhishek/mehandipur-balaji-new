
'use client'
import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useGlobalConfig } from '@/types/GlobalConfigContext';
import axios from 'axios';
// import { Config } from '@/types/GlobalConfigContext';


// Define type for form values
interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  // message: string;
}

// Form validation schema using Yup
const ContactSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Name is required'),
  email: Yup.string()
    .email('Invalid email')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .required("Phone is required"),
  serviceType: Yup.string().required("Service type is required"),
  // message: Yup.string()
  //   .min(10, 'Message is too short')
  //   .max(500, 'Message is too long')
  //   .required('Message is required'),
});

interface ContactProps {
  isShowText: boolean;
  mainCat?: any;   // Optional prop
}

const Contact: React.FC<ContactProps> = ({ isShowText, mainCat }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  // const [config, setConfig] = useState<Config | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [maincategory, setMaincategory] = useState<any[]>([]);
  const [posts2, setPosts2] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>(mainCat || []);

  const [posts3, setPosts3] = useState<any>();
  const { whatsappNumber, metadata, setWhatsappNumber, setMetadata } = useGlobalConfig();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/config?id=${process.env.NEXT_PUBLIC_CONFIG_ID}`);
      if (response.data?.mainCategory) {
        const blogPosts = response.data.config.blogs.map((entry: any) => entry.blog);
        const blogPosts2 = response.data.config.services.map((entry: any) => entry.service);
        const mainCatroy = response.data.mainCategory?.map((entry: any) => entry) || [];

        setMaincategory(mainCatroy);
        setPosts(blogPosts);
        setPosts2(blogPosts2);
        setPosts3(response.data.config);

        setCategories(mainCatroy);  // ✅ Set the categories
        setWhatsappNumber(response.data.config.whatsapp_number as any);
        metadata.mainCategory = mainCatroy;
        mainCat.mainCategory = mainCatroy;
        metadata.facebookLink = mainCatroy.facebookLink;

        setMetadata({
          ...metadata,
          mainCategory: mainCatroy,
          title: response.data.config.title as any,
          description: "Updated Description",
          og_url: "/updated-image.jpg",
        });

        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    // if (!mainCat || mainCat.length === 0) {
    fetchCategories();
    // } else {
    //   console.log("main cat ", mainCat)
    //   setCategories(mainCat);
    // }
    // setLoading(false);
  }, [mainCat]);

  const handleSubmit = async (
    values: ContactFormValues,
    { resetForm, setSubmitting }: FormikHelpers<ContactFormValues>
  ) => {
    setIsSubmitting(true);

    try {
      // Map serviceType to mainCategoryId
      const selectedService = maincategory.find(
        (service) => service.name === values.serviceType
      );

      if (!selectedService) {
        alert('Invalid service type selected');
        setIsSubmitting(false);
        return;
      }

      // Prepare the request payload
      const payload = {
        name: values.name,
        phone: values.phone,
        email: values.email,  // Include email in the payload
        // message: values.message,  // Include message in the payload
        mainCategoryId: selectedService.id,
      };

      console.log('Submitting payload:', payload);

      const response = await fetch(`/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert('Thank you! Your form has been submitted successfully. 🙏');
        resetForm();
      } else {
        const result = await response.json();
        alert(`Failed to submit: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error. Please try again.');
    } finally {
      setIsSubmitting(false);
      setSubmitting(false);
    }
  };


  return (
    <section className="py-8  dark:bg-dark-2 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* <div className="bg-gray-50 dark:bg-dark-2 min-h-screen py-12"> */}
        {/* <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"> */}
        {/* Header */}
        <div className="text-center mb-5">
          {isShowText ? <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1> : null}
          {/* <p className="text-lg dark:text-white text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help. Reach out to our team using the form below.
            </p> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Header Section */}
              <div className="bg-orange-600 flex justify-center items-center px-6 py-8">
                <h3 className="text-2xl font-bold text-white">Get in Touch</h3>
              </div>


              {/* Contact Details */}
              <div className="px-2 py-12">
                <ul className="space-y-6">

                  {/* Location */}
                  <li className="flex items-start">
                    <MapPin className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Our Location</h4>
                      <a
                        href="https://g.co/kgs/ekDRnrz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1 text-gray-600 underline hover:text-orange-500 transition-all duration-300"
                      >
                        Shree Shiv Misthan Bhandar, shop number 1.B,
                        Mehandipur Balaji Ram Mandir wali line,
                        Dausa, Rajasthan
                      </a>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex items-start">
                    <Phone className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Phone Number</h4>
                      <a
                        href="tel:+91 8559833140"
                        className="mt-1 text-gray-600 underline hover:text-orange-500 transition-all duration-300"
                      >
                        +91 8559833140
                      </a>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-start">
                    <Mail className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div className="ml-4">
                      <h4 className="text-lg font-medium text-gray-900">Email Address</h4>
                      <a
                        href="mailto:info@mahandipurbalaji.com"
                        className="mt-1 text-gray-600 underline hover:text-orange-500 transition-all duration-300"
                      >
                        info@mahandipurbalaji.com
                      </a>
                    </div>
                  </li>


                </ul>
              </div>
            </div>
          </div>


          {/* Contact Form */}
          <div className="lg:col-span-2 ">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>

              <Formik
                initialValues={{ name: '', email: '', phone: '', serviceType: '' }}
                validationSchema={ContactSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting, errors, touched }) => (
                  <Form>
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                      <div className="sm:col-span-1">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className={`w-full px-4 py-2 border dark:bg-white rounded-md focus:ring-2 focus:outline-none ${errors.name && touched.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-200 focus:border-orange-500'
                            }`}
                          placeholder="John Doe"
                        />
                        <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div className="sm:col-span-1">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`w-full px-4 py-2 border dark:bg-white rounded-md focus:ring-2 focus:outline-none ${errors.email && touched.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-200 focus:border-orange-500'
                            }`}
                          placeholder="john@example.com"
                        />
                        <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div className="sm:col-span-2">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Contact Number
                        </label>
                        <Field
                          type="text"
                          name="phone"
                          id="phone"
                          className={`w-full px-4 py-2 border dark:bg-white rounded-md focus:ring-2 focus:outline-none ${errors.phone && touched.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-200 focus:border-orange-500'
                            }`}
                          placeholder="Please enter your phone number"
                        />
                        <ErrorMessage name="phone" component="p" className="mt-1 text-sm text-red-600" />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-gray-700 mb-2">Service Type *</label>
                        <Field as="select" name="serviceType" className="w-full px-4 py-3 rounded-lg border border-gray-300">
                          <option value="">Select Service Type</option>
                          {maincategory.map((service) => (
                            <option key={service.id} value={service.name} className="text-gray-700">
                              {service.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="serviceType" component="p" className="text-red-500 text-sm mt-1" />
                      </div>

                      {/* <div className="sm:col-span-2">
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <Field
                          as="textarea"
                          name="message"
                          id="message"
                          rows={5}
                          className={`w-full px-4 py-2 border dark:bg-white rounded-md focus:ring-2 focus:outline-none ${errors.message && touched.message ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-orange-200 focus:border-orange-500'
                            }`}
                          placeholder="Please describe how we can help you..."
                        />
                        <ErrorMessage name="message" component="p" className="mt-1 text-sm text-red-600" />
                      </div> */}

                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-md font-medium transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-70"
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>

        {/* Google Map or Location Image Placeholder */}
        {/* <div className="mt-16 bg-gray-300 h-96 rounded-lg overflow-hidden shadow-lg">
          <div className="h-full flex items-center justify-center bg-orange-100">
            <p className="text-gray-600 text-lg">Map or Location Image Here</p>
          </div>
        </div> */}
        <div className="map bg-white p-1 rounded-lg shadow-lg overflow-hidden mt-10">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.591285362214!2d76.7948994!3d26.9469184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39726b5299d1c169%3A0x7edf83bb32dedb0b!2sMehandipur%20Balaji%20Sawamani!5e0!3m2!1sen!2sin!4v1734010601296!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        {/* </div> */}
      </div>
      {/* </div> */}
    </section>
  );
};

export default Contact;