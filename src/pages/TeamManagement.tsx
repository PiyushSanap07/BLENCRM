import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/api';
import { 
  Plus, Mail, Shield, UserCheck, Clock, 
  Trash2, X, Loader2, AlertCircle, User 
} from 'lucide-react';
import { ConfirmDialog, useToast } from '../components/DialogSystem';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Sales Manager' | 'Developer' | 'Accountant' | 'Support';
  status: 'Active' | 'Pending';
}

export const TeamManagement: React.FC = () => {
  const { showToast } = useToast();
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Developer' as TeamMember['role'],
    status: 'Active' as TeamMember['status'],
  });

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getTeam();
      setTeam(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Failed to load team members:', err);
      setTeam([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleOpenModal = () => {
    setFormData({
      name: '',
      email: '',
      role: 'Developer',
      status: 'Active',
    });
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setErrorMessage('');
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Name and Email are required.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      const payload = {
        id: `tm-${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status,
      };

      await apiClient.createTeamMember(payload);
      await fetchTeam();
      setIsModalOpen(false);
      showToast('Team member added successfully!', 'success');
    } catch (err: any) {
      console.error('Error adding team member:', err);
      setErrorMessage(err.message || 'Failed to add team member.');
      showToast(err.message || 'Failed to add team member', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMember = (id: string, name: string) => {
    setMemberToDelete({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      await apiClient.deleteTeamMember(memberToDelete.id);
      setTeam(prev => prev.filter(m => m.id !== memberToDelete.id));
      showToast(`Removed ${memberToDelete.name} from the team`, 'success');
    } catch (err: any) {
      showToast(`Error removing member: ${err.message}`, 'error');
    } finally {
      setMemberToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage internal staff accounts, roles, and CRM access permissions.
          </p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-lg text-sm font-medium transition-all shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add to Team
        </button>
      </div>

      {/* Team Member Cards / List */}
      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
              Loading team directory...
            </div>
          ) : team.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">
              <p className="font-medium text-slate-600 dark:text-slate-300">No team members registered.</p>
              <p className="text-xs text-slate-400 mt-1">Click "Add to Team" above to grant workspace access.</p>
            </div>
          ) : (
            team.map((member: TeamMember) => (
              <div key={member.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 font-bold text-sm">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{member.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {member.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                    <Shield className="w-3 h-3 text-blue-500" /> {member.role}
                  </span>
                  
                  {member.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      <UserCheck className="w-3 h-3"/> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      <Clock className="w-3 h-3"/> Pending
                    </span>
                  )}

                  <button
                    onClick={() => handleDeleteMember(member.id, member.name)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors cursor-pointer ml-1"
                    title="Remove Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Team Member Modal */}
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
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add Team Member</h2>
                  <p className="text-xs text-slate-500">Provide user credentials and assign system role</p>
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
            <form onSubmit={handleAddMember} className="p-5 space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Work Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="sarah@blendigital.io"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    System Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Super Admin">Super Admin</option>
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Developer">Developer</option>
                    <option value="Accountant">Accountant</option>
                    <option value="Support">Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending Invitation</option>
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
                  {submitting ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Remove Dialog */}
      <ConfirmDialog
        open={!!memberToDelete}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${memberToDelete?.name} from the team? They will lose access to the CRM.`}
        confirmLabel="Remove Member"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setMemberToDelete(null)}
      />
    </div>
  );
};