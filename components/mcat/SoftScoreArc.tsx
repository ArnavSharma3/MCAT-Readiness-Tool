type SoftScoreArcProps = {
  projectedScore: number;
  targetScore: number;
};

export function SoftScoreArc({ projectedScore, targetScore }: SoftScoreArcProps) {
  const center = 90;
  const radius = 68;
  const startAngle = 200;
  const endAngle = -20;
  const sweep = 360 - startAngle + endAngle;
  const progress = Math.max(0, Math.min(1, (projectedScore - 472) / Math.max(1, targetScore - 472)));
  const activeAngle = startAngle + sweep * progress;

  const trackPath = describeArc(center, center, radius, startAngle, endAngle);
  const fillPath = describeArc(center, center, radius, startAngle, activeAngle);

  const hue = Math.round(208 - progress * 45);

  return (
    <div className="relative flex w-full max-w-[220px] justify-center">
      <svg viewBox="0 0 180 120" className="w-full">
        <path d={trackPath} fill="none" stroke="#e8eef9" strokeWidth="14" strokeLinecap="round" />
        <path d={fillPath} fill="none" stroke={`hsl(${hue}, 60%, 72%)`} strokeWidth="14" strokeLinecap="round" />
      </svg>
      <div className="absolute top-8 text-center">
        <p className="text-xs text-[var(--muted)]">Projected</p>
        <p className="text-3xl font-semibold">{projectedScore}</p>
      </div>
    </div>
  );
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}
