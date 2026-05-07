"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const sharedToolbar = {
  show: false,
};

const lineOptions: ApexOptions = {
  chart: {
    id: "admin-cohort-fill-progress",
    toolbar: sharedToolbar,
    zoom: { enabled: false },
    sparkline: { enabled: false },
  },
  stroke: {
    curve: "smooth",
    width: 3,
    colors: ["#491B27"],
  },
  markers: {
    size: 5,
    strokeWidth: 3,
    strokeColors: "#491B27",
    colors: ["#B8965A"],
    hover: {
      size: 6,
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    borderColor: "rgba(109, 66, 160, 0.12)",
    strokeDashArray: 4,
    padding: {
      left: 12,
      right: 12,
      top: 10,
      bottom: 0,
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.22,
      opacityTo: 0.04,
      stops: [0, 100],
      colorStops: [],
    },
  },
  xaxis: {
    categories: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
    labels: {
      style: {
        colors: "#998ead",
        fontSize: "12px",
      },
    },
    axisBorder: {
      show: true,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    min: 0,
    max: 1000,
    tickAmount: 4,
    labels: {
      style: {
        colors: "#998ead",
        fontSize: "12px",
      },
      formatter: (value) => `${Math.round(value)}`,
    },
    axisBorder: {
      show: true,
    },
  },
  tooltip: {
    theme: "light",
  },
  legend: {
    show: false,
  },
};

const registrationOptions: ApexOptions = {
  chart: {
    type: "donut",
    toolbar: sharedToolbar,
  },
  labels: ["Complete", "Not Complete", "Pending"],
  colors: ["var(--color-burgundy)", "var(--color-deepGold)", "#e5d6f7"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 0,
  },
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: "0%",
      },
    },
  },
  tooltip: {
    theme: "light",
  },
};

const paymentOptions: ApexOptions = {
  chart: {
    type: "donut",
    toolbar: sharedToolbar,
  },
  labels: ["Paid", "Failed", "Refund"],
  colors: ["var(--color-burgundy)", "var(--color-deepGold)", "var(--color-warmCreamy)"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 0,
  },
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: "0%",
      },
    },
  },
  tooltip: {
    theme: "light",
  },
};

export function AdminLineChart({
  labels = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"],
  series = [0, 0, 0, 0, 0, 0, 0, 0],
  maxY,
}: {
  labels?: string[];
  series?: number[];
  maxY?: number;
}) {
  const dynamicOptions: ApexOptions = {
    ...lineOptions,
    xaxis: {
      ...lineOptions.xaxis,
      categories: labels,
    },
    yaxis: {
      ...lineOptions.yaxis,
      max: maxY ?? Math.max(...series, 10),
      tickAmount: 4,
    },
  };

  return (
    <div className="admin-apex-chart admin-apex-chart--line">
      <Chart
        type="area"
        height="100%"
        series={[
          {
            name: "Registrations",
            data: series,
          },
        ]}
        options={dynamicOptions}
      />
    </div>
  );
}

export function AdminRegistrationDonutChart({
  series = [63, 25, 12],
}: {
  series?: number[];
}) {
  const isAllZero = !series || series.every((val) => val === 0);
  const finalSeries = isAllZero ? [100] : series;
  const finalOptions: ApexOptions = {
    ...registrationOptions,
    colors: isAllZero ? ["#9CA3AF"] : registrationOptions.colors,
    tooltip: {
      ...registrationOptions.tooltip,
      enabled: !isAllZero,
    },
  };

  return (
    <div className="admin-apex-chart admin-apex-chart--donut">
      <Chart
        type="donut"
        height={180}
        series={finalSeries}
        options={finalOptions}
      />
    </div>
  );
}

export function AdminPaymentDonutChart({
  series = [50, 35, 25],
}: {
  series?: number[];
}) {
  const isAllZero = !series || series.every((val) => val === 0);
  const finalSeries = isAllZero ? [100] : series;
  const finalOptions: ApexOptions = {
    ...paymentOptions,
    colors: isAllZero ? ["#9CA3AF"] : paymentOptions.colors,
    tooltip: {
      ...paymentOptions.tooltip,
      enabled: !isAllZero,
    },
  };

  return (
    <div className="admin-apex-chart admin-apex-chart--donut">
      <Chart
        type="donut"
        height={180}
        series={finalSeries}
        options={finalOptions}
      />
    </div>
  );
}
