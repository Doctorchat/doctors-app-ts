import { z } from "zod";

import i18n from "./i18n";

const zodIntlErrors = (issue: z.ZodIssueOptionalMessage) => {
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      return i18n.t("validations:zod_string_min", { min: issue.minimum });
    } else if (issue.type === 'number') {
      return i18n.t("common:zod_number_min", { min: issue.minimum });
    } else if (issue.type === 'array') {
      return i18n.t("validations:zod_array_min", { min: issue.minimum });
    }
  }
  
  if (issue.code === z.ZodIssueCode.too_big) {
    if (issue.type === 'string') {
      return i18n.t("validations:zod_string_max", { max: issue.maximum });
    } else if (issue.type === 'number') {
      return i18n.t("validations:zod_number_max", { max: issue.maximum });
    }
  }

  if (issue.code === z.ZodIssueCode.invalid_string) {
    if (issue.validation === "email") {
      return i18n.t("validations:invalid_email");
    }
  }
};

const zodErrorMap: z.ZodErrorMap = (issue) => {
  console.log(issue);

  const intlError = zodIntlErrors(issue);

  if (intlError) {
    return { message: intlError };
  }

  return {
    message: issue.message || i18n.t("unknown_error") || "Unknown error",
  };
};

export default zodErrorMap;
