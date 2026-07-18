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

        const id = formData.get("id") as string | null;
        const name = formData.get("name") as string;
        const weightType = formData.get("weightType") as string;

        const weight = parseFloat(formData.get("weight") as string);
        const price = parseFloat(formData.get("price") as string);
        const mainCategoryId = formData.get("mainCategoryId") as string;

        if (!name || !weight || !price || !mainCategoryId) {

            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        // Upload image if present
        image = await handleFileUpload(formData);

        if (id) {
            // ✅ Update Category
            const existingCategory = await prisma.category.findUnique({
                where: { id }
            });

            if (!existingCategory) {
                if (image) deleteFile(image);  // Delete uploaded image if no category found
                return NextResponse.json({ error: "Category not found" }, { status: 404 });
            }

            const updatedCategory = await prisma.category.update({
                where: { id },
                data: {
                    name,
                    weight,
                    weightType,
                    price,
                    image: image || existingCategory.image,
                    updatedAt: new Date(),
                    mainCategoryId
                }
            });

            return NextResponse.json({ message: "Category updated successfully", Category: updatedCategory });

        } else {
            // ✅ Create New Category
            const newCategory = await prisma.category.create({
                data: {
                    name,
                    weight,
                    weightType,
                    price,
                    image: image || "",
                    status: 1,
                    publishedAt: new Date(),
                    mainCategoryId
                }
            });

            return NextResponse.json({ message: "Category created successfully", Category: newCategory });
        }
    } catch (error) {
        console.error("Error in POST service:", error);
        if (image) deleteFile(image);  // Delete uploaded image on error
        return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
    }
};

// ✅ GET: Fetch Category by ID or List All
export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (id) {
            const category = await prisma.category.findUnique({
                where: { id, status: 1 },
                include: {
                    mainCategory: true,  // Include related MainCategory
                }
            });

            if (!category) {
                return NextResponse.json({ error: "Category not found" }, { status: 404 });
            }

            return NextResponse.json({ Category: category }, { status: 200 });
        } else {
            const categories = await prisma.category.findMany({
                where: { status: 1 },
                include: {
                    mainCategory: true,  // Include related MainCategory
                }
            });

            return NextResponse.json({ categories }, { status: 200 });
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
    }
};

// ✅ DELETE: Soft Delete Category
export const DELETE = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        const category = await prisma.category.findUnique({
            where: { id }
        });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        // Perform soft delete by setting status to 0
        await prisma.category.update({
            where: { id },
            data: { status: 0 }
        });

        return NextResponse.json({ message: "Category set to inactive successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error soft deleting category:", error);
        return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
    }
};