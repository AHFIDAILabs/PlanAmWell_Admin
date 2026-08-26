"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEventService, EventPayload } from "../../../services/AdminService";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";
import { Button } from "../../../components/ui/Button";
import { ArrowLeft } from "lucide-react";

interface FormState {
  title: string;
  description: string;
  category: string;
  startsAt: string;
  endsAt: string;
  isVirtual: boolean;
  location: string;
  capacity: string;
}

const EMPTY_FORM: FormState = {
  title: "",
  description: "",
  category: "",
  startsAt: "",
  endsAt: "",
  isVirtual: true,
  location: "",
  capacity: "",
};

export default function CreateEventPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.description.trim() || !form.startsAt) {
      setError("Title, description, and start time are required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload: EventPayload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim() || undefined,
        startsAt: new Date(form.startsAt).toISOString(),
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
        isVirtual: form.isVirtual,
        location: form.isVirtual ? undefined : form.location.trim() || undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
      };
      await createEventService(payload);
      router.push("/dashboard/events");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to create event");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-primary">New Community Event</h1>
      </div>

      {error && (
        <div className="rounded-2xl border border-error-container bg-error-container px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      <Card className="space-y-4">
        <Input label="Title" placeholder="e.g. Teen SRHR Support Circle" value={form.title} onChange={(e) => set("title", e.target.value)} />
        <Textarea
          label="Description"
          placeholder="What is this event about, and who is it for?"
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
        />
        <Input
          label="Category"
          placeholder="e.g. Support Group, Workshop, Q&A"
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Starts at"
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => set("startsAt", e.target.value)}
          />
          <Input
            label="Ends at (optional)"
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => set("endsAt", e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isVirtual"
            checked={form.isVirtual}
            onChange={(e) => set("isVirtual", e.target.checked)}
            className="h-5 w-5 rounded border-outline text-primary focus:ring-primary"
          />
          <label htmlFor="isVirtual" className="text-sm font-semibold text-on-surface">
            This is a virtual/online event
          </label>
        </div>

        {!form.isVirtual && (
          <Input
            label="Location"
            placeholder="Venue address or area"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
          />
        )}

        <Input
          label="Capacity (optional)"
          type="number"
          min={1}
          placeholder="Leave blank for unlimited"
          value={form.capacity}
          onChange={(e) => set("capacity", e.target.value)}
        />
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.push("/dashboard/events")} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? "Creating..." : "Create Event"}
        </Button>
      </div>
    </div>
  );
}
