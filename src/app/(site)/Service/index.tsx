import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OurServices = () => {
    const services = [
        {
            id: 'sawamani',
            icon: '/images/booking.png',
            title: 'Sawamani Booking',
            description: 'सवामणी प्रसाद के लिए मेहंदीपुर बालाजी सवामणी बुकिंग (Mehandipur Balaji Sawamani Booking) की सेवाएं लें। हम आपको शुद्ध देसी घी से बने हलवा, पूरी-सब्जी, और लड्डू आर्पित करने की सुविधा प्रदान करते हैं।',
            color: 'bg-orange-500',
            link: `/services/${1}`,
        },
        {
            id: 'arji',
            icon: '/images/laddu.png',
            title: 'Arji Booking',
            description: 'मेहंदीपुर बालाजी अर्जी बुकिंग (Mehandipur Balaji Arji Booking) अब सरल और सुविधाजनक हो गई है। भक्त अग्रिम में अर्जी बुक कर सकते हैं, जिसमें दलादा घी और देसी घी के विकल्प उपलब्ध है।',
            color: 'bg-orange-600',
            link: `/services/${2}`,
        },
        {
            id: 'chola',
            icon: '/images/towel.png',
            title: 'Chola Booking',
            description: 'मेहंदीपुर बालाजी चोला बुकिंग (Mehandipur Balaji Chola Booking) के लिए अपनी पसंद के अनुसार ऑनलाइन बुकिंग करें। हमारे पास सिल्वर और गोल्ड चोला के साथ-साथ पंचमेवा भोग के विकल्प भी उपलब्ध है।',
            color: 'bg-orange-700',
            link: `/services/${3}`,
        },
    ];

    return (
        <section className="relative py-2 px-2 md:px-8 lg:px-2 overflow-hidden">
            {/* Background Image - Improved for better responsiveness */}
            <div className="absolute inset-0 z-0">
                <div className="relative w-full h-full">
                    <Image
                        src='/images/bg.jpg'
                        alt="Lord Hanuman Background"
                        fill
                        priority
                        sizes="100vw"
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center'
                        }}
                        className="mix-blend-overlay opacity-100"
                    />
                </div>
            </div>

            <div className="container mx-auto relative z-1">
                {/* Section Heading - Improved spacing and responsive alignment */}
                <div className="mb-12 text-center md:text-left max-w-2xl mx-auto md:mx-0">
                    <h2 className="text-white text-xl font-medium mb-2">Our Services</h2>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">How We Can Help</h1>
                    <div className="w-24 h-1 bg-orange-500 mx-auto md:mx-0"></div>
                </div>

                {/* Services Cards - Improved responsive grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`${service.color} rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105 flex flex-col h-full`}
                        >
                            {/* Card Header */}
                            <div className="p-6 flex items-center space-x-4">
                                <div className="bg-orange-300 bg-opacity-20 p-3 rounded-full flex-shrink-0">
                                    <div className="relative w-8 h-8">
                                        <Image
                                            src={
                                                service.id === 'sawamani' ? '/images/booking.png' :
                                                    service.id === 'arji' ? '/images/laddu.png' :
                                                        '/images/towel.png'
                                            }
                                            alt={`${service.title} icon`}
                                            fill
                                            sizes="32px"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                </div>
                                <h3 className="text-xl text-white sm:text-2xl font-bold">{service.title}</h3>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 pt-0 flex-grow">
                                <p className="text-gray-100 mb-6 md:text-base leading-relaxed font-bold text-1xl">{service.description}</p>
                            </div>

                            {/* Card Footer */}
                            <div className="p-6 pt-2">
                                <Link href={service.link} className="inline-flex items-center justify-center w-full bg-black bg-opacity-30 hover:bg-opacity-50 text-white py-3 px-6 rounded-md font-medium transition duration-300 group">
                                    <span>Book Now</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Additional Information - Improved responsive layout */}
                <div className="mt-16 bg-gradient-to-r from-orange-500 to-red-800 rounded-lg p-6 sm:p-8 shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl text-white font-bold mb-2">Need Special Arrangements?</h3>
                            <p className="text-white text-opacity-90 max-w-xl font-bold">
                                Contact us for customized pooja services and special requirements
                            </p>
                        </div>
                        <a href={`tel:+91 8559833140`} className="bg-white text-red-800 hover:bg-gray-100 py-3 px-8 rounded-md font-medium transition duration-300 shadow-md whitespace-nowrap w-full md:w-auto text-center">
                            Contact Us
                        </a>
                    </div>
                </div>

                {/* Service Benefits - Improved grid responsiveness */}
                <div className="mt-16 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Benefit 1 */}
                    <div className="bg-gray-900 bg-opacity-60 rounded-lg p-6 flex flex-col items-center text-center h-full">
                        <div className="w-16 h-16 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Easy Booking</h4>
                        <p className="text-gray-300 text-sm font-bold">Simple online booking process that takes just a few minutes</p>
                    </div>

                    {/* Benefit 2 */}
                    <div className="bg-gray-900 bg-opacity-60 rounded-lg p-6 flex flex-col items-center text-center h-full">
                        <div className="w-16 h-16 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">100% Authentic</h4>
                        <p className="text-gray-300 text-sm font-bold">All rituals performed as per proper Vedic traditions</p>
                    </div>

                    {/* Benefit 3 */}
                    <div className="bg-gray-900 bg-opacity-60 rounded-lg p-6 flex flex-col items-center text-center h-full">
                        <div className="w-16 h-16 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Confirmation</h4>
                        <p className="text-gray-300 text-sm font-bold">Receive booking confirmation and photos of completed rituals</p>
                    </div>

                    {/* Benefit 4 */}
                    <div className="bg-gray-900 bg-opacity-60 rounded-lg p-6 flex flex-col items-center text-center h-full">
                        <div className="w-16 h-16 rounded-full bg-orange-500 bg-opacity-20 flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-2">Transparent Pricing</h4>
                        <p className="text-gray-300 text-sm font-bold">Clear pricing with no hidden charges for all services</p>
                    </div>
                </div>
            </div>


        </section >
    );
};

export default OurServices;

