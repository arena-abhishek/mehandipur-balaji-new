'use client';

import React, { useEffect, useState } from 'react';
import AuthService, { RegisterData, LoginData } from '@/ApiServices/AuthService';
import { setItemInLocalStorage } from '@/utils/localStorage';
import { useAuth } from '@/ContextApi/AuthContext';
import { toast } from "react-hot-toast";
import { useSnackbar } from '@/ContextApi/SnackBarContext';
import axios from 'axios';



// Mock localStorage getter

const getItem = (key: string) => localStorage.getItem(key) || '';

type BookingData = {
    bookingDate: string;
    deliveryDate: string;
    phone: string;
    receiptName: string;
    email: string;
    country: string;
    state: string;
    city: string;
    password: string;
};

type ValidationError = {
    field: keyof BookingData;
    message: string;
};

const indianStates: { [key: string]: string[] } = {
    "Delhi": ["New Delhi", "Dwarka", "Rohini", "Karol Bagh", "Vasant Kunj"],
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Meerut", "Gorakhpur", "Bareilly"],
    "Rajasthan": [
        "Ajmer", "Alwar", "Balotra", "Banswara", "Baran", "Barmer", "Beawar", "Bharatpur",
        "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Deeg", "Dholpur",
        "Didwana Kuchaman", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore",
        "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Khairthal-Tijara", "Kota",
        "Kotputli-Behror", "Nagaur", "Pali", "Phalodi", "Pratapgarh", "Rajsamand", "Salumbar",
        "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"
    ],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Erode"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kollam", "Kottayam", "Malappuram", "Calicut", "Thrissur"],
    "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Bellary", "Davanagere", "Tumkur"],
    "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Howrah", "Asansol", "Murshidabad", "Hooghly"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Anand"],
    "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Munger", "Darbhanga", "Purnia"],
    "Haryana": ["Chandigarh", "Faridabad", "Gurgaon", "Ambala", "Hisar", "Karnal", "Sonipat"],
    "Andhra Pradesh": ["Hyderabad", "Visakhapatnam", "Vijayawada", "Nellore", "Tirupati", "Kakinada"],
    "Punjab": ["Amritsar", "Chandigarh", "Ludhiana", "Jalandhar", "Patiala", "Bathinda"],
    "Uttarakhand": ["Dehradun", "Haridwar", "Nainital", "Rudrapur", "Haldwani", "Roorkee"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Rewa"],
    "Chhattisgarh": ["Raipur", "Bilaspur", "Durg", "Korba", "Rajnandgaon", "Raigarh"],
    "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Balasore"],
    "Andaman and Nicobar Islands": ["Port Blair", "Car Nicobar", "Little Andaman"],
    "Lakshadweep": ["Kavaratti", "Minicoy", "Amini"],
    "Goa": ["Panaji", "Margao", "Mapusa", "Vasco da Gama"],
    "Telangana": ["Hyderabad", "Warangal", "Khammam", "Nizamabad", "Karimnagar", "Rangareddy"],
    "Himachal Pradesh": ["Shimla", "Dharamsala", "Kullu", "Manali", "Solan", "Mandi", "Hamirpur"],
    "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Hazaribagh", "Giridih", "Bokaro"],
    "Sikkim": ["Gangtok", "Namchi", "Mangan", "Jorethang"],
    "Meghalaya": ["Shillong", "Tura", "Nongpoh", "Jowai"],
    "Nagaland": ["Kohima", "Dimapur", "Mokokchung", "Tuensang", "Wokha"],
    "Tripura": ["Agartala", "Udaipur", "Dharmanagar", "Belonia"],
    "Manipur": ["Imphal", "Churachandpur", "Thoubal", "Bishnupur"],
    "Mizoram": ["Aizawl", "Lunglei", "Champhai", "Kolasib"],
    "Arunachal Pradesh": ["Itanagar", "Tawang", "Ziro", "Naharlagun"],
    "Assam": ["Guwahati", "Dibrugarh", "Jorhat", "Silchar", "Tezpur"],
};

interface ServiceItem {
    id: number;
    name: string;
    quantity: string;
    price: number;
    selected?: boolean;
}

interface bookingProps {

    id: any,

}

export const BookingForm: React.FC<bookingProps> = ({ id }) => {
    const [formData, setFormData] = useState<BookingData>({
        bookingDate: new Date().toISOString().split('T')[0],
        deliveryDate: '',
        phone: '',
        receiptName: '',
        email: '',
        country: 'India',
        state: '',
        city: '',
        password: ''
    });

    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableCities, setAvailableCities] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // Load from localStorage
    useEffect(() => {
        let storedEmail = getItem('email');

        // Try to parse if it's in quotes (JSON stringified)
        try {
            if (storedEmail?.startsWith('"') && storedEmail?.endsWith('"')) {
                storedEmail = JSON.parse(storedEmail);
            }
        } catch (err) {
            console.warn('Invalid email format in storage:', storedEmail);
        }

        setFormData(prev => ({
            ...prev,
            email: storedEmail || '',
        }));
        fetchUserData(storedEmail);
    }, []);



    const fetchUserData = async (email: string) => {
        try {
            // Construct the API URL
            const url = `/api/user-order?email=${email}&ordershow=false`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            setFormData(prev => ({
                ...prev,
                phone: data.user.phone ?? "",
                receiptName: data.user.name,  // Assuming 'user' contains the user data
            }));

            setIsLoading(false);
        } catch (error) {
            // setError(error);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        // Update cities when state changes
        if (name === 'state') {
            setAvailableCities(indianStates[value] || []);
            setFormData(prev => ({ ...prev, city: '' }));
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear specific error
        setErrors((prev) => prev.filter((err) => err.field !== name));
    };

    const validateForm = (): ValidationError[] => {
        const errors: ValidationError[] = [];

        if (!formData.bookingDate) {
            errors.push({ field: 'bookingDate', message: 'Booking date is required.' });
        }

        if (!formData.deliveryDate) {
            errors.push({ field: 'deliveryDate', message: 'Delivery date is required.' });
        }

        if (!formData.phone.trim()) {
            errors.push({ field: 'phone', message: 'Phone number is required.' });
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            errors.push({ field: 'phone', message: 'Phone number must be 10 digits.' });
        }

        if (!formData.receiptName.trim()) {
            errors.push({ field: 'receiptName', message: 'Receipt name is required.' });
        } else if (formData.receiptName.length > 30) {
            errors.push({ field: 'receiptName', message: 'Name must be under 30 characters.' });
        }

        if (!formData.email.trim()) {
            errors.push({ field: 'email', message: 'Email is required.' });
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.push({ field: 'email', message: 'Invalid email address.' });
        }

        if (!formData.state.trim()) {
            errors.push({ field: 'state', message: 'State is required.' });
        }

        if (!formData.city.trim()) {
            errors.push({ field: 'city', message: 'City is required.' });
        }

        if (!formData.password.trim()) {
            errors.push({ field: 'password', message: 'Password is required.' });
        } else if (formData.password.length < 6) {
            errors.push({ field: 'password', message: 'Password must be at least 6 characters.' });
        }

        return errors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            toast.error(validationErrors[0].message);
            return;
        }

        setIsSubmitting(true);

        try {
            const orderPayload = {
                orderId: id.id,
                name: formData.receiptName,
                phone: formData.phone,
                delivery_date: new Date(formData.deliveryDate).toISOString(),
                booking_date: new Date(formData.bookingDate).toISOString(),
                state: formData.state,
                city: formData.city,
                country: formData.country,
                email: formData.email,
                password: formData.password, // ✅ Corrected: Password should be sent like this
                paymentGateway: "Phonepe",
                status: "pending",
                paymentStatus: "initiated",
                paymentDate: new Date().toISOString()
            };

            const response = await axios.put(
                `/api/orders`,
                orderPayload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.status === 200 && response.data.paymentURL) {
                setIsSubmitting(false);
                setItemInLocalStorage('email', formData.email);

                login(response.data.token);
                // ✅ Redirect to PhonePe payment page
                window.location.href = response.data.paymentURL;
            } else {
                setIsSubmitting(false);
                alert('Failed to create order. Please try again.');
            }
        } catch (err: any) {
            console.error("Booking Error:", err);
            toast.error('Failed to submit booking.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const login = (token: string) => {
        localStorage.setItem("accessToken", token);
        // setIsAuthenticated(true);

        // Sync authentication across tabs
        window.dispatchEvent(new Event('storage'));
    };
    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow mt-10">
            <h1 className="text-2xl font-bold mb-4 text-orange-600">Booking Page</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Booking + Delivery Date */}
                <div className="flex flex-col gap-3 md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Booking Date / बुकिंग तिथि *</label>
                        <input
                            type="date"
                            name="bookingDate"
                            value={formData.bookingDate}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-1.5 border rounded-md text-sm"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Delivery Date / वितरण तिथि *</label>
                        <input
                            type="date"
                            name="deliveryDate"
                            value={formData.deliveryDate}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-1.5 border rounded-md text-sm"
                        />
                    </div>
                </div>

                {/* Phone + Email */}
                <div className="flex flex-col gap-3 md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Mobile No. / फ़ोन नंबर *</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-1.5 border rounded-md text-sm"
                            placeholder="Enter Mobile No."
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Email / ईमेल आईडी *</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-1.5 border rounded-md text-sm"
                            placeholder="Enter Email"
                        />
                    </div>
                </div>

                {/* Receipt Name + Country */}
                <div className="flex flex-col gap-3 md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Name on Receipt / रसीद पर नाम *</label>
                        <input
                            type="text"
                            name="receiptName"
                            value={formData.receiptName}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-1.5 border rounded-md text-sm"
                            placeholder="Enter Party Name"
                        // maxLength={30}
                        />

                    </div>

                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">Country / देश</label>
                        <input
                            type="text"
                            name="country"
                            value="India"
                            readOnly
                            className="mt-1 w-full px-3 py-1.5 border rounded-md text-sm bg-gray-100"
                        />
                    </div>
                </div>

                {/* State + City */}
                <div className="flex flex-col gap-3 md:flex-row md:space-x-4">
                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">State / राज्य *</label>
                        <select
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-1.5 border rounded-md text-sm"
                        >
                            <option value="">Select State</option>
                            {Object.keys(indianStates).map((state) => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700">City / शहर *</label>
                        <select
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-1.5 border rounded-md text-sm"
                            disabled={!formData.state}
                        >
                            <option value="">Select City</option>
                            {availableCities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-3 md:flex-row md:space-x-4">
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700">
                            Password / पासवर्ड *
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-1.5 border rounded-md text-sm"
                            placeholder="Enter a secure password"
                        />
                        {/* ✅ Info text below password field */}
                        <p className="mt-1 text-xs text-gray-500">
                            This password will be used to log in to your account for future bookings.
                        </p>
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 mt-4 bg-orange-600 text-white font-semibold rounded-md hover:bg-orange-700 disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Booking'}
                </button>
            </form>
        </div>

    );
};
