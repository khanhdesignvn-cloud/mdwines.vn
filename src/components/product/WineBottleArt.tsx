const PALETTES: Record<
  string,
  { glass: [string, string]; liquid: [string, string]; cap: string; label: string }
> = {
  "vang-do": {
    glass: ["#3d0f1a", "#1c0810"],
    liquid: ["#74192f", "#3d0f1a"],
    cap: "#c9a24b",
    label: "#f7edd3",
  },
  "vang-trang": {
    glass: ["#8a9a5b", "#4c5a33"],
    liquid: ["#e8d98f", "#c9b45a"],
    cap: "#dfbd6c",
    label: "#faf7f1",
  },
  "vang-hong": {
    glass: ["#c98a9a", "#7a3a4a"],
    liquid: ["#e8a8bb", "#d17b93"],
    cap: "#dfbd6c",
    label: "#fff5f7",
  },
  "vang-no": {
    glass: ["#5a4a1a", "#2e2410"],
    liquid: ["#e8c96a", "#b0863a"],
    cap: "#f7edd3",
    label: "#f7edd3",
  },
};

const DEFAULT_PALETTE = PALETTES["vang-do"];

export function WineBottleArt({
  category,
  className,
  initials,
}: {
  category?: string;
  className?: string;
  initials?: string;
}) {
  const palette = (category && PALETTES[category]) || DEFAULT_PALETTE;
  const uid = category ?? "default";

  return (
    <svg
      viewBox="0 0 240 480"
      className={className}
      role="img"
      aria-label="Minh họa chai rượu vang"
    >
      <defs>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={palette.glass[0]} />
          <stop offset="55%" stopColor={palette.glass[1]} />
          <stop offset="100%" stopColor={palette.glass[0]} />
        </linearGradient>
        <linearGradient id={`liquid-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={palette.liquid[0]} />
          <stop offset="100%" stopColor={palette.liquid[1]} />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="120" cy="452" rx="70" ry="14" fill="#000000" opacity="0.12" />

      <path
        d="M100 40 h40 v50 c0 10 6 16 12 22 14 13 22 30 22 55 v270 c0 12 -9 21 -21 21 H87 c-12 0 -21 -9 -21 -21 V167 c0 -25 8 -42 22 -55 c6 -6 12 -12 12 -22 Z"
        fill={`url(#glass-${uid})`}
        stroke="#00000022"
        strokeWidth="1"
      />

      <path
        d="M66 240 v147 c0 12 9 21 21 21 h66 c12 0 21 -9 21 -21 V240 Z"
        fill={`url(#liquid-${uid})`}
        opacity="0.9"
      />

      <path
        d="M100 40 h40 v50 c0 10 6 16 12 22 14 13 22 30 22 55 v270 c0 12 -9 21 -21 21 H87 c-12 0 -21 -9 -21 -21 V167 c0 -25 8 -42 22 -55 c6 -6 12 -12 12 -22 Z"
        fill={`url(#glow-${uid})`}
      />

      <rect x="96" y="18" width="48" height="26" rx="4" fill={palette.cap} />
      <rect x="96" y="18" width="48" height="8" rx="4" fill="#00000018" />

      <rect x="75" y="255" width="90" height="110" rx="3" fill={palette.label} opacity="0.95" />
      <line x1="87" y1="278" x2="153" y2="278" stroke="#00000030" strokeWidth="1.5" />
      <text
        x="120"
        y="305"
        textAnchor="middle"
        fontSize="15"
        fontFamily="Georgia, 'Playfair Display', serif"
        fill="#2a1e18"
        fontWeight="700"
        letterSpacing="1"
      >
        {initials ?? "MDW"}
      </text>
      <line x1="87" y1="320" x2="153" y2="320" stroke="#00000030" strokeWidth="1.5" />
      <text x="120" y="345" textAnchor="middle" fontSize="8.5" fill="#5a4632" letterSpacing="2">
        FINE WINE
      </text>
    </svg>
  );
}
