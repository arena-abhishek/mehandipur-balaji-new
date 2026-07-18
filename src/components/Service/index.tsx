"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGlobalConfig } from '@/types/GlobalConfigContext';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import PreLoader from "@/components/Common/PreLoader";
import Loader from "@/components/Admin/common/Loader";

const OurServices = () => {
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
                    `${process.env.NEXT_PUBLIC_API_URL}/api/config?id=${process.env.NEXT_PUBLIC_CONFIG_ID}`
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

    if (loading) return <Loader />;  // ✅ Display Loader while loading


    return (


        <section className="relative py-12 px-4 md:px-8 lg:px-12 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src='/images/bg.jpg'
                    alt="Background"
                    fill
                    priority
                    sizes="100vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    className="mix-blend-overlay opacity-100"
                />
            </div>

            <div className="container mx-auto relative z-10">
                {/* Section Heading */}
                <div className="mb-12 text-center">
                    <h2 className="text-white text-xl font-medium mb-2">Our Services</h2>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">How We Can Help</h1>
                    <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {metadata.mainCategory.map((service: any) => (
                        <Link key={service.id} href={`booking/${service.slug}`} className="block">
                            <div
                                className="bg-orange-600 rounded-lg shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col h-full p-8"
                            >
                                {/* Circular Image */}
                                {/* <div className="flex justify-center">
                                    <div className="relative w-40 h-40 rounded-full overflow-hidden mb-6 shadow-md">
                                        <Image
                                            src={service.image}
                                            alt={`${service.name} icon`}
                                            fill
                                            sizes="100vw"
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </div>
                                </div> */}

                                <div className="flex justify-center">
                                    <div className="relative w-72 h-40 overflow-hidden mb-6 shadow-md rounded-lg">
                                        {/* ✅ Rectangle image with border radius */}
                                        {/* <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/api${service.image}`}

                                            // src={service.image}
                                            alt={`${service.name} icon`}
                                            // fill
                                            sizes="100vw"
                                            style={{ objectFit: 'cover' }}
                                        /> */}
                                        <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL}/api${service.image}`}
                                            alt={`${service.name} icon`}
                                            width={288}
                                            height={160}
                                            style={{ objectFit: 'cover', borderRadius: '0.5rem' }} // same as rounded-lg
                                            className="mb-6 shadow-md"
                                        />
                                    </div>
                                </div>


                                {/* Service Title */}
                                <h3 className="text-2xl text-white font-bold mb-4 text-center">{service.name}</h3>

                                {/* HTML Content Rendering */}
                                <div
                                    className="text-gray-100 mb-6 md:text-base leading-relaxed font-bold text-center"
                                    dangerouslySetInnerHTML={{ __html: service.content }}
                                />

                                {/* Booking Link */}
                                <div className="mt-auto">
                                    <Link
                                        href={`booking/${service.slug}`}
                                        className="block text-center bg-black bg-opacity-70 hover:bg-opacity-90 text-white py-3 px-6 rounded-md font-medium transition duration-300"
                                    >
                                        Book Now
                                    </Link>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Additional Information */}
                <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-800 rounded-lg p-6 sm:p-8 shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl text-white font-bold mb-2">Need Special Arrangements?</h3>
                            <p className="text-white text-opacity-90 max-w-xl font-bold">
                                Contact us for customized pooja services and special requirements
                            </p>
                        </div>
                        <a href="tel:+91 8559833140" className="bg-white text-red-800 hover:bg-gray-100 py-3 px-8 rounded-md font-medium transition duration-300 shadow-md whitespace-nowrap w-full md:w-auto text-center">
                            Contact Us
                        </a>
                    </div>
                </div>
            </div>
        </section>

    );

}


export default OurServices;
