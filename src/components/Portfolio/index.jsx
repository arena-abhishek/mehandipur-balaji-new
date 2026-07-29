"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import Image from "next/image";

const PortfolioShowcase = () => {
  const router = useRouter();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`/api/portfolio`);
        const data = await response.json();
        setProjects(data.portfolios); // Update the state with the portfolio data
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="bg-white pb-10 pt-20 dark:bg-dark lg:pb-20 lg:pt-[0]">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link href={`/portfolio/${project.slug}`}>
                <div className="relative h-48">
                  <Image
                    width={100}
                    height={100}
                    src={`/api${project.image}`}

                    // src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <div className="p-6 bg-gray-50">
                <span className="text-sm font-medium text-blue-600">
                  {project.category}
                </span>
                <h3 className="text-xl font-semibold mt-2 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-600">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-orange-100 rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold mb-6 max-w-3xl mx-auto">
            {/* New text here */}
            Unlock the potential of your business with our expertise in solving challenges across diverse industries such as FinTech, eCommerce, Healthcare, and more!
          </h2>
          <button onClick={() => router.push("/contact")} className="bg-orange text-white px-6 py-3 rounded-md hover:bg-orange-800 transition-colors">
            Let&apos;s Talk  »
          </button>
        </div>

      </div>
    </div>
  );
};

export default PortfolioShowcase;
