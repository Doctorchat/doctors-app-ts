import axios from "axios";

import { ApiErrorResponse } from "@/types";
import { useTranslation } from "react-i18next";

export const getApiErrorMessages = (response: unknown): string[] | string => {
  const { t } = useTranslation();
  if (axios.isAxiosError(response)) {
    if (response.response?.status === 422) {
      // const error = response as ApiErrorResponse;
      // if (error.response?.data.errors) {
      //   return Object.values(error.response.data.errors).flat();
      // }

      // if (error.response?.data.message || error.message) {
      //   return error.response?.data.message || error.message;
      // }
    }
    if (response.response?.status === 401) {
      const error = response as ApiErrorResponse;
      let errorMessageKey = "";

      if (error.response?.data.errors) {
        console.log(error.response?.data.errors);
        errorMessageKey = "invalid_password_message";
      } else if (error.response?.data.message) {
        console.log(error.response.data.message);
        if (error.response.data.message === "Bad credentials") {
          errorMessageKey = "bad_credentials_message";
        } else if (error.response.data.message === "Regional inconsistencies") {
          errorMessageKey = "regional_inconsistencies_message";
        }
      }

      if (errorMessageKey) {
        return t(errorMessageKey);
      }
    }
  }

  return "common:unknown_error";
};
