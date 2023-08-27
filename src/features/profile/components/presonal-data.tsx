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

interface IFormData {
  name: string;
  email: string;
  specialization: { [key: string]: string };
  bio: { [key: string]: string };
  professionalTitle: string;
  experience: number;
  workplace: string;
  education: string[];
}

type InfoStateProps = {
  [anyProperty: string]: any;
};

export const PersonalData: React.FC = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();

  const [info, setInfo] = useState<InfoStateProps>({});
  const [avatar, setAvatar] = useState("");
  const [tempInputData, setTempInputData] = useState("");

  const rightItemsList = ["specialization", "bio", "professionalTitle", "experience", "workplace"];

  const schema = z.object({
    name: z.string(),
    email: z
      .string()
      .min(1, { message: "This field has to be filled." })
      .email("This is not a valid email."),
    specialization: z.object({
      en: z.string().optional().nullable(),
      ro: z.string().optional().nullable(),
      ru: z.string().optional().nullable(),
    }),
    bio: z.object({
      en: z.string().optional().nullable(),
      ro: z.string().optional().nullable(),
      ru: z.string().optional().nullable(),
    }),
    professionalTitle: z.string(),
    experience: z.number(),
    workplace: z.string(),
    education: z.array(z.string()),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    defaultValues: info,
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    const userStorageData = localStorage.getItem("session:user");

    if (userStorageData) {
      const {
        name,
        email,
        about: { specialization, bio, professionalTitle, experience },
        activity: { education, workplace },
      } = JSON.parse(userStorageData);

      const userData = {
        name,
        email,
        specialization,
        bio,
        professionalTitle,
        experience,
        workplace,
        education,
      };
      setAvatar(avatar);
      setInfo(userData);
      form.reset(userData);
    }
  }, []);

  useEffect(() => {
    form.reset(info);
  }, [i18n.language]);

  const handlePushData = (fieldKey: string, tempInputData: string) => {
    const currentData = form.getValues()[fieldKey as FormFieldTypes];

    if (Array.isArray(currentData)) {
      const currentArray = [...currentData];
      currentArray.push(tempInputData);
      form.reset({ ...form.getValues(), [fieldKey]: currentArray });
      setTempInputData("");
    }
  };

  const removeItemFromList = (fieldKey: string, index: number) => {
    const currentData = form.getValues()[fieldKey as FormFieldTypes];

    if (Array.isArray(currentData)) {
      const currentArray = [...currentData];
      currentArray.splice(index, 1);
      form.reset({ ...form.getValues(), [fieldKey]: currentArray });
    }
  };

  const handleBlur = (fieldName: keyof IFormData) => {
    if (form.formState.errors[fieldName]) {
      form.clearErrors(fieldName as FormFieldTypes);
    }
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
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel className="mb-2 block text-xs uppercase tracking-wide text-gray-600">
                            {t(`profile:${k}`)}
                          </FormLabel>
                          {Array.isArray(field.value) ? (
                            <>
                              {field.value.map((value: string, index: number) => (
                                <div key={index} className="mb-4 flex">
                                  <Input
                                    {...form.register(`${k}.${index}` as keyof IFormData)}
                                    value={value}
                                  />

                                  {index > 0 && (
                                    <Button
                                      variant="ghost"
                                      className="ml-4"
                                      onClick={() => removeItemFromList(k, index)}
                                    >
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

                                <Button
                                  variant="ghost"
                                  disabled={!tempInputData.length}
                                  onClick={() => handlePushData(k, tempInputData)}
                                >
                                  <PlusIcon className="h-5 w-5" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <Input {...form.register(k as keyof IFormData)} />
                          )}

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
                {rightItemsList.map((k) => {
                  return (
                    <FormField
                      key={k}
                      name={k}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel className="mb-2 block text-xs uppercase tracking-wide text-gray-600">
                              {t(`profile:${k}`)}
                            </FormLabel>
                            {typeof field.value === "object" ? (
                              <Textarea
                                {...form.register(`${k}.${i18n.language}` as keyof IFormData)}
                              />
                            ) : (
                              <Input
                                {...form.register(k as keyof IFormData)}
                                onBlur={() => handleBlur(k as keyof IFormData)}
                              />
                            )}
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
