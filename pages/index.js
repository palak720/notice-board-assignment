import { useState } from "react";
import Head from "next/head";
import Layout from "@/components/Layout";
import NoticeCard from "@/components/NoticeCard";
import prisma from "@/lib/prisma";

export async function getServerSideProps() {
  const notices = await prisma.notice.findMany({
    orderBy: [
      { priority: "desc" }, // Urgent sorts above Normal — done in the DB query.
      { publishDate: "desc" },
    ],
  });

  return {
    props: {
      notices: JSON.parse(JSON.stringify(notices)),
    },
  };
}

export default function Home({ notices: initialNotices }) {
  const [notices, setNotices] = useState(initialNotices);

  function handleDeleted(id) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <Layout>
      <Head>
        <title>The Notice Board</title>
        <meta name="description" content="Announcements, exams and events, all in one place." />
      </Head>

      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Notices</h1>
        <p className="mt-1 text-sm text-muted">
          Urgent notices are pinned to the top, everything else follows by publish date.
        </p>
      </div>

      {notices.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </Layout>
  );
}

function EmptyState() {
  return (
    <div className="rounded-card border border-dashed border-border bg-surface px-6 py-16 text-center">
      <h2 className="font-display text-lg font-semibold text-ink">Nothing posted yet</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        This board is empty. Create the first notice and it will show up here for everyone.
      </p>
      <a
        href="/notices/new"
        className="mt-5 inline-block rounded-full bg-brand px-5 py-2.5 text-sm font-medium text-white shadow-card hover:bg-brand-dark"
      >
        + New notice
      </a>
    </div>
  );
}
