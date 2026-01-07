"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getArticleBySlug } from "../../../services/AdvocacyService";
import { ArrowLeft } from "lucide-react";
import NextLink from "next/link";

export default function PublicArticleView() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    const articleSlug = Array.isArray(slug) ? slug[0] : slug; // ensure string

    getArticleBySlug(articleSlug)
      .then(res => setArticle(res))
      .catch(err => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!article) return <div className="p-6">Article not found.</div>;

  return (

    <>
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
      </div>

    </div>
    
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
        <h1 className="text-2xl font-bold text-pink-600">{article.title}</h1>
        <p className="text-sm text-gray-500 mb-4">
          {article.author?.name ? `By ${article.author.name}` : ""}
        </p>
        {article.featuredImage?.url && (
          <img src={article.featuredImage.url} alt={article.featuredImage.alt || ""} className="mb-4 rounded" />
        )}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div></>
  );
}
