import React, { useState } from 'react';
import { mockTasks } from '../mocks/activitiesData';
import type { TaskItem } from '../mocks/activitiesData';
import { 
  Plus, Search, Filter, CheckCircle2, 
  Clock, Calendar, User, Building2, Tag 
} from 'lucide-react';

export const TasksActivities: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          const nextStatus: TaskItem['status'] = 
            task.status === 'Completed' ? 'Pending' : 'Completed';
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.clientOrLead.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityBadge = (priority: TaskItem['priority']) => {
    switch (priority) {
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">Medium</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Low</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks & Activities</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage operational team tasks, client follow-ups, and deliverables.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Create Task
        </button>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search task or client name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === status 
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredTasks.map((task) => (
            <div 
              key={task.id} 
              className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                task.status === 'Completed' ? 'bg-slate-50/50 dark:bg-slate-900/20' : 'hover:bg-slate-50/80 dark:hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => toggleTaskStatus(task.id)}
                  className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  <CheckCircle2 className={`w-5 h-5 ${task.status === 'Completed' ? 'text-emerald-500 fill-emerald-100 dark:fill-emerald-950' : ''}`} />
                </button>
                <div>
                  <h3 className={`text-sm font-semibold ${task.status === 'Completed' ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>
                    {task.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Building2 className="w-3 h-3"/> {task.clientOrLead}</span>
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3"/> {task.category}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3"/> {task.assignedTo}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pl-8 sm:pl-0">
                {getPriorityBadge(task.priority)}
                <div className="text-right text-xs">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400"/> {task.dueDate}
                  </p>
                  <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3"/> {task.dueTime}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};