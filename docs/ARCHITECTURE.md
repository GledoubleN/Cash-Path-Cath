# Cath 서비스 흐름도 (Service Flow)

기획서 §10(MSA), §12(Kafka Event), §15(Demo Flow) 기준.
이 프론트엔드 데모는 아래 백엔드 흐름을 **클라이언트 순수 함수**(`src/domain/engine.ts`)로 재현한다.

## 1. 전체 아키텍처 (MSA)

```mermaid
flowchart TD
    GW[API Gateway]
    ID[identity-service<br/>인증·JWT]
    US[user-service]
    PS[policy-service<br/>금융 정책]

    GW --> ID
    GW --> US --> PS

    subgraph collect[데이터 수집]
      AS[account-service<br/>계좌]
      TS[transaction-service<br/>거래 수집]
      ED[external-data-service<br/>외부 연동·mock]
    end
    PS --> K((Kafka))
    AS --> K
    TS --> K
    ED --> K

    subgraph react[이벤트 반응]
      CF[cashflow-service<br/>현금흐름 예측]
      RS[risk-service<br/>위험 탐지]
      BS[budget-service<br/>예산 분석]
    end
    K --> CF
    K --> RS
    K --> BS

    CF --> OPT[optimization-service<br/>자금 배분 최적화]
    RS --> OPT
    OPT --> EX[execution-service<br/>자금 이동 실행]
    EX --> SAV[saving]
    EX --> INV[investment]
    EX --> LOAN[loan]
    EX --> NOTI[notification-service]
```

## 2. 핵심 이벤트 흐름 — 돌발 지출 시나리오 (§9, §15)

사용자가 노트북을 결제하면 하나의 이벤트가 여러 도메인을 연쇄적으로 재계산시킨다.

```mermaid
sequenceDiagram
    actor U as 사용자
    participant TX as transaction-service
    participant K as Kafka
    participant CF as cashflow-service
    participant RS as risk-service
    participant OPT as optimization-service
    participant N as notification-service

    U->>TX: 노트북 결제 -₩1,290,000
    TX-->>K: PAYMENT_COMPLETED
    K-->>CF: 현금흐름 재계산
    CF-->>K: CASHFLOW_UPDATED (예상 최저잔액 하락)
    K-->>RS: 위험 재평가
    RS-->>K: LIQUIDITY_RISK_DETECTED
    K-->>OPT: 자금 재배치 계산
    OPT-->>U: 제안 (ETF 보류 + CMA→생활계좌)
    U->>OPT: 승인
    OPT->>N: 실행 완료 알림
    N-->>U: "위험이 해소되었습니다"
```

## 3. 자동화 수준 (§5) — 이 데모는 LEVEL 2 (승인 필요)

```mermaid
flowchart LR
    L0[L0 분석] --> L1[L1 추천] --> L2[L2 승인] --> L3[L3 자동]
    style L2 fill:#d7e2ff,stroke:#2f6bff
```

## 4. 최적화 우선순위 (§8)

```mermaid
flowchart TD
    P1[1. 결제 불능 방지] --> P2[2. 필수 생활비 확보]
    P2 --> P3[3. 비상자금 확보] --> P4[4. 고금리 부채 상환]
    P4 --> P5[5. 단기 목표 저축] --> P6[6. 투자]
```

> 데모 엔진(`optimize()`)은 **1·2번(결제 불능 방지 → 유동성 확보)** 만 구현한다.
> 3~6번(비상자금·부채·저축·투자 배분)은 백엔드 optimization-service 몫으로 남긴 확장 지점.
