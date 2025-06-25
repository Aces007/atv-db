import { Suspense } from "react";
import ArticleJournalPageClient from "../article_journClient/page";

export default function ArticleJournalPageWrapper() {
  return (
    <Suspense fallback={<div>Loading article...</div>}>
      <ArticleJournalPageClient />
    </Suspense>
  );
}
