import Draw from './Draw';

/**
 * Ruled measurement scale with registration crosses.
 *
 * Plate three is the reading poster, so its visual has to sit *under* the text
 * rather than compete with it. A printer's registration bar does that — it is
 * unmistakably from the same document family as the schematics, but it is
 * furniture, not an image. Static by design; nothing here should move.
 */

// 50 so the run closes on a long tick — at 48 the scale trailed off in three
// short ticks exactly where the eye finishes
const TICKS = 50;

export default function Registration({ className }: { className?: string }) {
  return (
    <Draw className={className} rules="line, circle">
    <svg
      viewBox="0 0 1200 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: '100%', height: '4rem', display: 'block' }}
    >
      {/* vector-effect is NOT inherited, so it goes on every shape. Without it,
          preserveAspectRatio="none" stretches the 1200-unit box across the sheet
          and the vertical ticks render thicker than the horizontal rule. */}
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <line x1="0" y1="32" x2="1200" y2="32" vectorEffect="non-scaling-stroke" />
        {Array.from({ length: TICKS + 1 }, (_, i) => {
          const x = (i / TICKS) * 1200;
          // every fifth tick runs full height, the rest are short — the rhythm
          // is what makes it read as a scale rather than a hatch
          const long = i % 5 === 0;
          return (
            <line
              key={i}
              x1={x}
              y1={long ? 12 : 25}
              x2={x}
              y2={long ? 52 : 39}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
        {/* registration crosses at either end */}
        {/* midway between ticks — at x=24 the cross collided with the tick at
            x=25 and drew a 1px-apart double stroke */}
        {[12, 1188].map((x) => (
          <g key={x} vectorEffect="non-scaling-stroke">
            <circle cx={x} cy={32} r="9" vectorEffect="non-scaling-stroke" />
            <line x1={x - 16} y1={32} x2={x + 16} y2={32} vectorEffect="non-scaling-stroke" />
            <line x1={x} y1={16} x2={x} y2={48} vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </g>
    </svg>
    </Draw>
  );
}
