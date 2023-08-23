import { Button, FormField, FormItem, FormLabel, FormMessage, Input } from "@/components/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const Security = () => {
  const { t } = useTranslation();
  const fields = ["current_password", "new_password", "password_confirmation"];

  type FormFieldTypes = "current_password" | "new_password" | "password_confirmation";

  const schema = z.object({
    current_password: z.string(),
    new_password: z.string(),
    password_confirmation: z.string(),
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

  const onSubmit = async (values: FormValues) => {
    console.log({ values });
  };

  return (
    <div className="grid flex-1 grid-cols-12">
      <div className="col-span-12 md:col-span-6">
        <h2 className="mb-8 text-xl font-bold text-black">{t("profile:security")}</h2>
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
                        <Input
                          {...form.register(k as FormFieldTypes)}
                          type="password"
                          onChange={(e) => handleChange(k, e.target.value)}
                        />
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
            <Button className="mt-4" type="submit" variant="outline">
              {t("common:save")}
            </Button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
