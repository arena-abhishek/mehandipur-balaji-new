import { pages } from "@/utils/markdown";
import Pages from "@/components/Blog_pre/Pages";
import ErrorPage from "@/app/not-found";
import { Metadata } from "next/types";
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await pages(params.slug, ["title"]);

  // Fallback metadata if the post is not found
  if (!post) {
    return {
      title: "Page Not Found",
      description: "The page you are looking for does not exist.",
    };
  }

  const { title } = post;

  return {
    title: `${title} - Mehandipur Balaji Sawamani `,
    description: `Read more about ${title} on Mehandipur Balaji Sawamani`,
    openGraph: {
      title: `${title} - Mandipur balaji`,
      description: `Learn more about ${title} on Mehandipur Balaji Sawamani`,
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${params.slug}`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/default-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${title} Cover Image`,
        },
      ],
    },
  };
}
type Props = {
  params: { slug: string };
};

export default async function Paages({ params }: Props) {
  console.log(`Fetching page data for slug: `);

  // Fetch post data using the slug
  const post = await pages(params.slug, ["title", "content"]);

  // Handle post not found
  if (!post) {
    return <ErrorPage />;
  }

  // Destructure post details
  const { title, content } = post;

  return (
    <div>
      {/* Render the Pages component */}
      <Pages title={title} content={content} />
    </div>
  );
}
