import axios from "axios";

import { ApiErrorResponse } from "@/types";
import { useTranslation } from "react-i18next";

export const getApiErrorMessages = (response: any, t: any): string[] | string => {
  if (axios.isAxiosError(response)) {
    if (response.response?.status === 401) {
      const error = response as ApiErrorResponse;
      let errorMessageKey = "";
      console.log(error.response?.data.errors);

      if (error.response?.data.message) {
        if (error.response.data.message === "You are not a doctor") {
          errorMessageKey = "invalid_doctor";
        } else if (error.response.data.message === "Entered password is invalid") {
          errorMessageKey = "invalid_password";
        } else if (error.response.data.message === "The selected phone is invalid.") {
          errorMessageKey = "invalid_phone";
        } else if (error.response.data.message === "Regional inconsistencies") {
          errorMessageKey = "regional_inconsistencies";
        } else if (error.response.data.message === "Bad credentials") {
          errorMessageKey = "bad_credentials";
        }
      }

      if (errorMessageKey) {
        return t(`auth:` + errorMessageKey);
      }
    } else if (response.response?.status === 422) {
      const error = response as ApiErrorResponse;
      let errorMessageKey = "";
      console.log(error.response?.data.errors);

      if (error.response?.data.message) {
        if (error.response.data.message === "You are not a doctor") {
          errorMessageKey = "invalid_doctor";
        } else if (error.response.data.message === "Entered password is invalid") {
          errorMessageKey = "invalid_password";
        } else if (error.response.data.message === "The selected phone is invalid.") {
          errorMessageKey = "invalid_phone";
        } else if (error.response.data.message === "Regional inconsistencies") {
          errorMessageKey = "regional_inconsistencies";
        } else if (error.response.data.message === "Bad credentials") {
          errorMessageKey = "bad_credentials";
        }
      }

      if (errorMessageKey) {
        return t(`auth:` + errorMessageKey);
      }
    }
  }

  return "common:unknown_error";
};
