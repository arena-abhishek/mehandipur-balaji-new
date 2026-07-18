import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/utils/prismaDB";
import { v4 as uuidv4 } from "uuid";  // Import UUID library

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");



export const POST = async (req: NextRequest) => {
  let featuredImagePath = null;

  try {
    // Parse the form data
    const formData = await req.formData();


    // Extract fields from form data
    const id = formData.get("id"); // Blog ID (for updates)
    const title = formData.get("title");
    const slug = formData.get("slug") as string;
    const content = formData.get("content");



    if (id) {
      // **Update existing blog**
      const blogId = Number(id);

      // Check if the blog exists
      const existingBlog = await prisma.pages.findUnique({
        where: { id: blogId },
      });

      if (!existingBlog) {

        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }

      // Update the blog
      const updatedBlog = await prisma.pages.update({
        where: { id: blogId },
        data: {
          title: title as string,
          slug: slug as string,
          content: content as string,


        },
      });

      return NextResponse.json({ message: "Pages updated successfully", blog: updatedBlog });
    } else {
      // **Create new blog**
      // Check if slug is unique
      const exitsPage = await prisma.pages.findUnique({
        where: { slug },
      });

      if (exitsPage) {

        return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
      }

      // Create the blog
      const newBlog = await prisma.pages.create({
        data: {
          title: title as string,
          slug: slug as string,
          content: content as string,

        },
      });

      return NextResponse.json({ message: "Pages created successfully", blog: newBlog });
    }
  } catch (error) {

    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};




export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const slug = searchParams.get("slug");
    if (!slug) {
      // Fetch all blogs from the database
      const page = await prisma.pages.findMany({

      });



      // Return the blogs in the response
      return NextResponse.json({ pages: page }, { status: 200 });
    } else {

      // Fetch the blog by slug from the database
      const blog = await prisma.pages.findUnique({
        where: { slug },

      });

      if (!blog) {
        return NextResponse.json({ error: "page not found" }, { status: 404 });
      }


      // Return the blog in the response
      return NextResponse.json({ page: blog }, { status: 200 });
    }


  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};


export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Delete one config by id
      const config = await prisma.pages.delete({
        where: { id: Number(id) },
      });

      return NextResponse.json({ message: "Pages deleted successfully", config }, { status: 200 });
    } else {
      // // Delete all configs
      // const deletedConfigs = await prisma.config.deleteMany();

      // return NextResponse.json({ message: "All configs deleted successfully", deletedCount: deletedConfigs.count }, { status: 200 });
    }
  } catch (error) {
    console.error("Error deleting config:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};