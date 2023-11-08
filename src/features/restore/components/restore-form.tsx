import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { CountrySelect } from "@/components/shared";
import Notification from "@/components/ui/notification";
import { toast } from "@/hooks";
import { getApiErrorMessages, getApiErrorMessagesLogin } from "@/utils";
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
import { apiRestore } from "../api";

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

  const onResetPasword = React.useCallback(
    async (values: FormValues) => {
      try {
        const data = { ...values };

        await apiRestore(data).then(() => {
          setApiErrors(null);
          setOpenNotification(true);
          setTimeout(() => {
            setOpenNotification(false);
            navigate("/auth/reset-password");
            form.reset({ phone: "" });
          }, 1000);
        });
      } catch (error) {
        console.log(error);
        setApiErrors(getApiErrorMessagesLogin(error, t));
      }
    },
    [form, navigate]
  );
  const isAuthInProcess = form.formState.isSubmitting;
  const [openNotification, setOpenNotification] = React.useState<boolean>(false);

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
      <Notification
        open={openNotification ? true : false}
        onOpenChange={setOpenNotification.bind(null, false)}
        type={"success"}
        description={t("auth:reset_password")}
      />
    </Card>
  );
};
