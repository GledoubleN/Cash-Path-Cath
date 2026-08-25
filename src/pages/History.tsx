// 내역 — 기획서 화면 ② 거래 내역. 데모 이벤트(가상 거래 생성)도 여기서 발생.
import { useState } from 'react';
import { signedWon } from '../domain/format';
import { DEMO_EVENTS } from '../store';
import type { Cath } from '../store';

type Filter = 'all' | 'in' | 'out';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'in', label: '수입' },
  { key: 'out', label: '지출' },
];

export function History({ cath }: { cath: Cath }) {
  const { recentTx, fireEvent, reset } = cath;
  const [filter, setFilter] = useState<Filter>('all');

  const shown = recentTx.filter((t) =>
    filter === 'all' ? true : filter === 'in' ? t.amount > 0 : t.amount < 0,
  );

  return (
    <>
      <div className="segmented">
        {FILTERS.map((f) => (
          <button key={f.key} className={filter === f.key ? 'on' : ''} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      <section className="card">
        <ul className="rows">
          {shown.map((t) => (
            <li key={t.id}>
              <span>
                {t.title} <em className="muted">{t.occurredAt.slice(5, 10).replace('-', '/')}</em>
              </span>
              <strong className={t.amount < 0 ? 'neg' : 'pos'}>{signedWon(t.amount)}</strong>
            </li>
          ))}
          {shown.length === 0 && <li className="muted">해당하는 거래가 없어요.</li>}
        </ul>
      </section>

      <section className="card">
        <h2>+ 새 거래 추가 </h2>
        <p className="muted">버튼을 누르면 가상 거래가 발생하고 예측·위험·최적화가 즉시 재계산됩니다.</p>
        <div className="demobar-btns">
          {DEMO_EVENTS.map((e) => (
            <button key={e.key} className="chip" onClick={() => fireEvent(e)}>
              {e.emoji} {e.label} {signedWon(e.amount)}
            </button>
          ))}
          <button className="chip ghost" onClick={reset}>
            ↺ 초기화
          </button>
        </div>
      </section>
    </>
  );
}
