import { useState } from "react";
import { useRouter } from "next/router";

export default function ConfirmDeleteButton({ noticeId, title, onDeleted }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/notices/${noticeId}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to delete notice.");
      }
      setOpen(false);
      if (onDeleted) {
        onDeleted(noticeId);
      } else {
        router.replace(router.asPath);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-transparent px-3.5 py-1.5 text-sm font-medium text-urgent-dark transition hover:bg-urgent-light"
      >
        Delete
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-delete-heading"
        >
          <div className="w-full max-w-sm rounded-card bg-surface p-6 shadow-cardHover">
            <h2 id="confirm-delete-heading" className="font-display text-lg font-semibold text-ink">
              Delete this notice?
            </h2>
            <p className="mt-2 text-sm text-muted">
              &ldquo;{title}&rdquo; will be permanently removed. This can&apos;t be undone.
            </p>
            {error && <p className="mt-2 text-sm text-urgent-dark">{error}</p>}
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={deleting}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink transition hover:border-ink disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={deleting}
                className="rounded-full bg-urgent px-4 py-2 text-sm font-medium text-white transition hover:bg-urgent-dark disabled:opacity-50"
              >
                {deleting ? "Deleting…" : "Delete notice"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
