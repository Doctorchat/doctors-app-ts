import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
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
  Textarea,
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "./user-avatar";
import { updateDoctor } from "../api";
import { getApiErrorMessages } from "@/utils";

type FormFieldTypes =
  | "name"
  | "email"
  | "specialization"
  | "bio"
  | "professionalTitle"
  | "experience"
  | "workplace"
  | "education";

type InfoStateProps = {
  [anyProperty: string]: any;
};

export const PersonalData: React.FC = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const [info, setInfo] = useState<InfoStateProps>({});
  const { name, email, education, avatar, ...restData } = info;

  const schema = z.object({
    name: z.string(),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    specialization: z.string(),
    bio: z.string(),
    professionalTitle: z.string(),
    experience: z.number(),
    workplace: z.string(),
    education: z.array(z.string()),
  });

  type FormValues = z.infer<typeof schema>;

  useEffect(() => {
    const userStorageData = localStorage.getItem("session:user");

    if (userStorageData) {
      const {
        name,
        email,
        about: { specialization, bio, professionalTitle, experience },
        activity: { education, workplace },
        avatar,
      } = JSON.parse(userStorageData);

      setInfo({
        name,
        email,
        specialization,
        bio,
        professionalTitle,
        experience,
        workplace,
        education,
        avatar,
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(info).length) {
      for (const key in info) {
        const value = info[key];
        if (Array.isArray(value)) {
          form.setValue(key as FormFieldTypes, info[key] ?? [""]);
        } else if (typeof value === "object") {
          form.setValue(key as FormFieldTypes, info[key][i18n.language] ?? "");
        } else {
          form.setValue(key as FormFieldTypes, info[key]);
        }
      }
    }
  }, [info]);

  const form = useForm<FormValues>({
    defaultValues: info,
    resolver: zodResolver(schema),
  });

  type InputProp = {
    fieldKey: FormFieldTypes;
  };

  const FormattedInput: React.FC<InputProp> = ({ fieldKey }) => {
    const [tempInputData, setTempInputData] = useState("");

    const value = info[fieldKey];

    const handleChange = (newValue: string) => {
      form.setValue(fieldKey as FormFieldTypes, newValue);
    };

    const handlePushData = () => {
      setInfo({ ...info, [fieldKey]: [...info[fieldKey], tempInputData] });
      setTempInputData("");
    };

    const removeItemFromList = (index: number) => {
      const temp = [...info[fieldKey]];
      temp.splice(index, 1);
      setInfo({ ...info, [fieldKey]: temp });
    };

    if (Array.isArray(value)) {
      return (
        <div>
          {info[fieldKey].map((value: string, index: number) => (
            <div key={index} className="mb-4 flex">
              <Input value={value} onChange={(e) => handleChange(e.target.value)} />

              {index !== 0 && (
                <Button variant="ghost" className="ml-4" onClick={() => removeItemFromList(index)}>
                  <TrashIcon className="h-5 w-5" color="text-red-600" />
                </Button>
              )}
            </div>
          ))}

          <div className="mt-4 flex">
            <Input
              type="text"
              className="mr-4"
              value={tempInputData}
              onChange={(e) => setTempInputData(e.target.value)}
            />

            <Button variant="ghost" disabled={!tempInputData.length} onClick={handlePushData}>
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      );
    }
    if (typeof value === "object") {
      return (
        <Textarea {...form.register(fieldKey)} onChange={(e) => handleChange(e.target.value)} />
      );
    }
    return (
      <Input
        {...form.register(fieldKey)}
        disabled={form.formState.isSubmitting}
        onChange={(e) => handleChange(e.target.value)}
      />
    );
  };
  const [apiErrors, setApiErrors] = React.useState<string[] | string | null>(null);

  const onSubmit = async (values: FormValues) => {
    try {
      await updateDoctor(values);
    } catch (error) {
      setApiErrors(getApiErrorMessages(error));
    }
  };

  return (
    <div>
      {apiErrors && (
        <Alert variant="destructive">
          <AlertTitle>{t("common:error")}</AlertTitle>
          <AlertDescription>
            <p>{t(apiErrors)}</p>
          </AlertDescription>
        </Alert>
      )}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-1 xl:gap-20">
            <div className="col-span-12 mb-2 mb-4 xl:col-span-6">
              <h2 className="pb-4 text-xl font-bold text-black">{t("profile:personal_info")}</h2>
              <div className="mb-8 flex items-end ">
                <UserAvatar image={avatar} />
              </div>
              <div className="space-y-6">
                {["name", "email", "education"].map((k) => (
                  <FormField
                    key={k}
                    name={k}
                    render={() => {
                      return (
                        <FormItem>
                          <FormLabel className="mb-2 block text-xs uppercase tracking-wide text-gray-600">
                            {t(`profile:${k}`)}
                          </FormLabel>
                          <FormattedInput fieldKey={k as FormFieldTypes} />
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="col-span-12 xl:col-span-6">
              <h2 className="pb-4 text-xl font-bold text-black">
                {t("profile:professional_info")}
              </h2>
              <div className="space-y-6">
                {Object.keys(restData).map((k) => {
                  return (
                    <FormField
                      key={k}
                      name={k}
                      render={() => {
                        return (
                          <FormItem>
                            <FormLabel className="mb-2 block text-xs uppercase tracking-wide text-gray-600">
                              {t(`profile:${k}`)}
                            </FormLabel>
                            <FormattedInput fieldKey={k as FormFieldTypes} />
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  );
                })}
              </div>
              <Button className="float-right mt-4" type="submit" variant="outline">
                {t("common:save")}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
