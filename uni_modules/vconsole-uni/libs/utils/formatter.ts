const pad2 = (n: number): string => (n < 10 ? '0' + n : '' + n);

export function formatTimeHHmmss(date: Date = new Date()): string {
  return `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`;
}

export function prettyJson(obj: any, defaultValue?: string): string {
  if (obj == null) {
    return defaultValue == null ? String(obj) : defaultValue;
  }

  if (typeof obj === 'string') {
    try {
      const o = JSON.parse(obj);

      return JSON.stringify(o, null, 2);
    } catch {
      return obj;
    }
  }

  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj);
  }
}
