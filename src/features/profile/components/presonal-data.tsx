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
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/components/ui";
import { useTranslation } from "react-i18next";
import { UserAvatar } from "./user-avatar";
import { getSpecialitites, getUser, updateDoctor } from "../api";
import { getApiErrorMessages } from "@/utils";
import { MultiSelect, useProfileLayoutStore } from ".";
import { useAuth } from "@/features/auth";

type FormFieldTypes =
  | "name"
  | "email"
  | "category"
  | "specialization"
  | "specialization_ru"
  | "specialization_ro"
  | "specialization_en"
  | "bio"
  | "bio_ru"
  | "bio_ro"
  | "bio_en"
  | "professionalTitle"
  | "experience"
  | "workplace"
  | "education";

interface IFormData {
  name: string;
  email: string;
  specialization_en: string;
  specialization_ro: string;
  specialization_ru: string;
  bio: { [key: string]: string };
  bio_ru: string;
  bio_en: string;
  bio_ro: string;
  specialization: { [key: string]: string };
  professionalTitle: string;
  experience: number;
  workplace: string;
  category: string[];
  education: string[];
}

interface ISpeciality {
  id: number;
  name_en: string;
  name_ro: string;
  name_ru: string;
}

type InfoStateProps = {
  [anyProperty: string]: any;
};

export const PersonalData: React.FC = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const setNotification = useProfileLayoutStore((store) => store.setNotification);
  const [tab, setTab] = useState("ro");
  const [info, setInfo] = useState<InfoStateProps>({});
  const [avatar, setAvatar] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [tempInputData, setTempInputData] = useState("");
  const rightItemsList = ["category", "professionalTitle", "experience", "workplace"];

  const schema = z.object({
    name: z.string(),
    email: z
      .string()
      .min(4, { message: t("common:zod_mixed_required") })
      .email(t("validations:invalid_email")),

    specialization_en: z.string().optional().nullable(),
    specialization_ro: z.string().optional().nullable(),
    specialization_ru: z.string().optional().nullable(),
    bio_en: z.string().optional().nullable(),
    bio_ro: z.string().optional().nullable(),
    bio_ru: z.string().optional().nullable(),
    professionalTitle: z.string().min(2, { message: t("common:zod_mixed_required") }),
    experience: z
      .number()
      .min(4, { message: t("common:zod_mixed_required") })
      .refine((v) => v >= 0),
    workplace: z.string().min(4, { message: t("common:zod_mixed_required") }),
    education: z.array(z.string().min(4, { message: t("common:zod_mixed_required") })),
    category: z.array(z.string()),
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
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    defaultValues: info,
    resolver: zodResolver(schema),
  });
  const { revalidateSession } = useAuth();
  const userStorageData = localStorage.getItem("session:user");
  useEffect(() => {
    getUser().then((data: any) => {
      localStorage.setItem("session:user", JSON.stringify(data));
    });
  }, []);

  useEffect(() => {
    if (userStorageData) {
      const {
        avatar,
        name,
        email,
        about: {
          specialization,
          bio,
          bio_en,
          bio_ro,
          bio_ru,
          specialization_en,
          specialization_ro,
          specialization_ru,
          professionalTitle,
          experience,
        },
        activity: { education, workplace },
        category,
      } = JSON.parse(userStorageData);

      const userData = {
        name,
        email,
        specialization,
        bio,
        bio_en,
        bio_ro,
        bio_ru,
        specialization_en,
        specialization_ro,
        specialization_ru,
        professionalTitle,
        experience,
        workplace,
        education,
        category,
      };
      setAvatar(avatar);
      setInfo(userData);
      form.reset(userData);
    }

    return () => {
      localStorage.removeItem("user:category");
    };
  }, []);

  useEffect(() => {
    form.reset(info);
  }, [i18n.language]);

  useEffect(() => {
    getSpecialitites().then((res) => {
      if (res.data.length) setSpecialities(res.data);
    });
  }, []);

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

  const clearFormErrorsAfterBlur = (fieldName: keyof IFormData) => {
    if (form.formState.errors[fieldName]) {
      form.clearErrors(fieldName as FormFieldTypes);
    }
  };

  const [apiErrors, setApiErrors] = React.useState<string[] | string | null>(null);

  const updateCtegory = (values: string[]) => {
    const data = { ...info, category: values };
    setInfo(data);
  };

  const userSpecialities = () => {
    const user = localStorage.getItem("session:user");
    if (!!user) {
      return specialities.filter((s: ISpeciality) =>
        JSON.parse(user).category.every((el: ISpeciality) => el.id !== s.id)
      );
    }
  };

  const rightSideContent = (field: any, k: string) => {
    if (field.name === "category") {
      return (
        <MultiSelect
          onChange={(values: string[]) => updateCtegory(values)}
          data={userSpecialities()}
        />
      );
    }
    return (
      <Input
        {...form.register(k as keyof IFormData)}
        onBlur={() => clearFormErrorsAfterBlur(k as keyof IFormData)}
      />
    );
  };

  const onSubmit = async (
    values: FormValues,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const category = localStorage.getItem("user:category");
    let newValues = { ...values, category: values.category.map((v: any) => v.id.toString()) };

    if (category) {
      newValues = { ...values, category: JSON.parse(category) };
    }
    try {
      await updateDoctor(newValues)
        .then(() => setNotification({ visible: true, message: "profile:personal_info_updated" }))
        .then(() => revalidateSession());
      setApiErrors(null);
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
        <form>
          <div className="grid grid-cols-12 gap-1 xl:gap-20">
            <div className="col-span-12 mb-2 mb-4 xl:col-span-6">
              <h2 className="hidden pb-4 text-xl font-bold text-black md:block">
                {t("profile:personal_info")}
              </h2>
              <UserAvatar image={avatar} />
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
                              {field.value.map((value: string, index: number) => {
                                return (
                                  <div key={index} className="mb-4 flex">
                                    <Input {...form.register(`${k}.${index}` as keyof IFormData)} />
                                    {index > 0 && (
                                      <Button
                                        variant="ghost"
                                        className="ml-4"
                                        disabled={value.length < 4}
                                        onClick={() => removeItemFromList(k, index)}
                                      >
                                        <TrashIcon className="h-5 w-5" color="text-red-600" />
                                      </Button>
                                    )}
                                  </div>
                                );
                              })}

                              <div className="mt-4 flex">
                                <Input
                                  type="text"
                                  className="mr-4"
                                  value={tempInputData}
                                  onChange={(e) => setTempInputData(e.target.value)}
                                />
                                <Button
                                  variant="ghost"
                                  disabled={tempInputData.length < 5}
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
                              {k === "category" ? t("profile:speciality") : t(`profile:${k}`)}
                            </FormLabel>
                            {rightSideContent(field, k)}
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  );
                })}
                <Tabs
                  defaultValue={tab}
                  onValueChange={(value) => setTab(value as "en" | "ru" | "ro")}
                >
                  <TabsList>
                    <TabsTrigger
                      className={`mr-4 border ${tab === "en" && "border-sky-600"}`}
                      value="en"
                    >
                      En
                    </TabsTrigger>
                    <TabsTrigger
                      className={`mr-4 border ${tab === "ru" && "border-sky-600"}`}
                      value="ru"
                    >
                      Ru
                    </TabsTrigger>
                    <TabsTrigger
                      className={`mr-4 border ${tab === "ro" && "border-sky-600"}`}
                      value="ro"
                    >
                      Ro
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                {["en", "ru", "ro"].map((lng: string, idx: number) => (
                  <FormField
                    key={"specialization" + idx}
                    name={`specialization.${lng}`}
                    render={({ field }) => {
                      return (
                        <FormItem className={`${lng !== tab ? "hidden" : "visible"}`}>
                          <FormLabel className="mb-2 block text-xs uppercase tracking-wide text-gray-600">
                            {t(`profile:specialization`)}
                          </FormLabel>
                          <Textarea
                            {...form.register(`specialization_${lng}` as keyof IFormData)}
                          />
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ))}
                {["en", "ru", "ro"].map((lng: string, idx: number) => (
                  <FormField
                    key={"bio" + idx}
                    name={`bio.${lng}`}
                    render={({ field }) => {
                      return (
                        <FormItem className={`${lng !== tab ? "hidden" : "visible"}`}>
                          <FormLabel className="mb-2 block text-xs uppercase tracking-wide text-gray-600">
                            {t(`profile:bio`)}
                          </FormLabel>
                          <Textarea {...form.register(`bio_${lng}` as keyof IFormData)} />
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <Button
                className="float-right mt-4"
                onClick={(e) => onSubmit(form.getValues(), e)}
                variant="primary"
              >
                {t("common:save")}
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
