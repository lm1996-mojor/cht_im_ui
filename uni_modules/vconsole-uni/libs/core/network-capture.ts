import { readonly, ref } from 'vue';
import { formatTimeHHmmss } from '../utils/formatter';

export type NetMethod =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'UPLOAD'
  | 'DOWNLOAD'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD';

export type VNetItem = {
  id: number;
  method: NetMethod;
  url: string;
  status: number | null;
  ok: boolean;
  time: string;
  duration: number;
  requestHeaders?: Record<string, any>;
  responseHeaders?: Record<string, any>;
  requestBody?: any;
  responseBodySummary?: string;
  responseBody?: any;
  error?: string;
};

const netsRef = ref<VNetItem[]>([]);

let maxNetNumber = 1000;
let counter = 0;
let installed = false;

function summarizeBody(body: any): string {
  try {
    if (body == null) {
      return '';
    }

    if (typeof body === 'string') {
      return body.length > 200 ? body.slice(0, 200) + '…' : body;
    }

    const text = JSON.stringify(body);

    return text.length > 200 ? text.slice(0, 200) + '…' : text;
  } catch {
    return String(body);
  }
}

function push(item: VNetItem) {
  netsRef.value.unshift(item);

  if (netsRef.value.length > maxNetNumber) {
    netsRef.value.splice(maxNetNumber);
  }
}

type InitNetworkCaptureOptions = {
  maxNetNumber?: number;
};

export function initNetworkCapture(options: InitNetworkCaptureOptions = {}) {
  if (installed) {
    return;
  }

  installed = true;

  if (typeof options.maxNetNumber === 'number' && options.maxNetNumber > 0) {
    maxNetNumber = options.maxNetNumber;
  }

  const rawRequest = uni.request;
  (uni as any).request = function (options: UniApp.RequestOptions) {
    const start = Date.now();
    const id = ++counter;
    const url: string = options?.url ?? '';
    const method: NetMethod = String(options?.method ?? 'GET').toUpperCase() as any;
    const reqHeaders = options?.header;
    const reqBody = options?.data;

    const userSuccess: ((option: UniApp.RequestSuccessCallbackResult) => void) | undefined =
      options?.success;
    const userFail: ((option: UniApp.GeneralCallbackResult) => void) | undefined = options?.fail;
    const userComplete: ((option: UniApp.GeneralCallbackResult) => void) | undefined =
      options?.complete;

    const wrapped: UniApp.RequestOptions = {
      ...options,
      success: (res: UniApp.RequestSuccessCallbackResult) => {
        const duration = Date.now() - start;
        const item: VNetItem = {
          id,
          method,
          url,
          status: res?.statusCode,
          ok: true,
          time: formatTimeHHmmss(),
          duration,
          requestHeaders: reqHeaders,
          responseHeaders: res?.header,
          requestBody: reqBody,
          responseBodySummary: summarizeBody(res?.data as any),
          responseBody: res?.data as any,
        };

        push(item);

        if (typeof userSuccess === 'function') {
          userSuccess(res);
        }
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        const duration = Date.now() - start;
        const item: VNetItem = {
          id,
          method,
          url,
          status: null,
          ok: false,
          time: formatTimeHHmmss(),
          duration,
          requestHeaders: reqHeaders,
          requestBody: reqBody,
          error: err?.errMsg,
        };

        push(item);

        if (typeof userFail === 'function') {
          userFail(err);
        }
      },
      complete: (res: any) => {
        if (typeof userComplete === 'function') {
          userComplete(res);
        }
      },
    };

    return rawRequest(wrapped);
  };

  const rawUpload = uni.uploadFile;
  (uni as any).uploadFile = function (options: UniApp.UploadFileOption) {
    const start = Date.now();
    const id = ++counter;
    const url: string = options?.url ?? '';
    const method: NetMethod = 'UPLOAD';
    const reqHeaders = options?.header;

    const userSuccess: ((result: UniApp.UploadFileSuccessCallbackResult) => void) | undefined =
      options?.success;
    const userFail: ((result: UniApp.GeneralCallbackResult) => void) | undefined = options?.fail;
    const userComplete: ((result: UniApp.GeneralCallbackResult) => void) | undefined =
      options?.complete;

    const wrapped: UniApp.UploadFileOption = {
      ...options,
      success: (res: UniApp.UploadFileSuccessCallbackResult) => {
        const duration = Date.now() - start;
        const item: VNetItem = {
          id,
          method,
          url,
          status: res?.statusCode,
          ok: true,
          time: formatTimeHHmmss(),
          duration,
          requestHeaders: reqHeaders,
          responseHeaders: undefined,
          responseBodySummary: summarizeBody(res?.data as any),
          responseBody: res?.data as any,
        };

        push(item);

        if (typeof userSuccess === 'function') {
          userSuccess(res);
        }
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        const duration = Date.now() - start;
        const item: VNetItem = {
          id,
          method,
          url,
          status: null,
          ok: false,
          time: formatTimeHHmmss(),
          duration,
          requestHeaders: reqHeaders,
          error: err?.errMsg,
        };

        push(item);

        if (typeof userFail === 'function') {
          userFail(err);
        }
      },
      complete: (res: any) => {
        if (typeof userComplete === 'function') {
          userComplete(res);
        }
      },
    };

    return rawUpload(wrapped);
  };

  const rawDownload = uni.downloadFile;
  (uni as any).downloadFile = function (options: UniApp.DownloadFileOption) {
    const start = Date.now();
    const id = ++counter;
    const url: string = options?.url ?? '';
    const method: NetMethod = 'DOWNLOAD';
    const reqHeaders = options?.header;

    const userSuccess: ((result: UniApp.DownloadSuccessData) => void) | undefined =
      options?.success;
    const userFail: ((result: UniApp.GeneralCallbackResult) => void) | undefined = options?.fail;
    const userComplete: ((result: UniApp.GeneralCallbackResult) => void) | undefined =
      options?.complete;

    const wrapped: UniApp.DownloadFileOption = {
      ...options,
      success: (res: UniApp.DownloadSuccessData) => {
        const duration = Date.now() - start;
        const item: VNetItem = {
          id,
          method,
          url,
          status: res?.statusCode,
          ok: true,
          time: formatTimeHHmmss(),
          duration,
          requestHeaders: reqHeaders,
          responseHeaders: undefined,
          responseBodySummary: summarizeBody(res?.tempFilePath),
          responseBody: res?.tempFilePath,
        };

        push(item);

        if (typeof userSuccess === 'function') {
          userSuccess(res);
        }
      },
      fail: (err: UniApp.GeneralCallbackResult) => {
        const duration = Date.now() - start;
        const item: VNetItem = {
          id,
          method,
          url,
          status: null,
          ok: false,
          time: formatTimeHHmmss(),
          duration,
          requestHeaders: reqHeaders,
          error: err?.errMsg,
        };

        push(item);

        if (typeof userFail === 'function') {
          userFail(err);
        }
      },
      complete: (res: any) => {
        if (typeof userComplete === 'function') {
          userComplete(res);
        }
      },
    };

    return rawDownload(wrapped);
  };
}

export function getNetworkRef() {
  return readonly(netsRef);
}

export function clearNetwork() {
  netsRef.value = [];
}
