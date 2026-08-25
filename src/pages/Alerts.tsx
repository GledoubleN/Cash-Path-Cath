// 알림 — 위험/해소/거래 이벤트를 시간순으로.
export interface Notice {
  id: string;
  tone: 'warn' | 'ok' | 'info';
  title: string;
  body: string;
}

const ICON: Record<Notice['tone'], string> = { warn: '!', ok: '✓', info: '₩' };

export function Alerts({ notices }: { notices: Notice[] }) {
  if (notices.length === 0) {
    return (
      <section className="card">
        <h2>알림</h2>
        <p className="muted">아직 알림이 없어요.</p>
      </section>
    );
  }
  return (
    <section className="card">
      <h2>알림</h2>
      <ul className="notices">
        {notices.map((n) => (
          <li key={n.id} className={`notice ${n.tone}`}>
            <span className="notice-icon">{ICON[n.tone]}</span>
            <span>
              <strong>{n.title}</strong>
              <em className="muted">{n.body}</em>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
