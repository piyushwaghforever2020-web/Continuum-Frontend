import { Suspense } from "react";
import EditCohortClient from "./EditCohortClient";

export default function EditCohortPage() {
  return (
    <Suspense fallback={<div className="admin-page" />}>
      <EditCohortClient />
    </Suspense>
  );
}
