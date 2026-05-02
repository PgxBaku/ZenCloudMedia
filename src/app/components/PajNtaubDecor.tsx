// Paj ntaub (Hmong flower cloth) decorative SVG components.
// All use currentColor so they respect whatever color the parent sets.

// Diamond chain band — the foundational paj ntaub grid motif.
// Diamonds share vertices and tile seamlessly. Each cell has a cross-stitch
// detail inside and a center dot, matching the classic field pattern structure.
export function DiamondBand({
  opacity = 0.5,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width="100%"
      height="18"
      className={className}
      style={{ color: "var(--zcm-quote)", opacity }}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="paj-diamond"
          x="0"
          y="0"
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          {/* Outer diamond — vertices sit exactly on tile edges for seamless tiling */}
          <polygon
            points="9,0 18,9 9,18 0,9"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.85"
          />
          {/* Inner cross detail (cross-stitch characteristic) */}
          <line x1="9" y1="4.5" x2="9" y2="13.5" stroke="currentColor" strokeWidth="0.5" />
          <line x1="4.5" y1="9" x2="13.5" y2="9" stroke="currentColor" strokeWidth="0.5" />
          {/* Center dot */}
          <circle cx="9" cy="9" r="1.4" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="18" fill="url(#paj-diamond)" />
    </svg>
  );
}

// Mountain step border (roob) — stair-step motif representing the mountains
// the Hmong people crossed. Each peak tiles end-to-end with a flat base.
export function StepBand({
  opacity = 0.45,
  className = "",
}: {
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      width="100%"
      height="14"
      className={className}
      style={{ color: "var(--zcm-quote)", opacity }}
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="paj-steps"
          x="0"
          y="0"
          width="24"
          height="14"
          patternUnits="userSpaceOnUse"
        >
          {/* Stepped mountain peak — symmetrical, flat base tiles seamlessly */}
          <polyline
            points="0,14 0,10 4,10 4,6 8,6 8,2 16,2 16,6 20,6 20,10 24,10 24,14"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.85"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />
        </pattern>
      </defs>
      <rect width="100%" height="14" fill="url(#paj-steps)" />
    </svg>
  );
}

// Ram's horn pair (kub yaj) — paired inward-spiraling scrolls with a
// center diamond. Used as a section accent or ornament.
export function SpiralPair({
  size = 44,
  opacity = 0.75,
}: {
  size?: number;
  opacity?: number;
}) {
  return (
    <svg
      width={Math.round(size * 1.5)}
      height={size}
      viewBox="0 0 48 32"
      style={{ color: "var(--zcm-quote)", opacity }}
      aria-hidden="true"
    >
      {/* Left horn — sweeps outward then spirals inward */}
      <path
        d="M 5,26 C 2,18 2,8 8,5 C 14,2 20,8 18,14 C 16,19 11,18 12,14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Right horn — mirror */}
      <path
        d="M 43,26 C 46,18 46,8 40,5 C 34,2 28,8 30,14 C 32,19 37,18 36,14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Center diamond with dot */}
      <polygon
        points="24,10 28,16 24,22 20,16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="24" cy="16" r="1.6" fill="currentColor" />
    </svg>
  );
}

// Snail / double spiral (qab qwj) — concentric squares spiraling outward,
// symbolising family lineage and longevity.
export function SnailSpiral({
  size = 32,
  opacity = 0.65,
}: {
  size?: number;
  opacity?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ color: "var(--zcm-quote)", opacity }}
      aria-hidden="true"
    >
      {/* Innermost square */}
      <rect x="13" y="13" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {/* Second ring */}
      <rect x="9" y="9" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {/* Outer ring */}
      <rect x="5" y="5" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="0.8" />
      {/* Spiral connector lines — form the snail path linking rings */}
      <line x1="16" y1="5"  x2="16" y2="9"  stroke="currentColor" strokeWidth="0.8" />
      <line x1="27" y1="9"  x2="27" y2="16" stroke="currentColor" strokeWidth="0.8" />
      <line x1="9"  y1="23" x2="16" y2="23" stroke="currentColor" strokeWidth="0.8" />
      <line x1="9"  y1="13" x2="9"  y2="23" stroke="currentColor" strokeWidth="0.8" />
      {/* Center dot */}
      <circle cx="16" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}
