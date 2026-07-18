import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";
import axios from "axios";





export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const email = searchParams.get("email");
    const ordershow = searchParams.get("ordershow") === "false" ? false : true;  // Set default to true if not passed or passed as 'true'

    // Fetch the user from the database by email
    const user = await prisma.user.findFirst({
      where: { email: email },
      include: ordershow
        ? {
          order: {
            include: {
              orderItems: true, // Include order items if ordershow is true
            },
          },
        }
        : {}, // Do not include order if ordershow is false
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the user data, with or without orders
    return NextResponse.json({ user: user }, { status: 200 });

  } catch (error) {
    console.error("Error fetching user:", error);
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