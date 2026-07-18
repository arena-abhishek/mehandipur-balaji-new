import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export async function POST(request: any) {
  try {
    const body = await request.json();
    const { email, oldPassword, newPassword } = body;

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json({ message: "Missing Fields" }, { status: 400 });
    }

    // ✅ Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found!" }, { status: 404 });
    }

    // ✅ Verify the old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password ?? "");

    if (!isPasswordValid) {
      return NextResponse.json({ message: "Incorrect old password!" }, { status: 401 });
    }

    // ✅ Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update the password in the database
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        password: hashedNewPassword,
      },
    });

    // ✅ Send Confirmation Email with Brevo
    // const BREVO_API_KEY = process.env.BREVO_API_KEY;




    // console.log("Confirmation email sent successfully.");

    return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });

  } catch (error) {
    console.error("Error updating password:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
