# 금융정책 초기설정 — 1·2단계

카쓰(Cath)의 금융정책 초기설정 흐름 중 다음 두 화면을 설명합니다.

1. 첫 설정 안내
2. 안전자금 설정

사용자는 로그인, 회원가입, 금융기관 연결을 이미 완료한 상태라고 가정합니다. 따라서 이 흐름은 계좌 연결을 반복하지 않고, 카쓰가 자금을 관리할 때 적용할 기준을 정하는 데 집중합니다.

## 실행 방법

```bash
npm install
npm run dev
```

개발 서버 실행 후 아래 주소에서 확인할 수 있습니다.

```text
http://localhost:5173/#/setup
```

각 화면은 해시 URL로 직접 접근할 수 있습니다: 온보딩 `#/onboarding`, 금융정책 설정 `#/setup`. 우선순위 미설정 시 기본 진입 화면은 온보딩입니다.

## 관련 파일

```text
src/
  App.tsx
  components/
    PolicySetupFlow.tsx
    PolicySetupFlow.css
```

- `PolicySetupFlow.tsx`: 단계 이동, 입력 상태, 유효성 검사 및 화면 구성
- `PolicySetupFlow.css`: Figma 기반 390×844 모바일 레이아웃과 시각 스타일
- `App.tsx`: `#/setup` 미리보기 진입점

## 공통 디자인 기준

- 기준 화면: 390×844px
- 배경: `#F5F7FA`
- 주요 글자: `#1A1F29`
- 보조 글자: `#666E7A`
- 경계선: `#E0E3E8`
- 안내 배경: `#E9EDF3`
- 카드 배경: `#FFFFFF`
- 주요 버튼: `#1A1F29`
- 기본 모서리 반경: 화면 28px, 카드 16px, 버튼 14px
- 글꼴: Inter 우선, Apple SD Gothic Neo 및 시스템 글꼴 대체

## 1단계 — 첫 설정 안내

### 목적

사용자에게 카쓰가 어떤 정보를 바탕으로 무엇을 설정할지 설명합니다. 금융기관 연결을 다시 요청하지 않고, 이미 연결된 자산 현황을 간단하게 요약합니다.

### 주요 문구

```text
카쓰가 내 돈을 관리하는 법
앞으로 쓸 수 있는 돈과 안전하게 운용할 금액을 구분해요.
```

### 표시 정보

- 예상 설정 시간: 약 2분
- 연결된 금융기관: 5개
- 연결 정보: 계좌 7개, 카드 2개, 투자계좌 1개
- 이후 설정할 항목:
  - 최소 생활자금과 비상금
  - 대출 상환 처리 계획
  - 계좌·적금·투자 배분 비율

### 사용자 동작

사용자가 `내 돈 관리 기준 설정하기` 버튼을 누르면 2단계 안전자금 설정으로 이동합니다.

### 입력과 출력

1단계에서는 사용자가 입력하는 값이 없습니다.

컴포넌트의 `connectedSummary` 속성으로 연결 금융정보 요약 문구를 바꿀 수 있습니다.

```tsx
<PolicySetupFlow
  connectedSummary="계좌 7개 · 카드 2개 · 투자계좌 1개"
  onComplete={handleComplete}
/>
```

## 2단계 — 안전자금 설정

### 목적

예정 지출과 별도로 반드시 보호할 현금 기준을 설정합니다. 카쓰는 이 금액을 먼저 확보하고, 이후에 남는 금액만 대출 상환, 저축 또는 투자에 배분합니다.

### 설정 항목

#### 최소 생활자금

생활비 계좌가 내려가지 않아야 할 하한 금액입니다.

기본값:

```text
₩1,000,000
```

상태 필드:

```ts
minimumCash: number
```

#### 비상금 목표

예상하지 못한 지출에 대비해 별도로 확보할 목표 금액입니다.

기본값:

```text
₩3,000,000
```

상태 필드:

```ts
emergencyFund: number
```

### 사용자 동작

- 금액 입력란을 선택해 최소 생활자금과 비상금 목표를 수정할 수 있습니다.
- 음수 입력은 컴포넌트 내부에서 `0`으로 보정합니다.
- `다음 · 대출 처리 계획` 버튼을 누르면 3단계로 이동합니다.
- 상단 이전 버튼을 누르면 첫 설정 안내로 돌아갑니다.

### 상태 예시

```ts
const policy = {
  minimumCash: 1_000_000,
  emergencyFund: 3_000_000,
};
```

### 정책 적용 원칙

```text
예정된 필수 지출 확보
  → 최소 생활자금 보호
  → 비상금 목표 반영
  → 남는 금액만 운용
```

2단계에서 입력한 값은 마지막 최종 확인 단계까지 `FinancialPolicyDraft` 상태로 유지됩니다.

## 컴포넌트 인터페이스

```ts
interface PolicySetupFlowProps {
  connectedSummary?: string;
  availableCash?: number;
  initialValue?: FinancialPolicyDraft;
  onComplete: (policy: FinancialPolicyDraft) => void;
}
```

초기 정책값을 전달하지 않으면 컴포넌트 내부 기본값을 사용합니다.

```tsx
<PolicySetupFlow
  initialValue={{
    minimumCash: 1_000_000,
    emergencyFund: 3_000_000,
    loan: {
      monthlyAmount: 500_000,
      surplusThreshold: 1_500_000,
      surplusRepaymentRatio: 50,
      priorityInterestRate: 6,
    },
    allocation: {
      living: 40,
      emergency: 20,
      saving: 20,
      investment: 20,
    },
  }}
  onComplete={handlePolicyComplete}
/>
```

## 현재 구현 범위

- Figma 기반 1·2단계 UI 구현
- 단계 이동과 이전 단계 복귀
- 안전자금 금액 입력 및 상태 유지
- 390×844 모바일 프레임 대응
- 기존 온보딩을 유지한 독립 미리보기 경로

현재 `onComplete` 결과는 백엔드에 저장하지 않습니다. 실제 정책 API가 연결되면 최종 확인 단계에서 저장 요청을 수행하도록 확장할 수 있습니다.

## 확인 항목

개발 시 다음 사항을 확인합니다.

- `#/setup`에서 기존 온보딩이 아닌 신규 첫 화면이 표시되는가
- 첫 화면의 주요 버튼이 모바일 프레임 내부 하단에 고정되는가
- 첫 화면에서 2단계로 정상 이동하는가
- 최소 생활자금과 비상금 목표를 수정할 수 있는가
- 이전 버튼으로 1단계에 복귀할 수 있는가
- 작은 브라우저 창에서도 390×844 레이아웃이 압축되지 않고 스크롤되는가

## Figma

디자인 기준 화면:

https://www.figma.com/design/rw91NJFUN6nwGWFZCCt2C1/카쓰-UI-초안?node-id=34-2
