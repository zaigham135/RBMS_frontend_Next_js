// API Response wrapper
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
