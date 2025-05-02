import ArticleJournalPage from "@/components/ArticleJournalPage";
import { Suspense } from "react";

const ArticleJournalPageDynamic = () => {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading article...</div>}>
            <ArticleJournalPage />
        </Suspense>
    )
}


export default ArticleJournalPageDynamic;