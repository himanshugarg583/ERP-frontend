import axios from "axios";
import { toast } from "react-toastify";

const GET_SUCCESS_SUPPRESS_WINDOW_MS = 1200;
const SETUP_FLAG_KEY = "__ERP_TOAST_POLICY_SETUP__";
const SUPPRESS_UNTIL_KEY = "__ERP_SUPPRESS_TOAST_UNTIL__";
const SUCCESS_PATCHED_KEY = "__ERP_TOAST_SUCCESS_PATCHED__";
const ORIGINAL_SUCCESS_KEY = "__ERP_TOAST_SUCCESS_ORIGINAL__";
const ORIGINAL_ERROR_KEY = "__ERP_TOAST_ERROR_ORIGINAL__";
const ORIGINAL_INFO_KEY = "__ERP_TOAST_INFO_ORIGINAL__";
const ORIGINAL_WARN_KEY = "__ERP_TOAST_WARN_ORIGINAL__";
const ORIGINAL_WARNING_KEY = "__ERP_TOAST_WARNING_ORIGINAL__";
const AXIOS_INTERCEPTOR_KEY = "__ERP_AXIOS_GET_INTERCEPTOR_ID__";

const getWindow = () => (typeof window !== "undefined" ? window : null);

const markSuppressSuccessWindow = () => {
  const w = getWindow();
  if (!w) return;
  w[SUPPRESS_UNTIL_KEY] = Date.now() + GET_SUCCESS_SUPPRESS_WINDOW_MS;
};

export const setupToastPolicy = () => {
  const w = getWindow();
  if (!w) return;
  if (w[SETUP_FLAG_KEY]) return;

  if (!w[SUCCESS_PATCHED_KEY]) {
    w[ORIGINAL_SUCCESS_KEY] = toast.success.bind(toast);
    w[ORIGINAL_ERROR_KEY] = toast.error.bind(toast);
    w[ORIGINAL_INFO_KEY] = toast.info.bind(toast);
    w[ORIGINAL_WARN_KEY] = toast.warn.bind(toast);
    w[ORIGINAL_WARNING_KEY] = typeof toast.warning === 'function' ? toast.warning.bind(toast) : null;

    const wrap = (originalFn) => (content, options) => {
      const suppressUntil = Number(w[SUPPRESS_UNTIL_KEY] || 0);
      if (Date.now() <= suppressUntil) {
        return null;
      }

      return originalFn(content, options);
    };

    toast.success = wrap(w[ORIGINAL_SUCCESS_KEY]);
    toast.error = wrap(w[ORIGINAL_ERROR_KEY]);
    toast.info = wrap(w[ORIGINAL_INFO_KEY]);
    toast.warn = wrap(w[ORIGINAL_WARN_KEY]);
    if (typeof toast.warning === 'function' && w[ORIGINAL_WARNING_KEY]) {
      toast.warning = wrap(w[ORIGINAL_WARNING_KEY]);
    }

    w[SUCCESS_PATCHED_KEY] = true;
  }

  if (w[AXIOS_INTERCEPTOR_KEY] === undefined) {
    w[AXIOS_INTERCEPTOR_KEY] = axios.interceptors.response.use(
      (response) => {
        const method = String(response?.config?.method || "").toLowerCase();
        if (method === "get") {
          markSuppressSuccessWindow();
        }
        return response;
      },
      (error) => {
        const method = String(error?.config?.method || "").toLowerCase();
        if (method === "get") {
          markSuppressSuccessWindow();
        }
        return Promise.reject(error);
      }
    );
  }

  w[SETUP_FLAG_KEY] = true;
};
