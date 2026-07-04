import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export default function Card({ title, description, children, className = '' }: CardProps) {
  return (
    <div className={`rounded-[2rem] border border-white/10 bg-slate-900/80 p-6 shadow-soft backdrop-blur-xl ${className}`}>
      {title ? <div className="mb-4 space-y-2"><h2 className="text-xl font-semibold text-white">{title}</h2>{description ? <p className="text-sm text-slate-400">{description}</p> : null}</div> : null}
      {children}
    </div>
  );
}
