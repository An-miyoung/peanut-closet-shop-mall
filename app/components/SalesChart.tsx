"use client";

import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatPrice } from "@utils/formatPrice";

interface Props {
  data: {
    day: string;
    sale: number;
  }[];
}

export default function SalesChart({ data }: Props) {
  return (
    <LineChart
      margin={{ left: 30, top: 20 }}
      width={500}
      height={300}
      data={data}
    >
      <Line type="monotone" dataKey="sale" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Tooltip formatter={(value, name) => [formatPrice(+value), name]} />
      <XAxis dataKey="day" />
      <YAxis dataKey="sale" tickFormatter={(value) => formatPrice(value)} />
    </LineChart>
  );
}
