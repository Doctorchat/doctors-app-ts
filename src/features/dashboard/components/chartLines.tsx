import Chart from "react-apexcharts";
import { ChartsLineProps } from "../types";
import { generateMonthlyData } from "../utils/generateMonthlyData";
import { useTranslation } from "react-i18next";

const BasicLine: React.FC<ChartsLineProps> = ({ loading, data }) => {
  const monthlyData = generateMonthlyData(data);
  const { t } = useTranslation();
  const datas = [
    {
      name: t("conversations:chats_closed"),
      data: monthlyData,
    },
  ];

  return (
    <Chart
      options={{
        chart: {
          type: "line",
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },

        xaxis: {
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },
      }}
      series={datas}
      height={140}
      minHeight={140}
    />
  );
};

export default BasicLine;
