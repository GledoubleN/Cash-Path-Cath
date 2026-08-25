import { useMemo, useState } from 'react';
import { PolicySetupFlow } from './components/PolicySetupFlow';
import { TabBar, type TabKey } from './components/TabBar';
import { Alerts, type Notice } from './pages/Alerts';
import { Forecast } from './pages/Forecast';
import { History } from './pages/History';
import { Home } from './pages/Home';
import { Optimize } from './pages/Optimize';
import { signedWon, won } from './domain/format';
import type { RiskLevel } from './domain/types';
import { useRoute, type Route } from './route';
import { useCath } from './store';

const TAB_KEYS: TabKey[] = ['home', 'forecast', 'optimize', 'history', 'alerts'];

const RISK_LABEL: Record<RiskLevel, string> = { LOW: '안전', MEDIUM: '주의', HIGH: '위험', CRITICAL: '심각' };
const DRAFT_KEY = 'cath.policyDraft';

export default function App() {
  const [route, navigate] = useRoute();
  const [onboarded, setOnboarded] = useState(() => !!localStorage.getItem(DRAFT_KEY));

  // setup(=온보딩) 명시 진입, 또는 설정 미완료 시 게이트로 설정 화면 표시
  if (route === 'setup' || !onboarded) {
    return (
      <PolicySetupFlow
        onComplete={(draft) => {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
          setOnboarded(true);
          navigate('home');
        }}
      />
    );
  }
  return <Shell route={route} navigate={navigate} />;
}

function Shell({ route, navigate }: { route: Route | null; navigate: (r: Route) => void }) {
  const cath = useCath();
  const tab: TabKey = TAB_KEYS.includes(route as TabKey) ? (route as TabKey) : 'home';
  const safe = cath.forecast.riskLevel === 'LOW';

  const notices = useMemo<Notice[]>(() => {
    const list: Notice[] = [];
    if (cath.planApproved)
      list.push({ id: 'resolved', tone: 'ok', title: '위험이 해소되었습니다', body: `예상 최저잔액 ${won(cath.forecast.minimumExpectedBalance)}` });
    if (cath.plan)
      list.push({ id: 'risk', tone: 'warn', title: '유동성 부족 위험 감지', body: `예상 부족액 ${won(-cath.plan.shortfall)}` });
    for (const t of cath.recentTx.filter((t) => t.id.startsWith('tx-demo')).slice(0, 4))
      list.push({ id: t.id, tone: 'info', title: `${t.title} ${signedWon(t.amount)}`, body: '가상 거래가 반영되었습니다' });
    return list;
  }, [cath.planApproved, cath.plan, cath.forecast, cath.recentTx]);

  const toOptimize = () => navigate('optimize');

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">Cath · Cash + Path</div>
          <div className="tagline">돈이 필요한 곳으로, 알아서 흐르도록.</div>
        </div>
        <span className={`badge ${safe ? 'ok' : 'warn'}`}>{RISK_LABEL[cath.forecast.riskLevel]}</span>
      </header>

      <main className="page">
        {tab === 'home' && <Home cath={cath} onFix={toOptimize} />}
        {tab === 'forecast' && <Forecast cath={cath} onFix={toOptimize} />}
        {tab === 'optimize' && <Optimize cath={cath} />}
        {tab === 'history' && <History cath={cath} />}
        {tab === 'alerts' && <Alerts notices={notices} />}
      </main>

      <TabBar
        active={tab}
        onChange={navigate}
        dots={{ optimize: !!cath.plan, alerts: notices.some((n) => n.tone === 'warn') }}
      />
    </div>
  );
}
