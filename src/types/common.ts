export interface SelectOption  {
  value: string;
  label: string;
};

export interface ApiResponse<T> {
  status: number;
  data: T;
  message: string;
}
