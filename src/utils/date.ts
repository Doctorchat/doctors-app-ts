import {
  format,
  formatDistanceToNow,
  differenceInYears,
  differenceInMonths,
  differenceInWeeks,
  isToday,
  isValid,
} from "date-fns";
import { enUS, ro, ru } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import getActiveLng from "./getActiveLng";

const formats = {
  time: "HH:mm",
  day: "MMM dd",
  month: "MMMM dd",
  year: "dd/MM/yyyy",
  full: "dd.MM.yyyy HH:mm",
  serverDate: "yyyy-MM-dd",
  serverFull: "yyyy-MM-dd HH:mm",
};

const localeMapping: Record<string, typeof enUS | typeof ro | typeof ru> = {
  en: enUS,
  ro: ro,
  ru: ru,
};

export interface Transformers {
  dynamic: () => any;
  monthDate: () => string;
  toServerDate: () => string;
  default: string;
  time: string;
  full: string;
  relative: string;
}

/**
 * @typedef {Object} Tranformers
 * @property {Function} dynamic
 * @property {Function} monthDate
 * @property {String} default
 * @property {String} time
 * @property {String} full
 * @property {String} relative
 */

/**
 * @param {Date} date
 * @returns {Tranformers}
 */

export default function transformDate(date: Date | string): any {
  const { t } = useTranslation();
  const parsedDate = new Date(date);

  if (!isValid(parsedDate)) {
    return date as string;
  }

  const localeMapping: Record<string, Locale> = {
    en: enUS,
    ro: ro,
    ru: ru,
  };

  const currentLocale = localeMapping[getActiveLng()];

  const dynamic = (): string => {
    if (differenceInYears(new Date(), parsedDate) !== 0)
      return format(parsedDate, formats.year, { locale: currentLocale });
    if (!isToday(parsedDate)) return format(parsedDate, formats.day, { locale: currentLocale });
    return format(parsedDate, formats.time, { locale: currentLocale });
  };

  const monthDate = (): string => {
    if (isToday(parsedDate)) return t("today");
    return format(parsedDate, formats.month, { locale: currentLocale });
  };

  const toServerDate = (): string =>
    format(parsedDate, formats.serverDate, { locale: currentLocale });

  return {
    dynamic,
    monthDate,
    toServerDate,
    default: format(parsedDate, "MMMM dd, yyyy", { locale: currentLocale }),
    time: format(parsedDate, formats.time, { locale: currentLocale }),
    full: format(parsedDate, formats.full, { locale: currentLocale }),
    relative: formatDistanceToNow(parsedDate, { locale: currentLocale, addSuffix: true }),
  };
}

export const IOSMonthDate = (date: Date | string, t: Function): string => {
  const parsedDate = new Date(date);

  if (isValid(parsedDate)) {
    const currentLocale = localeMapping[getActiveLng()];
    if (isToday(parsedDate)) return t("today");
    return format(parsedDate, "MMMM dd", { locale: currentLocale });
  }

  return date as string;
};

export interface AgeData {
  age: number;
  years: number;
  months: number;
  weeks: number;
}

export const calculateAge = (birthday: Date | string): AgeData => {
  const parsedBirthday = new Date(birthday);
  const years = differenceInYears(new Date(), parsedBirthday);
  const months = differenceInMonths(new Date(), parsedBirthday) - years * 12;
  const weeks =
    differenceInWeeks(new Date(), parsedBirthday) - years * 52 - Math.floor(months * 4.33);
  return { age: years, years, months, weeks };
};

export const daysWeek = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
