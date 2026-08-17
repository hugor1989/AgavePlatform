export function SearchDollarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <g transform="translate(11 11) scale(0.46) translate(-12 -12)">
        <line x1="12" y1="4" x2="12" y2="20" strokeWidth={4} />
        <path
          d="M16 8.5H10.25a2.75 2.75 0 0 0 0 5.5h3.5a2.75 2.75 0 0 1 0 5.5H8"
          strokeWidth={4}
        />
      </g>
    </svg>
  );
}
