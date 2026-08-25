// 여유자금 배분 도넛 — Home '돈 관리 기준'. 차트 라이브러리 없이 SVG stroke-dasharray.
import type { CSSProperties } from 'react';
import { won } from '../domain/format';
import type { FundAllocation } from './PolicySetupFlow';

const SEGMENTS: { key: keyof FundAllocation; label: string; color: string }[] = [
  { key: 'living', label: '생활 여유분', color: '#3b6ef5' },
  { key: 'emergency', label: '비상금', color: '#4bb3dc' },
  { key: 'saving', label: '저축', color: '#20b26b' },
  { key: 'investment', label: '투자', color: '#f3b100' },
];

export function BudgetDonut({ allocation, availableCash }: { allocation: FundAllocation; availableCash: number }) {
  const r = 60;
  const C = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="budget">
      <svg className="donut" viewBox="0 0 140 140" role="img" aria-label="여유자금 배분 도넛 차트">
        <g transform="rotate(-90 70 70)">
          {SEGMENTS.map((s, index) => {
            const len = (C * allocation[s.key]) / 100;
            const circleStyle = {
              '--segment-length': len,
              '--segment-gap': C - len,
              '--circumference': C,
              '--segment-delay': `${index * 110}ms`,
            } as CSSProperties;
            const seg = (
              <circle
                key={s.key}
                className="donut-segment"
                cx="70" cy="70" r={r} fill="none"
                stroke={s.color} strokeWidth="18"
                strokeDasharray={`${len} ${C - len}`}
                strokeDashoffset={-offset}
                style={circleStyle}
              />
            );
            offset += len;
            return seg;
          })}
        </g>
        <text className="donut-cap" x="70" y="64" textAnchor="middle">배분 합계</text>
        <text className="donut-pct" x="70" y="84" textAnchor="middle">100%</text>
      </svg>

      <ul className="budget-legend">
        {SEGMENTS.map((s, index) => (
          <li key={s.key} style={{ '--legend-delay': `${360 + index * 70}ms` } as CSSProperties}>
            <span className="dot" style={{ background: s.color }} />
            <span className="lg-label">{s.label}</span>
            <span className="lg-pct" style={{ color: s.color }}>{allocation[s.key]}%</span>
            <span className="lg-amt">{won((availableCash * allocation[s.key]) / 100)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
