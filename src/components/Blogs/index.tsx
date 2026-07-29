'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';

interface Blog {
  id: number | string;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  featuredImage: string;
  publishedAt: string;
  status: string;
  views: number;
  likes: number;
  tags: string[];
}

interface BlogCardsProps {
  maxLength?: number;
  maxBlogs?: number;
}

const BlogCards: React.FC<BlogCardsProps> = ({ maxLength = 150, maxBlogs }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`/api/blog`);
        const apiBlogs = response.data.blogs.map((blog: any) => ({
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          metaTitle: blog.metaTitle,
          metaDescription: blog.metaDescription,
          featuredImage: blog.featuredImage,
          publishedAt: blog.publishedAt,
          status: blog.status,
          views: blog.views,
          likes: blog.likes,
          tags: blog.tags
        }));

        setBlogs(apiBlogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const blogsToShow = maxBlogs ? blogs.slice(0, maxBlogs) : blogs;

  return (
    <section className="py-10 bg-gray-50">
      <div className="container mx-auto px-4">
        {maxBlogs && (
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Blogs</h1>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {blogsToShow.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
              maxLength={maxLength}
            />
          ))}
        </div>

        {maxBlogs && blogs.length > maxBlogs && (
          <div className="text-center mt-6">
            <Link
              href="/blogs"
              className="px-10 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
              View All Blogs
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

interface BlogCardProps {
  blog: Blog;
  maxLength: number;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, maxLength }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);

  const truncatedDescription = blog.metaDescription.length > maxLength
    ? `${blog.metaDescription.substring(0, maxLength)}...`
    : blog.metaDescription;

  const description = showFullDescription ? blog.metaDescription : truncatedDescription;

  return (
    <Link
      href={`/blogs/${blog.slug}`}
    // className="block mt-4 text-center bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition"
    >
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={`/api${blog.featuredImage}`}

            // src={blog.featuredImage}
            alt={blog.title}
            fill
            className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-5">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
            <span className="bg-orange-400 text-orange-800 px-2 py-0.5 rounded-full text-xs">
              {blog.status}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-orange-600 transition-colors duration-200">
            {blog.title}
          </h3>

          <p className="text-gray-600 mb-4">{description}</p>

          {blog.metaDescription.length > maxLength && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              {showFullDescription ? 'Show Less' : 'View More'}
            </button>
          )}

          <Link
            href={`/blogs/${blog.slug}`}
            className="block mt-4 text-center bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition"
          >
            Read More
          </Link>
        </div>
      </div>     </Link>
  );
};

export default BlogCards;
