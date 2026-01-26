import { ref, readonly } from 'vue';
import { initLogCapture } from './log-capture';
import { initNetworkCapture } from './network-capture';

export type VConsoleOptions = {
  /**
   * Whether to enable debug mode.
   * Default: true
   */
  enableDebug?: boolean;

  /**
   * Maximum number of logs to keep in memory.
   * Default: 1000
   */
  maxLogNumber?: number;

  /**
   * Maximum number of network requests to keep in memory.
   * Default: 1000
   */
  maxNetNumber?: number;
};

const enableDebugRef = ref(true);

export function initVConsole(options: VConsoleOptions = {}) {
  try {
    const { enableDebug = true, maxLogNumber = 1000, maxNetNumber = 1000 } = options;

    enableDebugRef.value = enableDebug;

    if (!enableDebug) {
      return;
    }

    initLogCapture({ maxLogNumber });
    initNetworkCapture({ maxNetNumber });
  } catch (error: any) {
    console.error('Error in [initVConsole]:', error);
  }
}

export function getEnableDebugRef() {
  return readonly(enableDebugRef);
}
