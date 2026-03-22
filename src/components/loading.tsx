export function LoadingSpinner({ 
  size = "md",
  className = ""
}: { 
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-16 h-16 border-4",
  };

  return (
    <div
      className={`${sizes[size]} border-accent border-t-transparent rounded-full animate-spin ${className}`}
    />
  );
}

export function LoadingOverlay({ message = "جاري التحميل..." }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  );
}

export function SkeletonLogo() {
  return (
    <div className="aspect-square bg-gray-100 rounded-xl animate-pulse flex items-center justify-center">
      <div className="w-16 h-16 bg-gray-200 rounded" />
    </div>
  );
}
