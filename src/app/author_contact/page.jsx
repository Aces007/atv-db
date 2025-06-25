'use client';

import dynamic from "next/dynamic";
import { Suspense } from "react";


const ContactAuthorClient = dynamic(() => import("../authorcontactClient/client"), {
  ssr: false, // Important: disables server-side rendering so useSearchParams can be used safely
});


export default function ContactAuthorPage() {
  return (
    <Suspense fallback={<div>Loading article...</div>}>
      <ContactAuthorClient />
    </Suspense>
  );
}
