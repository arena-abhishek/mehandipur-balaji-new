import { getPostBySlug } from "@/utils/markdown";
import BlogDetails from "@/components/Blog_pre/BlogDetails";
import ErrorPage from "@/app/not-found";
import { Metadata } from "next/types";
import BookingDetails from "../../Service/details";

type Props = {
  params: { slug: string };
};

// ✅ Metadata Generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug(params.slug, [
    "name",
    "content",
    "coverImage",
    "publishedAt",
    "status",
    "likes",
    "metaTitle",
    "metaDescription",
  ]);

  if (!post) {
    return {
      title: "Service Not Found",
      description: "The service you are looking for does not exist.",
      keywords: "error, service, not found",
      openGraph: {
        title: "Service Not Found",
        description: "The service you are looking for does not exist.",
        url: `https://example.com/service/not-found`,
        images: [
          {
            url: "https://example.com/default-image.jpg",
            width: 800,
            height: 600,
            alt: "Service Not Found",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: "Service Not Found",
        description: "The service you are looking for does not exist.",
        images: ["https://example.com/default-image.jpg"],
      },
    };
  }

  const {
    name,
    content,
    coverImage,
    publishedAt,
    metaTitle,
    metaDescription,
  } = post;

  const imageUrl = coverImage || "https://example.com/default-cover-image.jpg";

  return {
    robots: "index, follow",
    title: metaTitle || name,
    description: metaDescription || content.slice(0, 150) + "...",
    keywords: `${name}, booking, service, mehandipur`,
    openGraph: {
      title: metaTitle || name,
      description: metaDescription || content.slice(0, 150) + "...",
      url: `https://example.com/service/${params.slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: name || "Service Cover Image",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle || name,
      description: metaDescription || content.slice(0, 150) + "...",
      images: [imageUrl],
    },
  };
}

// ✅ Main Component
export default async function BlogPage({ params }: Props) {
  const post = await getPostBySlug(params.slug, [
    "name",
    "content",
    "coverImage",
    "publishedAt",
    "status",
    "likes",
    "metaTitle",
    "metaDescription",
    "category"
  ]);

  if (!post) {
    return <ErrorPage />;
  }

  const { name, content, coverImage, publishedAt, likes, status, category } = post;

  return (
    <>
      {/* Service Details */}
      <BookingDetails bookingData={post} />

      {/* Blog Details Component */}
      {/* <BlogDetails
        title={name}
        content={content}
        coverImage={coverImage}
        publishedAt={publishedAt}
      // likes={likes}
      // status={status}
      /> */}
    </>
  );
}
