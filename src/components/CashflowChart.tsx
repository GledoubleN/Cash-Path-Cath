// 30일 예상 잔액 흐름 — 인라인 SVG (차트 라이브러리 미사용).
// 최저점과 최소생활자금 기준선을 강조한다 (기획서 §6.2 Cashflow Timeline).
import type { Forecast } from '../domain/types';
import { won } from '../domain/format';

const W = 640;
const H = 240;
const PAD = { top: 24, right: 20, bottom: 34, left: 8 };

interface Props {
  forecast: Forecast;
  minimumCash: number;
}

export function CashflowChart({ forecast, minimumCash }: Props) {
  const pts = forecast.series;
  const values = [...pts.map((p) => p.balance), minimumCash, 0];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (pts.length === 1 ? 0 : (i / (pts.length - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - ((v - min) / span) * innerH;

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(p.balance)}`).join(' ');
  const minIdx = pts.reduce((lo, p, i) => (p.balance < pts[lo].balance ? i : lo), 0);
  const risky = forecast.riskLevel !== 'LOW';
  const stroke = risky ? 'var(--danger)' : 'var(--brand)';

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img" aria-label="예상 잔액 흐름">
      {/* 최소 생활자금 기준선 */}
      <line x1={PAD.left} x2={W - PAD.right} y1={y(minimumCash)} y2={y(minimumCash)} className="chart-floor" />
      <text x={W - PAD.right} y={y(minimumCash) - 6} className="chart-floor-label" textAnchor="end">
        최소생활자금 {won(minimumCash)}
      </text>

      <path d={line} fill="none" stroke={stroke} strokeWidth={2.5} strokeLinejoin="round" />

      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.balance)} r={i === minIdx ? 5 : 3.5} fill={i === minIdx ? stroke : 'var(--bg)'} stroke={stroke} strokeWidth={2} />
          <text x={x(i)} y={H - 12} className="chart-x" textAnchor="middle">
            {p.label}
          </text>
        </g>
      ))}

      {/* 최저점 라벨 */}
      <g transform={`translate(${x(minIdx)}, ${y(pts[minIdx].balance)})`}>
        <text y={-12} textAnchor="middle" className="chart-min" fill={stroke}>
          {won(pts[minIdx].balance)}
        </text>
      </g>
    </svg>
  );
}
