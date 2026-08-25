// 유동성 위험 배너 — Home·예측 페이지 공용. onFix 주면 최적화 탭으로 유도.
import { won } from '../domain/format';
import type { OptimizationPlan } from '../domain/types';
import { Button } from '@toss/tds-mobile';

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
      <h2>⚠ 유동성 부족 위험 감지</h2>
      <p>예정 지출을 반영하면 예상 최저잔액이 안전자금 {won(minimumCash)} 아래로 내려가요.</p>
      <div className="kv danger">
        <span>예상 부족액</span>
        <strong>{won(Math.abs(plan.shortfall))}</strong>
      </div>
      {onFix && (
        <Button className="banner-action" size="medium" display="full" variant="weak" color="danger" onClick={onFix}>
          조정안 확인하기
        </Button>
      )}
    </section>
  );
}
