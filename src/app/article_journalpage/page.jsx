import { Suspense } from "react";
import ArticleJournalPageClient from "../article_journClient/client";

export default function ArticleJournalPageWrapper() {
  return (
    <Suspense fallback={<div>Loading article...</div>}>
      <ArticleJournalPageClient />
    </Suspense>
  );
}
