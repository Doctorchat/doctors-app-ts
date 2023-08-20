import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { FormProvider, UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/components/ui";

type WalletWithdrawFormProps = {
  isConfirmation: boolean;
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  form: UseFormReturn<{ amount: string; }>;
};

const WalletWithdrawForm: React.FC<WalletWithdrawFormProps> = (props) => {
  const { isConfirmation, setConfirm, form } = props;
  const { t } = useTranslation();

  const isSubmitting = form.formState.isSubmitting;

  return (
    <FormProvider {...form}>
      <form>
        <div className={cn("flex flex-col gap-4")}>
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("common:sum")}</FormLabel>
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
      </form>
    </FormProvider>
  );
};

export default WalletWithdrawForm;