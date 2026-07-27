/**
 * The ARCA wordmark, drawn rather than set: both A's are the arch itself —
 * two splayed legs and a semicircular top, no crossbar. The same arch, at
 * 24x12 and one hairline thick, is the section separator used before eyebrows.
 */
export function Logo({ className }: { className?: string }) {
  // The legs splay by 3 units: without that the arch reads as an N, not an A.
  const A = (x: number) =>
    `M${x},26 L${x + 3},11 A9,9 0 0 1 ${x + 21},11 L${x + 24},26`;

  return (
    <svg
      className={className}
      viewBox="0 0 106 26"
      role="img"
      aria-label="ARCA"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="butt"
    >
      <path d={A(0)} />
      <path d="M31,26 L31,1 L41,1 A6.5,6.5 0 0 1 41,14 L31,14 M40,14 L50,26" />
      <path d="M73.1,5.6 A11,11 0 1 0 73.1,20.4" />
      <path d={A(82)} />
    </svg>
  );
}

/** The hairline arch: separator, empty-state frame, 404 mark. */
export function Arch({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "arch"}
      viewBox="0 0 24 12"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      <path d="M1,12 L1,7 A11,7 0 0 1 23,7 L23,12" />
    </svg>
  );
}
