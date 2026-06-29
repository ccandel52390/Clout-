"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface ChartProps {
  data: { date: string; count: number }[];
}

export function PicksTrendChart({ data }: ChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#666" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            stroke="#666" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "8px" }}
            itemStyle={{ color: "#00d1ff" }}
          />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#00d1ff" 
            strokeWidth={3} 
            dot={{ r: 4, fill: "#00d1ff" }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

interface NicheData {
  name: string;
  count: number;
}

export function NicheBreakdownChart({ data }: { data: NicheData[] }) {
  const COLORS = ["#00d1ff", "#00ff94", "#ffb800", "#ff4b00", "#a855f7", "#ec4899"];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="name" 
            stroke="#fff" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            width={80}
          />
          <Tooltip 
            cursor={{ fill: "transparent" }}
            contentStyle={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "8px" }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
