"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">حدث خطأ</h1>
        <p className="text-gray-600 mb-6">
          {error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."}
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} variant="default">
            حاول مرة أخرى
          </Button>
          <Button onClick={() => (window.location.href = "/")} variant="secondary">
            الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
}
