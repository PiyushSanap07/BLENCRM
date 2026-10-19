import React from 'react';
import { mockTasks } from '../mocks/activitiesData';
import { Calendar as CalendarIcon, Clock, Plus, Building2, User } from 'lucide-react';

export const CalendarView: React.FC = () => {
  // Simple schedule aggregation for demonstration
  const scheduleDays = [
    { day: "Mon", date: "Oct 19, 2026", active: false },
    { day: "Tue", date: "Oct 20, 2026", active: true },
    { day: "Wed", date: "Oct 21, 2026", active: false },
    { day: "Thu", date: "Oct 22, 2026", active: false },
    { day: "Fri", date: "Oct 23, 2026", active: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Calendar & Schedule</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Schedule client meetings, milestone calls, and payment follow-ups.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Schedule Follow-up
        </button>
      </div>

      {/* Week Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {scheduleDays.map((item, idx) => (
          <div 
            key={idx} 
            className={`p-3 rounded-xl border text-center transition-colors ${
              item.active 
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:border-blue-900/50 text-blue-600 dark:text-blue-400' 
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
            }`}
          >
            <p className="text-xs font-semibold uppercase">{item.day}</p>
            <p className="text-sm font-bold mt-1">{item.date}</p>
          </div>
        ))}
      </div>

      {/* Scheduled Events Feed */}
      <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="text-base font-semibold flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
          <CalendarIcon className="w-4 h-4 text-blue-500" /> Upcoming Scheduled Events
        </h2>

        <div className="space-y-3">
          {mockTasks.map((event) => (
            <div 
              key={event.id}
              className="p-4 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                    {event.category}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{event.title}</h3>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3"/> {event.clientOrLead}</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3"/> {event.assignedTo}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                {event.dueDate} at {event.dueTime}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};