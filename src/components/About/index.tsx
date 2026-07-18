"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const About = () => {
  const [aboutContent, setAboutContent] = useState<string | null>(null); // Handle API content

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/config?id=${process.env.NEXT_PUBLIC_CONFIG_ID}`);
        const data = response.data?.config;

        if (data && data.aboutPageContent) {
          setAboutContent(data.aboutPageContent);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Static fallback content
  const staticContent = `
    <p>सवामणी प्रसाद से लेकर भोग सेवा तक सभी प्रकार की सेवाओं के लिए मेहंदीपुर बालाजी सवामणी ऑनलाइन बुकिंग (Mehandipur Balaji Sawamani Online Booking) से संपर्क करें। हम सभी प्रकार की सवामणी ऑनलाइन सेवाएँ (Sawamani Online Booking) प्रदान करते हैं।</p>
    <p>हम आपको मेहंदीपुर बालाजी के लिए शुद्ध, उच्च गुणवत्ता वाला और पवित्र सवामणी प्रसाद अर्पित करने की सेवा प्रदान करते हैं, जिससे आपकी मनोकामनाएँ पूर्ण हो सकें।</p>
    <p>शिव मिष्ठान भंडार पिछले 35 वर्षों से मेहंदीपुर बालाजी धाम में सवामणी ऑनलाइन बुकिंग और अर्जी ऑनलाइन बुकिंग (Mehandipur Balaji Sawamani Online) के लिए एक विश्वसनीय और प्रतिष्ठित स्थान के रूप में जाना जाता है।</p>
    <p>मेहंदीपुर बालाजी के पवित्र धाम में आप अपनी सवामणी ऑनलाइन बुकिंग (Mehandipur Balaji Sawamani) आसानी से कर सकते हैं और संपूर्ण विधि-विधान के साथ बालाजी महाराज को शुद्ध एवं पवित्र प्रसाद अर्पित कर उनका आशीर्वाद प्राप्त कर सकते हैं।</p>
    <p>यदि आप भी बालाजी महाराज को प्रसन्न करना चाहते हैं, तो आज ही मेहंदीपुर बालाजी में सवामणी ऑनलाइन बुकिंग (Balaji Sawamani online Booking) करें। और अधिक जानकारी के लिए नीचे दिए गए नंबर पर कॉल करें। और ऑनलाइन सवामणी बुक करें।</p>
    <p>Sawamani online booking, Chola online booking, and Arji online booking at Mehandipur Balaji Dham. Book Sawamani, Chola, and Arji services online. All prasad offerings include pure and high-quality food products. Book today to receive the blessings of Lord Balaji.</p>
  `;

  return (
    <section id="about" className="bg-gray-1 pt-2 dark:bg-dark-2 lg:pb-[10px] lg:pt-[20px]">
      <div className="container">
        <div className="wow fadeInUp" data-wow-delay=".2s">
          <div className="-mx-4 flex flex-wrap">
            {/* Left Section */}
            <div className="w-full px-8 lg:w-1/2">
              <div className="text-center mb-10 font-bold">
                <h1 className="text-dark mb-4 text-3xl font-bold text-black-500 dark:text-black-500 sm:text-4xl md:text-[40px] md:leading-[1.2]">
                  मेहंदीपुर बालाजी धाम
                </h1>


                <h2 className="mb-5 text-3xl font-medium leading-tight text-dark dark:text-white sm:text-[40px] sm:leading-[1.2]">
                  हमारे बारे में
                </h2>

                {/* Render API content or fallback to static content */}
                {/* <div
                  className="mb-5 text-base leading-relaxed text-body-color dark:text-dark-6"
                  dangerouslySetInnerHTML={{ __html: aboutContent || staticContent }}
                /> */}
                {/* <div
                  className="prose prose-sm sm:prose-base max-w-none text-justify mb-10"
                  dangerouslySetInnerHTML={{ __html: aboutContent || staticContent }}
                /> */}
                <div>
                  <style>
                    {`
    .same-heading-styles h1,
    .same-heading-styles h2,
    .same-heading-styles h3,
    .same-heading-styles h4,
    .same-heading-styles h5,
    .same-heading-styles h6,
    .same-heading-styles b,
    .same-heading-styles strong {
      font-size: 16px !important;
      font-weight: 400 !important; /* remove boldness */
      margin: 0.8rem 0 !important;
      line-height: 1.7 !important;
    }

    .same-heading-styles p {
      margin: 0.25rem 0 !important;
      line-height: 1.5 !important;
      font-weight: 400 !important;
    }

    .same-heading-styles ul,
    .same-heading-styles ol {
      margin: 0.25rem 0 !important;
      padding-left: 1.25rem !important;
    }

    .same-heading-styles li {
      margin: 0.15rem 0 !important;
      font-weight: 400 !important;
    }

    .same-heading-styles br {
      display: none;
    }
  `}
                  </style>


                  <div
                    className="prose max-w-none text-justify same-heading-styles"
                    style={{
                      fontSize: '16px',

                      // lineHeight: '',
                    }}
                    dangerouslySetInnerHTML={{ __html: aboutContent || staticContent }}
                  />
                </div>

                <div className="mb-2"></div>

                <Link
                  href="tel:+91 8559833140"
                  className="inline-flex items-center justify-center rounded-md bg-orange-700 px-7 py-3 text-center text-base font-medium text-white duration-300 hover:bg-orange/90"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full px-4 lg:w-1/2">
              <div className="-mx-2 flex flex-wrap sm:-mx-4 lg:-mx-2 xl:-mx-4">
                <div className="w-full px-2 sm:w-1/2 sm:px-4 lg:px-2 xl:px-4">
                  <div className="relative mb-3 sm:mb-8 sm:h-[558px] md:h-[688px] lg:h-[744px] xl:h-[744px]">
                    <Image
                      src="/images/about/about-image-011.webp"
                      alt="Mehandipur Balaji Sawamani"
                      fill
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>

                <div className="w-full px-2 sm:w-1/2 sm:px-4 lg:px-2">
                  <div className="relative sm:h-[446px] md:h-[496px] lg:h-[468px] xl:mb-8 xl:h-[552px]">
                    <Image
                      src="/images/about/11about-image-022.webp"
                      alt="Mehandipur Balaji Sawamani"
                      fill
                      className="h-full w-full object-cover object-center"
                    />
                  </div>


                  <div className="relative z-10 mb-3 flex items-center justify-center overflow-hidden bg-orange-700 px-6 py-12 sm:mb-4 sm:h-[160px] sm:p-5 lg:mb-2 xl:mb-4">
                    <div>
                      <span className="block text-base font-semibold text-white">We have</span>
                      <span className="block text-5xl font-extrabold text-white">35</span>
                      <span className="block text-base font-medium text-white text-opacity-70">
                        Years of experience
                      </span>
                    </div>


                    <div>
                      <span className="absolute left-0 top-0 -z-10">
                        <svg
                          width="106"
                          height="144"
                          viewBox="0 0 106 144"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            opacity="0.1"
                            x="-67"
                            y="47.127"
                            width="113.378"
                            height="131.304"
                            transform="rotate(-42.8643 -67 47.127)"
                            fill="url(#paint0_linear_1416_214)"
                          />
                          <defs>
                            <linearGradient
                              id="paint0_linear_1416_214"
                              x1="-10.3111"
                              y1="47.127"
                              x2="-10.3111"
                              y2="178.431"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="white" />
                              <stop offset="1" stopColor="white" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
