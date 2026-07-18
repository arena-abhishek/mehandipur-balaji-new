"use client";

import { useEffect, useState } from "react";
import OrderList from "./OrderList";
import { getItemFromLocalStorage } from "@/utils/localStorage";

type OrderItem = {
    id: number;
    orderId: number;
    categoryId: string;
    productName: string;
    quantity: number;
    price: string;
    totalAmount: string;
    createdAt: string;
    updatedAt: string;
};

type Order = {
    id: number;
    userId: string;
    amount: string;
    discount: string;
    couponCode: string | null;
    status: string;
    paymentGateway: string;
    transactionId: string;
    referenceId: string;
    paymentStatus: string;
    paymentMethod: string | null;

    booking_date?: string | Date | null;
    delivery_date?: string | Date | null;
    paymentDate: string | null;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];

    name: string;
    email: string;
    phone: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    phone: string;
    order: Order[];
};

export default function ProfileInfo() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const email =
        getItemFromLocalStorage("email");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/user-order?email=${email}`);
                const data = await res.json();
                setUser(data.user);
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-center py-10 text-gray-600">Loading...</div>;
    }

    if (!user) {
        return <div className="text-center py-10 text-red-500">You need to login to access the orders.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4">
            <div className="mb-6 p-4 border rounded-lg bg-white shadow">
                <h2 className="text-lg font-semibold mb-2">User Information</h2>
                <p><strong>Name:</strong> {user.name || ""}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
            </div>

            <div className="mt-8">
                <OrderList orders={user.order} />
            </div>
        </div>
    );
}
