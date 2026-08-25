// 홈 — 기획서 화면 ① 대시보드 (Figma R_HOME_DONUT). 히어로 + 위험 배너 + 돈 관리 기준.
import { BudgetDonut } from '../components/BudgetDonut';
import type { FundAllocation } from '../components/PolicySetupFlow';
import { signedWon, won } from '../domain/format';
import type { Cath } from '../store';
import { TextButton } from '@toss/tds-mobile';
import { Warning } from '@phosphor-icons/react';

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

export function Home({
  cath,
  onFix,
  onEditPolicy,
  onViewHistory,
}: {
  cath: Cath;
  onFix: () => void;
  onEditPolicy: () => void;
  onViewHistory: () => void;
}) {
  const { forecast, plan, accounts, policy, recentTx } = cath;
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

      {plan && (
        <section className="card banner home-risk">
          <h2><Warning size={18} weight="fill" aria-hidden="true" />12일 뒤 안전자금 아래로 내려가요</h2>
          <p>예상 최저잔액 {won(forecast.minimumExpectedBalance)} · 기준보다 {won(Math.abs(plan.shortfall))} 부족</p>
          <button type="button" className="banner-link" onClick={onFix}>조정안 확인하기</button>
        </section>
      )}

      <section className="card">
        <div className="card-head">
          <h2>돈 관리 기준</h2>
          <TextButton className="link" size="small" color="#3182f6" fontWeight="semibold" onClick={onEditPolicy}>설정 수정</TextButton>
        </div>
        <BudgetDonut allocation={readAllocation()} availableCash={available} />
        <p className="budget-note">안전자금을 제외한 여유자금 {won(available)} 기준</p>
      </section>

      <section className="card recent-card">
        <div className="card-head">
          <h2>최근 거래 내역</h2>
          <TextButton className="link" size="small" color="#3182f6" fontWeight="semibold" onClick={onViewHistory}>
            전체보기
          </TextButton>
        </div>
        <ul className="recent-list">
          {recentTx.slice(0, 4).map((transaction) => (
            <li key={transaction.id}>
              <span className={`recent-icon ${transaction.amount > 0 ? 'income' : 'expense'}`} aria-hidden="true">
                {transaction.amount > 0 ? '↓' : '↑'}
              </span>
              <span className="recent-copy">
                <strong>{transaction.title}</strong>
                <small>{transaction.occurredAt.slice(5, 10).replace('-', '.')}</small>
              </span>
              <strong className={transaction.amount > 0 ? 'pos' : 'neg'}>{signedWon(transaction.amount)}</strong>
            </li>
          ))}
        </ul>
      </section>

    </>
  );
}
