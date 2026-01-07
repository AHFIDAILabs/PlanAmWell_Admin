"use client";

import { useEffect, useState } from "react";
import { getAdvocacyStats } from "../../../services/AdvocacyService";
import { ArrowLeft } from "lucide-react";
import NextLink from "next/link"; // Correct Link import

export default function AdvocacyAnalytics() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    getAdvocacyStats().then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

      {/* Header with Back Arrow */}
      <div className="flex items-center gap-4">
        <NextLink
          href="/dashboard/advocacy"
          className="flex items-center gap-2 text-gray-700 hover:text-pink-600 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </NextLink>

        <h1 className="text-2xl md:text-3xl font-bold text-pink-600">
          Advocacy Analytics
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Articles</p>
          <p className="text-2xl font-bold">{stats.totalArticles}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold">{stats.publishedArticles}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-2xl font-bold">{stats.totalViews}</p>
        </div>
      </div>

      {/* Top Categories */}
      <h3 className="font-semibold mb-2">Top Categories</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {stats.categoryStats.map((c: any) => (
          <div key={c._id} className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">{c._id}</p>
            <p className="font-semibold">{c.count} articles</p>
            <p className="text-xs text-gray-400">Views: {c.views} • Likes: {c.likes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
