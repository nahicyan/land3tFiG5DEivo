// client/src/components/ui/charts.jsx
import React from "react";
import { BarChart as BaseBarChart, LineChart as BaseLineChart, AreaChart as BaseAreaChart } from "@tremor/react";

export function BarChart(props) {
  return <BaseBarChart {...props} />;
}

export function LineChart(props) {
  return <BaseLineChart {...props} />;
}

export function AreaChart(props) {
  return <BaseAreaChart {...props} />;
}