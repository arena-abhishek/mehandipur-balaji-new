import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

const SECRET_KEY = process.env.JWT_SECRET || "your-secret-key";

export async function POST(request: any) {
  try {
    // Parse the incoming request
    const body = await request.json();
    const { email, password } = body;

    // Check if required fields are provided
    if (!email || !password) {
      return NextResponse.json({ message: "Missing email or password" }, { status: 400 });
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // If user is not found, return error
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    // Generate a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" } // Token expiration time
    );

    // Return the token and user details in the response
    return NextResponse.json(
      {
        message: "Login successful!",
        success:true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified
        },
      },
      { status: 200 }
    );
  } catch (error) {
    // console.error("Error during login:", error);
    return NextResponse.json(
      { error: `An error occurred: ${error}` },
      { status: 500 }
    );
  }
}
