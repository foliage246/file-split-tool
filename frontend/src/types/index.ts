// API 相關類型定義

export interface User {
  user_id: string;
  email: string;
  is_premium: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user_id: string;
  email: string;
  is_premium: boolean;
  access_token: string;
  token_type: string;
}

export interface FileUploadResponse {
  task_id: string;
  status: string;
  message: string;
}

export interface TaskStatus {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  filename: string;
  file_size_mb: number;
  column_name?: string;
  batch_size?: number;
  created_at: string;
  updated_at: string;
  error_message?: string;
  total_rows?: number;
  split_groups?: number;
  output_files?: number;
  file_details?: FileDetail[];
}

export interface FileDetail {
  group_value: string;
  row_count: number;
  filename: string;
}

export interface UsageLimits {
  user_tier: 'free' | 'premium';
  daily_usage: {
    current: number;
    limit: number;
    remaining: number;
    reset_date: string;
  };
  file_limits: {
    max_size_mb: number;
    supported_formats: string[];
  };
  features: {
    big5_encoding: boolean;
    batch_processing: boolean;
    priority_processing: boolean;
  };
}

export interface SubscriptionInfo {
  user_id: string;
  is_premium: boolean;
  has_subscription: boolean;
  subscription_id?: string;
  status?: string;
  current_period_start?: number;
  current_period_end?: number;
  cancel_at_period_end?: boolean;
}

export interface PricingPlan {
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  limitations: string[];
}

// UI 相關類型定義
export interface StepProps {
  activeStep: number;
  onNext: () => void;
  onPrevious: () => void;
}

export interface FileUploadData {
  file: File | null;
  columnName: string;
  batchSize?: number;
}

export interface ApiError {
  detail: string;
}