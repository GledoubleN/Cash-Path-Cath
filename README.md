# 💰 도느름 · DONEUREUM

> 돈이 필요한 곳으로, 알아서 흐르도록.

여러 금융기관에 흩어진 데이터를 통합해 **미래 현금흐름을 예측하고, 금융 정책에 따라 자금을 자동 재배치**하는 개인 금융 자동화 플랫폼의 프론트엔드 데모.

현재 잔액이 아니라 **미래 예상 최저잔액**을 기준으로 "지금 실제로 써도 되는 돈"을 판단한다.

## 이 저장소 범위

프론트엔드만. 백엔드(MSA)는 미구현이며 계산은 클라이언트 순수 함수로 mock 한다.
핵심 데모는 **이벤트 발생 → 현금흐름 재계산 → 위험 감지 → 자금 재배치 제안**의 실시간 반응(기획서 §15)이다.

- 하단 데모 바에서 `노트북 구매 -₩1,290,000`을 누르면 → 위험 감지 → 도느름이 재배치를 제안 → 승인 시 위험 해소.
- 이 흐름 전체가 `src/domain/engine.ts`의 순수 함수로만 돌아간다 (백엔드 호출 없음).

## 실행

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 엔진 로직 검증 (SAFE → 위험 → SAFE)
npm run build
```

## 구조

```
src/
  domain/
    types.ts     # 도메인 타입 (= 프론트/백 계약 초안)
    mock.ts      # 초기 계좌·거래·정책 mock 데이터
    engine.ts    # 순수 계산: 현금흐름 예측 · 위험 판정 · 최적화
    engine.test.ts
    format.ts    # 원화 포맷
  store.ts       # 앱 상태 훅 (이벤트 → 재계산)
  components/
    CashflowChart.tsx  # 인라인 SVG 그래프 (차트 라이브러리 미사용)
  App.tsx
docs/
  ARCHITECTURE.md  # 서비스 흐름도 (Mermaid)
  ERD.md           # 데이터 모델 (Mermaid)
```

## 문서

- [서비스 흐름도](docs/ARCHITECTURE.md) — MSA 구조 · Kafka 이벤트 시퀀스 · 최적화 우선순위
- [ERD](docs/ERD.md) — 도메인 데이터 모델 · 서비스별 테이블 매핑

## 스택

Vite · React 18 · TypeScript · Vitest. 런타임 의존성은 React뿐.

## 남은 확장 지점

- 최적화 엔진은 **결제 불능 방지(유동성 확보)** 만 구현. 비상자금·부채 상환·저축/투자 배분(기획서 §8 3~6번)은 백엔드 몫.
- 온보딩, 정책 편집 화면, 자동화 L3(자동 실행)는 미구현.
