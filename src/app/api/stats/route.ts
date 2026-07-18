import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

// export const POST = async (req: NextRequest) => {
//   try {
//     const { name, email, phone, message, mainCategoryId } = await req.json();

//     if (!name || !phone || !mainCategoryId) {
//       return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//     }

//     // Check if MainCategory exists
//     const existingCategory = await prisma.mainCategory.findUnique({
//       where: { id: mainCategoryId },
//     });

//     if (!existingCategory) {
//       return NextResponse.json({ message: "Service not found" }, { status: 404 });
//     }

//     // Check if the lead already exists
//     const existingLead = await prisma.lead.findUnique({
//       where: { phone: phone },
//     });

//     const BREVO_API_KEY = process.env.BREVO_API_KEY;

//     // Define multiple admin/support team emails
//     const adminEmails = [
//       // "olaf.trygve@thefluent.org"
//       "Piyushkalra816@gmail.com",
//       "rameshsainimehandipur@gmail.com"

//     ];

//     // Email data preparation
//     let emailData;

//     if (existingLead) {
//       // ✅ Existing lead - Send different email
//       emailData = {
//         sender: {
//           name: "Mehandipur Balaji",
//           email: "techpiyushkhatri@gmail.com"
//         },
//         to: [
//           // { email, name },
//           ...adminEmails.map(admin => ({ email: admin, name: "Admin" }))
//         ],
//         subject: "Exitsing Inquiry - Mehandipur Balaji",
//         htmlContent: `
//           <html>
//             <body>
//               <h2>Existing Inquiry Notification</h2>
//               <p><strong>Name:</strong> ${name}</p>
//               <p><strong>Phone:</strong> ${phone}</p>
//               <p><strong>Service Name:</strong> ${existingCategory.name}</p>

//               <p>User already submitted a request. Thank you!</p>
//             </body>
//           </html>`
//       };

//       await sendEmail(emailData, BREVO_API_KEY);
//       return NextResponse.json({ message: "You already submitted a lead!" }, { status: 200 });
//     }

//     // ✅ New lead - Save to database
//     const lead = await prisma.lead.create({
//       data: {
//         name,
//         email: email || "",
//         phone,
//         message: message || "",
//         status: "new",
//         mainCategoryId,
//         logs: {
//           create: {
//             status: "new",
//             message: "Lead created successfully",
//           },
//         },
//       },
//     });

//     // ✅ New lead - Send welcome email
//     emailData = {
//       sender: {
//         name: "Mehandipur Balaji",
//         email: "techpiyushkhatri@gmail.com"
//       },
//       to: [
//         // { email, name },
//         ...adminEmails.map(admin => ({ email: admin, name: "Admin" }))
//       ],
//       subject: "New Inquiry - Mehandipur Balaji",
//       htmlContent: `
//         <html>
//           <body>
//             <h2>New Inquiry</h2>
//             <p><strong>Name:</strong> ${name}</p>
//             <p><strong>Phone:</strong> ${phone}</p>
//             <p><strong>Service Name:</strong> ${existingCategory.name}</p>

//             <p>New User Inquiry</p>
//           </body>
//         </html>`
//     };

//     await sendEmail(emailData, BREVO_API_KEY);

//     return NextResponse.json({ message: "Lead created successfully", lead }, { status: 201 });

//   } catch (error) {
//     console.error("Error creating lead:", error);
//     return NextResponse.json({ error: "An error occurred" }, { status: 500 });
//   }
// };

// // ✅ Email sending function
// const sendEmail = async (emailData, BREVO_API_KEY) => {
//   try {
//     const response = await fetch("https://api.brevo.com/v3/smtp/email", {
//       method: "POST",
//       headers: {
//         "accept": "application/json",
//         "api-key": BREVO_API_KEY,
//         "content-type": "application/json"
//       },
//       body: JSON.stringify(emailData)
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Failed to send email:", errorData);
//       throw new Error("Failed to send email");
//     }

//     const responseData = await response.json();
//     console.log("Email sent successfully:", responseData);
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };



export const GET = async (req: NextRequest) => {
  try {

    const user = await prisma.user.count({ where: { role: 'user' } });
    const visit = await prisma.uniqueVisit.count();
    const orders = await prisma.order.count();
    const successfulOrders = await prisma.order.count({
      where: {
        paymentStatus: "success"
      }
    });




    return NextResponse.json({
      totalUsers: user,
      totalOrders: orders,
      uniqueVisitors: visit,

      customerOrders: successfulOrders,
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching lead timeline:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
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