"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

export default function AdminArticleView() {
  const { id } = useParams();
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/advocacy/admin/all`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    }).then(res => {
      setArticle(res.data.data.find((x:any)=> x._id === id));
    });
  }, [id]);

  if (!article) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow">
      <h1 className="text-3xl font-bold text-pink-600 mb-2">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-4">{article.partner ? `By ${article.partner}` : "Partner: N/A"}</p>
      <img src={article.featuredImage} alt="" className="w-full rounded-md mb-4" />
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
    </div>
  );
}
