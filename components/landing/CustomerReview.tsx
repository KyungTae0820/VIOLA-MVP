import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
  rating?: number;
  className?: string;
};

export default function CustomerReview({
  title = "Customer Review",
  quote,
  author,
  role,
  company,
  avatarUrl,
  rating = 5,
  className,
}: Props) {
  return (
    <Card
      className={cn("relative rounded-2xl shadow-lg border-slate-200 overflow-hidden bg-white/90 backdrop-blur", className)}>
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#FDE68A]" />
      </div>

      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="relative z-10 px-6 pb-6">
        <div className="mx-auto mb-3 h-9 w-9 rounded-full grid place-items-center 
                        bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#FDE68A] text-white shadow-sm">
          <span className="text-lg leading-none">“</span>
        </div>

        <p className="mx-auto max-w-prose text-center text-slate-700 leading-relaxed">
          {quote}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={author}
              className="h-10 w-10 rounded-full ring-2 ring-white object-cover"
            />
          ) : null}

          <div className="text-center sm:text-left">
            <div className="font-semibold text-slate-900">{author}</div>
            {(role || company) && (
              <div className="text-xs text-slate-500">
                {[role, company].filter(Boolean).join(" • ")}
              </div>
            )}

            {typeof rating === "number" && rating >= 0 && (
              <div className="mt-1 flex items-center justify-center sm:justify-start gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    viewBox="0 0 24 24"
                    className={cn(
                      "h-4 w-4",
                      i < rating ? "fill-[#FDE68A]" : "fill-slate-200"
                    )}
                  >
                    <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
