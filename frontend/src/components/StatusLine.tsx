// Lime pulse dot + uppercase mono system label, e.g. "SAFEHAIVN · ONLINE".
export default function StatusLine({
  label = "SAFEHAIVN · ONLINE",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="h-2.5 w-2.5 rounded-full bg-lime animate-pulse shadow-[0_0_10px_rgba(164,210,51,0.7)]" />
      <span className="font-mono uppercase tracking-[0.18em] text-[10.5px] text-statusdim">
        {label}
      </span>
    </div>
  );
}
