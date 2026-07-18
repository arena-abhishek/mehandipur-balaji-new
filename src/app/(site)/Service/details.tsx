'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AuthModal from '@/components/AuthModal/authModal';
import { useAuth } from '@/ContextApi/AuthContext';


import axios from 'axios';
import { getItemFromLocalStorage } from '@/utils/localStorage';
import { useSearchParams } from 'next/dist/client/components/navigation';

// Define TypeScript interfaces
interface ServiceItem {
  id: number;
  name: string;
  quantity: string;
  price: number;
  selected?: boolean;
}

type PopupType = 'none' | 'register' | 'login' | 'otp' | 'booking';

const BookingDetails: React.FC<{ bookingData: any }> = ({ bookingData }) => {



  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [isOpenBooking, setIsOpenBooking] = useState(false);


  const [isSubmitting, setIsSubmitting] = useState(false);


  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [popupType, setPopupType] = useState<PopupType>('none');
  const rawPop = searchParams?.get('pop');
  const popParam = searchParams?.get('pop') ?? 'none'; // 'none' is a fallback if param is missing


  useEffect(() => {
    if (popParam !== 'none') {
      setPopupType(popParam as PopupType);

      if (popParam === 'booking') {
        // If no services are selected, clean the URL and do not show modal
        if (selectedServices.length === 0) {
          const params = new URLSearchParams(window.location.search);
          params.delete('pop');

          router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
          return;
        }

        // Otherwise, open modal in booking mode
        setIsAuthModalOpen(true);
        setIsOpenBooking(true);
      }
    }
  }, [popParam, selectedServices]);


  // ✅ Handle service selection
  const toggleService = (id: number): void => {
    const updatedServices = [...selectedServices];
    const serviceIndex = updatedServices.findIndex(s => s.id === id);

    if (serviceIndex >= 0) {
      updatedServices.splice(serviceIndex, 1);
    } else {
      const service = bookingData.category.find((s: any) => s.id === id);
      if (service) {
        updatedServices.push({
          id: service.id,
          name: service.name,
          quantity: '1', // Adjust quantity as per requirement
          price: service.price
        });
      }
    }

    setSelectedServices(updatedServices);
  };

  // ✅ Calculate total amount
  useEffect(() => {
    const sum = selectedServices.reduce((total, service) => total + service.price, 0);
    setTotalAmount(sum);
  }, [selectedServices]);

  // ✅ Handle booking and call Instamojo API
  // const handleBooking = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!isAuthenticated) {
  //     setIsAuthModalOpen(true);

  //     return;
  //   }





  //   if (selectedServices.length === 0) {
  //     alert('Please select at least one service.');
  //     return;
  //   }
  //   if (isAuthenticated) {
  //     // setIsAuthModalOpen(true);
  //     // setIsOpenBooking(true);

  //     setIsAuthModalOpen(false);
  //     setIsOpenBooking(false);
  //     setPopupType('booking'); // Optional, if you're using it in UI

  //     // Update the URL to include `pop=booking`
  //     const params = new URLSearchParams(window.location.search);
  //     params.set('pop', 'booking');

  //     router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  //     return
  //   }

  // const userEmail = getItemFromLocalStorage('email');
  // setIsSubmitting(true);
  // try {
  //   const orderPayload = {
  //     email: userEmail,  // Replace with the current user email dynamically
  //     items: selectedServices.map(service => ({
  //       categoryId: service.id.toString(),
  //       productName: service.name,
  //       quantity: 1,                          // Set to 1 or use service.quantity
  //       price: service.price
  //     })),
  //     paymentGateway: "Phonepe",
  //     status: "pending",
  //     paymentStatus: "initiated",
  //     paymentDate: new Date().toISOString()
  //   };

  //   const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, orderPayload, {
  //     headers: { 'Content-Type': 'application/json' }
  //   });

  //   if (response.status === 201 && response.data.paymentURL) {
  //     setIsSubmitting(false);

  //     // ✅ Redirect user to Instamojo payment gateway
  //     window.location.href = response.data.paymentURL;
  //   } else {
  //     setIsSubmitting(false);
  //     alert('Failed to create order. Please try again.');
  //   }

  // } catch (error) {
  //   setIsSubmitting(false);
  //   console.error('Error during booking:', error);
  //   alert('Failed to create booking. Please try again.');
  // }
  // };

  const handleBooking = async (e: React.FormEvent) => {


    if (selectedServices.length === 0) {
      alert('Please select at least one service.');
      return;
    }




    // 🚀 Now call the API here
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: selectedServices.map(service => ({
            productName: service.name,
            categoryId: service.id,
            quantity: 1,
            price: service.price,
          })),
          // if you want to pass a dummy email for now:


        }),
      });

      const data = await response.json();

      if (response.ok) {
        // console.log('Order created successfully:', data);
        router.push(`/booking-form/${data.orderId}`, { scroll: false });


      } else {
        console.error('Failed to create order:', data);
        alert(`Failed to create order: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order.');
    }

  };


  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-25">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-t-xl shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">

            {/* Content Section */}
            <div className="md:w-1/2 w-full mb-6 md:mb-0">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {bookingData.name}
              </h1>
              <div className="text-white text-sm md:text-base">
                <div dangerouslySetInnerHTML={{ __html: bookingData.content }} />
              </div>
            </div>

            {/* Responsive Image Section */}
            <div className="w-full md:w-1/4 h-[200px] md:h-[250px] relative rounded-lg overflow-hidden">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/api${bookingData.coverImage}`}

                // src={`${process.env.NEXT_PUBLIC_API_URL}/${bookingData.coverImage}`}
                alt={bookingData.name}
                className="w-full h-full object-cover rounded-lg shadow-md"
              />
            </div>

          </div>
        </div>


        {/* Main Content Section */}
        <div className="bg-white rounded-b-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-orange-600 mb-6 border-b pb-2">Select Your Offerings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {bookingData.category.map((service: any) => (
              <div
                key={service.id}
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 
                  ${selectedServices.some(s => s.id === service.id)
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-200 hover:border-orange-300 hover:shadow'}`}
                onClick={() => toggleService(service.id)}
              >
                <div className="flex-shrink-0">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/api${service.image}`}

                    // src={service.image}
                    alt={service.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-orange-300"
                  />
                </div>

                <div className="ml-4 flex-grow">
                  <h3 className="font-bold text-lg text-gray-800">{service.name}</h3>
                  <h5 className="font-bold text-sm text-gray-500 pt-2">Weight: {service.weight} {service.weightType}</h5>
                  <p className="text-orange-600 font-bold text-lg mt-2">₹ {service.price.toLocaleString()}</p>
                </div>

                <div className="ml-auto">
                  <input
                    type="checkbox"
                    id={`service-${service.id}`}
                    checked={selectedServices.some(s => s.id === service.id)}
                    onChange={() => { }}
                    className="h-5 w-5 text-orange-500 border-orange-300 rounded focus:ring-orange-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="flex justify-between items-center border-t border-gray-200 pt-6">
            <div>
              <span className="text-gray-600">Selected Items: {selectedServices.length}</span>
              <div className="flex flex-wrap mt-2">
                {selectedServices.map((service) => (
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

              {/* <div className="flex space-x-4">
             
              </div> */}

              <div className="flex space-x-4">
                <a href="tel:+91 8559833140">
                  <button
                    className="flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-lg text-white bg-green-500 hover:bg-green-600 shadow-sm transition-colors"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    CALL NOW
                  </button>
                </a>
                <button
                  onClick={handleBooking}
                  disabled={isSubmitting || selectedServices.length === 0}
                  className={`inline-flex items-center justify-center px-8 py-2 border text-base font-medium rounded-lg text-white shadow-sm transition-colors
                    ${selectedServices.length > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                  {isSubmitting ? "Booking..." : "Book Now"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <AuthModal
          mt={70}
          items={selectedServices}
          isOpenBooking={isOpenBooking}
          isOpen={isAuthModalOpen}
          onClose={() => {
            // setIsAuthModalOpen(false);
            // setIsOpenBooking(false);
            // setPopupType('');

            setIsAuthModalOpen(false);
            setIsOpenBooking(false);
            setPopupType('booking'); // Optional, if you're using it in UI

            // Update the URL to include `pop=booking`
            const params = new URLSearchParams(window.location.search);
            params.set('pop', 'booking');

            router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });

          }}
        />
      </div>
    </div>
  );
};

export default BookingDetails;
