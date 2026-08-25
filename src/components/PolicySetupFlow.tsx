import { useMemo, useState } from 'react';
import { Button } from '@toss/tds-mobile';
import { CaretLeft } from '@phosphor-icons/react';
import cathLogoLockup from '../assets/cath-logo-lockup.png';
import './PolicySetupFlow.css';

export interface FundAllocation {
  living: number;
  emergency: number;
  saving: number;
  investment: number;
}

export interface LoanRepaymentPolicy {
  monthlyAmount: number;
  surplusThreshold: number;
  surplusRepaymentRatio: number;
  priorityInterestRate: number;
}

export interface FinancialPolicyDraft {
  minimumCash: number;
  emergencyFund: number;
  loan: LoanRepaymentPolicy;
  allocation: FundAllocation;
}

interface PolicySetupFlowProps {
  connectedSummary?: string;
  availableCash?: number;
  initialValue?: FinancialPolicyDraft;
  onComplete: (policy: FinancialPolicyDraft) => void;
}

const DEFAULT_POLICY: FinancialPolicyDraft = {
  minimumCash: 1_000_000,
  emergencyFund: 3_000_000,
  loan: {
    monthlyAmount: 500_000,
    surplusThreshold: 1_500_000,
    surplusRepaymentRatio: 50,
    priorityInterestRate: 6,
  },
  allocation: { living: 40, emergency: 20, saving: 20, investment: 20 },
};

const STEP_LABELS = ['안내', '안전자금', '대출 계획', '자금 배분', '최종 확인'];

const won = (value: number) => `₩${Math.round(value).toLocaleString('ko-KR')}`;

export function PolicySetupFlow({
  connectedSummary = '계좌 7개 · 카드 2개 · 투자계좌 1개',
  availableCash = 1_240_000,
  initialValue = DEFAULT_POLICY,
  onComplete,
}: PolicySetupFlowProps) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<FinancialPolicyDraft>(initialValue);
  const allocationTotal = useMemo(
    () => Object.values(draft.allocation).reduce((sum, ratio) => sum + ratio, 0),
    [draft.allocation],
  );

  const goNext = () => setStep((current) => Math.min(current + 1, STEP_LABELS.length - 1));
  const goBack = () => setStep((current) => Math.max(current - 1, 0));

  return (
    <main className="policy-setup-shell">
      <section className="policy-setup-phone" aria-label="금융 정책 설정">
        <header className="policy-setup-header">
          <span className="policy-setup-time" aria-hidden="true">9:41</span>
          {step > 0 && (
            <div className="policy-setup-progress">
              <button type="button" className="policy-setup-back" onClick={goBack} aria-label="이전 단계"><CaretLeft size={19} weight="bold" /></button>
              <span>{step} / 4&nbsp;&nbsp;{STEP_LABELS[step]}</span>
            </div>
          )}
        </header>

        {step === 0 && <IntroStep connectedSummary={connectedSummary} onNext={goNext} />}
        {step === 1 && <SafetyStep draft={draft} setDraft={setDraft} onNext={goNext} />}
        {step === 2 && <LoanStep draft={draft} setDraft={setDraft} onNext={goNext} />}
        {step === 3 && (
          <AllocationStep
            availableCash={availableCash}
            draft={draft}
            setDraft={setDraft}
            total={allocationTotal}
            onNext={goNext}
          />
        )}
        {step === 4 && <ReviewStep draft={draft} onComplete={() => onComplete(draft)} />}
      </section>
    </main>
  );
}

function IntroStep({ connectedSummary, onNext }: { connectedSummary: string; onNext: () => void }) {
  return (
    <div className="policy-step">
      <div className="policy-step-title-block intro-title">
        <img className="policy-logo-lockup" src={cathLogoLockup} alt="Cath, cash plus path" />
        <h1>Cath가 내 돈을 관리하는 법</h1>
        <p>앞으로 쓸 수 있는 돈과 안전하게 운용할 금액을 구분해요.</p>
        <span className="policy-pill">첫 설정 · 약 2분</span>
      </div>
      <div className="policy-card">
        <h2>연결된 금융정보</h2>
        <p className="policy-muted">금융기관 5개</p>
        <strong>{connectedSummary}</strong>
      </div>
      <div className="policy-card policy-criteria">
        <h2>설정할 기준</h2>
        <ol>
          <li>최소 생활자금과 비상금</li>
          <li>대출 상환 처리 계획</li>
          <li>계좌·적금·투자 배분 비율</li>
        </ol>
      </div>
      <BottomButton onClick={onNext}>내 돈 관리 기준 설정하기</BottomButton>
    </div>
  );
}

function SafetyStep({
  draft,
  setDraft,
  onNext,
}: {
  draft: FinancialPolicyDraft;
  setDraft: React.Dispatch<React.SetStateAction<FinancialPolicyDraft>>;
  onNext: () => void;
}) {
  return (
    <div className="policy-step">
      <Title title={<>얼마를 남겨두면<br />마음이 놓이나요?</>} subtitle="예정 지출과 별개로 항상 지킬 현금 기준입니다." />
      <MoneyField
        label="최소 생활자금"
        value={draft.minimumCash}
        description="생활비 계좌에서 이 금액 아래로 내려가지 않게 보호해요."
        onChange={(minimumCash) => setDraft((current) => ({ ...current, minimumCash }))}
      />
      <MoneyField
        label="비상금 목표"
        value={draft.emergencyFund}
        description="현재 ₩2,100,000 · 목표까지의 금액을 우선 채워요."
        onChange={(emergencyFund) => setDraft((current) => ({ ...current, emergencyFund }))}
      />
      <p className="policy-note">Cath는 예정 지출과 위 두 안전자금을 먼저 확보한 뒤, 남는 돈만 운용합니다.</p>
      <BottomButton onClick={onNext}>다음 · 대출 처리 계획</BottomButton>
    </div>
  );
}

function LoanStep({
  draft,
  setDraft,
  onNext,
}: {
  draft: FinancialPolicyDraft;
  setDraft: React.Dispatch<React.SetStateAction<FinancialPolicyDraft>>;
  onNext: () => void;
}) {
  const updateLoan = (patch: Partial<LoanRepaymentPolicy>) =>
    setDraft((current) => ({ ...current, loan: { ...current.loan, ...patch } }));

  return (
    <div className="policy-step">
      <Title title={<>대출은 어떤 속도로<br />갚아갈까요?</>} subtitle="기본 상환액과 여유자금 발생 시 규칙을 정합니다." />
      <div className="policy-card compact">
        <span className="policy-label">현재 대출</span>
        <strong>신용대출 · 잔액 ₩8,400,000</strong>
        <small>금리 6.8% · 매월 25일</small>
      </div>
      <MoneyField
        compact
        label="매달 갚을 금액"
        value={draft.loan.monthlyAmount}
        description="최소 상환액 ₩280,000보다 더 갚을 금액을 정해요."
        onChange={(monthlyAmount) => updateLoan({ monthlyAmount })}
      />
      <div className="policy-card compact">
        <label className="policy-label" htmlFor="surplus-threshold">여유자금이 생기면</label>
        <div className="policy-inline-inputs">
          <MoneyInput id="surplus-threshold" value={draft.loan.surplusThreshold} onChange={(surplusThreshold) => updateLoan({ surplusThreshold })} />
          <span>초과분의</span>
          <NumberInput value={draft.loan.surplusRepaymentRatio} suffix="%" onChange={(surplusRepaymentRatio) => updateLoan({ surplusRepaymentRatio })} />
        </div>
        <small className="policy-example">예: 여유자금 ₩2M → 일부 금액 추가 상환</small>
      </div>
      <div className="policy-card compact policy-priority">
        <span>우선순위</span>
        <NumberInput value={draft.loan.priorityInterestRate} suffix="% 이상 고금리 대출 먼저" onChange={(priorityInterestRate) => updateLoan({ priorityInterestRate })} />
      </div>
      <BottomButton onClick={onNext}>다음 · 자금 배분</BottomButton>
    </div>
  );
}

function AllocationStep({
  availableCash,
  draft,
  setDraft,
  total,
  onNext,
}: {
  availableCash: number;
  draft: FinancialPolicyDraft;
  setDraft: React.Dispatch<React.SetStateAction<FinancialPolicyDraft>>;
  total: number;
  onNext: () => void;
}) {
  const entries: Array<[keyof FundAllocation, string, string]> = [
    ['living', '생활 여유분', '생활비 계좌'],
    ['emergency', '비상금', 'CMA 비상금 계좌'],
    ['saving', '저축', '토스뱅크 적금'],
    ['investment', '투자', '증권 종합계좌'],
  ];

  const updateRatio = (key: keyof FundAllocation, ratio: number) =>
    setDraft((current) => ({
      ...current,
      allocation: { ...current.allocation, [key]: ratio },
    }));

  return (
    <div className="policy-step">
      <Title title={<>남은 돈을 어디에<br />얼마씩 나눌까요?</>} subtitle={`이번 달 예상 여유자금 ${won(availableCash)} 기준`} />
      <div className={`policy-card allocation-card ${total !== 100 ? 'invalid' : ''}`}>
        <h2>합계 {total}%</h2>
        {entries.map(([key, label, account]) => {
          const ratio = draft.allocation[key];
          return (
            <label className="allocation-row" key={key}>
              <span className="allocation-head"><strong>{label}</strong><b>{ratio}%</b></span>
              <span className="allocation-meta"><small>{account}</small><small>{won(availableCash * ratio / 100)}</small></span>
              <input type="range" min="0" max="100" step="5" value={ratio} onChange={(event) => updateRatio(key, Number(event.target.value))} />
            </label>
          );
        })}
      </div>
      <p className="policy-note">비상금 목표가 채워지면 해당 비율은 저축과 투자에 재배분할 수 있어요.</p>
      {total !== 100 && <p className="policy-error">배분 비율의 합계를 100%로 맞춰주세요.</p>}
      <BottomButton disabled={total !== 100} onClick={onNext}>다음 · 최종 확인</BottomButton>
    </div>
  );
}

function ReviewStep({ draft, onComplete }: { draft: FinancialPolicyDraft; onComplete: () => void }) {
  return (
    <div className="policy-step">
      <Title title={<>이 기준으로<br />돈을 관리할게요</>} subtitle="언제든 설정에서 다시 바꿀 수 있습니다." />
      <SummaryCard title="안전자금" rows={[
        ['최소 생활자금', won(draft.minimumCash)],
        ['비상금 목표', won(draft.emergencyFund)],
      ]} />
      <SummaryCard title="대출 처리 계획" rows={[
        ['매월 기본 상환', won(draft.loan.monthlyAmount)],
        ['추가 상환', `${won(draft.loan.surplusThreshold)} 초과분의 ${draft.loan.surplusRepaymentRatio}%`],
        ['우선 상환', `금리 ${draft.loan.priorityInterestRate}% 이상`],
      ]} />
      <SummaryCard title="여유자금 배분" rows={[
        ['생활 여유분', `${draft.allocation.living}%`],
        ['비상금 · 저축 · 투자', `${draft.allocation.emergency}% · ${draft.allocation.saving}% · ${draft.allocation.investment}%`],
      ]} />
      <p className="policy-note">예정 지출과 안전자금을 확보한 뒤 남는 금액만 위 비율로 운용합니다.</p>
      <BottomButton onClick={onComplete}>이 기준으로 시작하기</BottomButton>
    </div>
  );
}

function Title({ title, subtitle }: { title: React.ReactNode; subtitle: string }) {
  return <div className="policy-step-title-block"><h1>{title}</h1><p>{subtitle}</p></div>;
}

function MoneyField({ label, value, description, onChange, compact = false }: { label: string; value: number; description: string; onChange: (value: number) => void; compact?: boolean }) {
  return <div className={`policy-card money-field ${compact ? 'compact' : ''}`}><label className="policy-label"><span>{label}</span><MoneyInput value={value} onChange={onChange} /></label><small>{description}</small></div>;
}

function MoneyInput({ id, value, onChange }: { id?: string; value: number; onChange: (value: number) => void }) {
  return <span className="money-input"><span>₩</span><input id={id} inputMode="numeric" type="number" min="0" step="10000" value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value)))} /></span>;
}

function NumberInput({ value, suffix, onChange }: { value: number; suffix: string; onChange: (value: number) => void }) {
  return <span className="number-input"><input type="number" min="0" max="100" value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value)))} /><span>{suffix}</span></span>;
}

function SummaryCard({ title, rows }: { title: string; rows: Array<[string, string]> }) {
  return <div className="policy-card summary-card"><h2>{title}</h2>{rows.map(([label, value]) => <div className="summary-row" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>;
}

function BottomButton({ children, onClick, disabled = false }: { children: React.ReactNode; onClick: () => void; disabled?: boolean }) {
  return <Button type="button" display="full" size="large" className="policy-bottom-button" onClick={onClick} disabled={disabled}>{children}</Button>;
}
