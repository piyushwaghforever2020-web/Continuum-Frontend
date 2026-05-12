import { Suspense } from "react";
import CreateCohortClient from "./CreateCohortClient";

export default function CreateCohortPage() {
  return (
    <Suspense fallback={<div className="admin-page" />}>
      <CreateCohortClient />
    </Suspense>
  );
}
