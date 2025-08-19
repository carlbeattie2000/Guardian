interface ErrorPayload {
  code: number;
  message: string;
  data: unknown;
}

interface ResponsePayload<T> {
  status: string;
  data: T | ErrorPayload;
  message: string;
}

interface LoginPayload {
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = ResponsePayload<LoginPayload>;
