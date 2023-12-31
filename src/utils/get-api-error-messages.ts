import axios from "axios";

import { ApiErrorResponse } from "@/types";
import { useTranslation } from "react-i18next";

export const getApiErrorMessagesLogin = (response: any, t: any): string[] | string => {
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

export const getApiErrorMessages = (response: unknown): string[] | string => {
  
  if (axios.isAxiosError(response)) {
    //     'message' => 'Entered password is invalid' -401
    // 'message' => 'Bad credentials' - in caz cind IP adresa e blocata, aici nu stiu ce sa scriu, ca el nu trebuie sa stie ca are IP blocat - 401
    //  'message' => 'Regional inconsistencies' - cind incearca user de pe RO sa intre pe site de MD - 401
    if (response.response?.status === 422) {
      const error = response as ApiErrorResponse;
      if (error.response?.data.errors) {
        //['The selected phone is invalid.']
        console.log(Object.values(error.response.data.errors).flat());
        return Object.values(error.response.data.errors).flat();
      }
      if (error.response?.data.message || error.message) {
        console.log(Object.values(error.response?.data.message || error.message));
        return error.response?.data.message || error.message;
      }
    }
    if (response.response?.status === 401) {
      const error = response as ApiErrorResponse;
      if (error.response?.data.errors) {
        return Object.values(error.response.data.errors).flat();
      }
      if (error.response?.data.message || error.message) {
        return error.response?.data.message || error.message;
      }
    }
    if (response.response?.status === 400) {
      const error = response as ApiErrorResponse;

      if (error.response?.data.errors) {
        return Object.values(error.response.data.errors).flat();
      }
      if (error.response?.data.message || error.message) {
        return (
          error.response?.data.message ||
          (typeof error.response?.data === "string" && error.response?.data) ||
          error.message
        );
      }
    }
  }

  return "common:unknown_error";
};
