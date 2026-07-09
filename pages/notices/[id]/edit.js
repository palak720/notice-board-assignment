import Head from "next/head";
import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";
import prisma from "@/lib/prisma";

export async function getServerSideProps({ params }) {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return { notFound: true };
  }

  const notice = await prisma.notice.findUnique({ where: { id } });
  if (!notice) {
    return { notFound: true };
  }

  return {
    props: {
      notice: JSON.parse(JSON.stringify(notice)),
    },
  };
}

export default function EditNoticePage({ notice }) {
  return (
    <Layout>
      <Head>
        <title>Edit notice · The Notice Board</title>
      </Head>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-ink">Edit notice</h1>
        <p className="mt-1 text-sm text-muted">Update the details and save your changes.</p>
        <div className="mt-6 rounded-card border border-border bg-surface p-6 shadow-card">
          <NoticeForm initialNotice={notice} noticeId={notice.id} />
        </div>
      </div>
    </Layout>
  );
}
