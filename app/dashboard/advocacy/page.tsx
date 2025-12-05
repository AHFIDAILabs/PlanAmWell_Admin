"use client";
import { useEffect, useState } from "react";
import { getPublicArticles } from "../../services/AdvocacyService";
import Link from "next/link";

export default function PublicAdvocacyList() {
  const [articles, setArticles] = useState<any[]>([]);
  useEffect(()=> {
    getPublicArticles().then(res => setArticles(res.data || []));
  }, []);
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-pink-600">Articles</h1>
      {articles.map(a => (
  <Link
    key={a._id}
    href={`/advocacy/${a.slug}`}
    className="block bg-white p-4 rounded shadow hover:shadow-lg"
  >
    <h2 className="font-semibold">{a.title}</h2>
    <p className="text-sm text-gray-500">{a.excerpt}</p>
  </Link>
))}
    </div>
  );
}
