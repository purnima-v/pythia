import React, { useMemo } from 'react';

export type Bucket = {
  id: string;
  rangeLabel: string;
  communityProb: number;
};

interface Props {
  buckets: Bucket[];
  selected: { id: string; weight: number }[];
  accentColor?: string;
  onHover?: (id: string | null) => void;
}

export default function NoviceHistogram({
  buckets,
  selected,
  accentColor = '#06b6d4',
  onHover,
}: Props) {
  const barWidth = 100 / buckets.length;
  const maxHeight = 100; // percentage of container height

  // Calculate weighted mean position
  const meanX = useMemo(() => {
    const totalProb = buckets.reduce((sum, bucket) => sum + bucket.communityProb, 0);
    if (totalProb === 0) return 50; // center if no data

    const weightedSum = buckets.reduce((sum, bucket, i) => {
      const midPoint = (i + 0.5) * barWidth;
      return sum + (bucket.communityProb * midPoint);
    }, 0);

    return weightedSum / totalProb;
  }, [buckets, barWidth]);

  return (
    <div className="relative w-full h-40">
      {/* Mean marker */}
      <div
        className="absolute top-0 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-transparent border-b-gray-600"
        style={{ left: `${meanX}%`, transform: 'translateX(-50%)' }}
      />

      {/* Histogram bars */}
      <svg className="w-full h-full">
        {buckets.map((bucket, i) => {
          const isSelected = selected.some(s => s.id === bucket.id);
          const selectedWeight = selected.find(s => s.id === bucket.id)?.weight ?? 0;
          const opacity = selected.length === 2 ? 0.3 + 0.7 * selectedWeight : 1;

          return (
            <rect
              key={bucket.id}
              x={`${i * barWidth}%`}
              y={`${100 - (bucket.communityProb * maxHeight)}%`}
              width={`${barWidth}%`}
              height={`${bucket.communityProb * maxHeight}%`}
              fill={isSelected ? accentColor : '#9ca3af'} // gray-400
              opacity={opacity}
              className="transition-all duration-200 hover:fill-[#06b6d4]/60"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  onHover?.(bucket.id);
                }
              }}
              onMouseEnter={() => onHover?.(bucket.id)}
              onMouseLeave={() => onHover?.(null)}
              onFocus={() => onHover?.(bucket.id)}
              onBlur={() => onHover?.(null)}
            >
              <title>{bucket.rangeLabel}</title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
} 