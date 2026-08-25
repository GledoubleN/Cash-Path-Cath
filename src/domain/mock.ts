// 초기 mock 데이터. 실제 은행/투자 API 대신 사용 (기획서 §16 MVP 범위).
// 데모 시나리오(SAFE → 위험 → SAFE)가 자연스럽게 나오도록 튜닝된 값.
// 숫자는 시연용 보정값이니 팀에서 자유롭게 조정 가능.
import type { Account, Policy, ScheduledEvent, Transaction } from './types';

export const CHECKING_ID = 'acc-checking';

export const accounts: Account[] = [
  { id: CHECKING_ID, name: '생활계좌', bank: 'A은행', type: 'CHECKING', balance: 3_000_000 },
  { id: 'acc-cma', name: 'CMA', bank: 'B증권', type: 'CMA', balance: 4_200_000 },
  { id: 'acc-etf', name: 'ETF 투자', bank: 'C증권', type: 'ETF', balance: 5_340_000 },
  { id: 'acc-savings', name: '적금', bank: 'D은행', type: 'SAVINGS', balance: 3_000_000 },
  {
    id: 'acc-loan',
    name: '신용대출',
    bank: 'A은행',
    type: 'LOAN',
    balance: -1_800_000,
    interestRate: 0.068,
  },
];

// 최근 거래 (표시용). occurredAt 내림차순으로 렌더.
export const transactions: Transaction[] = [
  { id: 'tx-1', accountId: CHECKING_ID, title: '급여 입금', category: 'SALARY', amount: 3_200_000, occurredAt: '2026-08-23T09:15:00' },
  { id: 'tx-2', accountId: 'acc-etf', title: '카드 결제', category: 'CARD', amount: -1_100_000, occurredAt: '2026-08-23T08:45:00' },
  { id: 'tx-3', accountId: CHECKING_ID, title: '월세', category: 'RENT', amount: -700_000, occurredAt: '2026-08-23T08:30:00' },
  { id: 'tx-4', accountId: CHECKING_ID, title: '식비', category: 'FOOD', amount: -38_000, occurredAt: '2026-08-23T12:10:00' },
];

// 앞으로 30일 예정 현금 이벤트 (기획서 §6.2 / 화면 ③ 예정 지출).
export const scheduledEvents: ScheduledEvent[] = [
  { id: 'se-card', label: '카드 결제', category: 'CARD', amount: -1_100_000, date: '2026-08-28' },
  { id: 'se-rent', label: '월세', category: 'RENT', amount: -700_000, date: '2026-09-01' },
  { id: 'se-insurance', label: '보험료', category: 'INSURANCE', amount: -120_000, date: '2026-09-03' },
  { id: 'se-utility', label: '통신비', category: 'UTILITY', amount: -50_000, date: '2026-09-05' },
  { id: 'se-salary', label: '급여 입금', category: 'SALARY', amount: 3_200_000, date: '2026-09-10' },
];

// 기획서 §4 / §13 Policy 기본값.
export const policy: Policy = {
  minimumCash: 1_000_000,
  emergencyFund: 3_000_000,
  savingRatio: 0.2,
  investmentRatio: 0.4,
  loanPriorityInterestRate: 0.06,
  automationLevel: 'APPROVAL_REQUIRED',
};

// 이번 달 예정된 자동 투자(ETF). 위험 시 보류 대상.
export const pendingAutoInvest = { accountId: 'acc-etf', amount: 300_000, label: 'ETF 자동 투자 보류' };
