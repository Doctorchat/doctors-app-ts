import "./lib/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    returnNull: false;
  }
}
