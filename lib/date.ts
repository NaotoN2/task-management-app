export function getTodayString() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo'
  }).format(new Date());
}
