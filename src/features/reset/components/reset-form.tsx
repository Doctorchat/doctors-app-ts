import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import OtpInput from "react-otp-input";
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
  PasswordInput,
} from "@/components/ui";
import { apiCheckCode, apiRestorePassword } from "../api";
import { useMutation } from "react-query";

const schema = z.object({
  password: z.string().refine(isValidPhoneNumber, { message: "validations:invalid_phone_number" }),
});

type FormValues = z.infer<typeof schema>;

export const ResetForm: React.FC = () => {
  const { t } = useTranslation();
  const [openNotification, setOpenNotification] = React.useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = React.useState(1);
  const [otpCode, setOtpCode] = React.useState("");
  const form = useForm<FormValues>({
    defaultValues: {
      password: "",
    },
    resolver: zodResolver(schema),
  });
  const isAuthInProcess = form.formState.isSubmitting;
  const navigate = useNavigate();
  const onResetSubmit = useCallback(
    async (values: any) => {
      try {
        setLoading(true);
        await apiRestorePassword({ ...values, code: otpCode }).then(() => {
          setOpenNotification(true);
          setTimeout(() => {
            setOpenNotification(false);
            navigate("/auth/login");
          }, 1000);
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "common:something_went_wrong",
          description: getApiErrorMessages(error),
        });
        setLoading(false);
      }
    },
    [otpCode]
  );
  return (
    <Card className="w-full max-w-lg">
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
          <CardTitle className="mt-3 text-xl">{t("auth:password_recovery")}</CardTitle>
          <p className=" text-sm text-typography-secondary">
            {t("auth:restore_password_confirm_code")}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <ConfirmPhone
          isCurrentStep={step === 1}
          setStep={setStep}
          setOtpCode={setOtpCode}
          optCode={otpCode}
        />
        <div
          style={{
            display: step === 1 ? "none" : "flex",
            // visibility: step === 1 ? "hidden" : "visible",
            marginTop: "2rem",
            width: "100%"
          }}
        >
          <FormProvider {...form} >
            <form onSubmit={form.handleSubmit(onResetSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-typography-secondary">
                      {t("auth:new_password")}
                    </FormLabel>
                    <FormControl>
                      <FormControl>
                        <PasswordInput
                          disabled={isAuthInProcess}
                          placeholder="********"
                          {...field}
                        />
                      </FormControl>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="form-bottom">
                <div className="mt-7 flex w-full items-center justify-between">
                  <Button type="submit" disabled={isAuthInProcess} className="w-full">
                    {t("common:confirm")}
                    {isAuthInProcess && "..."}
                  </Button>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      </CardContent>
      <Notification
        open={openNotification ? true : false}
        onOpenChange={setOpenNotification.bind(null, false)}
        type={"success"}
        description={t("auth:parssword_recovery_success")}
      />
    </Card>
  );
};
interface ConfirmPhoneProps {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  isCurrentStep: boolean;
  setOtpCode: React.Dispatch<React.SetStateAction<string>>;
  optCode: string;
}

const ConfirmPhone: React.FC<ConfirmPhoneProps> = ({
  setStep,
  isCurrentStep,
  setOtpCode,
  optCode,
}) => {
  const { t } = useTranslation();
  const [isConfirming, setIsConfirming] = useState(false);
  const { mutate, isLoading } = useMutation((code) => apiCheckCode({ code: code }), {
    onSuccess: () => {
      setStep(2);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "common:something_went_wrong",
        description: getApiErrorMessages(error),
      });
    },
    onSettled: () => {
      setIsConfirming(false);
    },
  });

  const onCodeEntered = (code: any) => {
    setIsConfirming(true);
    mutate(code);
  };

  const manualCodeConfirm = () => {
    onCodeEntered(optCode);
  };

  return (
    <div className="flex h-full flex-col items-center justify-start rounded-2xl bg-gray-100 p-10">
      <header className="mb-5 flex items-center justify-between">
        <p>{t("auth:restore_password_confirm_code")}</p>
      </header>
      <OtpInput
        value={optCode}
        onChange={setOtpCode}
        numInputs={6}
        renderInput={(props) => (
          <input {...props} autoComplete="one-time-code" disabled={!isCurrentStep} />
        )}
        inputStyle="!w-[59px] !h-[57px] mr-[10px] rounded-lg bg-white border-none outline-none"
        shouldAutoFocus
      />
      {isLoading && <span>Validating code...</span>}

      {isCurrentStep && (
        <div className="mt-7 flex items-center justify-between">
          <Button
            type="submit"
            disabled={optCode?.length < 6 || !optCode}
            onClick={manualCodeConfirm}
          >
            {t("common:confirm")}
          </Button>
        </div>
      )}
    </div>
  );
};
