// 도메인 타입 — 기획서 §11(Microservices), §13(REST API) 기준.
// 백엔드는 mock. 이 타입들이 곧 프론트/백 계약(contract) 초안 역할을 한다.

export type AccountType =
  | 'CHECKING' // 생활/급여 계좌 (유동)
  | 'CMA' // 단기 유동 + 소액 이자
  | 'ETF' // 투자
  | 'SAVINGS' // 적금
  | 'LOAN'; // 대출 (음수 잔액)

export interface Account {
  id: string;
  name: string;
  bank: string;
  type: AccountType;
  balance: number; // 원. LOAN은 음수.
  interestRate?: number; // 대출 금리 등 (연, 0.06 = 6%)
}

export type TxCategory =
  | 'SALARY'
  | 'RENT'
  | 'CARD'
  | 'LOAN_REPAYMENT'
  | 'INSURANCE'
  | 'UTILITY'
  | 'FOOD'
  | 'ELECTRONICS'
  | 'TRANSFER'
  | 'ETC';

export interface Transaction {
  id: string;
  accountId: string;
  title: string;
  category: TxCategory;
  amount: number; // 부호 있음. 지출 음수, 수입 양수.
  occurredAt: string; // ISO date
}

// 미래에 예정된 현금 이벤트 (카드대금/월세/급여 등). Cashflow 예측의 입력.
export interface ScheduledEvent {
  id: string;
  label: string;
  category: TxCategory;
  amount: number; // 부호 있음
  date: string; // ISO date
}

export type AutomationLevel =
  | 'ANALYSIS' // L0
  | 'RECOMMENDATION' // L1
  | 'APPROVAL_REQUIRED' // L2
  | 'AUTO'; // L3

// 기획서 §4 Financial Policy / §13 Policy API
export interface Policy {
  minimumCash: number; // 최소 생활자금 (결제불능 방지 하한)
  emergencyFund: number; // 비상자금 목표
  savingRatio: number; // 여유자금 중 저축 최소 비율
  investmentRatio: number; // 여유자금 중 투자 최대 비율
  loanPriorityInterestRate: number; // 이 금리 이상이면 우선 상환
  automationLevel: AutomationLevel;
}

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Cashflow 예측 결과 한 점.
export interface ForecastPoint {
  date: string;
  label: string; // NOW / CARD / RENT / SALARY ...
  balance: number; // 해당 시점 예상 유동 잔액
}

// 기획서 §13 Cashflow forecast response + 그래프용 series.
export interface Forecast {
  currentBalance: number; // 오늘 유동 잔액
  requiredCash: number; // 예측 기간 내 총 필수 지출
  availableCash: number; // 운용 가능 자금
  minimumExpectedBalance: number; // 기간 내 최저 예상 잔액
  riskLevel: RiskLevel;
  series: ForecastPoint[];
}

// Optimization 제안 한 줄.
export interface OptimizationAction {
  id: string;
  label: string; // "CMA → 생활계좌 이동"
  amount: number; // 유동성에 더해지는 양(+) 또는 배분되는 양(-)
  from?: string;
  to?: string;
}

export interface OptimizationPlan {
  id: string;
  reason: string;
  actions: OptimizationAction[];
  shortfall: number; // 부족액 (없으면 0)
  projectedMinBefore: number;
  projectedMinAfter: number;
  riskBefore: RiskLevel;
  riskAfter: RiskLevel;
  approved: boolean;
}
