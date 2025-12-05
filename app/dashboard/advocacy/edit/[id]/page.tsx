"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminUpdateArticle } from "../../../../services/AdvocacyService";
import axios from "axios";

export default function EditArticlePage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // FIX

  const router = useRouter();
  const [form, setForm] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/advocacy/admin/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        const found = res.data.data.find((x: any) => x._id === id);
        setForm(found);
      });
  }, [id]);

  if (!form) return <div className="p-6">Loading...</div>;

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = { ...form };
      await adminUpdateArticle(id!, payload, file || undefined);
      router.push("/dashboard/advocacy");
    } catch (err: any) {
      alert(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">Edit Article</h1>

      <div className="space-y-4 bg-white p-4 rounded-xl shadow">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <input
          value={form.partner || ""}
          onChange={(e) => setForm({ ...form, partner: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <input
          value={form.category || ""}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full p-2 border rounded"
        />

        <input
          value={(form.tags || []).join(", ")}
          onChange={(e) =>
            setForm({
              ...form,
              tags: e.target.value.split(",").map((s: string) => s.trim()),
            })
          }
          className="w-full p-2 border rounded"
        />

        <textarea
          value={form.excerpt || ""}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full p-2 border rounded"
          rows={3}
        />

        <textarea
          value={form.content || ""}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full p-2 border rounded"
          rows={8}
        />

        <div className="flex gap-3 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(e.target.files?.[0] ? e.target.files[0] : null)
            }
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="bg-pink-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
