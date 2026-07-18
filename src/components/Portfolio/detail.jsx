"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Link as LinkIcon, Layers, Clock, Users, Globe, Phone, Mail } from 'lucide-react';
import Image from "next/image";
// import { log } from 'console';


function Detail(slug) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceSlug = slug.slug
  // console.log("aaya ", serviceSlug);

  const [portfolioData, setPortfolioData] = useState(null);

  // Fetch portfolio data based on the slug from the URL
  useEffect(() => {
    if (serviceSlug) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/portfolio?slug=${serviceSlug}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.portfolios && data.portfolios.length > 0) {
            setPortfolioData(data.portfolios[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching portfolio data:", error);
        });
    }
  }, [serviceSlug]);

  if (!portfolioData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-4xl sm:text-5xl font-bold">{portfolioData.title}</h1>
          </div>
          <div className="mt-4 flex items-center text-blue-100">
            <Layers className="w-5 h-5 mr-2" />
            {portfolioData.category}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2">
            <div className="relative h-[500px] mb-12">
              <Image
                width={1000}
                height={500}
                src={`${process.env.NEXT_PUBLIC_API_URL}/api${portfolioData.image}`}

                // src={portfolioData.image}
                alt={portfolioData.title}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
            <section className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Project Overview</h2>
              <div
                className="text-gray-700 text-lg leading-relaxed"
                dangerouslySetInnerHTML={{ __html: portfolioData.longDescription }}
              />
            </section>


            {/* <section className="mb-12">
              <h2 className="text-3xl font-bold mb-8">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="font-bold text-xl mb-2">Real-time Monitoring</h3>
                  <p className="text-gray-600">24/7 security monitoring with instant alerts and notifications</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="font-bold text-xl mb-2">Advanced Security</h3>
                  <p className="text-gray-600">Multi-layer security protocols with encryption</p>
                </div>
              </div>
            </section> */}

            {/* <section>
              <h2 className="text-3xl font-bold mb-6">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md font-medium">React Native</span>
                <span className="px-6 py-3 bg-gray-100 text-gray-800 rounded-md font-medium">Node.js</span>
              </div>
            </section> */}
          </div>

          {/* Right Column - Project Info */}
          <div className="lg:col-span-1">
            <div className="border-l border-gray-200 pl-8">
              <h2 className="text-2xl font-bold mb-8">Project Information</h2>

              <div className="space-y-6">
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Project Duration</p>
                    <p className="font-semibold text-lg">{portfolioData.duration}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Users className="w-6 h-6 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-semibold text-lg">{portfolioData.client}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Globe className="w-6 h-6 text-blue-600 mr-4" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-semibold text-lg">{portfolioData.website}</p>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Phone className="w-6 h-6 text-blue-600 mr-4" />
                      <p className="text-lg">{portfolioData.contactPhone}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-6 h-6 text-blue-600 mr-4" />
                      <p className="text-lg">{portfolioData.contactEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
