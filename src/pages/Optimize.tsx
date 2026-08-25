// 최적화 — 기획서 화면 ④ 제안 · ⑤ 승인 · ⑥ 결과.
import { useState } from 'react';
import { Button, Checkbox } from '@toss/tds-mobile';
import { signedWon, won } from '../domain/format';
import type { Cath } from '../store';

export function Optimize({ cath }: { cath: Cath }) {
  const { plan, planApproved, approvedPlan, forecast, approvePlan } = cath;
  const [agreed, setAgreed] = useState(false);

  // ⑥ 결과
  if (planApproved && approvedPlan) {
    const moved = approvedPlan.actions.reduce((s, a) => s + a.amount, 0);
    return (
      <section className="card resolved">
        <h2>✓ 위험이 해소되었습니다</h2>
        <p className="muted">Cath가 자동으로 자금을 재배치해 예상 최저잔액을 최소생활자금 위로 올렸어요.</p>
        <ul className="rows">
          {approvedPlan.actions.map((a) => (
            <li key={a.id}>
              <span>{a.label}</span>
              <strong className="pos">{signedWon(a.amount)}</strong>
            </li>
          ))}
        </ul>
        <div className="kv">
          <span>총 이동 금액</span>
          <strong>{won(moved)}</strong>
        </div>
        <div className="kv">
          <span>예상 최저잔액</span>
          <strong className="pos">{won(forecast.minimumExpectedBalance)}</strong>
        </div>
      </section>
    );
  }

  // ④⑤ 제안 + 승인
  if (plan) {
    return (
      <section className="card proposal">
        <h2>Cath의 제안</h2>
        <p className="muted">위험을 해결하기 위한 자금 재배치 제안입니다.</p>

        <div className="summary-grid">
          <div>
            <span>위험 해소 금액</span>
            <strong>{won(plan.shortfall)}</strong>
          </div>
          <div>
            <span>예상 최저잔액</span>
            <strong>{won(plan.projectedMinAfter)}</strong>
          </div>
        </div>

        <h3 className="sub">제안 상세</h3>
        <ul className="rows">
          {plan.actions.map((a) => (
            <li key={a.id}>
              <span>{a.label}</span>
              <strong className="pos">{signedWon(a.amount)}</strong>
            </li>
          ))}
        </ul>
        <div className="kv">
          <span>예상 최저잔액 변화</span>
          <strong>
            {won(plan.projectedMinBefore)} → {won(plan.projectedMinAfter)}
          </strong>
        </div>

        <div className="agree">
          <Checkbox.Circle checked={agreed} onCheckedChange={setAgreed} aria-label="제안 내용 동의" />
          <span>제안 내용을 확인했고 동의합니다.</span>
        </div>
        <Button className="proposal-action" display="full" size="large" disabled={!agreed} onClick={approvePlan}>
          승인하고 실행하기
        </Button>
      </section>
    );
  }

  // 위험 없음
  return (
    <section className="card">
      <h2>현재 위험 없음</h2>
      <p className="muted">
        예상 최저잔액이 최소생활자금 위에 있어요. 내역 탭에서 돌발 지출을 발생시키면 Cath가 재배치를 제안합니다.
      </p>
    </section>
  );
}
