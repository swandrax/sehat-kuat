import { secureStorage } from '../utils/secureStorage';

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data: T;
  meta?: any;
}

export async function mobileApiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = await secureStorage.getItem('access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Inject Idempotency-Key for state mutating operations
  if (['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase() || '')) {
    if (!headers['Idempotency-Key'] && !headers['x-idempotency-key']) {
      headers['Idempotency-Key'] = `idemp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    await secureStorage.removeItem('access_token');
    throw new Error('Sesi kedaluwarsa. Silakan masuk kembali.');
  }

  const json = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = json?.message || `HTTP ${response.status}: Terjadi kesalahan server`;
    throw new Error(Array.isArray(errorMsg) ? errorMsg.join(', ') : errorMsg);
  }

  return json;
}
