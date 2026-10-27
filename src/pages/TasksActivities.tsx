import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import type { TaskItem } from '../mocks/activitiesData';
import { 
  Plus, Search, Filter, CheckCircle2, 
  Clock, Calendar, User, Building2, Tag,
  X, Loader2, Trash2, AlertCircle
} from 'lucide-react';
import { ConfirmDialog, useToast } from '../components/DialogSystem';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const TASK_STATUSES: TaskItem['status'][] = ['Pending', 'In Progress', 'Completed'];
const TASK_FILTERS = ['All', ...TASK_STATUSES] as const;

export const TasksActivities: React.FC = () => {
  const { showToast } = useToast();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string; title: string } | null>(null);

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
    dueTime: '02:00 PM',
    assignedTo: '',
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTasks();
      setTasks(data);
    } catch (err: any) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const data = await apiClient.getTeam();
      setTeamMembers(data);
      return data;
    } catch (err: any) {
      console.error('Failed to fetch team members:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTeamMembers();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      title: '',
      clientOrLead: '',
      category: 'Call',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      dueTime: '02:00 PM',
      assignedTo: teamMembers.length > 0 ? teamMembers[0].name : '',
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Task title is required.');
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
      await fetchTasks();
      setIsModalOpen(false);
      showToast('Task created successfully!', 'success');
    } catch (err: any) {
      console.error('Error creating task:', err);
      setErrorMessage(err.message || 'Failed to create task.');
      showToast(err.message || 'Failed to create task', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleTaskStatus = async (taskId: string) => {
    const task = tasks.find(item => item.id === taskId);
    if (!task) return;
    const nextStatus: TaskItem['status'] =
      task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await apiClient.updateTaskStatus(taskId, nextStatus);
      setTasks(prev =>
        prev.map(item => item.id === taskId ? { ...item, status: nextStatus } : item)
      );
      showToast('Task status updated', 'info');
    } catch (err: any) {
      console.error('Failed to update task status in backend:', err);
      showToast('Failed to update task status', 'error');
    }
  };

  const handleTaskStatusChange = async (taskId: string, status: TaskItem['status']) => {
    const task = tasks.find(item => item.id === taskId);
    if (!task || task.status === status) return;

    try {
      await apiClient.updateTaskStatus(taskId, status);
      setTasks(prev =>
        prev.map(item => item.id === taskId ? { ...item, status } : item)
      );
      showToast('Task status updated', 'success');
    } catch (err: any) {
      console.error('Failed to update task status in backend:', err);
      showToast(err.message || 'Failed to update task status', 'error');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    setTaskToDelete({ id: taskId, title: task ? task.title : 'this task' });
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      await apiClient.deleteTask(taskToDelete.id);
      setTasks(prev => prev.filter(t => t.id !== taskToDelete.id));
      showToast('Task deleted successfully', 'success');
    } catch (err: any) {
      showToast(`Error deleting task: ${err.message}`, 'error');
    } finally {
      setTaskToDelete(null);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.clientOrLead && task.clientOrLead.toLowerCase().includes(searchTerm.toLowerCase()));
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
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">{priority}</span>;
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
        <button 
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
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
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-4 h-4 text-slate-400 hidden sm:block" />
          {TASK_FILTERS.map((status) => {
            const count = status === 'All'
              ? tasks.length
              : tasks.filter(task => task.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === status
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                {status} <span className="ml-1 opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
              Loading tasks...
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-600 dark:text-slate-300">No tasks found.</p>
              <p className="text-xs text-slate-400 mt-1">Click "Create Task" above to organize your workflow.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  task.status === 'Completed' ? 'bg-slate-50/50 dark:bg-slate-900/20' : 'hover:bg-slate-50/80 dark:hover:bg-slate-900/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button 
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title={task.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
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
                  <select
                    aria-label={`Update status for ${task.title}`}
                    value={task.status}
                    onChange={(e) => handleTaskStatusChange(task.id, e.target.value as TaskItem['status'])}
                    className="px-2 py-1.5 rounded-lg text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {TASK_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
                  </select>
                  <div className="text-right text-xs">
                    <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400"/> {task.dueDate}
                    </p>
                    <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3"/> {task.dueTime}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors cursor-pointer ml-1"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create New Task</h2>
                  <p className="text-xs text-slate-500">Assign deliverables, meetings, or client follow-ups</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateTask} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule discovery call with TechCorp"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Related Client / Lead Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp / John Doe"
                    value={formData.clientOrLead}
                    onChange={(e) => setFormData({ ...formData, clientOrLead: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Task Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Call">Call</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Billing">Billing</option>
                    <option value="Code Review">Code Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Time
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. 03:00 PM"
                      value={formData.dueTime}
                      onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Team Member
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {teamMembers.length === 0 ? (
                      <option value="">No team members found</option>
                    ) : (
                      teamMembers.map((member) => (
                        <option key={member.id} value={member.name}>{member.name} — {member.role}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Modal Footer */}
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
                  {submitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!taskToDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Task"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};