import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
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
} from "@/components/ui";

const schema = z.object({
  phone: z.string().refine(isValidPhoneNumber, { message: "validations:invalid_phone_number" }),
});

type FormValues = z.infer<typeof schema>;

export const RestoreForm: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const form = useForm<FormValues>({
    defaultValues: {
      phone: "",
    },
    resolver: zodResolver(schema),
  });

  const [apiErrors, setApiErrors] = React.useState<string[] | string | null>(null);

  // const onResetPasword = async (values: FormValues) => {
  //   try {
  //     console.log(values);
      // const response = await apiRestore(values);
  //     // const continueFrom = new URLSearchParams(window.location.search).get("continueFrom");
  //     // initializeSession(response.token, response.user);
  //     // if (continueFrom) navigate(continueFrom);
  //     // else navigate("/");
  //   } catch (error) {
  //     // console.log(error);
  //     // setApiErrors(getApiErrorMessages(error));
  //   }
  // };
  // const getRecaptchaToken = useGoogleRecaptcha();
  const onResetPasword = React.useCallback(
    async (values: FormValues) => {
      // setLoading(true);
      try {
        const data = { ...values };
        //   data.re_token = await getRecaptchaToken();
        //   const res = await api.user.resetPassword(data);
        //   dispatch(notification({ title: "success", descrp: "phone_verification.reset_password" }));
        //   form.reset({ phone: "" });
        //   if (res.status === 200) {
        //     router.push("/auth/reset-password");
        //   }
      } catch (error) {
        //   dispatch(
        //     notification({
        //       type: "error",
        //       title: "error",
        //       descrp: getApiErrorMessages(error, true),
        //       duration: 0,
        //     })
        //   );
      } finally {
        //   setLoading(false);
      }
    },
    [form, navigate]
  );
  const isAuthInProcess = form.formState.isSubmitting;

  return (
    <Card className="w-full max-w-sm">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onResetPasword)}>
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
              <CardDescription>{t("auth:reset_description")}</CardDescription>
              <Button variant="success">{t("auth:log_in")}</Button>
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
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isAuthInProcess} className="w-full">
              {t("auth:reset_button")}
              {isAuthInProcess && "..."}
            </Button>
          </CardFooter>
        </form>
      </FormProvider>
    </Card>
  );
};
