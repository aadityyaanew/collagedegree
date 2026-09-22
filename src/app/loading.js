export default function Loading() {
  return (
    <div className="flex-1 min-h-[60vh] flex items-center justify-center bg-slate-50/60 py-12">
      <div className="flex flex-col items-center gap-3">
        {/* Crisp Pulse Spinner */}
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-slate-200" />
          <div className="absolute inset-0 rounded-full border-2 border-crimson border-t-transparent animate-spin" />
        </div>
        <p className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          Loading Page...
        </p>
      </div>
    </div>
  );
}
