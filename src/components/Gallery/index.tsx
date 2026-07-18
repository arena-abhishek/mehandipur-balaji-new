// "use client"

// import { useState } from 'react';
// import Image from 'next/image';

// // Define TypeScript interfaces
// interface GalleryImage {
//     id: number;
//     src: string;
//     alt: string;
//     width: number;
//     height: number;
//     category?: string; // Optional category for filtering
// }

// const Gallery: React.FC = () => {
//     // Sample gallery images - replace with your actual images
//     const galleryImages: GalleryImage[] = [
//         {
//             id: 1,
//             src: '/images/gallery/image2.jpeg',
//             alt: "Gallery Image 1",
//             width: 600,
//             height: 400,
//             category: "category1"
//         },
//         {
//             id: 2,
//             src: '/images/gallery/image3.jpeg',
//             alt: "Gallery Image 2",
//             width: 600,
//             height: 400,
//             category: "category2"
//         },
//         {
//             id: 3,
//             src: '/images/gallery/image4.jpeg',
//             alt: "Gallery Image 3",
//             width: 600,
//             height: 400,
//             category: "category1"
//         },
//         {
//             id: 4,
//             src: '/images/gallery/image5.jpeg',
//             alt: "Gallery Image 4",
//             width: 600,
//             height: 400,
//             category: "category3"
//         },
//         {
//             id: 5,
//             src: '/images/gallery/image1.avif',
//             alt: "Gallery Image 5",
//             width: 600,
//             height: 400,
//             category: "category2"
//         },
//         {
//             id: 6,
//             src: '/images/gallery/image6.webp',
//             alt: "Gallery Image 6",
//             width: 600,
//             height: 400,
//             category: "category1"
//         },
//         {
//             id: 7,
//             src: '/images/gallery/image3.jpeg',
//             alt: "Gallery Image 7",
//             width: 600,
//             height: 400,
//             category: "category3"
//         },
//         {
//             id: 8,
//             src: '/images/gallery/image5.jpeg',
//             alt: "Gallery Image 8",
//             width: 600,
//             height: 400,
//             category: "category2"
//         }, {
//             id: 9,
//             src: '/images/gallery/image2.jpeg',
//             alt: "Gallery Image 1",
//             width: 600,
//             height: 400,
//             category: "category1"
//         },
//         {
//             id: 10,
//             src: '/images/gallery/image3.jpeg',
//             alt: "Gallery Image 2",
//             width: 600,
//             height: 400,
//             category: "category2"
//         },
//         {
//             id: 11,
//             src: '/images/gallery/image4.jpeg',
//             alt: "Gallery Image 3",
//             width: 600,
//             height: 400,
//             category: "category1"
//         },
//         {
//             id: 12,
//             src: '/images/gallery/image5.jpeg',
//             alt: "Gallery Image 4",
//             width: 600,
//             height: 400,
//             category: "category3"
//         },
//         {
//             id: 13,
//             src: '/images/gallery/image1.avif',
//             alt: "Gallery Image 5",
//             width: 600,
//             height: 400,
//             category: "category2"
//         },
//         {
//             id: 14,
//             src: '/images/gallery/image6.webp',
//             alt: "Gallery Image 6",
//             width: 600,
//             height: 400,
//             category: "category1"
//         },
//         {
//             id: 15,
//             src: '/images/gallery/image3.jpeg',
//             alt: "Gallery Image 7",
//             width: 600,
//             height: 400,
//             category: "category3"
//         },
//         {
//             id: 16,
//             src: '/images/gallery/image5.jpeg',
//             alt: "Gallery Image 8",
//             width: 600,
//             height: 400,
//             category: "category2"
//         },
//     ];

//     const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
//     const [activeCategory, setActiveCategory] = useState<string | null>(null);

//     // Function to open the modal with the selected image
//     const openModal = (image: GalleryImage): void => {
//         setSelectedImage(image);
//     };

//     // Function to close the modal
//     const closeModal = (): void => {
//         setSelectedImage(null);
//     };

//     // Function to filter images by category
//     const filterByCategory = (category: string | null): void => {
//         setActiveCategory(category);
//     };

//     // Filter images based on active category
//     const filteredImages = activeCategory
//         ? galleryImages.filter(image => image.category === activeCategory)
//         : galleryImages;

//     return (
//         <section className="py-12 bg-gray-50">
//             <div className="container mx-auto px-4">
//                 {/* Gallery Header */}
//                 <div className="text-center mb-10">
//                     <p className="text-gray-600 max-w-xl mx-auto">
//                         Explore our collection of beautiful images showcasing our work and achievements.
//                     </p>
//                 </div>



//                 {/* Gallery Grid */}
//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//                     {filteredImages.map((image) => (
//                         <div
//                             key={image.id}
//                             className="relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
//                             onClick={() => openModal(image)}
//                         >
//                             <div className="relative h-64 w-full">
//                                 <Image
//                                     src={image.src}
//                                     alt={image.alt}
//                                     fill
//                                     sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
//                                     className="object-cover transition-opacity duration-300 hover:opacity-90"
//                                 />
//                             </div>
//                             <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
//                                 <div className="text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                     </svg>
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//             </div>

//             {/* Lightbox Modal */}
//             {/* {selectedImage && (
//                 <div
//                     className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
//                     onClick={closeModal}
//                 >
//                     <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
//                         <button
//                             className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
//                             onClick={closeModal}
//                             aria-label="Close"
//                         >
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                             </svg>
//                         </button>
//                         <div className="relative h-full">
//                             <Image
//                                 src={selectedImage.src}
//                                 alt={selectedImage.alt}
//                                 width={selectedImage.width}
//                                 height={selectedImage.height}
//                                 className="rounded-lg"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )} */}
//         </section>
//     );
// };

// export default Gallery;
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Define TypeScript interfaces
interface GalleryImage {
    id: number;
    src: string;
    alt: string;
    width: number;
    height: number;
    category?: string;
}

interface GalleryProps {
    maxImages?: number; // Optional prop to limit images
}

const Gallery: React.FC<GalleryProps> = ({ maxImages }) => {
    const router = useRouter();

    // Sample gallery images - replace with actual images
    const galleryImages: GalleryImage[] = [
        { id: 11, src: "/images/gallery/imagenew4.jpg", alt: "मेहंदीपुर बालाजी - राजस्थान का पवित्र मंदिर | Mehandipur Balaji Mandir - Rajasthan Ka Pavitra Mandir", width: 600, height: 400, category: "category11" },

        { id: 10, src: "/images/gallery/imagenew3.jpg", alt: "Mehandipur Balaji | Mehandipur Balaji Tour Plan | Mehandipur Balaji Mandir | Balaji Mandir Rajasthan", width: 600, height: 400, category: "category8" },

        { id: 9, src: "/images/gallery/imagenew2.jpg", alt: "मेहंदीपुर बालाजी धाम (सवामणी, अर्जी, और चोला बुकिंग), Mehandipur Balaji, Sawamani Online Booking at Mehandipur Balaji", width: 600, height: 400, category: "category9" },

        { id: 8, src: "/images/gallery/imagenew1.jpg", alt: "mahandipurbalaji, Mehandipur Balaji, Sawamani Online Booking at Mehandipur Balaji", width: 600, height: 400, category: "category8" },
        { id: 1, src: "/images/gallery/image22.jpeg", alt: "Shiv Misthan Bhandar 1", width: 600, height: 400, category: "category1" },
        { id: 2, src: "/images/gallery/image33.jpeg", alt: "Shiv Misthan Bhandar 2", width: 600, height: 400, category: "category2" },
        { id: 3, src: "/images/gallery/image44.jpeg", alt: "Shiv Misthan Bhandar 3", width: 600, height: 400, category: "category1" },
        { id: 4, src: "/images/gallery/image55.jpeg", alt: "Shiv Misthan Bhandar 4", width: 600, height: 400, category: "category3" },
        { id: 5, src: "/images/gallery/image11.jpeg", alt: "Shiv Misthan Bhandar 5", width: 600, height: 400, category: "category3" },
        { id: 6, src: "/images/gallery/images66.jpeg", alt: "Shiv Misthan Bhandar 6", width: 600, height: 400, category: "category3" },
        { id: 7, src: "/images/gallery/images77.jpeg", alt: "Shiv Misthan Bhandar 7", width: 600, height: 400, category: "category3" },

    ];


    const latestImages = galleryImages.filter(
        (img) => img.id >= 8 && img.id <= 11
    );

    // Apply limit if maxImages is provided
    const displayedImages = maxImages ? latestImages.slice(0, maxImages) : galleryImages;

    return (
        <section className="py-5  dark:bg-dark-2 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Gallery Header */}
                <div className="text-center mb-10">
                    {maxImages && <p className="text-dark mb-4 text-3xl font-bold text-orange-500 dark:text-orange-500 sm:text-4xl md:text-[40px] md:leading-[1.2]">
                        ।। जय सीताराम जी ।।

                    </p>}
                    <p className="text-gray-600 max-w-xl mx-auto text-orange-500">
                        ।। जय श्री मेहंदीपुर बालाजी ।।
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayedImages.map((image) => (
                        <div key={image.id} className="relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105">
                            <div className="relative h-64 w-full">
                                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    className="object-cover transition-opacity duration-300 hover:opacity-90" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* View More Button */}
                {maxImages && galleryImages.length > maxImages && (
                    <div className="text-center mt-6">
                        <button
                            className="px-10 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                            onClick={() => router.push("/gallery")}
                        >
                            View More
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Gallery;
