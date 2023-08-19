import React from "react";
import { useTranslation } from "react-i18next";
import { cn, getApiErrorMessages } from "@/utils";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";
import Select from "@/components/shared/select";
import { updateDiscount } from "@/features/repeated-consultation/api";

const RepeatedConsultationForm = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const user = session?.user

  const isValidSelectOption = (value: string) => {
    return ["yes", "no"].includes(value);
  };

  const schema = z.object({
    offer_discount:
      z.string().refine(value => isValidSelectOption(value), {
        message: t("common:zod_mixed_required"),
      }),
    discount_days: z.number().int().min(1),
    discount: z.number().int().min(10).max(50,),
  });

  type FormValues = z.infer<typeof schema>;

  const [apiErrors, setApiErrors] = React.useState<string[] | string | null>(null);

  const form = useForm<any>({
    defaultValues: {
      offer_discount: user?.offer_discount ? "yes" : "no",
      discount_days: user?.discount_days ? user?.discount_days : 0,
      discount: user?.discount ? user?.discount : 0,
    },
    resolver: zodResolver(schema),
  });

  console.log(form.getValues());
  

  const onSubmitTestIsSubmitting = async (values: FormValues) => {
    try {
      const response = await updateDiscount({
        offer_discount: values.offer_discount === "yes" ? true : false,
        discount_days: values.discount_days,
        discount: values.discount,
      });
    }
    catch (error) {
      setApiErrors(getApiErrorMessages(error));
    }
  };


  const isSubmitting = form.formState.isSubmitting;

  const onChangeParseInt = (field: any) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      field.onChange(e.target.value);
      form.setValue(field.name, e.target.value);
    } else {
      field.onChange(value);
      form.setValue(field.name, value);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitTestIsSubmitting)}
      >
        <div className="space-y-6 mb-3">
          {apiErrors && (
            <Alert variant="destructive">
              <AlertTitle>{t("common:error")}</AlertTitle>
              <Button
                onClick={() => setApiErrors(null)}
              >
                  Close
                </Button>              
              <AlertDescription>
                <p>{t(apiErrors)}</p>
              </AlertDescription>
            </Alert>
          )}
        </div>
        <div className={cn("flex flex-col gap-4")}>
          <FormField
            control={form.control}
            name="offer_discount"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Select
                    value={form.getValues("offer_discount")}
                    disabled={isSubmitting}
                    options={[
                      { value: "yes", label: t("common:yes") },
                      { value: "no", label: t("common:no") },
                    ]}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultation:repeated_consultations.duration")}</FormLabel>
                <FormControl
                  onChange={onChangeParseInt(field)}
                >
                  <Input
                    type="number"
                    className="w-full"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("consultation:repeated_consultations.discount")}</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="w-full px-2 py-4"
                    disabled={isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div
          className={cn(
            "flex justify-end",
          )}
        >
          <Button
            type="submit"
            className="w-60 mt-4 text-sm bg-primary hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover px-2 py-1"
          >
            {t("common:save")}
            {isSubmitting && "..."}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default RepeatedConsultationForm;