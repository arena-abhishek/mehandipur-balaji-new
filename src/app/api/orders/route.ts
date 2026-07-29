import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import sha256 from "crypto-js/sha256";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

// Instamojo API details
const INSTAMOJO_BASE_URL = "https://www.instamojo.com/api/1.1/payment-requests/";
const INSTAMOJO_API_KEY = process.env.INSTAMOJO_API_KEY;
const INSTAMOJO_AUTH_TOKEN = process.env.INSTAMOJO_AUTH_TOKEN;

function generateRandomEmail(domain = "mahandipurbalaji.com") {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `user_forCreateOrder_${randomString}@${domain}`;
}

export const POST = async (req: NextRequest) => {
  try {
    const { email, items, discount = 0 } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }



    const totalAmount = items.reduce(
      (acc: number, item: any) => acc + item.price * item.quantity,
      0
    );
    const finalAmount = totalAmount - discount;
    const transactionId = `TXN-${uuidv4().slice(0, 8)}`;

    // Create order in DB (without full details yet)
    const order = await prisma.order.create({
      data: {
        // email: generateRandomEmail,
        userId: "cmbbh5qcv000llz4dqb4gu6lx",
        amount: finalAmount,
        discount,
        status: "pending",
        paymentGateway: "PhonePe",
        paymentStatus: "initiated",
        transactionId,
        referenceId: transactionId,
        orderItems: {
          create: items.map((item: any) => ({
            productName: item.productName,
            categoryId: item.categoryId,
            quantity: item.quantity,
            price: item.price,
            totalAmount: item.price * item.quantity,
          })),
        },
      },
    });

    return NextResponse.json(
      {
        message: "Order created. Proceed to fill details.",
        orderId: order.id,
        transactionId: order.transactionId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order Create Error:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Order creation failed",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
};


export const PUT = async (req: NextRequest) => {
  try {
    // const { orderId } = params;

    const formData = await req.json();

    const order = await prisma.order.findUnique({ where: { id: parseInt(formData.orderId) } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 1. Get OAuth Token
    const authResponse = await axios.post(
      `${process.env.PHONEPE_API_HOST}/apis/identity-manager/v1/oauth/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.PHONEPE_CLIENT_ID!,
        client_version: process.env.NEXT_PUBLIC_SALT_INDEX!,
        client_secret: process.env.PHONEPE_CLIENT_SECRET!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = authResponse.data.access_token;
    console.log("yaah tak aaya1 {", order.amount);
    let amount = (order.amount?.toNumber() || 0) * 100;



    // 2. Create payment link
    const paymentResponse = await axios.post(
      `${process.env.PHONEPE_API_HOST}/apis/pg/checkout/v2/pay`,
      {
        merchantOrderId: order.transactionId,
        amount: amount, // amount in paise
        expireAfter: 1200,
        metaInfo: {
          udf1: order.email,
          udf2: "SHIV MISTHAN BHANDAR",
          udf3: "Jai bata ki",
        },
        paymentFlow: {
          type: "PG_CHECKOUT",
          message: "Order Payment",
          merchantUrls: {
            redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/payment?payment_id=${order.transactionId}`,
          },
          paymentModeConfig: {
            enabledPaymentModes: [
              { type: "UPI_INTENT" },
              { type: "UPI_COLLECT" },
              { type: "UPI_QR" },
              { type: "NET_BANKING" },
              {
                type: "CARD",
                cardTypes: ["DEBIT_CARD", "CREDIT_CARD"],
              },
            ],
          },
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${accessToken}`,
        },
      }
    );
    console.log("yaah tak aaya2");

    const redirectUrl = paymentResponse.data.redirectUrl;
    const user = await prisma.user.findUnique({ where: { email: formData.email } });
    if (!user) {
      await prisma.user.create({
        data: {
          name: formData.receiptName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          role: "user",
          isVerified: false,
        },
      });
    }

    const token = jwt.sign(
      {
        id: user?.id ?? "",
        email: user?.email ?? "",
        role: user?.role ?? "user",
      },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expiration time
    );
    // 3. Update order with full details
    await prisma.order.update({
      where: { id: parseInt(formData.orderId) },
      data: {
        userId: user?.id || "cmbbh5qcv000llz4dqb4gu6lx",
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        delivery_date: formData.delivery_date,
        booking_date: formData.booking_date,
        state: formData.state,
        city: formData.city,
        country: formData.country,
        paymentStatus: "initiated",
        paymentDate: new Date().toISOString(),
      },
    });

    return NextResponse.json(
      {
        message: "Order updated. Payment URL generated.",
        paymentURL: redirectUrl,
        referenceId: order.referenceId,
        token
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("PhonePe Error:", error?.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Payment link generation failed",
        details: error?.response?.data || error.message,
      },
      { status: 500 }
    );
  }
};


// export const POST = async (req: NextRequest) => {
//   try {
//     const {
//       email,
//       items,                   // Array of order items
//       paymentGateway = "Instamojo",
//       couponCode = null,        // Optional coupon code
//       discount = 0,             // Discount amount
//       status = "pending",       // Default status
//       paymentMethod,            // Payment method (UPI, Card, etc.)
//     } = await req.json();

//     // ✅ Validate required fields
//     if (!email || !items || items.length === 0) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // ✅ 1. Fetch user data
//     const user = await prisma.user.findUnique({
//       where: { email: email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // ✅ 2. Calculate total amount
//     const totalAmount = items.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0);
//     const finalAmount = totalAmount - discount;

//     // ✅ 3. Prepare payment request payload
//     const payload = {
//       purpose: `Order Payment for ${user.name}`,
//       amount: finalAmount,
//       currency: "INR",
//       buyer_name: user.name,
//       email: user.email,
//       // phone: user.phone,
// redirect_url: `${process.env.NEXT_PUBLIC_API_URL}/payment`,  // Success URL
//       send_email: true,
//       // send_sms: true,
//     };

//     const auth = {
//       headers: {
//         "X-Api-Key": INSTAMOJO_API_KEY,
//         "X-Auth-Token": INSTAMOJO_AUTH_TOKEN,
//       },
//     };

//     // ✅ 4. Call Instamojo API to generate payment URL
//     const response = await axios.post(INSTAMOJO_BASE_URL, payload, auth);
//     console.log("responce data ", response, response.data)
//     // return NextResponse.json({ response, re: response.data }, { status: 500 });
//     // // return;
//     if (!response.data.success) {
//       return NextResponse.json({ error: "Failed to create payment URL", details: response.data }, { status: 500 });
//     }

//     const paymentURL = response.data.payment_request.longurl;
//     const transactionId = response.data.payment_request.id;

//     // ✅ 5. Create Order in Prisma
//     const order = await prisma.order.create({
//       data: {
//         userId: user.id,
//         amount: finalAmount,
//         discount,
//         couponCode,
//         status,
//         paymentGateway,
//         transactionId,         // Gateway transaction ID
//         referenceId: transactionId,  // Reference ID from Instamojo
//         paymentStatus: "initiated",
//         paymentMethod,
//         orderItems: {
//           create: items.map((item: any) => ({
//             productName: item.productName,
//             categoryId: item.categoryId,
//             quantity: item.quantity,
//             price: item.price,
//             totalAmount: item.price * item.quantity,
//           })),
//         },
//       },
//       include: {
//         orderItems: true,
//       },
//     });

//     // ✅ 6. Return payment URL and order reference ID
//     return NextResponse.json(
//       {
//         paymentURL,
//         referenceId: order.referenceId,
//         message: "Payment URL generated successfully",
//       },
//       { status: 201 }
//     );

//   } catch (error) {
//     // console.error("Error creating payment & order:", error);
//     return NextResponse.json({ error: "Failed to create payment & order" }, { status: 500 });
//   }
// };


// export const POST = async (req: NextRequest) => {
//   try {
//     const {
//       email,
//       items,
//       paymentGateway = "Phonepe",
//       couponCode = null,
//       discount = 0,
//       status = "pending",
//       paymentMethod,
//     } = await req.json();

//     if (!email || !items || items.length === 0) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const totalAmount = items.reduce(
//       (acc: number, item: any) => acc + item.price * item.quantity,
//       0
//     );
//     const finalAmount = totalAmount - discount;
//     const transactionId = "Tr-" + uuidv4().slice(-6);

//     // Prepare PhonePe payload
//     const payload = {
//       merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID,
//       merchantTransactionId: transactionId,
//       merchantUserId: "MUID-sdfa" + uuidv4().slice(-6),
//       amount: 100 * finalAmount, // in paise
//       redirectUrl: `${process.env.NEXT_PUBLIC_API_URL}/payment?payment_id=${transactionId}`,
//       redirectMode: "REDIRECT",
//       callbackUrl: `${process.env.NEXT_PUBLIC_API_URL}/payment?payment_id=${transactionId}`,
//       paymentInstrument: { type: "PAY_PAGE" },
//     };

//     const dataBase64 = Buffer.from(JSON.stringify(payload)).toString("base64");
//     const fullPath = "/pg/v1/init"; // Correct endpoint for production
//     const checksumString = dataBase64 + fullPath + process.env.NEXT_PUBLIC_SALT_KEY!;
//     const checksumHash = sha256(checksumString).toString();
//     const checksum = `${checksumHash}###${process.env.NEXT_PUBLIC_SALT_INDEX}`;
//     console.log("Merchant ID:", process.env.NEXT_PUBLIC_MERCHANT_ID);
//     console.log("Payload Base64:", dataBase64);
//     console.log("Checksum:", checksum);
//     console.log("Full PhonePe URL:", `${process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL}${fullPath}`);
//     // return;



//     const phonePeRes = await axios.post(
//       `${process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL}${fullPath}`,
//       { request: dataBase64 },
//       {
//         headers: {
//           accept: "application/json",
//           "Content-Type": "application/json",
//           "X-VERIFY": checksum,
//           "X-MERCHANT-ID": process.env.NEXT_PUBLIC_MERCHANT_ID, // Required
//           // Remove this line below unless PhonePe team has confirmed it's needed:
//           // "X-CLIENT-ID": process.env.NEXT_PUBLIC_PHONEPE_CLIENT_ID,
//         },
//       }
//     );

//     if (!phonePeRes.data.success) {
//       return NextResponse.json(
//         { error: "Failed to create payment URL", details: phonePeRes.data },
//         { status: 500 }
//       );
//     }

//     const paymentURL =
//       phonePeRes.data.data.instrumentResponse.redirectInfo.url;

//     // Create order in DB
//     const order = await prisma.order.create({
//       data: {
//         userId: user.id,
//         amount: finalAmount,
//         discount,
//         couponCode,
//         status,
//         paymentGateway,
//         transactionId,
//         referenceId: transactionId,
//         paymentStatus: "initiated",
//         paymentMethod,
//         orderItems: {
//           create: items.map((item: any) => ({
//             productName: item.productName,
//             categoryId: item.categoryId,
//             quantity: item.quantity,
//             price: item.price,
//             totalAmount: item.price * item.quantity,
//           })),
//         },
//       },
//       include: { orderItems: true },
//     });

//     return NextResponse.json(
//       {
//         paymentURL,
//         referenceId: order.referenceId,
//         message: "Payment URL generated successfully",
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating payment & order:", error);
//     return NextResponse.json(
//       {
//         error:
//           "Failed to create payment & order: " +
//           (error instanceof Error ? error.message : "Unknown error"),
//       },
//       { status: 500 }
//     );
//   }
// };


export const PATCH = async (req: NextRequest) => {
  try {
    const { transactionId } = await req.json();

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
    }

    // 🔐 Get access token
    const authResponse = await axios.post(
      `${process.env.PHONEPE_API_HOST}/apis/identity-manager/v1/oauth/token`,
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.PHONEPE_CLIENT_ID!,
        client_version: process.env.NEXT_PUBLIC_SALT_INDEX!,
        client_secret: process.env.PHONEPE_CLIENT_SECRET!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = authResponse.data.access_token;
    // 🌐 Fetch order status from PhonePe v2
    const phonePeRes = await axios.get(
      `${process.env.PHONEPE_API_HOST}/apis/pg/checkout/v2/order/${transactionId}/status`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `O-Bearer ${accessToken}`,
        },
      }
    );
    // console.log("check ${}", phonePeRes.data)


    const { state, errorCode, detailedErrorCode } = phonePeRes.data;

    let paymentStatus: "pending" | "success" | "failed" = "failed";

    if (state === "COMPLETED") {
      paymentStatus = "success";
    } else if (state === "PENDING") {
      paymentStatus = "pending";

    }

    // ✅ Update your DB order record
    const updatedOrder = await prisma.order.update({
      where: { transactionId },
      data: {
        paymentStatus,
        referenceId: `ref-${transactionId}`,
        updatedAt: new Date(),

      },
      include: {
        orderItems: true, // include related items
        user: true,        // if you have a user relationship
      },
    });
    if (!updatedOrder.emailSent) {

      const adminEmails = [
        // "olaf.trygve@thefluent.org"
        "Piyushkalra816@gmail.com",
        "rameshsainimehandipur@gmail.com"

      ];
      const customerEmail = updatedOrder.email;
      const customerName = updatedOrder.name;

      const total = updatedOrder.orderItems.reduce((acc, item) => {
        const price = item.price?.toNumber?.() || 0;
        return acc + price * item.quantity;
      }, 0);

      const items = updatedOrder.orderItems.map((item) => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
      }));

      const logoUrl = "https://www.mahandipurbalaji.com/_next/image?url=%2Fimages%2Flogo%2FLogo.png&w=384&q=75";
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      };

      const bookingDateFormatted = updatedOrder.booking_date
        ? new Date(updatedOrder.booking_date).toLocaleDateString("en-IN", options)
        : "N/A";

      const deliveryDateFormatted = updatedOrder.delivery_date
        ? new Date(updatedOrder.delivery_date).toLocaleDateString("en-IN", options)
        : "N/A";
      const customerPhone = updatedOrder.phone;

      const checkBookingUrl = `https://www.mahandipurbalaji.com/profile`;


      const emailData = {
        sender: {
          name: "Mehandipur Balaji",
          email: "techpiyushkhatri@gmail.com"
        },
        cc: [
          // {
          //   email: "piyushkhatri9024@gmail.com", // customer's email
          //   name: "Piyushkalra816"    // customer's name
          // }
          {
            email: "Piyushkalra816@gmail.com", // customer's email
            name: "Piyushkalra816"    // customer's name
          },
          {
            email: "rameshsainimehandipur@gmail.com", // customer's email
            name: "rameshsainimehandipur ji"    // customer's name
          }
        ],


        to: [
          {
            email: customerEmail, // customer's email
            name: customerName    // customer's name
          }
        ],
        subject: paymentStatus === "success"
          ? "✅ Order Confirmed - Mehandipur Balaji"
          : "❌ Order Failed - Mehandipur Balaji",

        htmlContent: `
          <html>
  <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px; color: #333;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">

      <!-- Logo and brand -->
      <div style="text-align: center; margin-bottom: 20px;">
        <img src="${logoUrl}" alt="Shiv Misthan Bhandar" style="height: 60px;" />
        <h2 style="margin: 10px 0 0; font-weight: bold;">Shiv Misthan Bhandar</h2>
        <p style="margin: 4px 0; font-size: 14px;">Booking Confirmation</p>
      </div>

      <!-- Customer Details -->
      <div style="margin-top: 20px;">
        <p><strong>Customer Name:</strong> ${customerName}</p>
        <p><strong>Mobile Number:</strong> ${customerPhone}</p>
        <p><strong>Email:</strong> ${customerEmail}</p>
      </div>

      <!-- Dates -->
      <div style="margin-top: 20px;">
        <p><strong>Booking Date:</strong> ${bookingDateFormatted}</p>
        <p><strong>Delivery Date:</strong> ${deliveryDateFormatted}</p>
      </div>

      <!-- Order Table -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
          <tr style="background-color: #f0f0f0;">
            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Item</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Qty</th>
            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
              <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${item.price.toFixed(2)}</td>
            </tr>
          `).join("")}
          <tr style="background-color: #f9f9f9;">
            <td colspan="2" style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>Total</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>₹${total.toFixed(2)}</strong></td>
          </tr>
        </tbody>
      </table>

      <!-- Transaction Info -->
      <div style="margin-top: 20px;">
        <p><strong>Transaction ID:</strong> ${transactionId}</p>
        <p><strong>Payment Status:</strong> 
          <span style="color: ${paymentStatus === "success" ? "green" : paymentStatus === "failed" ? "red" : "orange"};">
            ${paymentStatus.toUpperCase()}
          </span>
        </p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-top: 30px;">
        ${paymentStatus === "success"
            ? `<a href="${checkBookingUrl}" style="background-color: #28a745; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">🔍 Check Your Booking</a>`
            : `
            <a href="tel:+918559833140" style="background-color: #dc3545; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">Call Support: +91 85598 33140</a>
            <p style="margin-top: 15px;">
              Or <a href="https://www.mahandipurbalaji.com/booking/sawamani-online-booking" style="color: #007bff; text-decoration: underline;">click here to try booking again</a>.
            </p>
          `
          }
      </div>

      <!-- Footer -->
      <p style="margin-top: 30px; font-size: 14px; text-align: center;">
        Thank you for booking with <strong>Mehandipur Balaji</strong>.<br />
        If you have any questions, please contact us.
      </p>

    </div>
  </body>
</html>

          `



      };
      const BREVO_API_KEY = process.env.BREVO_API_KEY;

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": BREVO_API_KEY ?? "",
          "content-type": "application/json"
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Email send failed:", errorData);
      } else {
        await prisma.order.update({
          where: { transactionId },
          data: { emailSent: true },
        });
        console.log("Email sent successfully!");
      }
    }
    return NextResponse.json({
      message: "Order status updated",
      paymentStatus,
      phonePeResponse: phonePeRes.data,
      order: updatedOrder,
    }, { status: 200 });

  } catch (error: any) {
    console.error("PhonePe Status Check Error:", error?.response?.data || error.message);
    return NextResponse.json({
      error: "Failed to check/update payment status",
      details: error?.response?.data || error.message,
    }, { status: 500 });
  }
};

// //for testing
// export const GET = async (req: NextRequest) => {
//   const transactionId = "TEST_TXN_123456789";
//   const paymentStatus: "success" | "failed" | "pending" = "success";

//   const dummyOrder = {
//     transactionId,
//     email: "dreshawn.gradyn@fsitip.com",
//     referenceId: `ref-${transactionId}`,
//     paymentStatus,
//     user: {
//       name: "John Doe"
//     },
//     orderItems: [
//       {
//         productName: "Donation A",
//         quantity: 1,
//         price: {
//           toNumber: () => 200
//         }
//       },
//       {
//         productName: "Donation B",
//         quantity: 2,
//         price: {
//           toNumber: () => 150
//         }
//       }
//     ]
//   };

//   const total = dummyOrder.orderItems.reduce((acc, item) => {
//     const price = item.price?.toNumber?.() || 0;
//     return acc + price * item.quantity;
//   }, 0);

//   const items = dummyOrder.orderItems.map((item) => ({
//     name: item.productName,
//     quantity: item.quantity,
//     price: item.price.toNumber()
//   }));

//   const emailData = {
//     sender: {
//       name: "Mehandipur Balaji",
//       email: "techpiyushkhatri@gmail.com"
//     },
//     to: [
//       {
//         email: dummyOrder.email,
//         name: dummyOrder.user.name
//       }
//     ],
//     subject: paymentStatus === "success"
//       ? "✅ Order Confirmed - Mehandipur Balaji"
//       : "❌ Order Failed - Mehandipur Balaji",

//     htmlContent: `
//       <html>
//         <body style="font-family: Arial, sans-serif;">
//           <h2>Order ${paymentStatus === "success" ? "Confirmation" : "Status"}</h2>
//           <p>Dear ${dummyOrder.user.name},</p>
//           <p>Thank you for your order. Here are the details:</p>

//           <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
//             <thead>
//               <tr style="background-color: #f0f0f0;">
//                 <th style="padding: 8px; border: 1px solid #ccc;">Item</th>
//                 <th style="padding: 8px; border: 1px solid #ccc;">Qty</th>
//                 <th style="padding: 8px; border: 1px solid #ccc;">Price</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${items
//         .map(
//           (item) => `
//                 <tr>
//                   <td style="padding: 8px; border: 1px solid #ccc;">${item.name}</td>
//                   <td style="padding: 8px; border: 1px solid #ccc; text-align:center;">${item.quantity}</td>
//                   <td style="padding: 8px; border: 1px solid #ccc;">₹${item.price.toFixed(2)}</td>
//                 </tr>
//               `
//         )
//         .join("")}
//               <tr>
//                 <td colspan="2" style="padding: 8px; border: 1px solid #ccc; text-align: right;"><strong>Total</strong></td>
//                 <td style="padding: 8px; border: 1px solid #ccc;"><strong>₹${total.toFixed(2)}</strong></td>
//               </tr>
//             </tbody>
//           </table>

//           <p style="margin-top: 20px;"><strong>Transaction ID:</strong> ${transactionId}</p>
//           <p><strong>Payment Status:</strong> <span style="color: ${paymentStatus === "success" ? "green" : paymentStatus === "failed" ? "red" : "orange"
//       }">${paymentStatus.toUpperCase()}</span></p>

//           <p style="margin-top: 30px;">Regards,<br />Mehandipur Balaji Team</p>
//         </body>
//       </html>`
//   };

//   const BREVO_API_KEY = process.env.BREVO_API_KEY;

//   const response = await fetch("https://api.brevo.com/v3/smtp/email", {
//     method: "POST",
//     headers: {
//       accept: "application/json",
//       "api-key": BREVO_API_KEY ?? "",
//       "content-type": "application/json"
//     },
//     body: JSON.stringify(emailData)
//   });

//   const mailStatus = response.ok
//     ? "✅ Test email sent successfully"
//     : `❌ Failed to send test email: ${(await response.json()).message}`;

//   return NextResponse.json({
//     message: "Mock order test email sent",
//     mailStatus,
//     order: dummyOrder
//   });
// };

// export const PATCH = async (req: NextRequest) => {
//   try {
//     const { transactionId } = await req.json();

//     if (!transactionId) {
//       return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
//     }

//     const merchantId = process.env.NEXT_PUBLIC_MERCHANT_ID!;
//     const saltKey = process.env.NEXT_PUBLIC_SALT_KEY!;
//     const saltIndex = process.env.NEXT_PUBLIC_SALT_INDEX!;
//     const baseUrl = process.env.NEXT_PUBLIC_PHONE_PAY_HOST_URL!;

//     // 🔐 Create checksum
//     const payloadPath = `/pg/v1/status/${merchantId}/${transactionId}` + saltKey;
//     const checksum = sha256(payloadPath).toString() + "###" + saltIndex;

//     // 🌐 Request to PhonePe
//     const options = {
//       method: "GET",
//       url: `${baseUrl}/pg/v1/status/${merchantId}/${transactionId}`,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": checksum,
//         "X-MERCHANT-ID": merchantId,
//       },
//     };

//     const response = await axios.request(options);
//     const statusCode = response.data?.code;
//     const refId = response.data?.data?.transactionId;

//     let paymentStatus = "failed";

//     if (statusCode === "PAYMENT_SUCCESS") {
//       paymentStatus = "success";
//     } else if (statusCode === "PAYMENT_PENDING") {
//       paymentStatus = "pending";
//     }

//     // ✅ Update order in database
//     const updatedOrder = await prisma.order.update({
//       where: { transactionId },
//       data: {
//         paymentStatus,
//         referenceId: refId || transactionId,
//         updatedAt: new Date(),
//       },
//     });

//     return NextResponse.json({
//       message: "Order updated successfully",
//       status: paymentStatus,
//       order: updatedOrder,
//     }, { status: 200 });

//   } catch (error) {
//     console.error("Error updating order based on payment status:", error);
//     return NextResponse.json({ error: "Failed to check/update payment status" }, { status: 500 });
//   }
// };
//main function
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    if (!id) {
      // Fetch all blogs from the database
      const orders = await prisma.order.findMany({
        // skip,

        // take: parseInt(limit),
        orderBy: { createdAt: "desc" },
        include: { orderItems: true, user: true },
      });

      const totalOrders = await prisma.order.count();


      // Transform tags for better readability (optional)

      // Return the blogs in the response
      return NextResponse.json({ orders, totalOrders }, { status: 200 });
    } else {
      const numericId = Number(id);


      // Fetch the blog by slug from the database
      const orders = await prisma.order.findFirst({
        where: { id: numericId },
        include: {
          user: true,   // Include user details
          orderItems: true // Include order items
        },
      });
      if (!orders) {
        return NextResponse.json({ error: "orders not found" }, { status: 404 });
      }



      // Return the blog in the response
      return NextResponse.json({ orders }, { status: 200 });
    }


  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};


export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Delete one config by id
      const config = await prisma.lead.delete({
        where: { id: id },
      });

      return NextResponse.json({ message: "Blog deleted successfully", config }, { status: 200 });
    } else {
      // // Delete all configs
      // const deletedConfigs = await prisma.lead.deleteMany();

      // return NextResponse.json({ message: "All configs deleted successfully", deletedCount: deletedConfigs.count }, { status: 200 });
    }
  } catch (error) {
    console.error("Error deleting config:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};