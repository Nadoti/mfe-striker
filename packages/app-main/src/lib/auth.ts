/**
 * Funções helper para gerenciar autenticação no localStorage
 */

interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}

/**
 * Salvar dados de autenticação no localStorage
 */
export function saveAuthData(user: AuthUser, accessToken: string, refreshToken: string) {
  localStorage.setItem('auth_user', JSON.stringify(user));
  localStorage.setItem('auth_token', accessToken);
  localStorage.setItem('auth_refresh_token', refreshToken);
}

/**
 * Pegar dados do usuário do localStorage
 */
export function getAuthUser(): AuthUser | null {
  try {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Pegar token de acesso do localStorage
 */
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

/**
 * Pegar refresh token do localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem('auth_refresh_token');
}

/**
 * Verificar se o usuário está autenticado
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getAuthUser();
}

/**
 * Limpar todos os dados de autenticação do localStorage
 */
export function clearAuthData() {
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_refresh_token');
  localStorage.removeItem('auth_session'); // Compatibilidade com versão antiga
}

