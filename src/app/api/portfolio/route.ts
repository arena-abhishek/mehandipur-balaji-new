import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { prisma } from "@/utils/prismaDB";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

// Function to handle file upload
const handleFileUpload = async (formData: FormData) => {
  try {
    const file = formData.get("file") as Blob | null; // Get the file from form data

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      // Generate a unique file name
      const uniqueFileName = uuidv4();

      // Try to extract file extension from the MIME type (e.g., image/jpeg -> .jpg)
      const mimeType = file.type; // The MIME type of the file
      const extname = mimeType.split("/")[1]; // Extract file extension from MIME type
      const fileName = `${uniqueFileName}.${extname}`; // / Combine UUID with extension

      // Ensure the upload directory exists
      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      const filePath = path.resolve(UPLOAD_DIR, uniqueFileName); // Save the file with the unique name
      fs.writeFileSync(filePath, buffer);

      // Return the relative file path
      return `/uploads/${uniqueFileName}`;
    }
    return null; // If no file, return null
  } catch (error) {
    console.error("Error during file upload:", error);
    throw new Error("File upload failed.");
  }
};

// Function to delete the uploaded image if an error occurs
const deleteFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};


export const POST = async (req: NextRequest) => {
  let imagePath = null;

  try {
    const formData = await req.formData();
    imagePath = await handleFileUpload(formData);

    const id = formData.get("id"); // Portfolio ID (for updates)
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;

    const description = formData.get("description") as string;
    const longDescription = formData.get("longDescription") as string;
    const category = formData.get("category") as string;
    const iosAppLink = formData.get("iosAppLink") as string | null;
    const androidAppLink = formData.get("androidAppLink") as string | null;
    const fileLink = formData.get("fileLink") as string | null;
    const contactEmail = formData.get("contactEmail") as string;
    const client = formData.get("client") as string;
    const contactPhone = formData.get("contactPhone") as string;
    const duration = formData.get("duration") as string;
    const website = formData.get("website") as string;


    // Validate required fields
    if (!title || !description || !category) {
      if (imagePath) {
        deleteFile(path.resolve(UPLOAD_DIR, imagePath.split("/").pop() as string));
      }
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (id) {
      // **Update existing portfolio**
      const portfolioId = Number(id);
      const existingPortfolio = await prisma.portfolio.findUnique({
        where: { id: portfolioId },
      });

      if (!existingPortfolio) {
        if (imagePath) {
          deleteFile(path.resolve(UPLOAD_DIR, imagePath.split("/").pop() as string));
        }
        return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
      }

      if (imagePath) {
        // Delete the old image if it exists
        if (existingPortfolio.image) {
          const oldImagePath = path.resolve(UPLOAD_DIR, existingPortfolio.image.split("/").pop() as string);
          deleteFile(oldImagePath);
        }
      }

      const updatedPortfolio = await prisma.portfolio.update({
        where: { id: portfolioId },
        data: {
          contactEmail,
          client,
          contactPhone,
          duration,
          website,
          title,
          slug,
          description,
          longDescription,
          category,
          image: imagePath || existingPortfolio.image, // Keep existing image if no new one is uploaded
          iosAppLink,
          androidAppLink,
          fileLink,
        },
      });

      return NextResponse.json({ message: "Portfolio updated successfully", portfolio: updatedPortfolio });
    } else {
      // **Create new portfolio**
      const newPortfolio = await prisma.portfolio.create({
        data: {
          contactEmail,
          client,
          contactPhone,
          duration,
          website,
          title,
          description,
          slug,
          longDescription,
          category,
          image: imagePath, // Only add if provided
          iosAppLink,
          androidAppLink,
          fileLink,
        },
      });

      return NextResponse.json({ message: "Portfolio created successfully", portfolio: newPortfolio });
    }
  } catch (error) {
    console.error("Error creating/updating portfolio:", error);
    if (imagePath) {
      deleteFile(path.resolve(UPLOAD_DIR, imagePath.split("/").pop() as string));
    }
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: Number(id) },
      });

      if (!portfolio) {
        return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
      }

      return NextResponse.json({ portfolio }, { status: 200 });
    } else {
      const portfolios = await prisma.portfolio.findMany();
      return NextResponse.json({ portfolios }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const portfolio = await prisma.portfolio.findUnique({
        where: { id: Number(id) },
      });

      if (!portfolio) {
        return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
      }

      if (portfolio.image) {
        deleteFile(path.resolve(UPLOAD_DIR, portfolio.image.split("/").pop() as string));
      }

      await prisma.portfolio.delete({
        where: { id: Number(id) },
      });

      return NextResponse.json({ message: "Portfolio deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};
