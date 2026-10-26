import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { TaskItem } from '../mocks/activitiesData';
import { 
  Calendar as CalendarIcon, Clock, Plus, Building2, User, 
  X, Loader2, AlertCircle 
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const [events, setEvents] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    clientOrLead: '',
    category: 'Call' as TaskItem['category'],
    priority: 'Medium' as TaskItem['priority'],
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '10:00 AM',
    assignedTo: 'Piyush Swarnani',
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const tasks = await apiClient.getTasks();
      setEvents(tasks);
    } catch (err: any) {
      console.error('Failed to load scheduled events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      title: '',
      clientOrLead: '',
      category: 'Meeting',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '10:00 AM',
      assignedTo: 'Piyush Swarnani',
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
  };

  const handleScheduleFollowup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Event title is required.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      const payload = {
        id: `task-${Date.now()}`,
        title: formData.title.trim(),
        clientOrLead: formData.clientOrLead.trim() || 'Internal BLENDIGITAL',
        category: formData.category,
        priority: formData.priority,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        assignedTo: formData.assignedTo,
        assignee: formData.assignedTo,
      };

      await apiClient.createTask(payload);
      await fetchEvents();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('Error scheduling follow-up:', err);
      setErrorMessage(err.message || 'Failed to schedule event.');
    } finally {
      setSubmitting(false);
    }
  };

  // Schedule aggregation
  const scheduleDays = [
    { day: "Mon", date: "Oct 26, 2026", active: true },
    { day: "Tue", date: "Oct 27, 2026", active: false },
    { day: "Wed", date: "Oct 28, 2026", active: false },
    { day: "Thu", date: "Oct 29, 2026", active: false },
    { day: "Fri", date: "Oct 30, 2026", active: false },
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
        <button 
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
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
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
              Loading schedule...
            </div>
          ) : events.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-600 dark:text-slate-300">No upcoming scheduled events.</p>
              <p className="text-xs text-slate-400 mt-1">Click "Schedule Follow-up" above to add your first event.</p>
            </div>
          ) : (
            events.map((event) => (
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
            ))
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Schedule Follow-up</h2>
                  <p className="text-xs text-slate-500">Plan a client call, review, or milestone deadline</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleFollowup} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Event / Follow-up Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Milestone Presentation with Nexa"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Client / Account Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nexa Digital"
                  value={formData.clientOrLead}
                  onChange={(e) => setFormData({ ...formData, clientOrLead: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Event Type
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Call">Phone Call</option>
                    <option value="Proposal">Proposal Review</option>
                    <option value="Billing">Billing Follow-up</option>
                    <option value="Code Review">Code Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assigned Rep
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Piyush Swarnani">Piyush Swarnani</option>
                    <option value="Alex Rivera">Alex Rivera</option>
                    <option value="Elena Rostova">Elena Rostova</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    placeholder="10:00 AM"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={submitting}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-sm font-medium rounded-lg transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? 'Scheduling...' : 'Save to Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};