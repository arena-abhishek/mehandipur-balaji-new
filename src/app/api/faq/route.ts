import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prismaDB";

export const POST = async (req: NextRequest) => {
  try {
    const { id, questions, answer, status } = await req.json();

    if (!questions || !answer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let faq;

    if (id) {
      // ✅ Update existing FAQ
      faq = await prisma.fAQ.update({
        where: { id: parseInt(id) },
        data: {
          questions,
          answer,
          status: status ?? 1
        }
      });

      return NextResponse.json({ message: "FAQ updated successfully", faq }, { status: 200 });

    } else {
      // ✅ Create new FAQ
      faq = await prisma.fAQ.create({
        data: {
          questions,
          answer,
          status: status ?? 1
        }
      });

      return NextResponse.json({ message: "FAQ created successfully", faq }, { status: 201 });
    }

  } catch (error) {
    console.error("Error creating/updating FAQ:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};



// ✅ Get FAQs (single or all)
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const faq = await prisma.fAQ.findUnique({
        where: { id: parseInt(id) }
      });

      if (!faq) {
        return NextResponse.json({ error: "FAQ not found" }, { status: 404 });
      }

      return NextResponse.json({ faq }, { status: 200 });
    }

    // Fetch all FAQs
    const faqs = await prisma.fAQ.findMany({
      // orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ faqs }, { status: 200 });

  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};

// ✅ Delete an FAQ
export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing FAQ ID" }, { status: 400 });
    }

    const deletedFAQ = await prisma.fAQ.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: "FAQ deleted successfully", deletedFAQ }, { status: 200 });

  } catch (error) {
    console.error("Error deleting FAQ:", error);
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
};
