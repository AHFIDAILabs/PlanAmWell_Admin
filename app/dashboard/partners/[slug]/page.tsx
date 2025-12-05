"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function PartnerPage() {
  const { slug } = useParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/advocacy/admin/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      params: { partner: slug }
    }).then(res => {
      setArticles(res.data.data || []);
    }).finally(()=> setLoading(false));
  }, [slug]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">Partner: {slug}</h1>
      <div className="space-y-4">
        {loading ? <p>Loading...</p> : articles.map(a => (
          <div key={a._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-sm text-gray-500">{a.excerpt}</p>
            </div>
            <div>
              <button className="px-3 py-1 rounded bg-pink-600 text-white" onClick={() => location.href = `/dashboard/advocacy/view/${a._id}`}>View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
