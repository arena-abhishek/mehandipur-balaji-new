"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, Edit, Trash2, ArrowLeft, Eye, Share2 } from "lucide-react";
import Link from "next/link";

const ServiceDetailAdminPage = () => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slug, setSlug] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("slug");

  useEffect(() => {
    if (serviceId) {
      setSlug(serviceId);
    }
  }, [serviceId]);

  useEffect(() => {
    if (slug) {
      const fetchService = async () => {
        try {
          const response = await fetch(`/api/maincategory?slug=${slug}`);
          if (!response.ok) {
            throw new Error("Failed to fetch service details");
          }
          const data = await response.json();
          setService(data.Service);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchService();
    }
  }, [slug]);

  const handleEdit = () => {
    router.push(`/admin/services/edit/${slug}`);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      // Implement delete functionality
    }
  };

  const handlePreview = () => {
    window.open(`/services/${slug}`, '_blank');
  };

  if (!slug) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      {error}
    </div>
  );

  if (!service) return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
      Service not found
    </div>
  );

  return (
    <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {service.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mt-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(service.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Approx. {Math.ceil(service.content.split(" ").length / 200)} min read</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${service.status === "Published"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                    }`}>
                    {service.status}
                  </div>
                </div>
              </div>
            </div>

            {service.featuredImage && (
              <div className="relative w-full h-[400px] mt-8 rounded-lg overflow-hidden">
                <Image
                  src={`/api${service.featuredImage}`}

                  // src={service.featuredImage}
                  alt={service.featuredImageAltText || service.title}
                  className="object-cover"
                  fill
                  priority
                />
              </div>
            )}

            <div className="mt-8 prose max-w-none dark:prose-invert">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                {service.metaDescription}
              </p>
              <div
                className="formatted-content"
                dangerouslySetInnerHTML={{ __html: service.content }}
              />
            </div>
          </div>
        </div>

        {/* Meta Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              SEO & Meta Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Meta Title</h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  {service.metaTitle}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">URL Slug</h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  {service.slug}
                </p>
              </div>
              <div className="space-y-2 md:col-span-2">
                <h3 className="font-medium text-gray-900 dark:text-gray-100">Meta Description</h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
                  {service.metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailAdminPage;