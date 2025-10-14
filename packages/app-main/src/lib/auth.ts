interface AuthUser {
  id: string;
  email: string;
  createdAt: string;
}


export function saveAuthData(user: AuthUser, accessToken: string, refreshToken: string) {
  localStorage.setItem('auth_user', JSON.stringify(user));
  localStorage.setItem('auth_token', accessToken);
  localStorage.setItem('auth_refresh_token', refreshToken);
}


export function getAuthUser(): AuthUser | null {
  try {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}


export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('auth_refresh_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken() && !!getAuthUser();
}

export function clearAuthData() {
  localStorage.removeItem('auth_user');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_refresh_token');
  localStorage.removeItem('auth_session');
}

