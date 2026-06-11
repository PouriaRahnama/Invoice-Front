export interface ApiResponse<T> {
  success: boolean;
  data: T;
  code: number;
  message: string;
}