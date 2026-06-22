// Lightweight inline icon set (stroke 1.8). Avoids shipping an icon library
// so budget devices download less JS. Map metric.icon names here too.
const P = {
  stethoscope: "M6 3v5a4 4 0 0 0 8 0V3M4 3h2M12 3h2M10 12v3a5 5 0 0 0 10 0v-1m0 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  "shopping-basket": "M5 9h14l-1.5 10.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 9Zm3 0 2-5m6 5-2-5M9 13v4m6-4v4",
  "heart-pulse": "M12 20s-7-4.5-9.5-9A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9.5 5c-.5.9-1.2 1.8-2 2.6M3 11h4l2-3 2 5 2-3h6",
  users: "M16 19v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm13 10v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  map: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Zm0 0v14m6-12v14",
  utensils: "M4 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M6 12v9M14 3c-1.5 1-2 3-2 5s.5 3 2 3v10",
  home: "M3 11 12 3l9 8M5 10v10h14V10",
  droplets: "M12 3s6 5.5 6 10a6 6 0 1 1-12 0c0-4.5 6-10 6-10Z",
  calendar: "M3 9h18M7 3v4m10-4v4M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  "hand-heart": "M11 14 7.5 10.5a2 2 0 0 1 3-3l.5.5.5-.5a2 2 0 0 1 3 3L11 14ZM3 14l4 4 6 2 8-4v-2a2 2 0 0 0-2.5-1.5L18 14",
  sparkles: "M12 3l1.8 4.7L18.5 9.5 13.8 11 12 16l-1.8-5L5.5 9.5l4.7-1.8L12 3ZM19 14l.8 2 2 .8-2 .8L19 20l-.8-2.4-2-.8 2-.8L19 14Z",
  "trending-up": "M3 17l6-6 4 4 8-8M17 7h4v4",
  gift: "M20 12v9H4v-9M2 7h20v5H2V7Zm10 0v14M12 7S10 2 7 4s5 3 5 3Zm0 0s2-5 5-3-5 3-5 3Z",
  shield: "M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z",
  phone: "M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  lock: "M5 11h14v10H5V11Zm2 0V7a5 5 0 0 1 10 0v4",
  menu: "M3 6h18M3 12h18M3 18h18",
  x: "M6 6l12 12M18 6 6 18",
  "arrow-left": "M19 12H5m6-7-7 7 7 7",
  pin: "M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
};

export default function Icon({ name, size = 24, className = "", strokeWidth = 1.8 }) {
  const d = P[name] || P.sparkles;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}
