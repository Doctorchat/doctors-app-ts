import type { ApexOptions } from "apexcharts";

export const DIR_RTL = "rtl";
export const DIR_LTR = "ltr";
export const MODE_LIGHT = "light";
export const MODE_DARK = "dark";
export const LAYOUT_TYPE_CLASSIC = "classic";
export const LAYOUT_TYPE_MODERN = "modern";
export const LAYOUT_TYPE_STACKED_SIDE = "stackedSide";
export const LAYOUT_TYPE_DECKED = "decked";
export const LAYOUT_TYPE_SIMPLE = "simple";
export const LAYOUT_TYPE_BLANK = "blank";
export const NAV_MODE_LIGHT = "light";
export const NAV_MODE_DARK = "dark";
export const NAV_MODE_THEMED = "themed";
export const NAV_MODE_TRANSPARENT = "transparent";

export const SIDE_NAV_WIDTH = 290;
export const SIDE_NAV_COLLAPSED_WIDTH = 80;
export const SPLITTED_SIDE_NAV_MINI_WIDTH = 80;
export const SPLITTED_SIDE_NAV_SECONDARY_WIDTH = 250;
export const SIDE_NAV_CONTENT_GUTTER = "px-4";
export const LOGO_X_GUTTER = "px-6";
export const HEADER_HEIGHT_CLASS = "h-16";
export const PAGE_CONTAINER_GUTTER_X = "px-4 sm:px-6 md:px-8";
export const PAGE_CONTAINER_GUTTER_Y = "py-4 sm:py-6 md:px-8";

export const THEME_ENUM = {
  DIR_RTL: DIR_RTL,
  DIR_LTR: DIR_LTR,
  MODE_LIGHT: MODE_LIGHT,
  MODE_DARK: MODE_DARK,
  LAYOUT_TYPE_CLASSIC: LAYOUT_TYPE_CLASSIC,
  LAYOUT_TYPE_MODERN: LAYOUT_TYPE_MODERN,
  LAYOUT_TYPE_SIMPLE: LAYOUT_TYPE_SIMPLE,
  LAYOUT_TYPE_STACKED_SIDE: LAYOUT_TYPE_STACKED_SIDE,
  LAYOUT_TYPE_DECKED: LAYOUT_TYPE_DECKED,
  LAYOUT_TYPE_BLANK: LAYOUT_TYPE_BLANK,
  SIDE_NAV_WIDTH: SIDE_NAV_WIDTH,
  SIDE_NAV_COLLAPSED_WIDTH: SIDE_NAV_COLLAPSED_WIDTH,
  SPLITTED_SIDE_NAV_MINI_WIDTH: SPLITTED_SIDE_NAV_MINI_WIDTH,
  SPLITTED_SIDE_NAV_SECONDARY_WIDTH: SPLITTED_SIDE_NAV_SECONDARY_WIDTH,
  HEADER_HEIGHT_CLASS: HEADER_HEIGHT_CLASS,
  NAV_MODE_LIGHT: NAV_MODE_LIGHT,
  NAV_MODE_DARK: NAV_MODE_DARK,
  NAV_MODE_THEMED: NAV_MODE_THEMED,
  NAV_MODE_TRANSPARENT: NAV_MODE_TRANSPARENT,
} as const;

export type Direction = "ltr" | "rtl";
export type Mode = "light" | "dark";
export type NavMode = "transparent" | "light" | "dark" | "themed";
export type ControlSize = "lg" | "md" | "sm";
export type LayoutType = "blank" | "classic" | "modern" | "simple" | "decked" | "stackedSide";
export type ColorLevel = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export const apexLineChartDefaultOption: ApexOptions = {
  chart: {
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },

  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 2.5,
    curve: "smooth",
    lineCap: "round",
  },
  legend: {
    itemMargin: {
      vertical: 10,
    },
    tooltipHoverFormatter: function (val, opts) {
      return val + " - " + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + "";
    },
  },
  xaxis: {
    categories: [],
  },
};

export const apexAreaChartDefaultOption = { ...apexLineChartDefaultOption };

export const apexBarChartDefaultOption: ApexOptions = {
  chart: {
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "30px",
      borderRadius: 2,
    },
  },

  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 6,
    curve: "smooth",
    colors: ["transparent"],
  },
  legend: {
    itemMargin: {
      vertical: 10,
    },
    tooltipHoverFormatter: function (val, opts) {
      return val + " - " + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + "";
    },
  },
  xaxis: {
    categories: [],
  },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: (val) => `${val}`,
    },
  },
};

export const apexDonutChartDefaultOption: ApexOptions = {
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true,
            label: "",
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a: string, b: string) => {
                return a + b;
              }, 0);
            },
          },
        },
        size: "85%",
      },
    },
  },
  stroke: {
    colors: ["transparent"],
  },
  labels: [],
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
};

export const apexSparklineChartDefultOption: ApexOptions = {
  chart: {
    type: "line",
    sparkline: {
      enabled: true,
    },
  },
  stroke: {
    width: 2,
    curve: "smooth",
  },
  tooltip: {
    fixed: {
      enabled: false,
    },
    x: {
      show: false,
    },
    y: {
      title: {
        formatter: function () {
          return "";
        },
      },
    },
    marker: {
      show: false,
    },
  },
};
