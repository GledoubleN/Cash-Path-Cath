// 순수 계산 엔진 — 백엔드 cashflow/risk/optimization-service의 프론트 mock 구현.
// 모든 함수는 순수(입력→출력). 이벤트 발생 시 이 함수들을 다시 돌려 UI를 갱신한다
// (기획서 §15: Transaction → Cashflow → Risk → Optimization 재계산 흐름).
import type {
  Forecast,
  ForecastPoint,
  OptimizationAction,
  OptimizationPlan,
  Policy,
  RiskLevel,
  ScheduledEvent,
} from './types';

export interface ForecastInput {
  checkingStart: number; // 오늘 생활계좌 잔액
  scheduled: ScheduledEvent[]; // 예정 현금 이벤트
  appliedToday: number[]; // 오늘 즉시 반영되는 거래 금액(부호). 예: 노트북 -1,290,000
  liquidityInjection: number; // 최적화로 오늘 확보한 추가 유동성
  cmaBalance: number; // 참고용 (optimize에서 사용)
  policy: Policy;
}

function riskFromShortfall(shortfall: number, min: number, floor: number): RiskLevel {
  if (shortfall <= 0) return 'LOW';
  if (min < 0) return 'CRITICAL';
  if (shortfall >= floor * 0.5) return 'HIGH';
  return 'MEDIUM';
}

export function buildForecast(input: ForecastInput): Forecast {
  const { checkingStart, scheduled, appliedToday, liquidityInjection, policy } = input;

  const today = appliedToday.reduce((s, a) => s + a, 0);
  const start = checkingStart + today + liquidityInjection;

  const sorted = [...scheduled].sort((a, b) => a.date.localeCompare(b.date));

  const series: ForecastPoint[] = [{ date: 'now', label: 'NOW', balance: start }];
  let running = start;
  for (const ev of sorted) {
    running += ev.amount;
    series.push({ date: ev.date, label: labelFor(ev), balance: running });
  }

  const minimumExpectedBalance = Math.min(...series.map((p) => p.balance));
  const requiredCash = sorted.filter((e) => e.amount < 0).reduce((s, e) => s + Math.abs(e.amount), 0);
  const availableCash = Math.max(0, minimumExpectedBalance - policy.minimumCash);
  const shortfall = policy.minimumCash - minimumExpectedBalance;

  return {
    currentBalance: start,
    requiredCash,
    availableCash,
    minimumExpectedBalance,
    riskLevel: riskFromShortfall(shortfall, minimumExpectedBalance, policy.minimumCash),
    series,
  };
}

function labelFor(ev: ScheduledEvent): string {
  switch (ev.category) {
    case 'CARD':
      return 'CARD';
    case 'RENT':
      return 'RENT';
    case 'SALARY':
      return 'SALARY';
    case 'INSURANCE':
      return 'INS';
    case 'UTILITY':
      return 'UTIL';
    default:
      return ev.label;
  }
}

export interface OptimizeInput {
  forecast: Forecast; // 위험이 감지된 현재 예측
  base: ForecastInput; // 재계산용 입력
  autoInvestAmount: number; // 보류 가능한 이번 달 자동 투자액
}

// 부족액을 메우도록 자금을 재배치한다. 기획서 §8 Optimization 우선순위:
// 1) 결제 불능 방지가 최우선 → 유동성부터 확보.
export function optimize(input: OptimizeInput): OptimizationPlan {
  const { forecast, base, autoInvestAmount } = input;
  const floor = base.policy.minimumCash;
  const shortfall = Math.max(0, floor - forecast.minimumExpectedBalance);

  const actions: OptimizationAction[] = [];
  let injection = 0;

  // 1) 이번 달 자동 투자 보류 → 유동성에 남긴다.
  if (shortfall > 0 && autoInvestAmount > 0) {
    actions.push({ id: 'pause-invest', label: 'ETF 자동 투자 보류', amount: autoInvestAmount, from: 'acc-etf' });
    injection += autoInvestAmount;
  }

  // 2) 그래도 부족하면 CMA에서 생활계좌로 이동.
  const remaining = shortfall - injection;
  if (remaining > 0) {
    const transfer = Math.min(remaining, base.cmaBalance);
    if (transfer > 0) {
      actions.push({
        id: 'cma-transfer',
        label: 'CMA → 생활계좌 이동',
        amount: transfer,
        from: 'acc-cma',
        to: 'acc-checking',
      });
      injection += transfer;
    }
  }

  const after = buildForecast({ ...base, liquidityInjection: base.liquidityInjection + injection });

  return {
    id: `plan-${Date.now()}`,
    reason: shortfall > 0 ? '결제 불능 위험 해소를 위한 자금 재배치' : '현재 위험 없음 — 여유자금 운용 제안',
    actions,
    shortfall,
    projectedMinBefore: forecast.minimumExpectedBalance,
    projectedMinAfter: after.minimumExpectedBalance,
    riskBefore: forecast.riskLevel,
    riskAfter: after.riskLevel,
    approved: false,
  };
}

export function totalInjection(plan: OptimizationPlan): number {
  return plan.actions.reduce((s, a) => s + a.amount, 0);
}
