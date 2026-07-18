import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: any) {
  const body = await request.json();
  const { name, email, password, role, phone } = body;

  if (!name || !email || !password) {
    return NextResponse.json("Missing Fields", { status: 400 });
  }

  // Check if the user already exists
  const exist = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (exist) {
    return NextResponse.json({ message: "User already exists!" }, { status: 409 });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = new Date();
  otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 15); // OTP valid for 15 mins

  // Save the user and OTP in the database
  await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
      role,
      otp,
      otpExpiresAt,
      isVerified: false,
    },
  });

  // ✅ Use fetch() to send the email directly via Brevo API
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  const emailData = {
    sender: {
      name: "Mehandipur Balaji",
      email: "techpiyushkhatri@gmail.com"
    },
    to: [
      {
        email: email,
        name: name
      }
    ],
    subject: "Verify Your Email - Mehandipur Balaji",
    htmlContent: `
      <html>
        <body>
          <h1>Your OTP: <strong>${otp}</strong></h1>
          <p>It is valid for 15 minutes. Use this code to verify your email.</p>
        </body>
      </html>`
  };

  try {

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY ?? "",  // Ensure it's always a string
        "content-type": "application/json"
      },
      body: JSON.stringify(emailData)

    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to send email:", errorData);
      return NextResponse.json({ message: "Failed to send OTP email!" }, { status: 500 });
    }

    const responseData = await response.json();
    console.log("Email sent successfully:", responseData);

    return NextResponse.json({ message: "User created. OTP sent!", success: true, data: otp }, { status: 200 });

  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ message: "Failed to send OTP email!" }, { status: 500 });
  }
}
