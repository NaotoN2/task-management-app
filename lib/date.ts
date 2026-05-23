export function getTodayString() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo'
  }).format(new Date());
}

export function getTodayLabel() {
  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  }).format(new Date());
}
