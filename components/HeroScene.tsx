export default function HeroScene() {
  return (
    <svg
      viewBox="0 0 1200 640"
      className="h-full w-full"
      preserveAspectRatio="xMidYMax slice"
      role="img"
      aria-label="Illustration du port, de la route et du chantier GOSTA TRANS"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000000" />
          <stop offset="55%" stopColor="#0c0c0c" />
          <stop offset="100%" stopColor="#161616" />
        </linearGradient>
        <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070707" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
      </defs>

      <rect width="1200" height="640" fill="url(#sky)" />

      {/* stars / beacon dots */}
      <g fill="#E8A33D" opacity="0.55">
        <circle cx="120" cy="70" r="2" />
        <circle cx="300" cy="40" r="1.6" />
        <circle cx="560" cy="90" r="2" />
        <circle cx="820" cy="50" r="1.6" />
        <circle cx="1000" cy="100" r="2" />
        <circle cx="1120" cy="60" r="1.6" />
      </g>

      {/* route line: port -> road -> chantier, tracing the tagline order */}
      <path
        d="M40 430 C 260 430, 300 500, 480 500 S 760 430, 900 430 S 1080 380, 1160 380"
        stroke="#E8A33D"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />

      {/* PORT — cranes + water, left third */}
      <rect x="0" y="470" width="360" height="170" fill="url(#water)" />
      <g stroke="#2e2e2e" strokeWidth="2" opacity="0.6">
        <path d="M0 486 Q 40 478 80 486 T 160 486 T 240 486 T 320 486 T 400 486" fill="none" />
        <path d="M0 508 Q 40 500 80 508 T 160 508 T 240 508 T 320 508 T 400 508" fill="none" />
      </g>
      {/* crane 1 */}
      <g>
        <rect x="55" y="330" width="8" height="140" fill="#cfd6e0" />
        <path d="M40 336 L200 336 L200 348 L40 348 Z" fill="#cfd6e0" />
        <path d="M40 336 L20 380 L58 348 Z" fill="#9a9a9a" />
        <line x1="185" y1="342" x2="185" y2="400" stroke="#E8A33D" strokeWidth="2" />
        <rect x="176" y="398" width="18" height="14" fill="#E8A33D" />
      </g>
      {/* crane 2 */}
      <g>
        <rect x="220" y="300" width="8" height="170" fill="#cfd6e0" />
        <path d="M205 306 L 330 306 L330 318 L205 318 Z" fill="#cfd6e0" />
        <path d="M205 306 L188 356 L223 318 Z" fill="#9a9a9a" />
        <line x1="312" y1="312" x2="312" y2="392" stroke="#E8A33D" strokeWidth="2" />
        <rect x="303" y="390" width="18" height="14" fill="#E8A33D" />
      </g>
      {/* containers */}
      <g>
        <rect x="20" y="470" width="70" height="34" fill="#C81E2C" />
        <rect x="94" y="470" width="70" height="34" fill="#000000" stroke="#2e2e2e" />
        <rect x="20" y="436" width="70" height="34" fill="#111111" stroke="#2e2e2e" />
        <rect x="168" y="470" width="70" height="34" fill="#C81E2C" />
        <rect x="168" y="436" width="70" height="34" fill="#8f141f" />
      </g>
      {/* ship hull hint */}
      <path d="M240 560 L400 560 L380 590 L260 590 Z" fill="#080808" stroke="#2e2e2e" />

      {/* ROAD + TRUCK — middle */}
      <rect x="360" y="560" width="480" height="80" fill="#101010" />
      <line x1="360" y1="600" x2="840" y2="600" stroke="#E8A33D" strokeDasharray="24 16" strokeWidth="4" opacity="0.7" />
      <g>
        {/* trailer */}
        <rect x="470" y="500" width="180" height="70" rx="4" fill="#f5f2ec" stroke="#000000" strokeWidth="3" />
        <text x="480" y="540" fontFamily="var(--font-display)" fontSize="20" fill="#C81E2C" fontWeight="700">GOSTA TRANS</text>
        <text x="480" y="558" fontFamily="var(--font-body)" fontSize="10" fill="#111111">LOGISTIQUE &amp; BTP</text>
        {/* cab */}
        <path d="M650 500 L700 500 L718 528 L718 570 L650 570 Z" fill="#C81E2C" stroke="#8f141f" strokeWidth="2" />
        <rect x="662" y="510" width="30" height="20" rx="2" fill="#d2d2d2" opacity="0.8" />
        {/* wheels */}
        <circle cx="510" cy="574" r="16" fill="#12141a" />
        <circle cx="510" cy="574" r="6" fill="#8892a0" />
        <circle cx="600" cy="574" r="16" fill="#12141a" />
        <circle cx="600" cy="574" r="6" fill="#8892a0" />
        <circle cx="690" cy="574" r="16" fill="#12141a" />
        <circle cx="690" cy="574" r="6" fill="#8892a0" />
      </g>

      {/* CHANTIER — right third */}
      <g>
        <rect x="840" y="420" width="220" height="220" fill="#0b0b0b" opacity="0.7" />
        {/* building under construction, scaffolding grid */}
        <g stroke="#555555" strokeWidth="1.4" opacity="0.8">
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="860" y1={440 + i * 30} x2="1040" y2={440 + i * 30} />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`v${i}`} x1={860 + i * 30} y1="440" x2={860 + i * 30} y2="620" />
          ))}
        </g>
        {/* tower crane */}
        <rect x="1040" y="300" width="8" height="200" fill="#cfd6e0" />
        <path d="M1044 306 L1160 330 L1160 342 L1044 318 Z" fill="#cfd6e0" />
        <path d="M1044 306 L1010 340 L1044 330 Z" fill="#9a9a9a" />
        <line x1="1148" y1="336" x2="1148" y2="420" stroke="#E8A33D" strokeWidth="2" />
        <rect x="1139" y="418" width="18" height="14" fill="#E8A33D" />
        {/* excavator hint */}
        <g transform="translate(880 600)">
          <rect x="0" y="0" width="46" height="20" rx="3" fill="#E8A33D" />
          <circle cx="10" cy="24" r="8" fill="#20262f" />
          <circle cx="34" cy="24" r="8" fill="#20262f" />
          <path d="M40 4 L70 -18 L78 -14 L52 8 Z" fill="#E8A33D" stroke="#8f6321" />
        </g>
      </g>
    </svg>
  );
}
