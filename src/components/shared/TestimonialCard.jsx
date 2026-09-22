import Image from "next/image";
import { Star, Quote } from "lucide-react";

export default function TestimonialCard({ testimonial }) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 h-full flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Quote className="h-5 w-5 text-crimson/30" />
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(testimonial.rating || 5)].map((_, idx) => (
              <Star key={idx} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed mb-5">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </div>

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 border-2 border-slate-100 shadow-2xs">
          <Image
            src={testimonial.avatar || "/campus-placeholder.jpg"}
            alt={testimonial.name}
            fill
            sizes="40px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-navy leading-snug">{testimonial.name}</p>
          <p className="text-xs text-slate-500">
            {testimonial.course} &middot; {testimonial.college}
          </p>
        </div>
      </div>
    </div>
  );
}
