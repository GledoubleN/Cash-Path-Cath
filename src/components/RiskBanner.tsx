// 유동성 위험 배너 — Home·예측 페이지 공용. onFix 주면 최적화 탭으로 유도.
import { won } from '../domain/format';
import type { OptimizationPlan } from '../domain/types';

export function RiskBanner({
  plan,
  minimumCash,
  onFix,
}: {
  plan: OptimizationPlan;
  minimumCash: number;
  onFix?: () => void;
}) {
  return (
    <section className="card banner">
      <h2>⚠️ 유동성 부족 위험 감지</h2>
      <p>예정된 지출을 반영하면 예상 최저잔액이 최소생활자금({won(minimumCash)})보다 낮아집니다.</p>
      <div className="kv danger">
        <span>예상 부족액</span>
        <strong>{won(-plan.shortfall)}</strong>
      </div>
      {onFix && (
        <button className="primary" onClick={onFix}>
          계획 다시 계산하기
        </button>
      )}
    </section>
  );
}
