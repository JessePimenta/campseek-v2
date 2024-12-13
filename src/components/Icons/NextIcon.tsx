import { LucideIcon } from 'lucide-react';

export const NextIcon: LucideIcon = function NextIcon(props) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="transition-colors group-hover:text-black"
      {...props}
    >
      <path
        d="M5 4L15 12L5 20V4Z"
        className="fill-white group-hover:fill-black"
      />
      <path
        d="M19 5V19"
        className="stroke-white group-hover:stroke-black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};