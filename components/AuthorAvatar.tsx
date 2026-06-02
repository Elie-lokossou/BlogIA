import { AUTHOR } from "@/lib/site";

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-9 h-9 text-xs",
  md: "w-11 h-11 text-sm",
  lg: "w-14 h-14 text-base",
} as const;

export default function AuthorAvatar({ size = "md", className = "" }: Props) {
  return (
    <div
      className={`rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 bg-violet-600 ring-2 ring-orange-400 ring-offset-2 shadow-[0_4px_14px_rgba(124,58,237,0.35)] ${sizes[size]} ${className}`}
      aria-hidden
    >
      {AUTHOR.initials}
    </div>
  );
}
