/**
 * Clés de stockage
 * (scopées Admin)
 */
const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";

/**
 * Sauvegarder les tokens
 */
export const saveTokens = (
  accessToken: string,
  refreshToken: string
) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Récupérer les tokens
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Supprimer les tokens (logout)
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Vérifier si l'admin est connecté
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
