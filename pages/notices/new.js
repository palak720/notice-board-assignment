import Head from "next/head";
import Layout from "@/components/Layout";
import NoticeForm from "@/components/NoticeForm";

export default function NewNoticePage() {
  return (
    <Layout>
      <Head>
        <title>New notice · The Notice Board</title>
      </Head>
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-semibold text-ink">New notice</h1>
        <p className="mt-1 text-sm text-muted">Fill in the details below to publish a new notice.</p>
        <div className="mt-6 rounded-card border border-border bg-surface p-6 shadow-card">
          <NoticeForm />
        </div>
      </div>
    </Layout>
  );
}
