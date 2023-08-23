import i18nextlocal from "i18next";

const getActiveLng = (): string => {
  const available: string[] = ["ro", "ru", "en"];

  if (process.env.NEXT_PUBLIC_API_REGION === "ro") {
    available.shift();
  }

  if (i18nextlocal.language) {
    const [locale] = i18nextlocal.language.split("-");

    if (available.includes(locale)) {
      return locale;
    }
  }

  return "ro";
};

export default getActiveLng;

export const getInstanceTranslation = (key: string): string => {
  return i18nextlocal.t(key, { lng: getActiveLng() });
};
