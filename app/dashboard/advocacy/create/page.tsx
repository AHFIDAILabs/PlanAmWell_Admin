"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { adminCreateArticle } from "../../../services/AdvocacyService";

export default function CreateArticlePage() {
  const router = useRouter();
  const [form, setForm] = useState<any>({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    partner: "",
    status: "draft",
    featured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    immediatelyRender: false, // Fix SSR
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TextStyle,
      Color,
    ],
    content: form.content,
    onUpdate: ({ editor }) => {
      setForm((prev: any) => ({ ...prev, content: editor.getHTML() }));
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  const handleSubmit = async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    try {
      const tagsArray = form.tags
        ? form.tags.split(",").map((t: string) => t.trim())
        : [];
      const payload = { ...form, tags: tagsArray };
      await adminCreateArticle(payload, file || undefined);
      router.push("/dashboard/advocacy");
    } catch (err: any) {
      alert(err.message || "Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url && editor) editor.chain().focus().setImage({ src: url }).run();
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url && editor) editor.chain().focus().setLink({ href: url }).run();
  };

  if (!editor) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="space-y-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-pink-600 mb-4">Create Article</h1>

      <div className="space-y-4 bg-white p-6 rounded-xl shadow">
        {/* TITLE */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            placeholder="Enter article title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* PARTNER */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Partner Name
          </label>
          <input
            placeholder="Partner organization name"
            value={form.partner}
            onChange={(e) => setForm({ ...form, partner: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          />
        </div>

        {/* CATEGORY + TAGS + SLUG */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              placeholder="e.g., Health, Education"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              placeholder="tag1, tag2, tag3"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <input
              placeholder="slug"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* EXCERPT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            placeholder="Brief summary of the article (150-200 characters)"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={3}
          />
        </div>

        {/* CONTENT */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>

          {/* Toolbar */}
          <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("bold") ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              <strong>B</strong>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("italic") ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              <em>I</em>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("underline") ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              <u>U</u>
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("strike") ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              <s>S</s>
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("heading", { level: 1 }) ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("heading", { level: 2 }) ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("heading", { level: 3 }) ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              H3
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("bulletList") ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("orderedList") ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              1. List
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`px-3 py-1 rounded ${
                editor.isActive("blockquote") ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              "Quote"
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`px-3 py-1 rounded ${
                editor.isActive({ textAlign: "left" }) ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              ⬅
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("center").run()}
              className={`px-3 py-1 rounded ${
                editor.isActive({ textAlign: "center" }) ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              ↔
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`px-3 py-1 rounded ${
                editor.isActive({ textAlign: "right" }) ? "bg-pink-200" : "bg-white"
              } border hover:bg-gray-100`}
            >
              ➡
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button
              type="button"
              onClick={addLink}
              className="px-3 py-1 rounded bg-white border hover:bg-gray-100"
            >
              🔗 Link
            </button>
            <button
              type="button"
              onClick={addImage}
              className="px-3 py-1 rounded bg-white border hover:bg-gray-100"
            >
              🖼 Image
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="px-3 py-1 rounded bg-white border hover:bg-gray-100"
            >
              ―
            </button>
          </div>

          {/* Editor */}
          <div className="border border-t-0 border-gray-300 rounded-b-lg bg-white">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* FEATURED + STATUS + IMAGE */}
        <div className="flex flex-wrap gap-4 items-center pt-4 border-t">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="text-sm font-medium text-gray-700">Featured Article</span>
          </label>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-pink-50 file:text-pink-700
                hover:file:bg-pink-100
                cursor-pointer"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-6 pt-4 border-t">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Saving..." : "Save Article"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
