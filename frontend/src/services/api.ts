import axios, { AxiosInstance, AxiosResponse } from 'axios';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  FileUploadResponse,
  TaskStatus,
  UsageLimits,
  SubscriptionInfo,
  PricingPlan,
  ApiError,
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    // 從環境變數讀取後端API URL，fallback到相對路徑
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
    
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 請求攔截器 - 添加認證 token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 響應攔截器 - 處理認證錯誤
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token 過期或無效，清除本地存儲並重定向到登入頁面
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // 認證相關 API
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
    return response.data;
  }

  async logout(): Promise<void> {
    await this.api.post('/auth/logout');
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  // 檔案處理相關 API
  async uploadFile(
    file: File,
    columnName: string,
    batchSize?: number
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (columnName) formData.append('column_name', columnName);
    if (batchSize) formData.append('batch_size', batchSize.toString());

    const response: AxiosResponse<FileUploadResponse> = await this.api.post(
      '/files/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response: AxiosResponse<TaskStatus> = await this.api.get(`/files/status/${taskId}`);
    return response.data;
  }

  async downloadResult(taskId: string): Promise<Blob> {
    const response = await this.api.get(`/files/download/${taskId}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // 付費相關 API
  async createSubscription(): Promise<any> {
    const response = await this.api.post('/payment/create-subscription');
    return response.data;
  }

  async cancelSubscription(): Promise<any> {
    const response = await this.api.post('/payment/cancel-subscription');
    return response.data;
  }

  async getSubscriptionStatus(): Promise<SubscriptionInfo> {
    const response: AxiosResponse<SubscriptionInfo> = await this.api.get(
      '/payment/subscription-status'
    );
    return response.data;
  }

  async getUsageLimits(): Promise<UsageLimits> {
    const response: AxiosResponse<UsageLimits> = await this.api.get('/payment/usage-limits');
    return response.data;
  }

  async getPricing(): Promise<{ plans: PricingPlan[]; payment_methods: string[] }> {
    const response = await this.api.get('/payment/pricing');
    return response.data;
  }
}

// 創建 API 服務實例
export const apiService = new ApiService();

// 錯誤處理輔助函數
export const handleApiError = (error: any): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.message) {
    return error.message;
  }
  return '發生未知錯誤，請稍後再試';
};

export default apiService;