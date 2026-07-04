interface ProgressBarProps {
  value: number;
}

export default function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="rounded-full bg-white/10 p-1">
      <div className="h-3 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 transition-all" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}
