import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/utils/prismaDB";
import { getClientIp } from "request-ip";
import { v4 as uuidv4 } from "uuid";

export const GET = async (req: NextRequest) => {


  try {
    // Get IP address and User-Agent from the request
    const ipAddress = getClientIp(req as any) ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "Unknown IP"; const userAgent = req.headers.get("user-agent") || "Unknown UA";

    // Check if visitor already exists
    const existingVisitor = await prisma.uniqueVisit.findFirst({
      where: {
        ipAddress: ipAddress,
      },
    });

    if (existingVisitor) {
      // ✅ Update the existing visitor's session and visited time
      await prisma.uniqueVisit.update({
        where: { id: existingVisitor.id },
        data: {
          visitedAt: new Date(),
          sessionId: uuidv4(),
        },
      });
    } else {
      // ✅ Create a new visitor if it doesn't exist
      await prisma.uniqueVisit.create({
        data: {
          ipAddress,
          userAgent,
          sessionId: uuidv4(),
          visitedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      message: "Visitor tracked successfully",
      ip: ipAddress
    });

  } catch (error) {
    console.error("Error tracking visitor:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};


