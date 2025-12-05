"use client";
import { useEffect, useState } from "react";
import { getAdvocacyStats } from "../../../services/AdvocacyService";

export default function AdvocacyAnalytics() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    getAdvocacyStats().then(res => setStats(res.data));
  }, []);
  if (!stats) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-pink-600 mb-6">Advocacy Analytics</h1>

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

      <h3 className="font-semibold mb-2">Top Categories</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {stats.categoryStats.map((c:any) => (
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
