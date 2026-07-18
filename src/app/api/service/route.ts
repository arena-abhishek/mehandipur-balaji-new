import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { prisma } from "@/utils/prismaDB";
import { v4 as uuidv4 } from "uuid";  // Import UUID library

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
  let featuredImagePath = null;

  try {
    // Parse the form data
    const formData = await req.formData();

    // Handle file upload
    featuredImagePath = await handleFileUpload(formData);

    // Extract fields from form data
    const id = formData.get("id");
    const title = formData.get("title");
    const slug = formData.get("slug") as string;
    const content = formData.get("content");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const authorId = formData.get("authorId");
    const status = formData.get("status") as string;
    const icon = formData.get("icon") as string;

    const tags = formData.get("tags");

    // Validate required fields for create/update
    if (!title || !slug || !content || !authorId) {
      // If validation fails, delete the uploaded image
      if (featuredImagePath) {
        deleteFile(path.resolve(UPLOAD_DIR, featuredImagePath.split("/").pop() as string));
      }
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Ensure authorId is a number
    const authorIdNumber = Number(authorId);
    if (isNaN(authorIdNumber)) {
      // If validation fails, delete the uploaded image
      if (featuredImagePath) {
        deleteFile(path.resolve(UPLOAD_DIR, featuredImagePath.split("/").pop() as string));
      }
      return NextResponse.json({ error: "Invalid authorId" }, { status: 400 });
    }

    if (id) {
      // **Update existing Service**
      const ServiceId = Number(id);

      // Check if the Service exists
      const existingService = await prisma.service.findUnique({
        where: { id: ServiceId },
      });

      if (!existingService) {
        // If Service doesn't exist, delete the uploaded image
        if (featuredImagePath) {
          deleteFile(path.resolve(UPLOAD_DIR, featuredImagePath.split("/").pop() as string));
        }
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }

      // Update the Service
      const updatedService = await prisma.service.update({
        where: { id: ServiceId },
        data: {
          title: title as string,
          slug: slug as string,
          content: content as string,
          metaTitle: metaTitle as string,
          icon: icon as string,

          metaDescription: metaDescription as string,
          featuredImage: featuredImagePath || existingService.featuredImage, // Keep existing image if no new one is uploaded
          authorId: authorIdNumber,
          status: status || existingService.status,
          tags: {
            deleteMany: {}, // Clear existing tags
            create: tags
              ? (tags as string).split(",").map((tagName: string) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName },
                  },
                },
              }))
              : [],
          },
        },
      });

      return NextResponse.json({ message: "Service updated successfully", Service: updatedService });
    } else {
      // **Create new Service**
      // Check if slug is unique
      const existingServiceWithSlug = await prisma.service.findUnique({
        where: { slug },
      });

      if (existingServiceWithSlug) {
        // If slug already exists, delete the uploaded image
        if (featuredImagePath) {
          deleteFile(path.resolve(UPLOAD_DIR, featuredImagePath.split("/").pop() as string));
        }
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }

      // Create the Service
      const newService = await prisma.service.create({
        data: {
          title: title as string,
          slug: slug as string,
          icon: icon as string,
          content: content as string,
          metaTitle: metaTitle as string,
          metaDescription: metaDescription as string,
          featuredImage: featuredImagePath, // Path to the uploaded image
          authorId: authorIdNumber,
          status: status || "draft",
          tags: {
            create: tags
              ? (tags as string).split(",").map((tagName: string) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName },
                    create: { name: tagName },
                  },
                },
              }))
              : [],
          },
        },
      });

      return NextResponse.json({ message: "Service created successfully", Service: newService });
    }
  } catch (error) {
    console.error("Error creating/updating Service:", error);
    // If any error occurs, delete the uploaded image
    if (featuredImagePath) {
      deleteFile(path.resolve(UPLOAD_DIR, featuredImagePath.split("/").pop() as string));
    }
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};




export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const slug = searchParams.get("slug");
    if (!slug) {
      // Fetch all services from the database
      const services = await prisma.service.findMany({
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      // Transform tags for better readability (optional)
      const formattedservices = services.map((Service: { tags: any[]; }) => ({
        ...Service,
        tags: Service.tags.map((tagRelation) => tagRelation.tag.name),
      }));

      // Return the services in the response
      return NextResponse.json({ services: formattedservices }, { status: 200 });
    } else {

      // Fetch the Service by slug from the database
      const Service = await prisma.service.findUnique({
        where: { slug },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (!Service) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }

      // Transform tags for better readability
      const formattedService = {
        ...Service,
        tags: Service.tags.map((tagRelation: { tag: { name: any; }; }) => tagRelation.tag.name),
      };

      // Return the Service in the response
      return NextResponse.json({ Service: formattedService }, { status: 200 });
    }


  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};
export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const serviceData = await prisma.service.findUnique({
        where: { id: Number(id) },
      });

      if (!serviceData) {
        return NextResponse.json({ error: "Service not found" }, { status: 404 });
      }

      if (serviceData.featuredImage) {
        deleteFile(path.resolve(UPLOAD_DIR, serviceData.featuredImage.split("/").pop() as string));
      }

      await prisma.service.delete({
        where: { id: Number(id) },
      });

      return NextResponse.json({ message: "Service deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};