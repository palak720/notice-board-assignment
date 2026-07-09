import Link from "next/link";
import ConfirmDeleteButton from "@/components/ConfirmDeleteButton";

const CATEGORY_STYLES = {
  Exam: "bg-brand-light text-brand-dark",
  Event: "bg-[#EAE3F7] text-[#5B3E9C]",
  General: "bg-[#E7ECEF] text-[#3F5361]",
};

function formatDate(dateString) {
  const d = new Date(dateString);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function NoticeCard({ notice, onDeleted }) {
  const isUrgent = notice.priority === "Urgent";

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-card border bg-surface shadow-card transition hover:-translate-y-0.5 hover:shadow-cardHover ${
        isUrgent ? "border-urgent/40" : "border-border"
      }`}
    >
      {/* Pin: the board's signature element, colored by priority */}
      <span
        aria-hidden="true"
        className={`absolute right-4 top-4 h-2.5 w-2.5 rounded-full ring-4 ${
          isUrgent ? "bg-urgent ring-urgent-light" : "bg-brand ring-brand-light"
        }`}
      />

      {notice.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={notice.image}
          alt=""
          className="h-40 w-full object-cover"
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {isUrgent && (
            <span className="inline-flex items-center gap-1 rounded-full bg-urgent px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              Urgent
            </span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${CATEGORY_STYLES[notice.category]}`}
          >
            {notice.category}
          </span>
          <span className="font-mono text-xs text-muted">
            {formatDate(notice.publishDate)}
          </span>
        </div>

        <h2 className="font-display text-lg font-semibold leading-snug text-ink pr-4">
          {notice.title}
        </h2>

        <p className="line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
          {notice.body}
        </p>

        <div className="mt-2 flex items-center gap-3 border-t border-border pt-4">
          <Link
            href={`/notices/${notice.id}/edit`}
            className="rounded-full border border-border px-3.5 py-1.5 text-sm font-medium text-ink transition hover:border-brand hover:text-brand"
          >
            Edit
          </Link>
          <ConfirmDeleteButton noticeId={notice.id} title={notice.title} onDeleted={onDeleted} />
        </div>
      </div>
    </article>
  );
}
