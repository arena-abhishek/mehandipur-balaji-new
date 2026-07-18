'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import AuthModal from "../AuthModal/authModal";
import { useAuth } from "@/ContextApi/AuthContext";
interface ServiceItem {
    id: number;
    name: string;
    quantity: string;
    price: number;
    selected?: boolean;
}

const BookingDetails: React.FC = () => {
    // Sample services data
    const services: ServiceItem[] = [
        { id: 1, name: 'Laddupuri', quantity: '51 Kgs', price: 8100 },
        { id: 2, name: 'Halwapuri', quantity: '51 Kg', price: 7100 },
        { id: 3, name: 'Kheerpuri', quantity: '51 Kg', price: 6100 },
        { id: 4, name: 'Churma', quantity: '51 Kg', price: 8400 },
    ];
    const { isAuthenticated, isLoading } = useAuth();

    const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);






    // Handle service selection
    const toggleService = (id: number): void => {
        const updatedServices = [...selectedServices];
        const serviceIndex = updatedServices.findIndex(s => s.id === id);

        if (serviceIndex >= 0) {
            updatedServices.splice(serviceIndex, 1);
        } else {
            const service = services.find(s => s.id === id);
            if (service) {
                updatedServices.push(service);
            }
        }

        setSelectedServices(updatedServices);
    };

    // Calculate total amount when selected services change
    useEffect(() => {
        const sum = selectedServices.reduce((total, service) => total + service.price, 0);
        setTotalAmount(sum);
    }, [selectedServices]);


    ;
    const handelBooking = (e: React.FormEvent): void => {

        if (!isAuthenticated) {
            setIsAuthModalOpen(true)
        } else {
            window.alert('Booking succesfully')
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header - Horizontal Design */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-xl shadow-lg p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-6 md:mb-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">SAWAMANI BOOKING</h1>
                            <p className="text-white text-sm md:text-base">
                                A devotee offers Sawamani Prasad to God if their wishes are accepted. Choose from pure desi ghee made halwa, puri sabzi, or laddu.
                            </p>
                        </div>
                        <div className="md:w-1/3 relative h-40 w-full rounded-lg overflow-hidden">
                            <Image
                                src="/prasad-image.jpg"
                                alt="Sawamani Prasad"
                                className="rounded-lg shadow-md"
                                fill
                                style={{ objectFit: 'cover' }}


                            />
                        </div>
                    </div>
                </div>

                {/* Main Content - Horizontal Cards */}
                <div className="bg-white rounded-b-xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-orange-600 mb-6 border-b pb-2">
                        Select Your Offerings
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {services.map((service) => (
                            <div
                                key={service.id}
                                className={`relative p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedServices.some(s => s.id === service.id)
                                    ? 'border-orange-500 bg-orange-50 shadow-md'
                                    : 'border-gray-200 hover:border-orange-300 hover:shadow'
                                    }`}
                                onClick={() => toggleService(service.id)}
                            >
                                <div className="absolute top-3 right-3">
                                    <input
                                        type="checkbox"
                                        id={`service-${service.id}`}
                                        checked={selectedServices.some(s => s.id === service.id)}
                                        onChange={() => { }}
                                        className="h-5 w-5 text-orange-500 border-orange-300 rounded focus:ring-orange-500"
                                    />
                                </div>

                                <div className="pt-2">
                                    <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                                    <p className="text-gray-600 text-sm">{service.quantity}</p>
                                    <p className="text-orange-600 font-bold text-lg mt-2">₹ {service.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary - Horizontal Layout */}
                    <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6">
                        <div className="mb-4 md:mb-0">
                            <span className="text-gray-600">Selected Items: {selectedServices.length}</span>
                            <div className="flex flex-wrap mt-2">
                                {selectedServices.map((service, index) => (
                                    <span key={service.id} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                                        {service.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="flex items-baseline mb-4">
                                <span className="text-lg text-gray-600 mr-2">Total Amount:</span>
                                <span className="text-3xl font-bold text-orange-600">₹ {totalAmount.toLocaleString()}</span>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    className="flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 shadow-sm transition-colors"
                                    type="button"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                    </svg>
                                    CALL NOW
                                </button>

                                <button
                                    onClick={handelBooking}
                                    disabled={selectedServices.length === 0}
                                    className={`inline-flex items-center justify-center px-8 py-2 border border-transparent text-base font-medium rounded-lg text-white shadow-sm transition-colors ${selectedServices.length > 0
                                        ? 'bg-orange-500 hover:bg-orange-600 cursor-pointer'
                                        : 'bg-gray-400 cursor-not-allowed'
                                        }`}
                                >
                                    BOOK NOW
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600 text-sm">
                        The Mehandipur Sawamani booking can be made inside the temple. We offer you the best quality services.
                    </p>
                    <h2 className="text-xl font-bold text-orange-600 mt-2">
                        Shree Shyam Misthan Bhandar
                    </h2>
                </div>
            </div>
            {/* <AuthModal
                mt={1}
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            /> */}
        </div>
    );
};

export default BookingDetails;
