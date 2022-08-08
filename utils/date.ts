// Add minutes to date
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

// Add days to date
export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 86400000);
}
