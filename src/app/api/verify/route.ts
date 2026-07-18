import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: any) {
  const body = await request.json();
  const { email, otp } = body;

  if (!email || !otp) {
    return NextResponse.json({ message: "Missing Fields" }, { status: 400 });
  }

  // Find the user with the given email and check the OTP
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found!" }, { status: 404 });
  }
  console.log("check otp ", user, user.otp)
  // Check if the OTP is correct and still valid
  if (user.otp !== otp) {
    return NextResponse.json({ message: "Invalid OTP!" }, { status: 401 });
  }

  const now = new Date();
  const exp = user.otpExpiresAt ?? Date()
  if (exp < now) {
    return NextResponse.json({ message: "OTP expired!" }, { status: 410 });
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    SECRET_KEY,
    { expiresIn: "1h" } // Token expiration time
  );

  // Verify the user by setting `isVerified` to true
  await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: {

      isVerified: true,
      otp: null,  // Clear the OTP after successful verification
      otpExpiresAt: null
    }
  });

  return NextResponse.json({
    message: "Account Verifyed successful!",
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified

    },
  }, { status: 200 });
}
