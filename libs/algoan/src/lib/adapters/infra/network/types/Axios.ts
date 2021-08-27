export interface ResponseDataError {
  code: string;
  message: string;
  status: number;
}

export interface ResponseError {
  data: ResponseDataError;
}

export interface AxiosError {
  message: string;
  response: ResponseError;
}
