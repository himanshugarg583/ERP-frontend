const normalizeBaseUrl = (value) => String(value || '').replace(/\/$/, '');
const normalizePath = (value) => String(value || '').replace(/^\/+/, '');

const randomUserBaseUrl = normalizeBaseUrl(import.meta.env.VITE_ASSET_RANDOMUSER_BASE_URL);
const demoFileBaseUrl = normalizeBaseUrl(import.meta.env.VITE_DEMO_FILE_BASE_URL);

export const ASSET_URLS = {
  unsplashEarbuds: String(import.meta.env.VITE_ASSET_UNSPLASH_EARBUDS_URL || ''),
  unsplashParentProfile: String(import.meta.env.VITE_ASSET_UNSPLASH_PARENT_PROFILE_URL || ''),
  unsplashClassroom: String(import.meta.env.VITE_ASSET_UNSPLASH_CLASSROOM_URL || ''),
};

export const RAZORPAY_CHECKOUT_URL = String(import.meta.env.VITE_RAZORPAY_CHECKOUT_URL || '');
export const DEMO_IP_PLACEHOLDER = String(import.meta.env.VITE_DEMO_IP_PLACEHOLDER || '');

export const getRandomUserImage = (path) => {
  if (!randomUserBaseUrl) return '';
  return `${randomUserBaseUrl}/${normalizePath(path)}`;
};

export const getDemoFileUrl = (path) => {
  if (!demoFileBaseUrl) return '';
  return `${demoFileBaseUrl}/${normalizePath(path)}`;
};
