import { ref, readonly } from 'vue';
import { formatTimeHHmmss } from '../utils/formatter';

export type LogLevel = 'info' | 'debug' | 'warn' | 'error';

export type VLogItem = {
  id: number;
  level: LogLevel;
  text: string;
  data: any[];
  time: string;
};

const logsRef = ref<VLogItem[]>([]);

let maxLogNumber = 1000;
let counter = 0;
let installed = false;

function serializeConsoleArgs(data: any[]): string {
  try {
    const parts = data.map((d) => {
      if (typeof d === 'string') {
        return d;
      }

      if (d != null && typeof d === 'object') {
        const name = d.name;
        const message = d.message;
        const stack = d.stack;

        if (typeof name === 'string' && typeof message === 'string') {
          const firstStackLine = typeof stack === 'string' ? stack.split('\n')[0] ?? '' : '';
          return firstStackLine ? `${name}: ${message} (${firstStackLine})` : `${name}: ${message}`;
        }

        try {
          return JSON.stringify(d);
        } catch {
          return String(d);
        }
      }

      return String(d);
    });

    return parts.join(' ');
  } catch {
    return String(data);
  }
}

function push(level: LogLevel, args: any[]) {
  const item: VLogItem = {
    id: ++counter,
    level,
    text: serializeConsoleArgs(args),
    data: args,
    time: formatTimeHHmmss(),
  };

  logsRef.value.unshift(item);

  if (logsRef.value.length > maxLogNumber) {
    logsRef.value.splice(maxLogNumber);
  }
}

type InitLogCaptureOptions = { maxLogNumber?: number };

export function initLogCapture(options: InitLogCaptureOptions = {}) {
  if (installed) {
    return;
  }

  installed = true;

  if (typeof options.maxLogNumber === 'number' && options.maxLogNumber > 0) {
    maxLogNumber = options.maxLogNumber;
  }

  const rawLog = console.log.bind(console);
  const rawInfo = console.info.bind(console);
  const rawDebug = console.debug.bind(console);
  const rawWarn = console.warn.bind(console);
  const rawError = console.error.bind(console);

  console.log = function (...args: any[]) {
    push('info', args);
    rawLog(...args);
  };
  console.info = function (...args: any[]) {
    push('info', args);
    rawInfo(...args);
  };
  console.debug = function (...args: any[]) {
    push('debug', args);
    rawDebug(...args);
  };
  console.warn = function (...args: any[]) {
    push('warn', args);
    rawWarn(...args);
  };
  console.error = function (...args: any[]) {
    push('error', args);
    rawError(...args);
  };
}

export function getLogsRef() {
  return readonly(logsRef);
}

export function clearLogs() {
  logsRef.value = [];
}
