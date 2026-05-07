import { Suspense } from "react";
import CohortDetailClient from "./CohortDetailClient";

export default function CohortDetailPage() {
  // `useSearchParams()` is used inside the client component.
  // Wrapping it in a Suspense boundary fixes Next.js static export prerender errors.
  return (
    <Suspense fallback={<div className="admin-page" />}>
      <CohortDetailClient />
    </Suspense>
  );
}
