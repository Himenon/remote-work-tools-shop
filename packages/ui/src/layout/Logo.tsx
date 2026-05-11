import type { JSX } from "react";

export default function Logo({ size = 36 }: { size?: number }): JSX.Element {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="20" cy="20" r="20" fill="#4f46e5" />
      <text x="20" y="28" textAnchor="middle" fontSize="20" fontWeight="800" fontFamily="system-ui, -apple-system, sans-serif" fill="white">
        Re
      </text>
    </svg>
  );
}
