const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
  };
  message?: string;
}

export async function apiClient<T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include HttpOnly cookies across requests
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || {
          code: `HTTP_${response.status}`,
          message: result.message || 'Terjadi kesalahan pada server',
        },
      };
    }

    return result;
  } catch (error: any) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error.message || 'Gagal terhubung ke server',
      },
    };
  }
}
