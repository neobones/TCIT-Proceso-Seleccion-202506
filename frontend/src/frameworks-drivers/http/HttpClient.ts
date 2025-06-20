import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Logger } from '@shared/utils/logger';

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class HttpClient {
  private readonly axiosInstance: AxiosInstance;

  constructor(config: HttpClientConfig = {}) {
    this.axiosInstance = axios.create({
      baseURL: config.baseURL || '',
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        Logger.debug(`Petición HTTP: ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
      },
      (error) => {
        Logger.error('Error en petición HTTP', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        Logger.debug(`Respuesta HTTP: ${response.status} ${response.config.url}`, response.data);
        return response;
      },
      (error) => {
        Logger.error('Error en respuesta HTTP', error);
        
        if (error.response) {
          // Error de respuesta del servidor
          const { status, data } = error.response;
          Logger.error(`Error del servidor: ${status}`, data);
        } else if (error.request) {
          // Error de red
          Logger.error('Error de red', error.request);
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.delete<T>(url, config);
    return response.data;
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, data, config);
    return response.data;
  }
}

// Crear instancia global del cliente HTTP
const getApiUrl = (): string => {
  // Detección inteligente del entorno
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  
  // Si hay una URL explícita, usarla
  if (envUrl && envUrl !== '') {
    return `${envUrl}/api`;
  }
  
  // Auto-detección basada en la URL actual
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    
    // Si estamos en localhost (Docker o desarrollo), usar localhost:3001
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//localhost:3001/api`;
    }
    
    // Si estamos en otra IP, asumir que el backend está en el mismo host
    return `${protocol}//${hostname}:3001/api`;
  }
  
  // Fallback para SSR o casos especiales
  return 'http://localhost:3001/api';
};

export const httpClient = new HttpClient({
  baseURL: getApiUrl(),
  timeout: 10000,
});

// Log de configuración para debugging
if (typeof window !== 'undefined') {
  console.log('🔗 API Base URL configurada:', getApiUrl());
} 