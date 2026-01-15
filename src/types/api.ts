// 请求配置类型
export interface RequestConfig {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: any;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

// 响应数据类型
export interface ResponseData<T = any> {
  code: number;
  message: string;
  data: T;
  success: boolean;
}

// 错误类型
export interface ApiError {
  code: number;
  message: string;
  data?: any;
}

// 带分页的响应数据
export interface PaginatedData<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}