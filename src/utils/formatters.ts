export const round = (value = 0, decimals = 2) => {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
};

export const removeFractionalDecimals = (value: number, decimals = 2) => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};
