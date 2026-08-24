export function won(n: number): string {
  const sign = n < 0 ? '-' : '';
  return `${sign}₩${Math.abs(Math.round(n)).toLocaleString('ko-KR')}`;
}

export function signedWon(n: number): string {
  return `${n > 0 ? '+' : ''}${won(n)}`;
}
