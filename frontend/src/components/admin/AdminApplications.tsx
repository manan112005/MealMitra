import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Eye, Clock, ShieldAlert } from 'lucide-react';

export const AdminApplications: React.FC = () => {
  const { users, updateUserStatus } = useAuth();
  
  // Filter for pending cook or delivery applications
  const pendingApps = users.filter(u => u.status === 'pending' && (u.role === 'cook' || u.role === 'delivery'));
  const approvedApps = users.filter(u => u.status === 'approved' && (u.role === 'cook' || u.role === 'delivery'));

  const handleApprove = (id: string) => {
    updateUserStatus(id, 'approved');
  };

  const handleReject = (id: string) => {
    updateUserStatus(id, 'rejected');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">Pending Applications</h2>
          <p className="text-[#564337] mt-1">Review and approve new Cook and Delivery Partner registrations</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-100">
          <Clock className="w-4 h-4" />
          {pendingApps.length} Pending Review
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-2xs overflow-hidden">
        {pendingApps.length === 0 ? (
          <div className="p-12 text-center text-[#564337]">
            <ShieldAlert className="w-12 h-12 text-[#dcc1b1] mx-auto mb-3" />
            <p className="font-semibold text-lg">No pending applications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#faf9f8] text-[#564337] font-semibold border-b border-[#dcc1b1]/50">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeeeed]">
                {pendingApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#faf9f8] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={app.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-[#1a1c1c]">{app.name}</p>
                          <p className="text-xs text-[#564337]">ID: {app.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${
                        app.role === 'cook' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {app.role === 'cook' ? 'Home Cook' : 'Delivery Partner'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[#1a1c1c] font-medium">{app.phone}</p>
                      <p className="text-xs text-[#564337]">{app.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 text-yellow-600 font-semibold text-xs bg-yellow-50 px-2 py-1 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-[#564337] hover:bg-[#eeeeed] rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleApprove(app.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleReject(app.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Recently Approved Section */}
      {approvedApps.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-[#1a1c1c] mb-4">Recently Approved</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedApps.slice(0, 3).map(app => (
              <div key={app.id} className="bg-white p-4 rounded-xl border border-[#eeeeed] flex items-center gap-3">
                <img src={app.avatar} alt="" className="w-12 h-12 rounded-full" />
                <div>
                  <p className="font-bold text-[#1a1c1c]">{app.name}</p>
                  <p className="text-xs text-[#564337] uppercase tracking-wider">{app.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
