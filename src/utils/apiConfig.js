export const getBackendUrl = () => {
  const envUrl =
    import.meta.env.VITE_BACKEND_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.SCHOOL_ERP_BACKEND_URL;

  return String(envUrl || 'http://localhost:5000').replace(/\/$/, '');
};

export const BACKEND_URL = getBackendUrl();
export default BACKEND_URL;
