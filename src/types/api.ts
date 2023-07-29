import { AxiosError } from "axios";

export type ApiErrorResponse = AxiosError<{
  message?: string;
  errors?: { [key: string]: string[] };
}>;

export interface ApiSuccessResponse {
  message: string;
}
