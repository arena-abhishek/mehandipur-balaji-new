import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import { prisma } from "@/utils/prismaDB";
import { v4 as uuidv4 } from "uuid";
import { Blog } from "@prisma/client";

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? "", "public/uploads");

// Function to handle file upload
const handleFileUpload = async (formData: FormData) => {
  try {
    const file = formData.get("file") as Blob | null;

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());

      const uniqueFileName = uuidv4();
      const mimeType = file.type;
      const extname = mimeType.split("/")[1];
      const fileName = `${uniqueFileName}.${extname}`;

      if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR);
      }

      const filePath = path.resolve(UPLOAD_DIR, fileName);
      fs.writeFileSync(filePath, buffer);

      return `/uploads/${fileName}`;
    }
    return null;
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
const updateConfig = async (configId: number, blogs: string, services: string) => {
  try {
    // Step 1: Prepare blog and service IDs from input (converting to arrays of objects)
    const blogIds = blogs.split(",").map((blogId: string) => ({
      blogId: Number(blogId),
    }));

    const serviceIds = services.split(",").map((serviceId: string) => ({
      serviceId: Number(serviceId),
    }));

    // Step 2: Delete all existing relationships (ConfigBlog and ConfigService)
    await prisma.configBlog.deleteMany({
      where: { configId: configId },
    });

    await prisma.configService.deleteMany({
      where: { configId: configId },
    });

    // Step 3: Create new relationships
    // Create new blogs associations
    const createBlogRelations = blogIds.map(blogId => ({
      configId: configId,
      blogId: blogId.blogId,
    }));

    // Create new services associations
    const createServiceRelations = serviceIds.map(serviceId => ({
      configId: configId,
      serviceId: serviceId.serviceId,
    }));

    // Create the new associations in the respective tables
    await prisma.configBlog.createMany({
      data: createBlogRelations,
    });

    await prisma.configService.createMany({
      data: createServiceRelations,
    });

    // Step 4: Return the updated config with new associations (optional)
    const updatedConfig = await prisma.config.findUnique({
      where: { id: configId },
      include: {
        blogs: true,
        services: true,
      },
    });

    return updatedConfig;
  } catch (error) {
    console.error("Error updating config:", error);
    throw new Error(`An error occurred: ${error}`);
  }
};




export const PUT = async (req: NextRequest) => {
  try {
    const formData = await req.formData();

    // Parse the request body for configId, blogs, and services
    const services = formData.get("services") as string; // This is a comma-separated list of service IDs
    const id = formData.get("id") as string;
    const blogs = formData.get("blogs") as string;
    const configId = Number(id);
    if (!configId || !blogs || !services) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existingConfig = await prisma.config.findUnique({ where: { id: configId } });

    if (!existingConfig) {
      return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    // Call the updateConfig function
    const updatedConfig = await updateConfig(configId, blogs, services);

    return NextResponse.json({ message: 'Config updated successfully', config: updatedConfig });
  } catch (error) {
    console.error("Error updating config:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};




export const POST = async (req: NextRequest) => {
  let uploadedImagePath = null;

  try {
    const formData = await req.formData();

    uploadedImagePath = await handleFileUpload(formData);

    const id = formData.get("id");
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const slogan = formData.get("slogan") as string;

    const og_title = formData.get("og_title") as string;
    const og_description = formData.get("og_description") as string;
    const og_url = formData.get("og_url") as string;
    const meta_keywords = formData.get("meta_keywords") as string;
    const meta_description = formData.get("meta_description") as string;
    const meta_author = formData.get("meta_author") as string;
    const twitter_card = formData.get("twitter_card") as string;
    const twitter_site = formData.get("twitter_site") as string;
    const website_title = formData.get("website_title") as string;
    const website_description = formData.get("website_description") as string;
    const whatsapp_number = formData.get("whatsapp_number") as string;
    const facebookLink = formData.get("facebookLink") as string;
    const twitterLink = formData.get("twitterLink") as string;
    const instagramLink = formData.get("instagramLink") as string;
    const linkdingLink = formData.get("linkdingLink") as string;
    const bottomDescription = formData.get("bottomDescription") as string;

    // ✅ Correctly mapping the new fields
    const bookingMetaPageTitle = formData.get("bookingMetaPageTitle") as string;
    const bookingMetaPageDescription = formData.get("bookingMetaPageDescription") as string;
    const aboutPageContent = formData.get("aboutPageContent") as string;
    const aboutPageMetaTitle = formData.get("aboutPageMetaTitle") as string;
    const aboutPageMetaDescription = formData.get("aboutPageMetaDescription") as string;

    const services = formData.get("services") as string;
    const blogs = formData.get("blogs") as string;

    if (id) {
      const configId = Number(id);
      const existingConfig = await prisma.config.findUnique({ where: { id: configId } });

      if (!existingConfig) {
        if (uploadedImagePath) {
          deleteFile(path.resolve(UPLOAD_DIR, uploadedImagePath.split("/").pop() as string));
        }
        return NextResponse.json({ error: "Config not found" }, { status: 404 });
      }

      const updatedConfig = await prisma.config.update({
        where: { id: configId },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(og_title && { og_title }),
          ...(og_description && { og_description }),
          ...(og_url && { og_url }),
          ...(meta_keywords && { meta_keywords }),
          ...(meta_description && { meta_description }),
          ...(meta_author && { meta_author }),
          ...(twitter_card && { twitter_card }),
          ...(twitter_site && { twitter_site }),
          ...(website_title && { website_title }),
          ...(website_description && { website_description }),
          ...(slogan && { slogan }),
          ...(uploadedImagePath && { og_image: uploadedImagePath }),
          ...(whatsapp_number && { whatsapp_number }),
          ...(facebookLink && { facebookLink }),
          ...(twitterLink && { twitterLink }),
          ...(instagramLink && { instagramLink }),
          ...(linkdingLink && { linkdingLink }),
          ...(bottomDescription && { bottomDescription }),

          // ✅ Including new fields
          ...(bookingMetaPageTitle && { bookingMetaPageTitle }),
          ...(bookingMetaPageDescription && { bookingMetaPageDescription }),
          ...(aboutPageContent && { aboutPageContent }),
          ...(aboutPageMetaTitle && { aboutPageMetaTitle }),
          ...(aboutPageMetaDescription && { aboutPageMetaDescription }),
        },
      });

      return NextResponse.json({ message: "Config updated successfully", config: updatedConfig });

    } else {
      if (!title || !description || !website_title || !website_description) {
        if (uploadedImagePath) {
          deleteFile(path.resolve(UPLOAD_DIR, uploadedImagePath.split("/").pop() as string));
        }
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      const newConfig = await prisma.config.create({
        data: {
          title,
          description,
          og_title,
          og_description,
          og_url,
          meta_keywords,
          meta_description,
          meta_author,
          twitter_card,
          twitter_site,
          website_title,
          website_description,
          whatsapp_number,
          facebookLink,
          twitterLink,
          instagramLink,
          linkdingLink,
          bottomDescription,
          og_image: uploadedImagePath,

          // ✅ Adding new fields in create
          bookingMetaPageTitle,
          bookingMetaPageDescription,
          aboutPageContent,
          aboutPageMetaTitle,
          aboutPageMetaDescription,

          services: {
            create: services
              ? services.split(",").map((serviceId: string) => ({
                service: { connect: { id: Number(serviceId) } },
              }))
              : [],
          },
          blogs: {
            create: blogs
              ? blogs.split(",").map((blogId: string) => ({
                blog: { connect: { id: Number(blogId) } },
              }))
              : [],
          },
        },
      });

      return NextResponse.json({ message: "Config created successfully", config: newConfig });
    }
  } catch (error) {
    console.error("Error creating/updating config:", error);

    if (uploadedImagePath) {
      deleteFile(path.resolve(UPLOAD_DIR, uploadedImagePath.split("/").pop() as string));
    }

    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};



export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    // const visitorResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || ""}/api/trackvisitor`, {
    //   method: "GET",
    // });


    const id = searchParams.get("id");
    if (!id) {
      const configs = await prisma.config.findMany({
        include: {
          services: {
            include: {
              service: true, // Include the related service details
            },
          },
          blogs: {
            include: {
              blog: true, // Include the related blog details
            },
          },

        },
      });
      return NextResponse.json({ configs }, { status: 200 });
    } else {
      const config = await prisma.config.findUnique({
        where: { id: Number(id) },
        include: {
          services: {
            include: {
              service: true,
            },
          },
          blogs: {
            include: {
              blog: true,
            },
          },
        },
      });

      if (!config) {
        return NextResponse.json({ error: "Config not found" }, { status: 404 });
      }
      const mainCategory = await prisma.mainCategory.findMany({ where: { status: 1 } })

      return NextResponse.json({ config, mainCategory }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching configs:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Delete one config by id
      const config = await prisma.config.delete({
        where: { id: Number(id) },
      });

      // return NextResponse.json({ message: "Config deleted successfully", config }, { status: 200 });
    } else {
      // Delete all configs
      // const deletedConfigs = await prisma.config.deleteMany();

      // return NextResponse.json({ message: "All configs deleted successfully", deletedCount: deletedConfigs.count }, { status: 200 });
    }
  } catch (error) {
    console.error("Error deleting config:", error);
    return NextResponse.json({ error: `An error occurred: ${error}` }, { status: 500 });
  }
};