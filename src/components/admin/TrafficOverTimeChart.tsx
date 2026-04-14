'use client';

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

export type TrafficDayPoint = {
  date: string;
  label: string;
  page_views: number;
  visitors: number;
};

export function TrafficOverTimeChart({ data }: { data: TrafficDayPoint[] }) {
  if (!data.length) {
    return (
      <p className="text-gray-500 text-sm py-8 text-center">No traffic in this period yet.</p>
    );
  }

  return (
    <div className="h-72 w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6b7280' }} />
          <YAxis
            yAxisId="pv"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            allowDecimals={false}
            width={40}
          />
          <YAxis
            yAxisId="vis"
            orientation="right"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            allowDecimals={false}
            width={36}
          />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
            labelFormatter={(_, payload) => {
              const p = payload?.[0]?.payload as TrafficDayPoint | undefined;
              return p?.date ?? '';
            }}
          />
          <Legend wrapperStyle={{ fontSize: '13px' }} />
          <Area
            yAxisId="pv"
            type="monotone"
            dataKey="page_views"
            name="Page views"
            fill="rgb(14 165 233 / 0.15)"
            stroke="rgb(2 132 199)"
            strokeWidth={2}
          />
          <Line
            yAxisId="vis"
            type="monotone"
            dataKey="visitors"
            name="Visitors"
            stroke="rgb(217 119 6)"
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 4 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
