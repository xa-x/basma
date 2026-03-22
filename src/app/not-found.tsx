import { Button } from "@/components/ui";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <h2 className="text-xl text-gray-600 mb-6">الصفحة غير موجودة</h2>
        <p className="text-gray-500 mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.
        </p>
        <Link href="/">
          <Button size="lg">العودة للرئيسية</Button>
        </Link>
      </div>
    </div>
  );
}
