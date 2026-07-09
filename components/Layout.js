import Link from "next/link";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-surface shadow-card">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 4h14a1 1 0 0 1 1 1v13.5a.5.5 0 0 1-.777.416L16 16.5H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path d="M7.5 8.5h9M7.5 11.5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              The Notice Board
            </span>
          </Link>
          <Link
            href="/notices/new"
            className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-surface shadow-card transition hover:bg-brand-dark hover:shadow-cardHover"
          >
            + New notice
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-10">{children}</div>
    </div>
  );
}
