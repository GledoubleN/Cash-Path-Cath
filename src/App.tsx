import { useState } from 'react';
import { CashflowChart } from './components/CashflowChart';
import { Onboarding, PRIORITIES } from './components/Onboarding';
import { signedWon, won } from './domain/format';
import type { OptimizationPlan, RiskLevel } from './domain/types';
import { DEMO_EVENTS, useCath, type DemoEvent } from './store';

const RISK_LABEL: Record<RiskLevel, string> = {
  LOW: '안전',
  MEDIUM: '주의',
  HIGH: '위험',
  CRITICAL: '심각',
};

const PRIORITY_LABEL: Record<string, string> = Object.fromEntries(PRIORITIES.map((p) => [p.key, p.label]));
const STORAGE_KEY = 'cath.priorities';

export default function App() {
  const [priorities, setPriorities] = useState<string[] | null>(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : null;
  });

  if (!priorities) {
    return (
      <Onboarding
        onComplete={(sel) => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sel));
          setPriorities(sel);
        }}
      />
    );
  }

  return <Dashboard priorities={priorities} />;
}

function Dashboard({ priorities }: { priorities: string[] }) {
  const { forecast, plan, planApproved, accounts, policy, recentTx, fireEvent, approvePlan, reset } = useCath();
  const totalAssets = accounts.reduce((s, a) => s + a.balance, 0);
  const safe = forecast.riskLevel === 'LOW';

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">Cath · Cash + Path</div>
          <div className="tagline">
            {priorities.map((k) => PRIORITY_LABEL[k]).join(' · ') || '돈이 필요한 곳으로, 알아서 흐르도록.'}
          </div>
        </div>
        <span className={`badge ${safe ? 'ok' : 'warn'}`}>{RISK_LABEL[forecast.riskLevel]}</span>
      </header>

      {/* ── 운용 가능 자금 / 자산 요약 ── */}
      <section className="card hero">
        <div className="hero-label">지금 운용 가능한 돈</div>
        <div className="hero-amount">{won(forecast.availableCash)}</div>
        <div className="hero-sub">
          <span>총 금융자산 {won(totalAssets)}</span>
          <span>예상 최저잔액 {won(forecast.minimumExpectedBalance)}</span>
        </div>
      </section>

      {/* ── 위험 배너 ── */}
      {!safe && plan && <RiskBanner plan={plan} minimumCash={policy.minimumCash} />}

      {/* ── 현금흐름 그래프 ── */}
      <section className="card">
        <h2>30일 예상 잔액 흐름</h2>
        <CashflowChart forecast={forecast} minimumCash={policy.minimumCash} />
      </section>

      {/* ── 최적화 제안 ── */}
      {plan && <OptimizationCard plan={plan} onApprove={approvePlan} />}
      {planApproved && (
        <section className="card resolved">
          <h2>✓ 위험이 해소되었습니다</h2>
          <p className="muted">Cath가 자금을 재배치해 예상 최저잔액을 최소생활자금 위로 올렸어요.</p>
          <div className="kv">
            <span>예상 최저잔액</span>
            <strong>{won(forecast.minimumExpectedBalance)}</strong>
          </div>
        </section>
      )}

      {/* ── 계좌 요약 ── */}
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

      {/* ── 최근 거래 ── */}
      <section className="card">
        <h2>최근 거래</h2>
        <ul className="rows">
          {recentTx.slice(0, 6).map((t) => (
            <li key={t.id}>
              <span>{t.title}</span>
              <strong className={t.amount < 0 ? 'neg' : 'pos'}>{signedWon(t.amount)}</strong>
            </li>
          ))}
        </ul>
      </section>

      {/* ── 데모 이벤트 바 (기획서 §15) ── */}
      <div className="demobar">
        <div className="demobar-title">데모 이벤트 발생시키기</div>
        <div className="demobar-btns">
          {DEMO_EVENTS.map((e: DemoEvent) => (
            <button key={e.key} className="chip" onClick={() => fireEvent(e)}>
              {e.emoji} {e.label} {signedWon(e.amount)}
            </button>
          ))}
          <button className="chip ghost" onClick={reset}>
            ↺ 초기화
          </button>
        </div>
      </div>
    </div>
  );
}

function RiskBanner({ plan, minimumCash }: { plan: OptimizationPlan; minimumCash: number }) {
  return (
    <section className="card banner">
      <h2>⚠️ 유동성 부족 위험 감지</h2>
      <p>
        예정된 지출을 반영하면 예상 최저잔액이 최소생활자금({won(minimumCash)})보다 낮아집니다.
      </p>
      <div className="kv danger">
        <span>예상 부족액</span>
        <strong>{won(-plan.shortfall)}</strong>
      </div>
    </section>
  );
}

function OptimizationCard({ plan, onApprove }: { plan: OptimizationPlan; onApprove: () => void }) {
  return (
    <section className="card proposal">
      <h2>Cath의 제안</h2>
      <ul className="rows">
        {plan.actions.map((a) => (
          <li key={a.id}>
            <span>{a.label}</span>
            <strong className="pos">{signedWon(a.amount)}</strong>
          </li>
        ))}
      </ul>
      <div className="kv">
        <span>예상 최저잔액</span>
        <strong>
          {won(plan.projectedMinBefore)} → {won(plan.projectedMinAfter)}
        </strong>
      </div>
      <button className="primary" onClick={onApprove}>
        제안 승인하고 실행하기
      </button>
    </section>
  );
}
