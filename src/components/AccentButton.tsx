import { ButtonHTMLAttributes, ReactNode } from 'react';

interface AccentButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function AccentButton({ children, className = '', ...props }: AccentButtonProps) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-3xl bg-violet-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
