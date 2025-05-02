import { Suspense } from "react";
import ArticleJournalPage from "../article_journalpage/page";

const ArticleJournalPageDynamic = () => {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading article...</div>}>
            <ArticleJournalPage />
        </Suspense>
    )
}


export default ArticleJournalPageDynamic;