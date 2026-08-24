import { describe, expect, it } from 'vitest';
import { buildForecast, optimize, totalInjection, type ForecastInput } from './engine';
import { CHECKING_ID, accounts, pendingAutoInvest, policy, scheduledEvents } from './mock';

const cma = accounts.find((a) => a.type === 'CMA')!;
const checking = accounts.find((a) => a.id === CHECKING_ID)!;

function baseInput(appliedToday: number[]): ForecastInput {
  return {
    checkingStart: checking.balance,
    scheduled: scheduledEvents,
    appliedToday,
    liquidityInjection: 0,
    cmaBalance: cma.balance,
    policy,
  };
}

describe('cashflow engine — 기획서 §15 이벤트 흐름', () => {
  it('초기 상태는 위험 없음(LOW)', () => {
    const f = buildForecast(baseInput([]));
    expect(f.riskLevel).toBe('LOW');
    expect(f.minimumExpectedBalance).toBeGreaterThanOrEqual(policy.minimumCash);
  });

  it('노트북 -1,290,000 지출 시 유동성 위험이 감지된다', () => {
    const f = buildForecast(baseInput([-1_290_000]));
    expect(f.riskLevel).not.toBe('LOW');
    expect(f.minimumExpectedBalance).toBeLessThan(policy.minimumCash);
  });

  it('최적화 제안을 적용하면 위험이 해소된다(LOW 복귀)', () => {
    const base = baseInput([-1_290_000]);
    const risky = buildForecast(base);
    const plan = optimize({ forecast: risky, base, autoInvestAmount: pendingAutoInvest.amount });

    expect(plan.shortfall).toBeGreaterThan(0);
    expect(plan.actions.length).toBeGreaterThan(0);
    expect(plan.riskAfter).toBe('LOW');
    expect(plan.projectedMinAfter).toBeGreaterThanOrEqual(policy.minimumCash);
    // 확보한 유동성이 부족액을 덮어야 한다.
    expect(totalInjection(plan)).toBeGreaterThanOrEqual(plan.shortfall);
  });
});
