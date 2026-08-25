// 홈 — 기획서 화면 ① 대시보드 (현재 상태).
import { CashflowChart } from '../components/CashflowChart';
import { RiskBanner } from '../components/RiskBanner';
import { signedWon, won } from '../domain/format';
import type { Cath } from '../store';

export function Home({ cath, onFix }: { cath: Cath; onFix: () => void }) {
  const { forecast, plan, accounts, policy, recentTx } = cath;
  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);

  return (
    <>
      <section className="card hero">
        <div className="hero-label">지금 운용 가능한 돈</div>
        <div className="hero-amount">{won(forecast.availableCash)}</div>
        <div className="hero-grid">
          <div>
            <span>총 금융자산</span>
            <strong>{won(totalAssets)}</strong>
          </div>
          <div>
            <span>앞으로 30일 필요</span>
            <strong>{won(forecast.requiredCash)}</strong>
          </div>
          <div>
            <span>안전자금</span>
            <strong>{won(policy.minimumCash)}</strong>
          </div>
          <div>
            <span>예상 최저잔액</span>
            <strong>{won(forecast.minimumExpectedBalance)}</strong>
          </div>
        </div>
      </section>

      {plan && <RiskBanner plan={plan} minimumCash={policy.minimumCash} onFix={onFix} />}

      <section className="card">
        <h2>30일 예상 잔액 흐름</h2>
        <CashflowChart forecast={forecast} minimumCash={policy.minimumCash} />
      </section>

      <section className="card">
        <h2>계좌 요약</h2>
        <ul className="rows">
          {accounts.map((a) => (
            <li key={a.id}>
              <span>
                {a.name} <em className="muted">{a.bank}</em>
              </span>
              <strong className={a.balance < 0 ? 'neg' : ''}>{won(a.balance)}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>최근 거래</h2>
        <ul className="rows">
          {recentTx.slice(0, 4).map((t) => (
            <li key={t.id}>
              <span>{t.title}</span>
              <strong className={t.amount < 0 ? 'neg' : 'pos'}>{signedWon(t.amount)}</strong>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
