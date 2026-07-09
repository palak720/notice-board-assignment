import Layout from "@/components/Layout";

export default function NotFound() {
  return (
    <Layout>
      <div className="rounded-card border border-dashed border-border bg-surface px-6 py-16 text-center">
        <h1 className="font-display text-xl font-semibold text-ink">Notice not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          It may have been deleted, or the link is incorrect.
        </p>
        <a
          href="/"
          className="mt-5 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-card hover:bg-brand-dark"
        >
          Back to the board
        </a>
      </div>
    </Layout>
  );
}
