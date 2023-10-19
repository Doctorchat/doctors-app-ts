import axios from "axios";

import { ApiErrorResponse } from "@/types";

export const getApiErrorMessages = (response: unknown): string[] | string => {
  if (axios.isAxiosError(response)) {
    if (response.response?.status === 422) {
      const error = response as ApiErrorResponse;
      if (error.response?.data.errors) {
        return Object.values(error.response.data.errors).flat();
      }

      if (error.response?.data.message || error.message) {
        return error.response?.data.message || error.message;
      }
    }
    if (response.response?.status === 401) {
    }
  }

  return "common:unknown_error";
};
