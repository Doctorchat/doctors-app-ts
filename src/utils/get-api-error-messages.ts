import axios from "axios";

import { ApiErrorResponse } from "@/types";

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
        console.log(Object.values(error.response.data.errors).flat());
        return Object.values(error.response.data.errors).flat();
      }

      if (error.response?.data.message || error.message) {
        //You are not a doctor
        //Entered password is invalid
        console.log(error.response?.data.message || error.message);
        return error.response?.data.message || error.message;
      }
    }
  }

  return "common:unknown_error";
};
