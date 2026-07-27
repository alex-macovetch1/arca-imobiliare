/**
 * Every icon on the site: monochrome, 24x24, 1.5px stroke, inheriting
 * currentColor. No icon font, no library — a real-estate site needs nine
 * shapes, not nine hundred.
 */

type P = { className?: string; size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
});

export const IconSearch = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const IconPhone = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6.5 3h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 014.5 5.2 2 2 0 016.5 3z" />
  </svg>
);

export const IconHeart = ({ className, size = 20, filled = false }: P & { filled?: boolean }) => (
  <svg {...base(size)} className={className} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20.5s-7.5-4.6-7.5-9.7A4.3 4.3 0 0112 8.2a4.3 4.3 0 017.5 2.6c0 5.1-7.5 9.7-7.5 9.7z" />
  </svg>
);

export const IconPin = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const IconArrowRight = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const IconChevron = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M8 5l7 7-7 7" />
  </svg>
);

export const IconMenu = ({ className, size = 22 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

export const IconClose = ({ className, size = 22 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export const IconChat = ({ className, size = 24 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M20 12a8 8 0 01-11.7 7.1L4 20l1-4.2A8 8 0 1120 12z" />
    <path d="M9 10.6h6M9 14h3.6" />
  </svg>
);

export const IconShare = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v13M8 7l4-4 4 4" />
    <path d="M5 14v5a2 2 0 002 2h10a2 2 0 002-2v-5" />
  </svg>
);

export const IconViber = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3c4.6 0 7.5 2.6 7.5 6.8 0 4.2-2.9 6.8-7.5 6.8-.8 0-1.6-.1-2.3-.2L6 19v-3.2C4.4 14.6 4.5 12.5 4.5 9.8 4.5 5.6 7.4 3 12 3z" />
    <path d="M10 8.5c1 .3 1.9 1.1 2.2 2.2" />
  </svg>
);

export const IconTelegram = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M21 4L3 11l5 1.8L19 6.5l-8.5 8.2L10 21l3-3.4 4.2 3z" />
  </svg>
);

export const IconWhatsapp = ({ className, size = 20 }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1.1L4 20z" />
    <path d="M9.2 9c.3 1.8 1.9 3.4 3.8 3.9l1-1.2 1.7.8v1.4c-2.6.4-5.9-2.4-6.4-5.4l1.3-.2z" />
  </svg>
);
