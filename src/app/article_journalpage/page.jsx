'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";

const ArticleJournalPageClient = dynamic(() => import("../article_journClient/client"), {
  ssr: false, // Important: disables server-side rendering so useSearchParams can be used safely
});

export default function ArticleJournalPage() {
  return (
    <Suspense fallback={<div>Loading article...</div>}>
      <ArticleJournalPageClient />
    </Suspense>
  );
}
