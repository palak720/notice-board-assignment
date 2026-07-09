import { useState } from "react";
import { useRouter } from "next/router";
import { CATEGORIES, PRIORITIES } from "@/lib/validateNotice";

const MAX_IMAGE_BYTES = 3 * 1024 * 1024; // 3MB, matches server-side cap headroom

function toDateInputValue(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function NoticeForm({ initialNotice, noticeId }) {
  const router = useRouter();
  const isEdit = Boolean(noticeId);

  const [values, setValues] = useState({
    title: initialNotice?.title ?? "",
    body: initialNotice?.body ?? "",
    category: initialNotice?.category ?? "General",
    priority: initialNotice?.priority ?? "Normal",
    publishDate: toDateInputValue(initialNotice?.publishDate) || toDateInputValue(new Date()),
    image: initialNotice?.image ?? "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setValues((v) => ({ ...v, [field]: value }));
    setFieldErrors((e) => ({ ...e, [field]: undefined }));
  }

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) {
      update("image", "");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setFieldErrors((e2) => ({ ...e2, image: "Please choose an image file." }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setFieldErrors((e2) => ({ ...e2, image: "Image must be under 3MB." }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("image", reader.result);
    reader.readAsDataURL(file);
  }

  // Basic client-side checks for a fast, friendly UX.
  // The API route re-validates everything server-side regardless.
  function clientValidate() {
    const errors = {};
    if (!values.title.trim()) errors.title = "Title is required.";
    if (!values.body.trim()) errors.body = "Body is required.";
    if (!CATEGORIES.includes(values.category)) errors.category = "Choose a category.";
    if (!PRIORITIES.includes(values.priority)) errors.priority = "Choose a priority.";
    if (!values.publishDate || Number.isNaN(new Date(values.publishDate).getTime())) {
      errors.publishDate = "Choose a valid date.";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const clientErrors = clientValidate();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: values.title,
        body: values.body,
        category: values.category,
        priority: values.priority,
        publishDate: new Date(values.publishDate).toISOString(),
        image: values.image || null,
      };

      const res = await fetch(isEdit ? `/api/notices/${noticeId}` : "/api/notices", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.fields) setFieldErrors(data.fields);
        setFormError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.push("/");
    } catch (err) {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {formError && (
        <p className="rounded-card border border-urgent/30 bg-urgent-light px-4 py-3 text-sm text-urgent-dark">
          {formError}
        </p>
      )}

      <Field label="Title" error={fieldErrors.title} htmlFor="title">
        <input
          id="title"
          type="text"
          value={values.title}
          onChange={(e) => update("title", e.target.value)}
          maxLength={200}
          placeholder="e.g. Mid-term exam schedule released"
          className={inputClass(fieldErrors.title)}
        />
      </Field>

      <Field label="Body" error={fieldErrors.body} htmlFor="body">
        <textarea
          id="body"
          value={values.body}
          onChange={(e) => update("body", e.target.value)}
          rows={6}
          maxLength={5000}
          placeholder="Write the full notice details here…"
          className={inputClass(fieldErrors.body)}
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category" error={fieldErrors.category} htmlFor="category">
          <select
            id="category"
            value={values.category}
            onChange={(e) => update("category", e.target.value)}
            className={inputClass(fieldErrors.category)}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Priority" error={fieldErrors.priority} htmlFor="priority">
          <select
            id="priority"
            value={values.priority}
            onChange={(e) => update("priority", e.target.value)}
            className={inputClass(fieldErrors.priority)}
          >
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Publish date" error={fieldErrors.publishDate} htmlFor="publishDate">
        <input
          id="publishDate"
          type="date"
          value={values.publishDate}
          onChange={(e) => update("publishDate", e.target.value)}
          className={inputClass(fieldErrors.publishDate)}
        />
      </Field>

      <Field label="Image (optional)" error={fieldErrors.image} htmlFor="image">
        <input
          id="image"
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          onChange={handleImageChange}
          className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-brand-light file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-dark hover:file:bg-brand/20"
        />
        {values.image && (
          <div className="mt-3 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={values.image} alt="Preview" className="h-20 w-20 rounded-card object-cover" />
            <button
              type="button"
              onClick={() => update("image", "")}
              className="text-sm font-medium text-urgent-dark hover:underline"
            >
              Remove image
            </button>
          </div>
        )}
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-card transition hover:bg-brand-dark hover:shadow-cardHover disabled:opacity-60"
        >
          {submitting ? "Saving…" : isEdit ? "Save changes" : "Publish notice"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({ label, htmlFor, error, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-urgent-dark">{error}</p>}
    </div>
  );
}

function inputClass(hasError) {
  return `w-full rounded-card border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:outline-none ${
    hasError ? "border-urgent" : "border-border"
  }`;
}
