"use client";

import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import of ChartSection with no SSR
const ChartSection = dynamic(() => import('./ChartSection'), {
  ssr: false,
  loading: () => <div className="h-64 mb-6 bg-gray-100 animate-pulse rounded-lg" />
});

type TaskType = 'work' | 'study' | 'break';

interface ScheduleItem {
  id: number;
  time: string;
  task: string;
  type: TaskType;
  taskId: string;
  completed: boolean;
  progress: number;
  duration: number;
}

interface TaskStats {
  task: string;
  completed: number;
  total: number;
  completionRate: number;
}

interface Statistics {
  taskStats: TaskStats[];
  totalCompletion: number;
}

const initialScheduleItems: ScheduleItem[] = [
  { 
    id: 1,
    time: "6:00 PM - 7:00 PM", 
    task: "Work", 
    type: "work",
    taskId: "W1",
    completed: false,
    progress: 0,
    duration: 1
  },
  { 
    id: 2,
    time: "7:00 PM - 8:00 PM", 
    task: "Work", 
    type: "work",
    taskId: "W2",
    completed: false,
    progress: 0,
    duration: 1
  },
  { 
    id: 3,
    time: "8:00 PM - 8:30 PM", 
    task: "Break/Dinner", 
    type: "break",
    taskId: "B1",
    completed: false,
    progress: 0,
    duration: 0.5
  },
  { 
    id: 4,
    time: "8:30 PM - 9:30 PM", 
    task: "Work", 
    type: "work",
    taskId: "W3",
    completed: false,
    progress: 0,
    duration: 1
  },
  { 
    id: 5,
    time: "9:30 PM - 10:30 PM", 
    task: "Work", 
    type: "work",
    taskId: "W4",
    completed: false,
    progress: 0,
    duration: 1
  },
  { 
    id: 6,
    time: "10:30 PM - 11:30 PM", 
    task: "Study", 
    type: "study",
    taskId: "S1",
    completed: false,
    progress: 0,
    duration: 1
  },
  { 
    id: 7,
    time: "11:30 PM - 12:00 AM", 
    task: "Study", 
    type: "study",
    taskId: "S2",
    completed: false,
    progress: 0,
    duration: 0.5
  }
];

const ChronoFlow: React.FC = () => {
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(initialScheduleItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('chronoflow-schedule');
    if (saved) {
      setScheduleItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('chronoflow-schedule', JSON.stringify(scheduleItems));
    }
  }, [scheduleItems, mounted]);

  const handleProgressChange = (id: number, value: string): void => {
    setScheduleItems(items => 
      items.map(item => 
        item.id === id ? { ...item, progress: parseFloat(value) } : item
      )
    );
  };

  const toggleComplete = (id: number): void => {
    setScheduleItems(items =>
      items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const getColorForType = (type: TaskType): string => {
    switch(type) {
      case 'work':
        return 'bg-blue-100 border-l-4 border-blue-500';
      case 'study':
        return 'bg-green-100 border-l-4 border-green-500';
      case 'break':
        return 'bg-orange-100 border-l-4 border-orange-500';
      default:
        return 'bg-gray-100';
    }
  };

  const calculateStats = (): Statistics => {
    const taskTypes: TaskType[] = ['work', 'study', 'break'];
    const stats = taskTypes.map(type => {
      const typeItems = scheduleItems.filter(item => item.type === type);
      const totalProgress = typeItems.reduce((sum, item) => 
        sum + (item.progress * item.duration), 0);
      const totalHours = typeItems.reduce((sum, item) => sum + item.duration, 0);
      
      return {
        task: type.charAt(0).toUpperCase() + type.slice(1),
        completed: totalProgress,
        total: totalHours,
        completionRate: (totalProgress / totalHours) * 100
      };
    });

    const totalCompletedHours = scheduleItems.reduce((sum, item) => 
      sum + (item.progress * item.duration), 0);
    const totalPossibleHours = scheduleItems.reduce((sum, item) => 
      sum + item.duration, 0);

    return {
      taskStats: stats,
      totalCompletion: (totalCompletedHours / totalPossibleHours) * 100
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Top Section - Schedule */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center gap-2 text-xl font-bold">
            <Clock className="h-6 w-6" />
            Evening Schedule (6 PM - 12 AM)
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {scheduleItems.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-lg shadow-sm ${getColorForType(item.type)} ${
                  item.completed ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() => toggleComplete(item.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <h3 className={`font-semibold text-lg ${
                        item.completed ? 'line-through' : ''
                      }`}>
                        {item.task}
                      </h3>
                    </div>
                    <p className="text-gray-600">{item.time}</p>
                    <p className="text-sm text-gray-500">Task ID: {item.taskId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Progress:</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={item.progress}
                      onChange={(e) => handleProgressChange(item.id, e.target.value)}
                      className="w-24"
                    />
                    <span className="text-sm w-12">{(item.progress * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section - Statistics */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="text-xl font-bold">Task Statistics</div>
        </div>
        <div className="p-6">
          {mounted && <ChartSection taskStats={stats.taskStats} />}

          {/* Completion Statistics */}
          <div className="space-y-4">
            <h3 className="font-semibold">Task Completion Rates:</h3>
            {stats.taskStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{stat.task}:</span>
                <span className="font-medium">
                  {stat.completionRate.toFixed(1)}% 
                  ({stat.completed.toFixed(1)}/{stat.total} hours)
                </span>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center font-semibold">
                <span>Overall Completion Rate:</span>
                <span>{stats.totalCompletion.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChronoFlow;