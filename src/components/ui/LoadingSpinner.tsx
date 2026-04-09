interface LoadingSpinnerProps {
  message?: string;
  size?: "small" | "default";
}

export function LoadingSpinner({ message, size = "default" }: LoadingSpinnerProps) {
  const dimensions = size === "small" ? "h-5 w-5" : "h-10 w-10";

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${dimensions} animate-spin rounded-full border-4 border-gray-200 border-t-navy-700`}
      />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  );
}
