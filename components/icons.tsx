// Minimal inline SVG icon set — no emoji, no extra dependencies.
// All icons inherit the surrounding text color via `currentColor`.

type P = { className?: string };

const base = (
  path: React.ReactNode,
  { className = "h-5 w-5" }: P = {},
  filled = false,
) => (
  <svg
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke={filled ? "none" : "currentColor"}
    strokeWidth={filled ? undefined : 1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {path}
  </svg>
);

export const SearchIcon = (p: P) =>
  base(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.8-3.8" />
    </>,
    p,
  );

export const DownloadIcon = (p: P) =>
  base(
    <>
      <path d="M12 3v12" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4 21h16" />
    </>,
    p,
  );

export const StarIcon = (p: P) =>
  base(
    <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.1-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />,
    p,
    true,
  );

export const SettingsIcon = (p: P) =>
  base(
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.64 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09A1.7 1.7 0 0 0 10.1 3V3a2 2 0 1 1 4 0v.09c0 .68.4 1.3 1.01 1.55a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09c.26.6.87 1 1.55 1H21a2 2 0 1 1 0 4h-.09c-.68 0-1.3.4-1.51 1z" />
    </>,
    p,
  );

export const FilmIcon = (p: P) =>
  base(
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
    </>,
    p,
  );

export const TvIcon = (p: P) =>
  base(
    <>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="m9 21 3-3 3 3" />
    </>,
    p,
  );

export const CloseIcon = (p: P) =>
  base(<path d="M6 6l12 12M18 6 6 18" />, p);

export const AlertIcon = (p: P) =>
  base(
    <>
      <path d="M12 3 2.5 20h19z" />
      <path d="M12 9.5V14" />
      <path d="M12 17.2v.1" />
    </>,
    p,
  );

export const CheckIcon = (p: P) =>
  base(<path d="m4.5 12.5 5 5 10-11" />, p);

export const ExternalIcon = (p: P) =>
  base(
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 11 13" />
      <path d="M19 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5.5" />
    </>,
    p,
  );

export const ChevronLeftIcon = (p: P) =>
  base(<path d="m14.5 5.5-7 6.5 7 6.5" />, p);

export const ChevronRightIcon = (p: P) =>
  base(<path d="m9.5 5.5 7 6.5-7 6.5" />, p);

export const ChevronDownIcon = (p: P) =>
  base(<path d="m5.5 9.5 6.5 7 6.5-7" />, p);

export const ClockIcon = (p: P) =>
  base(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>,
    p,
  );

export const CalendarIcon = (p: P) =>
  base(
    <>
      <rect x="4" y="5.5" width="16" height="15" rx="2" />
      <path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" />
    </>,
    p,
  );

export const CaptionsIcon = (p: P) =>
  base(
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M10.5 10.2a2.3 2.3 0 0 0-3.4 0 2.9 2.9 0 0 0 0 3.6 2.3 2.3 0 0 0 3.4 0M17.5 10.2a2.3 2.3 0 0 0-3.4 0 2.9 2.9 0 0 0 0 3.6 2.3 2.3 0 0 0 3.4 0" />
    </>,
    p,
  );

export const LockIcon = (p: P) =>
  base(
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </>,
    p,
  );

export const RefreshIcon = (p: P) =>
  base(
    <>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" />
      <path d="M20 3.5V8h-4.5" />
    </>,
    p,
  );

export const LogoIcon = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="6" fill="#fbbf24" />
    <path
      d="M12 5.5v10M7.5 11.5 12 16l4.5-4.5"
      stroke="#09090b"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <path
      d="M7 19.5h10"
      stroke="#09090b"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);
