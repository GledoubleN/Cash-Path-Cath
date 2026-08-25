import {
  BellSimple,
  ChartLineUp,
  GearSix,
  House,
  ListBullets,
  type Icon,
} from '@phosphor-icons/react';

// 하단 탭 네비게이션. 라우터 없이 상태 전환.
export type TabKey = 'home' | 'forecast' | 'optimize' | 'history' | 'alerts';

const TABS: { key: TabKey; label: string; icon: Icon }[] = [
  { key: 'home', label: '홈', icon: House },
  { key: 'forecast', label: '예측', icon: ChartLineUp },
  { key: 'optimize', label: '최적화', icon: GearSix },
  { key: 'history', label: '내역', icon: ListBullets },
  { key: 'alerts', label: '알림', icon: BellSimple },
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
      {TABS.map((t) => {
        const TabIcon = t.icon;
        return (
        <button key={t.key} type="button" className={`tab ${active === t.key ? 'on' : ''}`} onClick={() => onChange(t.key)} aria-current={active === t.key ? 'page' : undefined}>
          <span className="tab-icon">
            <TabIcon size={22} weight={active === t.key ? 'fill' : 'regular'} aria-hidden="true" />
            {dots?.[t.key] && <span className="tab-dot" />}
          </span>
          <span className="tab-label">{t.label}</span>
        </button>
        );
      })}
    </nav>
  );
}
