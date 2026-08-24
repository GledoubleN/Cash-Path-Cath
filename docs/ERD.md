# Cath ERD

기획서 §11(Microservices)·§13(REST API) 기준의 논리 데이터 모델.
MSA에서는 서비스별로 DB가 분리되지만(§18 PostgreSQL per service), 여기서는 전체 도메인을 한 장으로 본다.
프론트 타입은 `src/domain/types.ts`와 1:1 대응한다.

```mermaid
erDiagram
    USER ||--o{ ACCOUNT : owns
    USER ||--|| POLICY : sets
    USER ||--o{ SCHEDULED_EVENT : plans
    ACCOUNT ||--o{ TRANSACTION : records
    USER ||--o{ FORECAST : has
    FORECAST ||--o{ FORECAST_POINT : contains
    USER ||--o{ RISK_ALERT : receives
    USER ||--o{ OPTIMIZATION_PLAN : receives
    OPTIMIZATION_PLAN ||--o{ OPTIMIZATION_ACTION : contains
    ACCOUNT ||--o{ OPTIMIZATION_ACTION : moves
    OPTIMIZATION_PLAN ||--o{ NOTIFICATION : triggers

    USER {
        bigint id PK
        string email
        string name
        datetime created_at
    }

    ACCOUNT {
        bigint id PK
        bigint user_id FK
        string name
        string bank
        enum type "CHECKING|CMA|ETF|SAVINGS|LOAN"
        bigint balance "원, LOAN은 음수"
        float interest_rate "nullable"
    }

    TRANSACTION {
        bigint id PK
        bigint account_id FK
        string title
        enum category "SALARY|RENT|CARD|..."
        bigint amount "부호 있음"
        datetime occurred_at
    }

    SCHEDULED_EVENT {
        bigint id PK
        bigint user_id FK
        string label
        enum category
        bigint amount "부호 있음"
        date scheduled_date
    }

    POLICY {
        bigint id PK
        bigint user_id FK
        bigint minimum_cash
        bigint emergency_fund
        float saving_ratio
        float investment_ratio
        float loan_priority_interest_rate
        enum automation_level "ANALYSIS|RECOMMENDATION|APPROVAL_REQUIRED|AUTO"
    }

    FORECAST {
        bigint id PK
        bigint user_id FK
        bigint current_balance
        bigint required_cash
        bigint available_cash
        bigint minimum_expected_balance
        enum risk_level "LOW|MEDIUM|HIGH|CRITICAL"
        datetime calculated_at
    }

    FORECAST_POINT {
        bigint id PK
        bigint forecast_id FK
        date point_date
        string label
        bigint balance
    }

    RISK_ALERT {
        bigint id PK
        bigint user_id FK
        enum risk_level
        bigint shortfall "부족액"
        date shortfall_date
        datetime detected_at
    }

    OPTIMIZATION_PLAN {
        bigint id PK
        bigint user_id FK
        string reason
        bigint shortfall
        bigint projected_min_before
        bigint projected_min_after
        enum risk_before
        enum risk_after
        boolean approved
        datetime created_at
    }

    OPTIMIZATION_ACTION {
        bigint id PK
        bigint plan_id FK
        string label
        bigint amount
        bigint from_account_id FK "nullable"
        bigint to_account_id FK "nullable"
    }

    NOTIFICATION {
        bigint id PK
        bigint user_id FK
        bigint plan_id FK "nullable"
        string message
        boolean read
        datetime created_at
    }
```

## 서비스 ↔ 테이블 매핑

| Service | 소유 테이블 |
|---|---|
| `user-service` | USER |
| `account-service` | ACCOUNT |
| `transaction-service` | TRANSACTION |
| `policy-service` | POLICY, SCHEDULED_EVENT |
| `cashflow-service` | FORECAST, FORECAST_POINT |
| `risk-service` | RISK_ALERT |
| `optimization-service` | OPTIMIZATION_PLAN, OPTIMIZATION_ACTION |
| `notification-service` | NOTIFICATION |

> 데모에서는 이 전부가 `src/domain/mock.ts`의 인메모리 데이터로 대체된다.
