import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";

import { apiLogin } from "../api";
import { useEmulateLogin } from "../hooks";
import { useAuth } from "../provider";

import { CountrySelect } from "@/components/shared";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
} from "@/components/ui";
import { getApiErrorMessages } from "@/utils";

const schema = z.object({
  phone: z.string().refine(isValidPhoneNumber, { message: "validations:invalid_phone_number" }),
  password: z.string().nonempty(),
});

type FormValues = z.infer<typeof schema>;

export const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const { initializeSession } = useAuth();
  const { isEmulating } = useEmulateLogin();

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    defaultValues: {
      phone: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });

  const [apiErrors, setApiErrors] = React.useState<string[] | string | null>(null);

  const onSubmitTestIsSubmitting = async (values: FormValues) => {
    try {
      const response = await apiLogin(values);
      const continueFrom = new URLSearchParams(window.location.search).get("continueFrom");

      initializeSession(response.token, response.user);
      if (continueFrom) navigate(continueFrom);
      else navigate("/");
    } catch (error) {
      console.log(error);
      setApiErrors(getApiErrorMessages(error, t));
    }
  };

  const isAuthInProcess = form.formState.isSubmitting || isEmulating;

  return (
    <Card className="w-full max-w-sm">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmitTestIsSubmitting)}>
          <CardHeader className="justify-between">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <img
                  src="/assets/logo.svg"
                  width="36"
                  height="36"
                  alt="Doctorchat"
                  className="mx-auto h-9 w-9 flex-shrink-0 object-contain"
                />
              </div>
              <CardTitle className="mt-3 text-xl">{t("common:welcome_back")}</CardTitle>
              <CardDescription>{t("auth:enter_credentials_to_continue")}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {apiErrors && (
                <Alert variant="destructive">
                  <AlertTitle>{t("common:error")}</AlertTitle>
                  <AlertDescription>
                    <p>{t(apiErrors)}</p>
                  </AlertDescription>
                </Alert>
              )}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-typography-secondary">
                      {t("common:phone_number")}
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        international
                        smartCaret
                        limitMaxLength
                        focusInputOnCountrySelection
                        defaultCountry="MD"
                        countryCallingCodeEditable={false}
                        className="flex space-x-2"
                        disabled={isAuthInProcess}
                        countrySelectComponent={CountrySelect}
                        inputComponent={Input}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between">
                      <FormLabel className="text-typography-secondary">
                        {t("auth:password")}
                      </FormLabel>
                      <FormLabel>
                        {/* <Link to="/auth/restore/password">
                          <p className="text-red-500 underline">
                            {t("validations:forgot_password")}
                          </p>
                        </Link> */}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <PasswordInput disabled={isAuthInProcess} placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isAuthInProcess} className="w-full">
              {t("auth:login")}
              {isAuthInProcess && "..."}
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
};
