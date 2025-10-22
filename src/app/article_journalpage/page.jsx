'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";



const ArticleJournalClient = dynamic(() => import("./ArticleJournalPageClient"), {
  ssr: false, // Important: disables server-side rendering so useSearchParams can be used safely
});


export default function ArticleJournalPage() {
  return (
    <Suspense fallback={<div>Loading article...</div>}>
      <ArticleJournalClient />
    </Suspense>
  );
}
