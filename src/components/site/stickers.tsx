/* eslint-disable @next/next/no-img-element */

// Die-cut sticker art for the hero desk. Every piece is filtered through
// #sticker-edge (defined once by the desk) for its white border and lift.

const EDGE = "url(#sticker-edge)";

// AP fluoroscopy of the lumbar spine, with the tracker's overlay locked on L3.
export function XrayFilm() {
  const bodies = [26, 61, 96, 131, 166];
  const tracked = bodies.slice(1, 4);
  return (
    <svg viewBox="0 0 160 212" overflow="visible" className="block h-auto w-full">
      <defs>
        <radialGradient id="xr-plate" cx="50%" cy="46%" r="62%">
          <stop offset="0" stopColor="#26394f" />
          <stop offset="1" stopColor="#0b1219" />
        </radialGradient>
        <linearGradient id="xr-bone" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#e8eff8" />
          <stop offset="1" stopColor="#9cb0c8" />
        </linearGradient>
      </defs>
      <g filter={EDGE}>
        <rect x="8" y="8" width="144" height="196" rx="10" fill="url(#xr-plate)" />
        {bodies.map((y) => (
          <g key={y}>
            <rect x="34" y={y + 9} width="92" height="7" rx="3.5" fill="#9cb0c8" opacity="0.4" />
            <rect x="52" y={y} width="56" height="26" rx="9" fill="url(#xr-bone)" opacity="0.92" />
            <ellipse cx="66" cy={y + 9} rx="5.5" ry="4" fill="#6a83a2" opacity="0.85" />
            <ellipse cx="94" cy={y + 9} rx="5.5" ry="4" fill="#6a83a2" opacity="0.85" />
            <ellipse cx="80" cy={y + 16} rx="3" ry="6" fill="#c6d4e6" opacity="0.7" />
          </g>
        ))}
        {tracked.map((y) =>
          [52, 108].map((x) =>
            [y, y + 26].map((cy) => (
              <circle key={`${x}-${cy}`} cx={x} cy={cy} r="2.4" fill="#4c8dff" />
            ))
          )
        )}
        <rect
          x="45"
          y="90"
          width="70"
          height="38"
          rx="5"
          fill="none"
          stroke="#4c8dff"
          strokeWidth="1.6"
          strokeDasharray="5 3"
        />
        <path d="M80 104v10M75 109h10" stroke="#4c8dff" strokeWidth="1.3" />
        <text x="119" y="88" fill="#4c8dff" fontSize="10" className="font-mono">
          L3
        </text>
        <text x="19" y="27" fill="#f2b441" fontSize="11" fontWeight="700" className="font-mono">
          R
        </text>
      </g>
    </svg>
  );
}

export function TrackerTerminal() {
  return (
    <svg viewBox="0 0 260 156" overflow="visible" className="block h-auto w-full">
      <g filter={EDGE}>
        <rect x="8" y="8" width="244" height="140" rx="12" fill="#14171c" />
        <rect x="8.5" y="8.5" width="243" height="139" rx="11.5" fill="none" stroke="#2a3038" />
        <path d="M9 34h242" stroke="#22272e" />
        <circle cx="24" cy="21" r="4.5" fill="#ff5f57" />
        <circle cx="38" cy="21" r="4.5" fill="#febc2e" />
        <circle cx="52" cy="21" r="4.5" fill="#28c840" />
        <text x="130" y="25" textAnchor="middle" fill="#6b7280" fontSize="10" className="font-mono">
          tracker
        </text>
        <g fontSize="11" className="font-mono">
          <text x="22" y="57">
            <tspan fill="#4c8dff">$</tspan>
            <tspan fill="#e9ebee"> ./tracker --live</tspan>
          </text>
          <text x="22" y="77">
            <tspan fill="#8a919c">calib  </tspan>
            <tspan fill="#e9ebee">rms &lt; 0.5px</tspan>
          </text>
          <text x="22" y="95">
            <tspan fill="#8a919c">c-arm  </tspan>
            <tspan fill="#e9ebee">pose solved</tspan>
          </text>
          <text x="22" y="113">
            <tspan fill="#8a919c">L1-L5  </tspan>
            <tspan fill="#28c840">tracking</tspan>
          </text>
          <text x="22" y="134" fill="#4c8dff">
            $
          </text>
        </g>
        <rect x="33" y="125" width="7" height="12" fill="#e9ebee" className="sticker-caret" />
      </g>
    </svg>
  );
}

// A calibration target with detected corners, drawn row by row the way OpenCV does.
export function CalibrationBoard() {
  const cell = 19;
  const rowColors = ["#4c8dff", "#28c840", "#f2b441"];
  const corners = rowColors.map((color, r) => ({
    color,
    points: [1, 2, 3, 4, 5].map((c) => [c * cell, (r + 1) * cell] as const),
  }));
  return (
    <svg viewBox="0 0 150 124" overflow="visible" className="block h-auto w-full">
      <g filter={EDGE}>
        <g transform="translate(75 62) rotate(-8) skewX(-10) translate(-57 -38)">
          <rect x="-7" y="-7" width="128" height="90" rx="3" fill="#f4f4f2" />
          {Array.from({ length: 4 }, (_, r) =>
            Array.from({ length: 6 }, (_, c) =>
              (r + c) % 2 === 0 ? (
                <rect key={`${r}-${c}`} x={c * cell} y={r * cell} width={cell} height={cell} fill="#16191e" />
              ) : null
            )
          )}
          {corners.map(({ color, points }) => (
            <g key={color} stroke={color} fill="none" strokeWidth="1.4">
              <polyline points={points.map((p) => p.join(",")).join(" ")} />
              {points.map(([x, y]) => (
                <circle key={x} cx={x} cy={y} r="3.2" />
              ))}
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
}

// Sally's chart card.
export function SallyCandles() {
  // [body top, body bottom, wick top, wick bottom, closed up]
  const candles: [number, number, number, number, boolean][] = [
    [88, 96, 84, 100, false],
    [86, 94, 82, 98, true],
    [80, 90, 76, 93, true],
    [82, 88, 79, 91, false],
    [72, 84, 68, 87, true],
    [66, 76, 62, 79, true],
    [68, 74, 64, 78, false],
    [56, 70, 52, 73, true],
    [48, 60, 44, 63, true],
  ];
  return (
    <svg viewBox="0 0 176 124" overflow="visible" className="block h-auto w-full">
      <g filter={EDGE}>
        <rect x="8" y="8" width="160" height="108" rx="12" fill="#f7f8fa" />
        <text x="22" y="31" fontSize="12" fontWeight="600" fill="#0e1116">
          Sally
        </text>
        <circle cx="128" cy="27" r="3" fill="#16a34a" />
        <text x="154" y="31" textAnchor="end" fontSize="10.5" fill="#16a34a" className="font-mono">
          live
        </text>
        {[50, 72, 94].map((y) => (
          <path key={y} d={`M20 ${y}h136`} stroke="#e6e8ec" />
        ))}
        {candles.map(([top, bottom, high, low, up], i) => {
          const x = 28 + i * 15.5;
          const color = up ? "#16a34a" : "#e5484d";
          return (
            <g key={x}>
              <path d={`M${x} ${high}V${low}`} stroke={color} strokeWidth="1.3" />
              <rect x={x - 4} y={top} width="8" height={bottom - top} rx="1" fill={color} />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

// Space Apps 2024.
export function RingedPlanet() {
  return (
    <svg viewBox="0 0 132 132" overflow="visible" className="block h-auto w-full">
      <defs>
        <radialGradient id="pl-body" cx="35%" cy="30%" r="78%">
          <stop offset="0" stopColor="#9cc2ff" />
          <stop offset="0.55" stopColor="#3a6fe0" />
          <stop offset="1" stopColor="#172f6b" />
        </radialGradient>
        <clipPath id="pl-clip">
          <circle cx="66" cy="66" r="34" />
        </clipPath>
      </defs>
      <g filter={EDGE}>
        <ellipse
          cx="66"
          cy="66"
          rx="58"
          ry="15"
          fill="none"
          stroke="#f2b441"
          strokeWidth="5"
          transform="rotate(-18 66 66)"
        />
        <circle cx="66" cy="66" r="34" fill="url(#pl-body)" />
        <g clipPath="url(#pl-clip)" fill="none" opacity="0.4">
          <path d="M28 54c14 6 46 6 76-2" stroke="#d6e5ff" strokeWidth="4" />
          <path d="M30 76c18 4 44 3 72-4" stroke="#0f2552" strokeWidth="5" />
        </g>
        <path
          d="M8 66A58 15 0 0 0 124 66"
          fill="none"
          stroke="#f2b441"
          strokeWidth="5"
          strokeLinecap="round"
          transform="rotate(-18 66 66)"
        />
        <circle cx="115" cy="24" r="7" fill="#dfe4eb" />
      </g>
    </svg>
  );
}

// Filter coffee in a steel davara-tumbler, the Bangalore way.
export function FilterCoffee() {
  return (
    <svg viewBox="0 0 112 136" overflow="visible" className="block h-auto w-full">
      <defs>
        <linearGradient id="fc-steel" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#8d97a5" />
          <stop offset="0.3" stopColor="#eef2f6" />
          <stop offset="0.55" stopColor="#b9c2cd" />
          <stop offset="0.8" stopColor="#f4f6f9" />
          <stop offset="1" stopColor="#9aa4b1" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-muted-foreground">
        <path d="M46 20c-4-5 4-8 0-14" className="sticker-steam" />
        <path d="M58 22c-4-6 4-9 0-16" className="sticker-steam [animation-delay:0.9s]" />
        <path d="M70 20c-4-5 4-8 0-14" className="sticker-steam [animation-delay:1.7s]" />
      </g>
      <g filter={EDGE}>
        <ellipse cx="56" cy="96" rx="46" ry="10" fill="#aab3bf" />
        <path d="M32 30 38 100q18 6 36 0l6-70Z" fill="url(#fc-steel)" />
        <path d="M33.5 46q22.5 6 45 0M37 88q19 5 38 0" fill="none" stroke="#f8fafc" strokeWidth="2" />
        <ellipse cx="56" cy="30" rx="24" ry="6" fill="#e9edf2" stroke="#8d97a5" />
        <ellipse cx="56" cy="30.5" rx="20.5" ry="4.6" fill="#d8b48a" />
        <ellipse cx="56" cy="31" rx="12" ry="2.6" fill="#b98756" />
        <path d="M10 96c2 16 14 24 46 24s44-8 46-24a46 10 0 0 1-92 0Z" fill="url(#fc-steel)" />
      </g>
    </svg>
  );
}

export function Polaroid({ src, caption }: { src: string; caption: string }) {
  return (
    <div className="relative rounded-[3px] bg-[#f5f5f2] p-[6%] pb-[24%] shadow-[0_6px_14px_rgba(0,0,0,0.45)]">
      <img
        src={src}
        alt=""
        draggable={false}
        className="block aspect-square w-full object-cover"
      />
      <span className="absolute inset-x-0 bottom-[3%] text-center font-hand text-[clamp(0.75rem,1.7vw,1.15rem)] text-[#2b2b2b]">
        {caption}
      </span>
    </div>
  );
}
