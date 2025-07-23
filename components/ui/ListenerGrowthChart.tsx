"use client";

import * as React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

const data = [
  { year: "2022", listeners: 1.2, genreAvg: 1.0 },
  { year: "2023", listeners: 1.4, genreAvg: 1.3 },
  { year: "2024", listeners: 1.9, genreAvg: 1.5 },
  { year: "2025", listeners: 2.4, genreAvg: 1.6 }
];

export const ListenerGrowthChart = () => {
  return (
    <div className="w-full h-64 relative">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: -40, bottom: 10 }}
        >
          <XAxis
            dataKey="year"
            tick={{ fontSize: 14 }}
            axisLine
            tickLine={false}
          />
          <YAxis
            axisLine={true}     
            tickLine={false}   
            tick={false}      
          />
          <Line
            type="monotone"
            dataKey="listeners"
            stroke="black"
            strokeWidth={1}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            strokeOpacity={1}
            style={{
              filter: "drop-shadow(0px 2px 2px rgba(144, 238, 144, 0.4))"
            }}
          />
          <Line
            type="monotone"
            dataKey="genreAvg"
            stroke="black"
            strokeWidth={1}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
            strokeOpacity={1}
            style={{
              filter: "drop-shadow(0px 2px 2px rgba(255, 99, 132, 0.3))"
            }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="absolute bottom-11 right-3 text-xs space-y-1">
        <div className="flex items-center gap-2 text-black">
          <span className="w-3.5 h-3.5 rounded-full bg-green-200" />
          2.41M Monthly Listeners
        </div>
        <div className="flex items-center gap-2 text-black">
          <span className="w-3.5 h-3.5 rounded-full bg-rose-200" />
          Average Genre Monthly Listeners
        </div>
      </div>
    </div>
  );
};
