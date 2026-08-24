// 앱 상태 훅. 데모 이벤트 발생 → 예측/위험/최적화가 자동 재계산된다.
// 백엔드 없이 domain/engine 순수 함수만으로 §15 이벤트 흐름을 재현.
import { useCallback, useMemo, useState } from 'react';
import { buildForecast, optimize, totalInjection, type ForecastInput } from './domain/engine';
import { CHECKING_ID, accounts, pendingAutoInvest, policy, scheduledEvents, transactions } from './domain/mock';
import type { Transaction } from './domain/types';

const checking = accounts.find((a) => a.id === CHECKING_ID)!;
const cma = accounts.find((a) => a.type === 'CMA')!;

// 데모 바에서 누를 수 있는 이벤트 (기획서 §15 Demo Event).
export interface DemoEvent {
  key: string;
  label: string;
  emoji: string;
  category: Transaction['category'];
  amount: number;
}

export const DEMO_EVENTS: DemoEvent[] = [
  { key: 'laptop', label: '노트북 구매', emoji: '💻', category: 'ELECTRONICS', amount: -1_290_000 },
  { key: 'card', label: '카드대금', emoji: '💳', category: 'CARD', amount: -1_100_000 },
  { key: 'salary', label: '월급', emoji: '💰', category: 'SALARY', amount: 3_200_000 },
];

export function useDoneureum() {
  const [applied, setApplied] = useState<Transaction[]>([]);
  const [injection, setInjection] = useState(0);
  const [planApproved, setPlanApproved] = useState(false);

  const base: ForecastInput = useMemo(
    () => ({
      checkingStart: checking.balance,
      scheduled: scheduledEvents,
      appliedToday: applied.map((t) => t.amount),
      liquidityInjection: injection,
      cmaBalance: cma.balance,
      policy,
    }),
    [applied, injection],
  );

  const forecast = useMemo(() => buildForecast(base), [base]);

  // 위험이 있고 아직 승인 안 했을 때만 제안 생성.
  const plan = useMemo(() => {
    if (forecast.riskLevel === 'LOW' || planApproved) return null;
    return optimize({ forecast, base, autoInvestAmount: pendingAutoInvest.amount });
  }, [forecast, base, planApproved]);

  const fireEvent = useCallback((e: DemoEvent) => {
    setPlanApproved(false);
    setApplied((prev) => [
      {
        id: `tx-demo-${Date.now()}`,
        accountId: CHECKING_ID,
        title: e.label,
        category: e.category,
        amount: e.amount,
        occurredAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  }, []);

  const approvePlan = useCallback(() => {
    if (!plan) return;
    setInjection((prev) => prev + totalInjection(plan));
    setPlanApproved(true);
  }, [plan]);

  const reset = useCallback(() => {
    setApplied([]);
    setInjection(0);
    setPlanApproved(false);
  }, []);

  const recentTx = useMemo<Transaction[]>(
    () => [...applied, ...transactions].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)),
    [applied],
  );

  return { forecast, plan, planApproved, accounts, policy, recentTx, fireEvent, approvePlan, reset };
}
