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
    const id = formData.get("id"); // Blog ID (for updates)
    const title = formData.get("title");
    const slug = formData.get("slug") as string;
    const content = formData.get("content");
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const authorId = formData.get("authorId");
    const status = formData.get("status") as string;
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
      // **Update existing blog**
      const blogId = Number(id);

      // Check if the blog exists
      const existingBlog = await prisma.blog.findUnique({
        where: { id: blogId },
      });

      if (!existingBlog) {
        // If blog doesn't exist, delete the uploaded image
        if (featuredImagePath) {
          deleteFile(path.resolve(UPLOAD_DIR, featuredImagePath.split("/").pop() as string));
        }
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      if (featuredImagePath) {
        // Delete the old image if it exists
        if (existingBlog.featuredImage) {
          const oldImagePath = path.resolve(UPLOAD_DIR, existingBlog.featuredImage.split("/").pop() as string);
          deleteFile(oldImagePath);
        }
      }

      // Update the blog
      const updatedBlog = await prisma.blog.update({
        where: { id: blogId },
        data: {
          title: title as string,
          slug: slug as string,
          content: content as string,
          metaTitle: metaTitle as string,
          metaDescription: metaDescription as string,
          featuredImage: featuredImagePath || existingBlog.featuredImage, // Keep existing image if no new one is uploaded
          authorId: authorIdNumber,
          status: status || existingBlog.status,
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

      return NextResponse.json({ message: "Blog updated successfully", blog: updatedBlog });
    } else {
      // **Create new blog**
      // Check if slug is unique
      const existingBlogWithSlug = await prisma.blog.findUnique({
        where: { slug },
      });

      if (existingBlogWithSlug) {
        // If slug already exists, delete the uploaded image
        if (featuredImagePath) {
          deleteFile(path.resolve(UPLOAD_DIR, featuredImagePath.split("/").pop() as string));
        }
        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }



      // Create the blog
      const newBlog = await prisma.blog.create({
        data: {
          title: title as string,
          slug: slug as string,
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

      return NextResponse.json({ message: "Blog created successfully", blog: newBlog });
    }
  } catch (error) {
    console.error("Error creating/updating blog:", error);
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
      // Fetch all blogs from the database
      const blogs = await prisma.blog.findMany({
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      // Transform tags for better readability (optional)
      const formattedBlogs = blogs.map((blog: { tags: any[]; }) => ({
        ...blog,
        tags: blog.tags.map((tagRelation) => tagRelation.tag.name),
      }));

      // Return the blogs in the response
      return NextResponse.json({ blogs: formattedBlogs }, { status: 200 });
    } else {

      // Fetch the blog by slug from the database
      const blog = await prisma.blog.findUnique({
        where: { slug },
        include: {
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      // Transform tags for better readability
      const formattedBlog = {
        ...blog,
        tags: blog.tags.map((tagRelation: { tag: { name: any; }; }) => tagRelation.tag.name),
      };

      // Return the blog in the response
      return NextResponse.json({ blog: formattedBlog }, { status: 200 });
    }


  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};


export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const blogData = await prisma.blog.findUnique({
        where: { id: Number(id) },
      });

      if (!blogData) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      if (blogData.featuredImage) {
        deleteFile(path.resolve(UPLOAD_DIR, blogData.featuredImage.split("/").pop() as string));
      }

      await prisma.blog.delete({
        where: { id: Number(id) },
      });

      return NextResponse.json({ message: "Blog deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};