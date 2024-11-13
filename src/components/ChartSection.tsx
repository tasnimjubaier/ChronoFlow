"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface TaskStats {
  task: string;
  completed: number;
  total: number;
  completionRate: number;
}

interface ChartSectionProps {
  taskStats: TaskStats[];
}

const ChartSection = ({ taskStats }: ChartSectionProps) => {
  return (
    <div className="h-64 mb-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={taskStats}>
          <XAxis dataKey="task" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#E5E7EB" name="Total Allocated Hours" />
          <Bar dataKey="completed" fill="#4F46E5" name="Hours Completed" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSection;