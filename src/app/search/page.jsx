import { Suspense } from "react";
import SearchContent from "./SearchContent";

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}