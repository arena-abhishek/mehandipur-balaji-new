"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CheckCircle, XCircle, LoaderCircle } from "lucide-react";

const PaymentSuccess = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [error, setError] = useState("");
  const calledOnce = useRef(false); // ✅ This flag prevents duplicate calls

  useEffect(() => {
    if (calledOnce.current) return; // ✅ Don't run again
    calledOnce.current = true;      // ✅ Mark as called
    const query = new URLSearchParams(window.location.search);
    // const status = query.get("payment_status");
    const id = query.get("payment_id");
    // const requestId = query.get("payment_request_id");

    if (id) {

      setPaymentId(id);


      // ✅ Verify and update the order status
      verifyAndUpdateOrder(id);
    } else {
      setError("Invalid payment details.");
      setLoading(false);
    }
  }, []);

  // ✅ Function to verify and update order status
  const verifyAndUpdateOrder = async (paymentId: any) => {
    try {
      // // Step 1: Verify Payment
      // const verifyPayload = {
      //   payment_id: paymentId,
      //   payment_request_id: requestId,
      //   status: status,
      // };

      // const verifyResponse = await axios.post(
      //   `/api/verify-payment`,
      //   verifyPayload
      // );

      // if (verifyResponse.data.success) {
      // ✅ Step 2: Update Order Status using PATCH request
      const patchPayload = {
        // Reference ID from payment request
        transactionId: paymentId,       // Payment ID from Instamojo

      };

      const patchResponse = await axios.patch(
        `/api/orders`,
        patchPayload
      );

      // console.log("payment status is ", )
      if (patchResponse.status === 200) {
        setPaymentStatus(patchResponse.data.paymentStatus)

        setLoading(false);
      } else {
        setError("Failed to update order status.");
      }
      // } else {
      //   setError("Payment verification failed.");
      //   setLoading(false);
      // }
    } catch (error) {
      console.error("Error verifying or updating order:", error);
      setError("Failed to verify and update payment.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="w-16 h-16 text-blue-500 animate-spin" />
          <p className="text-lg font-semibold text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-10 max-w-lg w-full border-t-4 border-orange-500">
        <div className="text-center">
          {error ? (
            <>
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-red-600">Payment Failed</h1>
              <p className="text-gray-600 mt-2">{error}</p>
            </>
          ) : paymentStatus === "success" ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-green-600">Payment Successful</h1>
              <p className="text-gray-600 mt-2">Thank you for your payment!</p>
            </>
          ) : (
            <>
              <XCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-yellow-600">Payment Pending</h1>
              <p className="text-gray-600 mt-2">Your payment status is pending.</p>
            </>
          )}

          <div className="mt-8">
            <div className="bg-gray-100 rounded-lg p-6 shadow-md">
              <p className="text-lg font-semibold">Payment ID: <span className="text-gray-700">{paymentId}</span></p>
              <p className="text-lg font-semibold">Request ID: <span className="text-gray-700">{paymentId}</span></p>
              <p className={`text-lg mt-2 ${paymentStatus === "success" ? "text-green-500" : "text-red-500"}`}>
                Status: {paymentStatus}
              </p>
            </div>

            <button
              onClick={() => router.push("/")}
              className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
