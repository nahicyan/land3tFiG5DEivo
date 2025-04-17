import React from "react";
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

export const BarChart = ({ 
  data, 
  index = "name", 
  categories, 
  colors = ["#3f4f24", "#324c48", "#D4A017", "#9CA3AF"], 
  yAxisWidth = 40,
  showLegend = true,
  valueFormatter = (value) => value,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey={index} 
          tick={{ fontSize: 12, fill: '#6B7280' }} 
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
        />
        <YAxis 
          width={yAxisWidth}
          tick={{ fontSize: 12, fill: '#6B7280' }} 
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
          tickFormatter={valueFormatter}
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            backgroundColor: 'white',
            border: '1px solid #E5E7EB',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
          formatter={(value) => [valueFormatter(value), ""]}
          labelFormatter={(label) => label}
        />
        {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
        
        {categories.map((category, index) => (
          <Bar
            key={category}
            dataKey={category}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
            barSize={30}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};