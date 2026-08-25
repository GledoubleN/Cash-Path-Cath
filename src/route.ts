import { useEffect, useState } from 'react';

// 해시 기반 라우팅. 라이브러리 없이 정적 호스팅(GitHub Pages)에서도 새로고침 404 없이 동작.
export type Route = 'setup' | 'home' | 'forecast' | 'optimize' | 'history' | 'alerts';
const ROUTES: Route[] = ['setup', 'home', 'forecast', 'optimize', 'history', 'alerts'];

export function currentRoute(): Route | null {
  const r = window.location.hash.replace(/^#\/?/, '') as Route;
  return ROUTES.includes(r) ? r : null;
}

export function useRoute(): [Route | null, (r: Route) => void] {
  const [route, setRoute] = useState<Route | null>(currentRoute);
  useEffect(() => {
    const onHash = () => setRoute(currentRoute());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  const go = (r: Route) => {
    window.location.hash = `/${r}`;
  };
  return [route, go];
}
