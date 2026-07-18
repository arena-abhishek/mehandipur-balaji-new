 type Blog = {
  id?: number;
  title?: string;
  slug?: string;
  excerpt?: string;
  coverImage?: string;
  date: string;
  publishedAt: any;

};


type Service = {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  featuredImageAltText: string | null;
  authorId: number;
  publishedAt: any;
  updatedAt: string;
  status: string;
  views: number;
  likes: number;
  icon: string;
};

export type Config = {
  id: number;
  title: string;
  description: string;
  og_image: string;
  og_title: string;
  og_description: string;
  og_url: string;
  meta_keywords: string;
  meta_description: string;
  meta_author: string;
  twitter_card: string;
  twitter_site: string;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image: string | null;
  whatsapp_number: string | null;
  website_title: string;
  website_description: string;
  slogan: string;
  createdAt: string;
  updatedAt: string;
  services: { configId: number; serviceId: number; service: Service }[];
  blogs: { configId: number; blogId: number; blog: Blog }[];
};
