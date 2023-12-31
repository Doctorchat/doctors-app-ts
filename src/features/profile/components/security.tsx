import React, { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { updatePassword } from "../api";
import { getApiErrorMessages } from "@/utils";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useProfileLayoutStore } from ".";

export const Security = () => {
  const { t } = useTranslation();
  const [fieldTextVisibile, setFieldTextVisibile] = useState({
    current_password: false,
    new_password: false,
    password_confirmation: false,
  });

  const setNotification = useProfileLayoutStore((store) => store.setNotification);

  const fields = ["current_password", "new_password", "password_confirmation"];

  type FormFieldTypes = "current_password" | "new_password" | "password_confirmation";

  const schema = z
    .object({
      current_password: z.string().min(4),
      new_password: z.string().min(4),
      password_confirmation: z.string().min(4),
    })
    .superRefine((data, ctx) => {
      if (data.new_password !== data.password_confirmation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: t("profile:password_dont_match"),
          path: ["password_confirmation"],
        });
      }
    });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    defaultValues: {
      current_password: "",
      new_password: "",
      password_confirmation: "",
    },
    resolver: zodResolver(schema),
  });

  const handleChange = (k: string, newValue: string) => {
    form.setValue(k as FormFieldTypes, newValue);
  };

  const [apiErrors, setApiErrors] = useState<string[] | string | null>(null);

  const onSubmit = async (values: FormValues) => {
    try {
      await updatePassword(values).then(() =>
        setNotification({ visible: true, message: "profile:password_update_success" })
      );
      setApiErrors(null);
    } catch (error) {
      setApiErrors(getApiErrorMessages(error));
    }
  };

  return (
    <div className="grid flex-1 grid-cols-12">
      <div className="col-span-12 md:col-span-6">
        {apiErrors && (
          <Alert variant="destructive">
            <AlertTitle>{t("common:error")}</AlertTitle>
            <AlertDescription>
              <p>{t(apiErrors)}</p>
            </AlertDescription>
          </Alert>
        )}
        <h2 className="mb-8 hidden text-xl font-bold text-black md:block">
          {t("profile:security")}
        </h2>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {fields.map((k: string) => (
                <FormField
                  key={k}
                  name={k}
                  render={() => {
                    return (
                      <FormItem>
                        <FormLabel className="mb-2 block text-xs uppercase tracking-wide text-gray-700">
                          {t(`profile:${k}`)}
                        </FormLabel>
                        <div className="relative flex items-center">
                          <Input
                            {...form.register(k as FormFieldTypes)}
                            type={fieldTextVisibile[k as FormFieldTypes] ? "text" : "password"}
                            onChange={(e) => handleChange(k, e.target.value)}
                            className="pr-12"
                          />
                          <Button
                            variant="ghost"
                            className="absolute right-0"
                            onClick={() =>
                              setFieldTextVisibile({
                                ...fieldTextVisibile,
                                [k]: !fieldTextVisibile[k as FormFieldTypes],
                              })
                            }
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <Button className="mt-4" type="submit" variant="primary">
              {t("common:save")}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
