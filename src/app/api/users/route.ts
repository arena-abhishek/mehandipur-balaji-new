import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);     // ✅ Get page number (default to 1)
    const limit = parseInt(searchParams.get("limit") || "10", 10);  // ✅ Get limit (default to 10)
    const skip = (page - 1) * limit;                                // ✅ Calculate skip offset

    const id = searchParams.get("id");
    const search = searchParams.get("search") || "";                // ✅ Search query

    if (id) {
      // ✅ Fetch single user by ID
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ user }, { status: 200 });

    } else {
      const filters = search
        ? {
          OR: [
            { name: { contains: search.toLowerCase() } },    // Lowercase comparison
            { email: { contains: search.toLowerCase() } },
            { phone: { contains: search.toLowerCase() } },
          ],
        }
        : {};

      // Fetch paginated and filtered users
      const users = await prisma.user.findMany({
        where: filters,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },  // Sorting by created date
      });

      // Get the total number of filtered users
      const totalUsers = await prisma.user.count({ where: filters });

      return NextResponse.json({
        users,
        totalUsers,
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
      }, { status: 200 });
    }

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};
