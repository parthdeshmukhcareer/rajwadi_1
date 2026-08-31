const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

let accessToken = null;
let refreshTokenPromise = null;
let authFailureCallback = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => {
  return accessToken;
};

export const clearAccessToken = () => {
  accessToken = null;
};

export const setAuthFailureCallback = (callback) => {
  authFailureCallback = callback;
};

// Low-level refresh session bypassing interceptor
export const refreshSession = async (sessionType = 'customer') => {
  if (refreshTokenPromise) {
    return refreshTokenPromise;
  }

  refreshTokenPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionType }),
    credentials: 'include', // Important to send HttpOnly refresh_token cookie
  }).then(async (response) => {
    if (!response.ok) {
      throw new Error('Refresh failed');
    }
    const data = await response.json();
    if (data.success && data.data.accessToken) {
      setAccessToken(data.data.accessToken);
      return data.data; // Return the full data payload containing user and accessToken
    }
    throw new Error('Invalid refresh response');
  }).catch((err) => {
    clearAccessToken();
    if (authFailureCallback) {
      authFailureCallback();
    }
    throw err;
  }).finally(() => {
    refreshTokenPromise = null;
  });

  return refreshTokenPromise;
};

/**
 * Standard API request wrapper
 * @param {string} endpoint - Path after base URL (e.g., '/auth/me')
 * @param {object} options - Fetch options
 * @param {object} customConfig - skipAuthRefresh (boolean) to bypass automatic 401 retries
 */
export const apiRequest = async (endpoint, options = {}, customConfig = {}) => {
  const { skipAuthRefresh = false, sessionType = 'customer' } = customConfig;
  
  const headers = new Headers(options.headers || {});
  
  if (options.body && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const config = {
    ...options,
    headers,
    credentials: 'include',
    cache: options.cache || 'no-store', // Prevent aggressive browser caching of GET requests
  };

  let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  // If 401 Unauthorized, and we haven't opted out of auto-refresh, and we originally had an access token
  if (response.status === 401 && !skipAuthRefresh && accessToken) {
    try {
      const refreshData = await refreshSession(sessionType);
      // Retry original request with new token
      headers.set('Authorization', `Bearer ${refreshData.accessToken}`);
      const retryConfig = {
        ...config,
        headers
      };
      response = await fetch(`${API_BASE_URL}${endpoint}`, retryConfig);
    } catch (refreshError) {
      // The refreshSession handles clearing token and callback
      // We just let the original 401 response return, or we can throw.
      // Returning the 401 response is usually fine so caller can parse it.
    }
  }

  const contentType = response.headers.get('content-type');
  let data;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    let errorMsg = data?.error?.message || data?.message;
    if (!errorMsg && response.status === 401) {
      errorMsg = 'Your session has expired. Please log in again.';
    }
    const error = new Error(errorMsg || 'API request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};
