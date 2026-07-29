'use client'
import { useEffect, useState } from 'react';
import { ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import React from 'react';
import { Phone } from 'lucide-react';
import axios from 'axios';
import { useGlobalConfig } from '@/types/GlobalConfigContext';
// Define prop types
interface FooterProps {
  mainCategory: {
    id: string;
    name: string;
    description?: string;  // Add properties based on your data
  }[];
}
export default function Footer({ mainCategory }: FooterProps) {
  // console.log("aay amain category", mainCategory)
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  // const [config, setConfig] = useState<Config | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [maincategory, setMaincategory] = useState<any[]>([]);
  const [posts2, setPosts2] = useState<any[]>([]);
  const [posts3, setPosts3] = useState<any>();
  const { whatsappNumber, metadata, setWhatsappNumber, setMetadata } = useGlobalConfig();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await axios.get(
          `/api/config?id=${process.env.NEXT_PUBLIC_CONFIG_ID}`
        );



        if (response.data && response.data.config) {
          // setConfig(response.data.config);
          const blogPosts = response.data.config.blogs.map((entry: any) => entry.blog);
          const blogPosts2 = response.data.config.services.map((entry: any) => entry.service);
          const mainCatroy = response.data.mainCategory?.map((entry: any) => entry) || [];

          setMaincategory(mainCatroy);
          setPosts(blogPosts);
          setPosts2(blogPosts2);
          setPosts3(response.data.config);

          setWhatsappNumber(response.data.config.whatsapp_number as any);
          metadata.mainCategory = mainCatroy;
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
        console.error("Error fetching config data:", error);
        setLoading(false);
      }
    };

    if (metadata.mainCategory.length === 0) {
      setLoading(true);
      fetchConfig();
    } else {

      setLoading(false);

    }
  }, []);
  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      serviceType: "",
      mainCategoryId: "cm8lpdnz5000lk54t2rit6a9r", // Default value
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      // email: Yup.string().email('Invalid email').required('Required'),
      phone: Yup.string()
        .matches(/^\d{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      serviceType: Yup.string().required("Service type is required"),

      // message: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      console.log(values);


      const selectedService = mainCategory.find(
        (service: any) => service.name === values.serviceType
      );

      const payload = {
        name: values.name,
        phone: values.phone,
        mainCategoryId: selectedService?.id || "cm8luc3pb000j269u6r0pzj2l", // ✅ Use the correct field name
      };


      try {
        const response = await fetch(`/api/leads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          setFormSubmitted(true);
          resetForm();
          setTimeout(() => setFormSubmitted(false), 10000);
          alert("Thank you for your submission!");
        } else {
          alert("Failed to submit the form. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("There was an error submitting the form. Please try again.");
      }
    },
  });
  console.log("metadata.facebookLink ", metadata)


  return (
    <section className="py-12  dark:bg-dark-2 bg-gray-50 bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="container mx-auto px-4">
        {/* <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white"> */}
        {/* Main Footer Content */}
        {/* <div className="max-w-6xl mx-auto p-6 md:p-10"> */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-bold">MEHANDIPUR BALAJI</h2>
            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <p className="text-lg font-medium">Visit Us</p>
              <a
                href="https://g.co/kgs/ekDRnrz"
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-2 text-white-700 hover:text-white-500 transition-colors duration-300 underline decoration-orange-500 hover:decoration-orange-700"
              >
                Shiv Misthan Bhandar, shop number 6.B,<br />
                Mehandipur Balaji Ram Mandir wali line,<br />
                Dausa, Rajasthan
              </a>

            </div>

            <div className="bg-white bg-opacity-10 p-4 rounded-lg">
              <p className="text-lg font-medium">Contact Info</p>
              <div className="mt-2 space-y-1">
                <a href="tel:+91 8559833140" className="flex items-center hover:underline">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  +91 8559833140
                </a>
                <a href="mailto:info@mahandipurbalaji.com" className="flex items-center hover:underline">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  info@mahandipurbalaji.com
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div className="pt-5">
              <div className="flex space-x-4">
                <a href='https://www.facebook.com/people/%E0%A4%B6%E0%A5%8D%E0%A4%B0%E0%A5%80-%E0%A4%AE%E0%A5%87%E0%A4%B9%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A5%80%E0%A4%AA%E0%A5%81%E0%A4%B0-%E0%A4%AC%E0%A4%BE%E0%A4%B2%E0%A4%BE%E0%A4%9C%E0%A5%80/61558166797584/' className="bg-white rounded-full p-2 text-red-600 hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>
                {/* <a href="#" className="bg-white rounded-full p-2 text-red-600 hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                  </svg>
                </a>
                <a href="#" className="bg-white rounded-full p-2 text-red-600 hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a> */}
                <a href='https://wa.me/918559833140' className="bg-white rounded-full p-2 text-red-600 hover:bg-gray-100 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Middle Column - Quick Links */}
          <div>
            <h2 className="text-2xl font-bold mb-4">QUICK LINKS</h2>
            <div className="grid grid-cols-2 gap-2">
              <a href="/" className="bg-white bg-opacity-10 p-3 rounded-lg hover:bg-opacity-20 transition-all flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Home
              </a>
              <a href="/booking" className="bg-white bg-opacity-10 p-3 rounded-lg hover:bg-opacity-20 transition-all flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Booking
              </a>
              <a href="/gallery" className="bg-white bg-opacity-10 p-3 rounded-lg hover:bg-opacity-20 transition-all flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Gallery
              </a>
              <a href="/blogs" className="bg-white bg-opacity-10 p-3 rounded-lg hover:bg-opacity-20 transition-all flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                Blogs
              </a>
              <a href="/about" className="bg-white bg-opacity-10 p-3 rounded-lg hover:bg-opacity-20 transition-all flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                About Us
              </a>
              <a href="/contact" className="bg-white bg-opacity-10 p-3 rounded-lg hover:bg-opacity-20 transition-all flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Contact Us
              </a>
            </div>
            <a href="/booking" className="block mt-6">
              <div className="bg-white bg-opacity-10 p-4 rounded-lg hover:bg-opacity-20 transition-all duration-300 cursor-pointer">
                <h3 className="text-lg font-medium mb-2">Online Booking Available</h3>
                <p>


                  Mehandipur Balaji sawamani online booking is available. Call now +91 8559833140 for sawamani booking. Shiv Misthan Bhandar provides sawamani prasad booking for
                  Mehandipur Balaji Dham.
                  {/* </a> */}

                </p>
                <div className="mt-3 inline-block bg-white text-red-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                  Book Now
                </div>
              </div>
            </a>

          </div>

          {/* Right Column - Contact Form */}
          <div>
            <h2 className="text-2xl font-bold mb-4">CONTACT US</h2>

            {formSubmitted ? (
              <div className="bg-white text-green-600 p-6 rounded-lg text-center">
                <svg className="w-12 h-12 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg font-bold mt-2">Message Sent!</h3>
                <p className="mt-1">Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit} className="bg-white bg-opacity-10 p-5 rounded-lg">
                <div className="mb-4">
                  <input
                    id="name"
                    type="text"
                    // name="name"
                    placeholder="Your Name"
                    className={`w-full p-3 bg-white bg-opacity-20 border ${formik.touched.name && formik.errors.name
                      ? 'border-red-400'
                      : 'border-transparent'
                      } rounded-lg placeholder-white placeholder-opacity-80 focus:bg-opacity-30 focus:outline-none`}
                    {...formik.getFieldProps('name')}
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-sm mt-1 text-white">{formik.errors.name}</div>
                  )}
                </div>

                {/* <div className="mb-4">
                  <input
                    id="email"
                    type="email"
                    // name="email"
                    placeholder="Your Email"
                    className={`w-full p-3 bg-white bg-opacity-20 border ${formik.touched.email && formik.errors.email
                      ? 'border-red-400'
                      : 'border-transparent'
                      } rounded-lg placeholder-white placeholder-opacity-80 focus:bg-opacity-30 focus:outline-none`}
                    {...formik.getFieldProps('email')}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-sm mt-1 text-white">{formik.errors.email}</div>
                  )}
                </div> */}
                <div className="mb-4">
                  <input
                    id="phone"
                    type="phone"
                    // name="phone"
                    placeholder="Your Phone"
                    className={`w-full p-3 bg-white bg-opacity-20 border ${formik.touched.phone && formik.errors.phone
                      ? 'border-red-400'
                      : 'border-transparent'
                      } rounded-lg placeholder-white placeholder-opacity-80 focus:bg-opacity-30 focus:outline-none`}
                    {...formik.getFieldProps('phone')}
                  />
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="text-sm mt-1 text-white">{formik.errors.phone}</div>
                  )}
                </div>

                <div className="mb-4">
                  <select
                    id="serviceType"
                    // name="serviceType"
                    className={`w-full p-3 bg-white bg-opacity-20 border ${formik.touched.serviceType && formik.errors.serviceType
                      ? "border-red-400"
                      : "border-transparent"
                      } rounded-lg placeholder-white placeholder-opacity-80 focus:bg-opacity-30 focus:outline-none`}
                    {...formik.getFieldProps("serviceType")}
                  >
                    <option value="" disabled>Select Service Type</option> {/* Add a default option */}
                    {mainCategory.map((e: any) => (
                      <option
                        key={e.id}
                        value={e.name}
                        className="text-black"  // Simplified text color styling
                      >
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>


                {/* {formik.touched.serviceType && formik.errors.serviceType && (
                    <div className="text-sm mt-1 text-white">{formik.errors.serviceType}</div>
                  )} */}
                {/* </div> */}




                {/* <div className="mb-4">
                  <textarea
                    id="message"
                    // name="message"
                    placeholder="Your Message"
                    rows={4}
                    className={`w-full p-3 bg-white bg-opacity-20 border ${
                      formik.touched.message && formik.errors.message 
                        ? 'border-red-400' 
                        : 'border-transparent'
                    } rounded-lg placeholder-white placeholder-opacity-80 focus:bg-opacity-30 focus:outline-none`}
                    {...formik.getFieldProps('message')}
                  />
                  {formik.touched.message && formik.errors.message && (
                    <div className="text-sm mt-1 text-white">{formik.errors.message}</div>
                  )}
                </div> */}

                <button
                  type="submit"
                  className="w-full bg-white text-red-600 font-bold py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  SEND MESSAGE
                </button>
              </form>
            )}
          </div>
        </div>
        {/* </div> */}

        {/* Bottom Copyright Bar */}
        <div className=" py-4 mt-3">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white opacity-80">&copy; {new Date().getFullYear()} Mehandipur Balaji. All rights reserved.</p>
            <div className="mt-2 md:mt-0">
              <a href="/privacy-policy" className="text-white opacity-80 hover:opacity-100 mx-2 text-sm">Privacy Policy</a>
              <a href="/refund-policy" className="text-white opacity-80 hover:opacity-100 mx-2 text-sm">Refund Policy</a>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </section >
  );
}