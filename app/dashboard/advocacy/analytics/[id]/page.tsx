"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getArticleStats } from "../../../../services/AdvocacyService";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ArticleAnalytics() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getArticleStats(id)
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading analytics...</div>;

  if (!stats)
    return (
      <div className="p-6 text-red-600">
        No stats available for this article.
      </div>
    );

  const { article } = stats;

  const dailyViewsChart = {
    labels: article.dailyViews?.map((d: any) => d.date) || [],
    datasets: [
      {
        label: "Daily Views",
        data: article.dailyViews?.map((d: any) => d.views) || [],
        backgroundColor: "rgba(236, 72, 153, 0.7)",
      },
    ],
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Article Title */}
      <h1 className="text-3xl font-bold text-pink-600">{article.title} Analytics</h1>

      {/* Basic Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Views</p>
          <p className="text-2xl font-bold">{article.views}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Likes</p>
          <p className="text-2xl font-bold">{article.likes}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Shares</p>
          <p className="text-2xl font-bold">{article.shares || 0}</p>
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {article.partner && (
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Partner</p>
            <p className="font-semibold">{article.partner}</p>
          </div>
        )}
        {article.category && (
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-semibold">{article.category}</p>
          </div>
        )}
        {article.tags?.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <p className="text-sm text-gray-500">Tags</p>
            <p className="font-semibold">{article.tags.join(", ")}</p>
          </div>
        )}
      </div>

      {/* Top Referrers */}
      {article.referrers?.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Top Referrers</h2>
          <ul className="list-disc list-inside text-gray-700">
            {article.referrers.map((r: any, i: number) => (
              <li key={i}>
                {r.source} — {r.count} views
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Daily Views Chart */}
      {article.dailyViews?.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Daily Views</h2>
          <Bar data={dailyViewsChart} />
        </div>
      )}

      {/* Top Countries */}
      {article.topCountries?.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Top Countries</h2>
          <ul className="list-disc list-inside text-gray-700">
            {article.topCountries.map((c: any, i: number) => (
              <li key={i}>
                {c.country} — {c.views} views
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Top Devices */}
      {article.topDevices?.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Top Devices</h2>
          <ul className="list-disc list-inside text-gray-700">
            {article.topDevices.map((d: any, i: number) => (
              <li key={i}>
                {d.device} — {d.views} views
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Comments Section */}
      {article.comments?.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">
            Comments ({article.comments.length})
          </h2>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {article.comments.map((c: any) => (
              <div key={c._id} className="border-b pb-2 last:border-none">
                <p className="text-sm font-semibold text-gray-800">
                  {c.author?.name || "Anonymous"}{" "}
                  {c.status === "flagged" && (
                    <span className="ml-2 text-xs text-red-600 font-normal">
                      [Flagged: {c.flagReason}]
                    </span>
                  )}
                </p>

                <p className="text-gray-600 text-sm">{c.content}</p>

                <div className="text-xs text-gray-400 mt-1">
                  {new Date(c.createdAt).toLocaleString()} • ❤️ {c.likes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
