// 홈 — 기획서 화면 ① 대시보드 (Figma R_HOME_DONUT). 히어로 + 위험 배너 + 돈 관리 기준.
import { BudgetDonut } from '../components/BudgetDonut';
import type { FundAllocation } from '../components/PolicySetupFlow';
import { RiskBanner } from '../components/RiskBanner';
import { signedWon, won } from '../domain/format';
import { DEMO_EVENTS, type Cath } from '../store';

const DEFAULT_ALLOCATION: FundAllocation = { living: 40, emergency: 20, saving: 20, investment: 20 };

// setup에서 저장한 배분 비율. 없으면 기본값.
function readAllocation(): FundAllocation {
  try {
    const raw = localStorage.getItem('cath.policyDraft');
    if (raw) return (JSON.parse(raw) as { allocation?: FundAllocation }).allocation ?? DEFAULT_ALLOCATION;
  } catch {
    /* 잘못된 값이면 기본값 */
  }
  return DEFAULT_ALLOCATION;
}

export function Home({ cath, onFix, onEditPolicy }: { cath: Cath; onFix: () => void; onEditPolicy: () => void }) {
  const { forecast, plan, accounts, policy, recentTx, fireEvent, reset } = cath;
  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);
  const available = forecast.availableCash;

  return (
    <>
      <section className="card hero">
        <div className="hero-label">지금 운용 가능한 돈</div>
        <div className="hero-amount">{won(available)}</div>
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
        <div className="card-head">
          <h2>돈 관리 기준</h2>
          <button className="link" onClick={onEditPolicy}>설정 수정</button>
        </div>
        <BudgetDonut allocation={readAllocation()} availableCash={available} />
        <p className="budget-note">안전자금을 제외한 여유자금 {won(available)} 기준</p>
      </section>

      <section className="card">
        <h2>최근 거래</h2>
        <ul className="rows">
          {recentTx.slice(0, 6).map((t) => (
            <li key={t.id}>
              <span>
                {t.title} <em className="muted">{t.occurredAt.slice(5, 10).replace('-', '/')}</em>
              </span>
              <strong className={t.amount < 0 ? 'neg' : 'pos'}>{signedWon(t.amount)}</strong>
            </li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>+ 새 거래 추가</h2>
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
