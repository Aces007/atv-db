import { Suspense } from "react";
import dynamic from "next/dynamic";

const ArticleJournalPageClient = dynamic(() => import("./ArticleJournalPageClient"), { ssr: false });

export default function Page() {
    return (
        <Suspense fallback={<div className="text-center p-8">Loading article...</div>}>
            <ArticleJournalPageClient />
        </Suspense>
    )
}