import React, { useState } from 'react';
import { useAuth, AuthUser } from '../../context/AuthContext';
import { Check, X, Eye, Clock, ShieldAlert, ChefHat, Bike, Phone, Mail, MapPin, Award, FileText, CheckCircle2, XCircle } from 'lucide-react';

import { AvatarImage } from './AdminUsers';

export const AdminApplications: React.FC = () => {
  const { users, updateUserStatus } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedApplicant, setSelectedApplicant] = useState<AuthUser | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'approve' | 'reject'; text: string } | null>(null);

  // Filter applications for cooks and delivery partners
  const allPartnerApps = users.filter(u => u.role === 'cook' || u.role === 'delivery');
  const pendingApps = allPartnerApps.filter(u => u.status === 'pending');
  const approvedApps = allPartnerApps.filter(u => u.status === 'approved');
  const rejectedApps = allPartnerApps.filter(u => u.status === 'rejected');

  const displayedApps = activeFilter === 'pending'
    ? pendingApps
    : activeFilter === 'approved'
    ? approvedApps
    : activeFilter === 'rejected'
    ? rejectedApps
    : allPartnerApps;

  const showNotification = (type: 'approve' | 'reject', text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApprove = (user: AuthUser) => {
    updateUserStatus(user.id, 'approved');
    showNotification('approve', `Approved ${user.name} (${user.role === 'cook' ? 'Home Cook' : 'Delivery Partner'}) successfully!`);
    if (selectedApplicant?.id === user.id) {
      setSelectedApplicant({ ...user, status: 'approved' });
    }
  };

  const handleReject = (user: AuthUser) => {
    updateUserStatus(user.id, 'rejected');
    showNotification('reject', `Rejected application for ${user.name}.`);
    if (selectedApplicant?.id === user.id) {
      setSelectedApplicant({ ...user, status: 'rejected' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`p-4 rounded-2xl flex items-center justify-between shadow-lg border transition-all ${
          toastMessage.type === 'approve' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}>
          <div className="flex items-center gap-2.5">
            {toastMessage.type === 'approve' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <p className="text-sm font-bold">{toastMessage.text}</p>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-stone-400 hover:text-stone-600 font-bold text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">Partner Onboarding & Verification</h2>
          <p className="text-[#564337] mt-1">Review new Home Cook and Delivery Partner registration applications</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-2 bg-amber-50 text-amber-800 rounded-xl border border-amber-200">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{pendingApps.length} Pending Approval</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-white p-1 rounded-2xl border border-[#dcc1b1]/50 w-full sm:w-fit shadow-xs">
        <button
          onClick={() => setActiveFilter('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'pending' ? 'bg-[#944a00] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" /> Pending Review ({pendingApps.length})
        </button>
        <button
          onClick={() => setActiveFilter('approved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'approved' ? 'bg-[#006e2c] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
          }`}
        >
          <Check className="w-3.5 h-3.5" /> Approved ({approvedApps.length})
        </button>
        <button
          onClick={() => setActiveFilter('rejected')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'rejected' ? 'bg-[#ba1a1a] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
          }`}
        >
          <X className="w-3.5 h-3.5" /> Rejected ({rejectedApps.length})
        </button>
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeFilter === 'all' ? 'bg-[#1a1c1c] text-white shadow-xs' : 'text-[#564337] hover:bg-[#faf9f8]'
          }`}
        >
          All Applications ({allPartnerApps.length})
        </button>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-xs overflow-hidden">
        {displayedApps.length === 0 ? (
          <div className="p-12 text-center text-[#564337]">
            <ShieldAlert className="w-12 h-12 text-[#dcc1b1] mx-auto mb-3" />
            <p className="font-bold text-lg text-[#1a1c1c]">No applications in this category</p>
            <p className="text-xs text-[#564337] mt-1">Everything is verified and up to date.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-[#faf9f8] text-[#564337] font-bold text-xs uppercase border-b border-[#dcc1b1]/40">
                <tr>
                  <th className="px-6 py-4">Applicant Profile</th>
                  <th className="px-6 py-4">Applying Role</th>
                  <th className="px-6 py-4">Verification Credentials</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Approve / Reject Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dcc1b1]/20">
                {displayedApps.map((app) => (
                  <tr key={app.id} className="hover:bg-[#faf9f8]/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <AvatarImage src={app.avatar} name={app.name} variant={app.role === 'cook' ? 'cook' : 'delivery'} className="w-11 h-11" />
                        <div>
                          <p className="font-bold text-[#1a1c1c] text-sm">{app.name}</p>
                          <div className="flex items-center gap-2 text-xs text-[#564337] mt-0.5">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#944a00]" /> {app.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${
                        app.role === 'cook' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {app.role === 'cook' ? <ChefHat className="w-3.5 h-3.5" /> : <Bike className="w-3.5 h-3.5" />}
                        {app.role === 'cook' ? 'Home Cook' : 'Delivery Partner'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5 max-w-[240px]">
                        {app.role === 'cook' ? (
                          <>
                            <p className="font-bold text-[#1a1c1c] truncate">{app.applicationDetails?.kitchenName || 'Home Kitchen'}</p>
                            <p className="text-[#564337] truncate">{app.applicationDetails?.foodCategory || 'Regional Cuisine'}</p>
                            {app.applicationDetails?.fssaiNumber && (
                              <p className="text-[11px] font-mono text-[#006e2c]">FSSAI: {app.applicationDetails.fssaiNumber}</p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="font-bold text-[#1a1c1c] truncate">{app.applicationDetails?.vehicleType || 'Two Wheeler'}</p>
                            {app.applicationDetails?.licenseNumber && (
                              <p className="text-[11px] font-mono text-[#005cb8]">DL: {app.applicationDetails.licenseNumber}</p>
                            )}
                            <p className="text-[#564337] truncate">{app.applicationDetails?.preferredZone || 'Ahmedabad Hub'}</p>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        app.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        app.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-900'
                      }`}>
                        {app.status === 'approved' ? 'Approved' : app.status === 'rejected' ? 'Rejected' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Inspect Details Button */}
                        <button 
                          onClick={() => setSelectedApplicant(app)}
                          className="px-3 py-2 bg-[#f4efe6] hover:bg-[#ebd9c8] text-[#564337] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
                          title="Inspect full application credentials"
                        >
                          <Eye className="w-3.5 h-3.5" /> Details
                        </button>

                        {/* RIGHT BUTTON (Approve) */}
                        <button
                          onClick={() => handleApprove(app)}
                          disabled={app.status === 'approved'}
                          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer ${
                            app.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-400 cursor-not-allowed'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95'
                          }`}
                          title="Approve applicant registration"
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Approve</span>
                        </button>

                        {/* WRONG BUTTON (Reject) */}
                        <button
                          onClick={() => handleReject(app)}
                          disabled={app.status === 'rejected'}
                          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                            app.status === 'rejected'
                              ? 'bg-rose-100 text-rose-300 cursor-not-allowed'
                              : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-95'
                          }`}
                          title="Reject applicant registration"
                        >
                          <X className="w-4 h-4 stroke-[3]" />
                          <span>Reject</span>
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

      {/* Applicant Detail Modal */}
      {selectedApplicant && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-[#dcc1b1]/50 space-y-5">
            <div className="flex items-center justify-between border-b border-[#dcc1b1]/30 pb-3">
              <div>
                <span className="text-xs font-bold text-[#944a00] uppercase tracking-wider">
                  {selectedApplicant.role === 'cook' ? 'Home Chef Application' : 'Delivery Partner Application'}
                </span>
                <h3 className="text-xl font-extrabold text-[#1a1c1c]">{selectedApplicant.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedApplicant(null)}
                className="w-8 h-8 rounded-full bg-[#f4efe6] text-[#1a1c1c] font-bold flex items-center justify-center hover:bg-[#ebd9c8] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-4 p-3 bg-[#faf9f8] rounded-2xl border border-[#dcc1b1]/30">
                <AvatarImage src={selectedApplicant.avatar} name={selectedApplicant.name} variant={selectedApplicant.role === 'cook' ? 'cook' : 'delivery'} className="w-16 h-16 text-xl" />
                <div className="space-y-1">
                  <p className="font-bold text-[#1a1c1c] text-base">{selectedApplicant.name}</p>
                  <p className="text-xs text-[#564337] flex items-center gap-1"><Phone className="w-3 h-3 text-[#944a00]" /> {selectedApplicant.phone}</p>
                  <p className="text-xs text-[#564337] flex items-center gap-1"><Mail className="w-3 h-3 text-[#944a00]" /> {selectedApplicant.email}</p>
                </div>
              </div>

              {selectedApplicant.role === 'cook' ? (
                <div className="space-y-2 p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl">
                  <p className="text-xs font-bold text-emerald-900 uppercase flex items-center gap-1">
                    <ChefHat className="w-4 h-4" /> Kitchen Credentials
                  </p>
                  <p className="text-sm font-bold text-stone-900">
                    Kitchen Name: {selectedApplicant.applicationDetails?.kitchenName || 'Home Kitchen'}
                  </p>
                  <p className="text-xs text-[#564337]">
                    Specialty Cuisine: {selectedApplicant.applicationDetails?.foodCategory || 'Traditional Gujarati'}
                  </p>
                  <p className="text-xs text-[#564337]">
                    Address: {selectedApplicant.applicationDetails?.address || 'Ahmedabad, Gujarat'}
                  </p>
                  {selectedApplicant.applicationDetails?.fssaiNumber && (
                    <p className="text-xs font-mono font-bold text-emerald-800">
                      FSSAI Reg. No: {selectedApplicant.applicationDetails.fssaiNumber}
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                  <p className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1">
                    <Bike className="w-4 h-4" /> Fleet & Vehicle Credentials
                  </p>
                  <p className="text-sm font-bold text-stone-900">
                    Vehicle: {selectedApplicant.applicationDetails?.vehicleType || 'Electric Two Wheeler'}
                  </p>
                  {selectedApplicant.applicationDetails?.licenseNumber && (
                    <p className="text-xs font-mono font-bold text-blue-800">
                      Driving License: {selectedApplicant.applicationDetails.licenseNumber}
                    </p>
                  )}
                  <p className="text-xs text-[#564337]">
                    Preferred Operating Cluster: {selectedApplicant.applicationDetails?.preferredZone || 'Ahmedabad Central'}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-[#dcc1b1]/30">
              <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-lg ${
                selectedApplicant.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                selectedApplicant.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                'bg-amber-100 text-amber-900'
              }`}>
                Current: {selectedApplicant.status}
              </span>

              <div className="flex gap-2">
                {/* Modal Right Button */}
                <button
                  onClick={() => handleApprove(selectedApplicant)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" /> Approve Registration
                </button>
                {/* Modal Wrong Button */}
                <button
                  onClick={() => handleReject(selectedApplicant)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4 stroke-[3]" /> Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

