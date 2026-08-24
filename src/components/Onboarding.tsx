// 온보딩 — 기획서 §14.01. 사용자가 중요하게 보는 금융 목표를 고른다.
// 선택값은 §8 최적화 우선순위와 연결되는 확장 지점(현재는 표시용).
import { useState } from 'react';

export interface Priority {
  key: string;
  emoji: string;
  label: string;
}

export const PRIORITIES: Priority[] = [
  { key: 'LIVING', emoji: '🏠', label: '생활비 안정' },
  { key: 'EMERGENCY', emoji: '🛟', label: '비상금 확보' },
  { key: 'SAVING', emoji: '🐷', label: '저축' },
  { key: 'LOAN', emoji: '💳', label: '대출 상환' },
  { key: 'INVEST', emoji: '📈', label: '투자' },
];

export function Onboarding({ onComplete }: { onComplete: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  return (
    <div className="onboard">
      <div className="onboard-inner">
        <div className="brand">💧 Cath · Cash + Path</div>
        <h1>
          당신에게 중요한 것은
          <br />
          무엇인가요?
        </h1>
        <p className="muted">고른 목표에 맞춰 Cath가 자금 배치를 제안해요. (복수 선택 가능)</p>

        <div className="opts">
          {PRIORITIES.map((p) => {
            const on = selected.includes(p.key);
            return (
              <button key={p.key} className={`opt ${on ? 'on' : ''}`} onClick={() => toggle(p.key)}>
                <span>
                  {p.emoji} {p.label}
                </span>
                <span className="check">{on ? '✓' : ''}</span>
              </button>
            );
          })}
        </div>

        <button className="primary" disabled={selected.length === 0} onClick={() => onComplete(selected)}>
          시작하기
        </button>
      </div>
    </div>
  );
}
