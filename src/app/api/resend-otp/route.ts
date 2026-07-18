import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: any) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    // ✅ Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ message: "User is already verified" }, { status: 400 });
    }

    // ✅ Generate a new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 15); // OTP valid for 15 mins

    // ✅ Update the OTP and expiration in the database
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        otp,
        otpExpiresAt,
      },
    });

    // ✅ Use fetch() to send the OTP via Brevo API
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    const emailData = {
      sender: {
        name: "Mehandipur Balaji",
        email: "techpiyushkhatri@gmail.com"
      },
      to: [
        {
          email: user.email,
          name: user.name
        }
      ],
      subject: "Resend OTP - Mehandipur Balaji",
      htmlContent: `
        <html>
          <body>
            <h1>Your New OTP: <strong>${otp}</strong></h1>
            <p>It is valid for 15 minutes. Use this code to verify your email.</p>
          </body>
        </html>`
    };

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": BREVO_API_KEY ?? "",
        "content-type": "application/json"
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Failed to resend email:", errorData);
      return NextResponse.json({ message: "Failed to resend OTP email!" }, { status: 500 });
    }

    const responseData = await response.json();
    console.log("Resend Email sent successfully:", responseData);

    return NextResponse.json({ message: "OTP resent successfully!", success: true, data: otp }, { status: 200 });

  } catch (error) {
    console.error("Error resending email:", error);
    return NextResponse.json({ message: "Failed to resend OTP email!" }, { status: 500 });
  }
}
