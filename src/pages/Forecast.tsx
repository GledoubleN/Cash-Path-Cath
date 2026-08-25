// 예측 — 기획서 화면 ③ 미래 현금흐름 예측.
import { CashflowChart } from '../components/CashflowChart';
import { RiskBanner } from '../components/RiskBanner';
import { signedWon, won } from '../domain/format';
import type { Cath } from '../store';

const fmtDate = (iso: string) => iso.slice(5).replace('-', '/'); // 2026-09-05 → 09/05

export function Forecast({ cath, onFix }: { cath: Cath; onFix: () => void }) {
  const { forecast, plan, policy, scheduledEvents } = cath;
  const upcoming = [...scheduledEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <section className="card">
        <h2>30일 예상 잔액 흐름</h2>
        <CashflowChart forecast={forecast} minimumCash={policy.minimumCash} />
        <div className="kv">
          <span>예상 최저잔액</span>
          <strong className={forecast.riskLevel === 'LOW' ? 'pos' : 'neg'}>
            {won(forecast.minimumExpectedBalance)}
          </strong>
        </div>
      </section>

      {plan && <RiskBanner plan={plan} minimumCash={policy.minimumCash} onFix={onFix} />}

      <section className="card">
        <h2>예정 지출</h2>
        <ul className="rows">
          {upcoming.map((e) => (
            <li key={e.id}>
              <span>
                <em className="muted">{fmtDate(e.date)}</em> {e.label}
              </span>
              <strong className={e.amount < 0 ? 'neg' : 'pos'}>{signedWon(e.amount)}</strong>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
