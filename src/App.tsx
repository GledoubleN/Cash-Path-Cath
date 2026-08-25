import { useMemo } from 'react';
import { Badge } from '@toss/tds-mobile';
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
const TAB_COPY: Record<TabKey, { title: string; description: string }> = {
  home: { title: 'Cath', description: '오늘의 돈 관리' },
  forecast: { title: 'Cath', description: '앞으로의 현금흐름을 미리 확인해요' },
  optimize: { title: 'Cath', description: '돈이 필요한 곳으로, 알아서 흐르도록' },
  history: { title: 'Cath', description: '내 돈의 흐름을 한눈에 확인해요' },
  alerts: { title: 'Cath', description: '놓치면 안 되는 변화를 알려드려요' },
};

export default function App() {
  const [route, navigate] = useRoute();

  // 해시 없는 기본 진입(=온보딩) 또는 #/setup → 항상 설정 화면부터 표시
  if (route === null || route === 'setup') {
    return (
      <PolicySetupFlow
        onComplete={(draft) => {
          localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
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
  const isHome = tab === 'home';
  const header = TAB_COPY[tab];

  const notices = useMemo<Notice[]>(() => {
    const list: Notice[] = [];
    if (cath.planApproved)
      list.push({ id: 'resolved', tone: 'ok', title: '위험이 해소되었습니다', body: `예상 최저잔액 ${won(cath.forecast.minimumExpectedBalance)}` });
    if (cath.plan)
      list.push({ id: 'risk', tone: 'warn', title: '유동성 부족 위험 감지', body: `예상 부족액 ${won(Math.abs(cath.plan.shortfall))}` });
    for (const t of cath.recentTx.filter((t) => t.id.startsWith('tx-demo')).slice(0, 4))
      list.push({ id: t.id, tone: 'info', title: `${t.title} ${signedWon(t.amount)}`, body: '가상 거래가 반영되었습니다' });
    return list;
  }, [cath.planApproved, cath.plan, cath.forecast, cath.recentTx]);

  const toOptimize = () => navigate('optimize');

  return (
    <div className="app">
      <div className="statusbar" aria-hidden="true">9:41</div>
      <header className="topbar">
        <div>
          <div className="brand">{header.title}</div>
          <div className="tagline">{header.description}</div>
        </div>
        <Badge className={`status-badge ${isHome || safe ? 'status-ok' : 'status-risk'}`} size="small" variant="weak" color={isHome || safe ? 'green' : 'red'}>
          {isHome ? '연결 정상' : RISK_LABEL[cath.forecast.riskLevel]}
        </Badge>
      </header>

      <main className="page">
        {tab === 'home' && <Home cath={cath} onFix={toOptimize} onEditPolicy={() => navigate('setup')} />}
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
