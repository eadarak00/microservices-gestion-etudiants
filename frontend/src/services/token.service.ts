import { jwtDecode } from "jwt-decode";

/**
 * Clés de stockage
 * (scopées Admin)
 */
const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";

/**
 * Interface du token décodé (Keycloak)
 */
interface DecodedToken {
  exp?: number;
  realm_access?: {
    roles: string[];
  };
  name?: string;
  email?: string;
}

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
export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

/**
 * Supprimer les tokens (logout)
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Décoder le token JWT
 */
export const decodeToken = (): DecodedToken | null => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error("JWT decode error", error);
    return null;
  }
};

/**
 * Vérifier si le token est expiré
 */
export const isTokenExpired = (): boolean => {
  const decoded = decodeToken();
  if (!decoded?.exp) return true;

  return decoded.exp * 1000 < Date.now();
};

/**
 * Vérifier si l'utilisateur a le rôle ADMIN
 */
export const hasAdminRole = (): boolean => {
  const decoded = decodeToken();
  return (
    decoded?.realm_access?.roles?.includes("ADMIN") ?? false
  );
};

/**
 * Vérifier si l'utilisateur a le rôle ETUDIANT
 */
export const hasStudentRole = (): boolean => {
  const decoded = decodeToken();
  return (
    decoded?.realm_access?.roles?.includes("ETUDIANT") ?? false
  );
};


// recupere le nom 
export const getStudentName = (): string => {
  const decoded = decodeToken();
  return decoded?.name || "Étudiant";
};


/**
 * Recuperr l'email de l'utilisateur
 * 
*/
export const getUserEmail = () : string | null => {
  const decoded  = decodeToken();
  return decoded?.email ?? null;
}


/**
 * Vérifier si l'admin est authentifié (token valide + rôle ADMIN)
 */
export const isAuthenticated = (): boolean => {
  return (
    !!getAccessToken() &&
    !isTokenExpired() &&
    hasAdminRole()
  );
};


/**
 * Vérifier si l'admin est authentifié (token valide + rôle ETUDIANT)
 */
export const isStudentAuthenticated = (): boolean => {
  return (
    !!getAccessToken() &&
    !isTokenExpired() &&
    hasStudentRole()
  );
};
