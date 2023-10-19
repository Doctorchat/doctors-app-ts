import Chart from "react-apexcharts";
import { ChartDonutProps } from "../types";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui";

const CardItemSkeleton: React.FC = () => {
  return (
    <div className="flex-column flex gap-1">
      <Skeleton className="h-10 w-full" />
    </div>
  );
};

const ChartDonut: React.FC<ChartDonutProps> = ({ loading, data }) => {
  const { t } = useTranslation();
  if (loading) {
    return (
      <div className="space-y-3">
        <CardItemSkeleton />
        <CardItemSkeleton />
        <CardItemSkeleton />
      </div>
    );
  }

  return (
    <Chart
      options={{
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
            },
          },
        ],
        legend: {
          position: "bottom",
          markers: {
            fillColors: ["rgb(0, 102, 255)", "rgb(239, 68, 68)"],
          },
        },
        labels: [t("profile:likes"), t("profile:dislikes")],
        yaxis: {
          labels: {
            align: "center",
          },
        },

        fill: {
          colors: ["rgb(0, 102, 255)", "rgb(239, 68, 68)"],
        },
      }}
      series={[data?.likes ?? 1, data?.dislikes ?? 0]}
      height="90%"
      type="donut"
    />
  );
};

export default ChartDonut;
