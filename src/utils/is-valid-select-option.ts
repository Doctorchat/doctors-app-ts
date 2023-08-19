type SelectOption = {
  value: string | number;
};

const isValidSelectOption = (option: string | number | SelectOption): boolean => {
  return Boolean(typeof option === "object" ? option?.value : option);
};

export default isValidSelectOption;