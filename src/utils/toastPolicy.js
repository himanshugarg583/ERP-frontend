import axios from "axios";
import { toast } from "react-toastify";

const GET_SUCCESS_SUPPRESS_WINDOW_MS = 1200;
const SETUP_FLAG_KEY = "__ERP_TOAST_POLICY_SETUP__";
const SUPPRESS_UNTIL_KEY = "__ERP_SUPPRESS_SUCCESS_TOAST_UNTIL__";
const SUCCESS_PATCHED_KEY = "__ERP_TOAST_SUCCESS_PATCHED__";
const ORIGINAL_SUCCESS_KEY = "__ERP_TOAST_SUCCESS_ORIGINAL__";
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

    toast.success = (content, options) => {
      const suppressUntil = Number(w[SUPPRESS_UNTIL_KEY] || 0);
      if (Date.now() <= suppressUntil) {
        return null;
      }

      return w[ORIGINAL_SUCCESS_KEY](content, options);
    };

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
      (error) => Promise.reject(error)
    );
  }

  w[SETUP_FLAG_KEY] = true;
};
