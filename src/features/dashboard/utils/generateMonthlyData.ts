interface MonthlyData {
  [key: string]: number;
}

export const generateMonthlyData = (data: MonthlyData = {}): number[] => {
  const monthlyData: number[] = new Array(12).fill(0);

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const [year, month] = key.split("-");

      if (year && month) {
        const monthIndex = parseInt(month, 10) - 1;
        if (monthlyData.hasOwnProperty(monthIndex)) {
          monthlyData[monthIndex] += data[key];
        }
      }
    }
  }

  return monthlyData;
};
