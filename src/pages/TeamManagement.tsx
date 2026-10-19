import React from 'react';
import { Plus, Mail, Shield, UserCheck } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Sales Manager' | 'Developer' | 'Accountant';
  status: 'Active' | 'Pending';
}

const mockTeam: TeamMember[] = [
  { id: '1', name: 'Piyush Swarnani', email: 'piyush@blendigital.io', role: 'Super Admin', status: 'Active' },
  { id: '2', name: 'Alex Rivera', email: 'alex@blendigital.io', role: 'Sales Manager', status: 'Active' },
  { id: '3', name: 'Elena Rostova', email: 'elena@blendigital.io', role: 'Accountant', status: 'Active' },
];

export const TeamManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Team Management</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage internal staff accounts, roles, and CRM access permissions.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Invite Team Member
        </button>
      </div>

      <div className="bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {mockTeam.map((member: TeamMember) => (
            <div key={member.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
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

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                  <Shield className="w-3 h-3 text-blue-500" /> {member.role}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <UserCheck className="w-3 h-3"/> {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};