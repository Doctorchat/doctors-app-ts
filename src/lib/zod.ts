import { z } from "zod";

import i18n from "./i18n";

const zodIntlErrors = (issue: z.ZodIssueOptionalMessage) => {
  if (issue.code === z.ZodIssueCode.too_small) {
    return i18n.t("validations:too_small", { min: issue.minimum });
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
