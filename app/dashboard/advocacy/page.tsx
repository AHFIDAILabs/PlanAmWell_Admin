"use client";

import { useEffect, useState } from "react";
import { getPublicArticles } from "../../services/AdvocacyService";
import Link from "next/link";
import { Edit, BarChart2, ArrowLeft } from "lucide-react";

export default function PublicAdvocacyList() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublicArticles()
      .then(res => setArticles(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-pink-600 animate-pulse">Articles</h1>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-28 bg-gray-200 rounded shadow animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-center text-gray-500">
        No articles available at the moment.
      </div>
    );
  }

return (
  <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

    {/* Header with Back Arrow */}
    <div className="flex items-center gap-4">
      <h1 className="text-3xl md:text-4xl font-bold text-pink-600 flex-1">
        Articles
      </h1>

      {/* Analytics Button */}
      <Link
        href="/dashboard/advocacy/analytics"
        className="flex items-center gap-2 bg-white p-2 md:px-4 md:py-2 rounded-full shadow hover:bg-pink-50 transition-colors duration-200"
        title="View Overall Analytics"
      >
        <BarChart2 size={18} className="text-pink-600" />
        <span className="hidden md:inline font-medium text-gray-700">Analytics</span>
      </Link>
    </div>

    {/* Articles Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map(a => (
        <div
          key={a._id}
          className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
        >
          {/* Main Article Link */}
          <Link
            href={`/dashboard/advocacy/${a.slug}`}
            className="block flex-1"
          >
            {a.featuredImage?.url && (
              <img
                src={a.featuredImage.url}
                alt={a.featuredImage.alt || a.title}
                className="w-full h-48 sm:h-40 lg:h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition-colors duration-200">
                {a.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1 line-clamp-3">
                {a.excerpt || "No summary available."}
              </p>
            </div>
          </Link>

          {/* Admin Actions */}
          <div className="absolute top-2 right-2 flex gap-2">
            <Link
              href={`/dashboard/advocacy/edit/${a._id}`}
              className="bg-white p-2 rounded-full shadow hover:bg-pink-50 transition-colors duration-200"
              title="Edit Article"
            >
              <Edit size={16} className="text-pink-600" />
            </Link>
            <Link
              href={`/dashboard/advocacy/analytics/${a._id}`}
              className="bg-white p-2 rounded-full shadow hover:bg-pink-50 transition-colors duration-200"
              title="View Analytics"
            >
              <BarChart2 size={16} className="text-pink-600" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}
