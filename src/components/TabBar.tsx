// 하단 탭 네비게이션. 라우터 없이 상태 전환.
export type TabKey = 'home' | 'forecast' | 'optimize' | 'history' | 'alerts';

const TABS: { key: TabKey; label: string; icon: string }[] = [
  { key: 'home', label: '홈', icon: '🏠' },
  { key: 'forecast', label: '예측', icon: '📈' },
  { key: 'optimize', label: '최적화', icon: '⚙️' },
  { key: 'history', label: '내역', icon: '📄' },
  { key: 'alerts', label: '알림', icon: '🔔' },
];

export function TabBar({
  active,
  onChange,
  dots,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
  dots?: Partial<Record<TabKey, boolean>>;
}) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button key={t.key} className={`tab ${active === t.key ? 'on' : ''}`} onClick={() => onChange(t.key)}>
          <span className="tab-icon">
            {t.icon}
            {dots?.[t.key] && <span className="tab-dot" />}
          </span>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
