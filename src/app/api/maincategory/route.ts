import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { prisma } from "@/utils/prismaDB";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

// ✅ Handle file upload
const handleFileUpload = async (formData: FormData) => {
    try {
        const file = formData.get("file") as Blob | null;

        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());

            // Generate a unique file name with UUID
            const uniqueFileName = uuidv4();
            const mimeType = file.type;
            const extname = mimeType.split("/")[1] || "jpg";  // Fallback to jpg if no extension found
            const fileName = `${uniqueFileName}.${extname}`;

            // Ensure the upload directory exists
            if (!fs.existsSync(UPLOAD_DIR)) {
                fs.mkdirSync(UPLOAD_DIR, { recursive: true });
            }

            const filePath = path.resolve(UPLOAD_DIR, fileName);
            fs.writeFileSync(filePath, buffer);

            // Return the relative file path
            return `/uploads/${fileName}`;
        }

        return null;  // Return null if no file
    } catch (error) {
        console.error("Error during file upload:", error);
        throw new Error("File upload failed.");
    }
};

// ✅ Delete image file if any error occurs
const deleteFile = (filePath: string) => {
    try {
        const fullPath = path.resolve(UPLOAD_DIR, filePath.split("/").pop() as string);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    } catch (error) {
        console.error("Error deleting file:", error);
    }
};

// ✅ POST: Create or Update MainCategory
export const POST = async (req: NextRequest) => {
    let image = null;

    try {
        const formData = await req.formData();

        // Extract fields from form data
        const id = formData.get("id") as string | null;
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;
        const content = formData.get("content") as string;
        const metaTitle = formData.get("metaTitle") as string;
        const metaDescription = formData.get("metaDescription") as string;


        const tags = formData.get("tags") as string;

        if (!name || !slug || !content) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Upload image if present
        image = await handleFileUpload(formData);

        if (id) {
            // ✅ Update MainCategory
            const existingService = await prisma.mainCategory.findUnique({
                where: { id }
            });

            if (!existingService) {
                if (image) deleteFile(image);  // Delete uploaded image if no service found
                return NextResponse.json({ error: "MainCategory not found" }, { status: 404 });
            }

            const updatedService = await prisma.mainCategory.update({
                where: { id },
                data: {
                    name,
                    metaTitle,
                    metaDescription,
                    slug,
                    content,
                    image: image || existingService.image,
                    updatedAt: new Date(),
                }
            });

            return NextResponse.json({ message: "MainCategory updated successfully", Service: updatedService });
        } else {
            // ✅ Create New MainCategory
            const existingSlug = await prisma.mainCategory.findUnique({
                where: { slug }
            });

            if (existingSlug) {
                if (image) deleteFile(image);
                return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
            }

            const newService = await prisma.mainCategory.create({
                data: {
                    name,
                    slug,
                    metaDescription, metaTitle,
                    content,
                    image: image || '',
                    status: 1,
                    publishedAt: new Date(),
                }
            });

            return NextResponse.json({ message: "MainCategory created successfully", Service: newService });
        }
    } catch (error) {
        console.error("Error in POST service:", error);
        if (image) deleteFile(image);  // Delete uploaded image on error
        return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
    }
};

// ✅ GET: Fetch MainCategory by slug or list all
export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (slug) {
            const service = await prisma.mainCategory.findUnique({
                where: {
                    slug,
                    status: 1
                },
                include: {
                    category: {
                        where: {
                            status: 1  // ✅ Only include categories with status = 1
                        }
                    }
                }
            });


            if (!service) {
                return NextResponse.json({ error: "MainCategory not found" }, { status: 404 });
            }

            return NextResponse.json({ Service: service }, { status: 200 });
        } else {
            const services = await prisma.mainCategory.findMany({ where: { status: 1 } });
            return NextResponse.json({ services }, { status: 200 });
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

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const service = await prisma.mainCategory.findUnique({
            where: { id }
        });

        if (!service) {
            return NextResponse.json({ error: "MainCategory not found" }, { status: 404 });
        }

        // Perform soft delete by setting status to 0
        await prisma.mainCategory.update({
            where: { id },
            data: { status: 0 }
        });

        return NextResponse.json({ message: "MainCategory set to inactive successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error soft deleting service:", error);
        return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
    }
};