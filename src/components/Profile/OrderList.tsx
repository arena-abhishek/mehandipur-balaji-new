type OrderItem = {
    id: number;
    productName: string;
    quantity: number;
    totalAmount: string;
};

type Order = {
    id: number;
    amount: string;
    status: string;
    paymentStatus: string;
    orderItems: OrderItem[];
    booking_date?: string | Date | null;
    delivery_date?: string | Date | null;
    name: string;
    email: string;
    phone: string;
};

export default function OrderList({ orders }: { orders: Order[] }) {
    if (!orders || orders.length === 0) {
        return <p className="text-gray-500">No orders found.</p>;
    }
    function formatDate(date: string | Date | null | undefined) {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    }

    return (
        <div className="p-4 border rounded-lg bg-white shadow">
            <h2 className="text-lg font-semibold mb-4">Order History</h2>
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-2">Order ID</th>
                            {/* <th className="px-4 py-2">Customer Name</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Phone</th> */}
                            <th className="px-4 py-2">Amount</th>
                            <th className="px-4 py-2">Payment Status</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2">Booking Date</th>
                            <th className="px-4 py-2">Delivery Date</th>
                            <th className="px-4 py-2">Items</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.toReversed().map((order) => (
                            <tr key={order.id} className="border-t">
                                <td className="px-4 py-2">{order.id}</td>
                                {/* <td className="px-4 py-2">{order.name}</td>
                                <td className="px-4 py-2">{order.email}</td>
                                <td className="px-4 py-2">{order.phone}</td> */}
                                <td className="px-4 py-2">₹{order.amount}</td>
                                <td className="px-4 py-2 capitalize">{order.paymentStatus}</td>
                                <td className="px-4 py-2 capitalize">{order.status}</td>
                                <td className="px-4 py-2">{formatDate(order.booking_date)}</td>
                                <td className="px-4 py-2">{formatDate(order.delivery_date)}</td>
                                <td className="px-4 py-2 space-y-1">
                                    {order.orderItems.map((item) => (
                                        <div key={item.id} className="text-sm">
                                            <span className="font-medium">{item.productName}</span> × {item.quantity} – ₹{item.totalAmount}
                                        </div>
                                    ))}
                                </td>
                            </tr>
                        ))}
                    </tbody>


                </table>
            </div>
        </div>
    );
}
