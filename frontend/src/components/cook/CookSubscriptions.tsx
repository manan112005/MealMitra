import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { SubscriptionPlan } from '../../types';
import {
  Repeat,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Save,
  Clock,
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Check,
  RotateCcw,
  DollarSign,
  AlertCircle,
  HelpCircle,
  X,
  Layers,
  Calendar,
  Users,
} from 'lucide-react';

export const CookSubscriptions: React.FC = () => {
  const { currentCookProfile, getCookSubscriptionPlans, updateCookSubscriptionPlans, subscriptions, setCookTab } = useApp();

  const [plans, setPlans] = useState<SubscriptionPlan[]>(() => {
    return getCookSubscriptionPlans(currentCookProfile.id);
  });

  const cookSubscribersList = useMemo(() => {
    return (subscriptions || []).filter((sub) => {
      if (!currentCookProfile) return false;
      const matchId = Boolean(sub.cookId && sub.cookId === currentCookProfile.id);
      const cookNameNormalized = (currentCookProfile.name || '').toLowerCase().trim();
      const chefNameNormalized = (currentCookProfile.chefName || '').toLowerCase().trim();
      const subCookName = (sub.cookName || '').toLowerCase().trim();
      const matchName = Boolean(
        subCookName &&
        (subCookName === cookNameNormalized ||
          subCookName === chefNameNormalized ||
          (cookNameNormalized && (subCookName.includes(cookNameNormalized) || cookNameNormalized.includes(subCookName))) ||
          (chefNameNormalized && (subCookName.includes(chefNameNormalized) || chefNameNormalized.includes(subCookName))))
      );
      return matchId || matchName;
    });
  }, [subscriptions, currentCookProfile]);

  const [isSaved, setIsSaved] = useState(false);
  const [editingModalPlan, setEditingModalPlan] = useState<SubscriptionPlan | null>(null);

  // New feature / term inputs for in-card quick adds
  const [activeFeatureInputs, setActiveFeatureInputs] = useState<Record<string, string>>({});
  const [activeTermInputs, setActiveTermInputs] = useState<Record<string, string>>({});

  // New Plan form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');
  const [newPlanCategory, setNewPlanCategory] = useState<'Lunch Only' | 'Dinner Only' | 'Lunch + Dinner' | 'Custom'>('Lunch Only');
  const [newPlanType, setNewPlanType] = useState<'Monthly' | '15 Days' | 'Weekly' | 'Yearly'>('Monthly');
  const [newPlanPrice, setNewPlanPrice] = useState<number>(3499);
  const [newPlanMealsCount, setNewPlanMealsCount] = useState<number>(26);
  const [newPlanTimeWindow, setNewPlanTimeWindow] = useState('12:30 PM – 1:30 PM');
  const [newPlanDescription, setNewPlanDescription] = useState('');
  const [newPlanFeatures, setNewPlanFeatures] = useState<string[]>([
    'Fresh daily homemade preparation',
    'Rotating wholesome menu (Sabzi, Dal, 4 Phulkas & Rice)',
    'Dual address delivery (Office / Home)',
    'Pause or skip meals anytime with notice',
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [newPlanTerms, setNewPlanTerms] = useState<string[]>([
    'Skip cutoff: 10:30 AM (Lunch) / 5:30 PM (Dinner)',
    'Valid for selected billing period',
    'Up to 7 days pause allowance without penalty',
  ]);
  const [newTermText, setNewTermText] = useState('');
  const [newPlanIsPopular, setNewPlanIsPopular] = useState(false);

  // Keep local state in sync if cook profile or saved plans change
  useEffect(() => {
    setPlans(getCookSubscriptionPlans(currentCookProfile.id));
  }, [currentCookProfile]);

  const handleSaveAll = (updatedPlans?: SubscriptionPlan[]) => {
    const toSave = updatedPlans || plans;
    setPlans(toSave);
    updateCookSubscriptionPlans(currentCookProfile.id, toSave);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleUpdateField = (planId: string, field: keyof SubscriptionPlan, value: any) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        const updated = { ...p, [field]: value };
        // Auto update billing label if mealsCount or type changed
        if (field === 'type' || field === 'mealsCount') {
          const type = field === 'type' ? value : p.type;
          const count = field === 'mealsCount' ? value : p.mealsCount || 26;
          updated.billingPeriod =
            type === 'Monthly'
              ? `/ month (${count} meals)`
              : type === '15 Days'
              ? `/ 15 days (${count} meals)`
              : type === 'Weekly'
              ? `/ week (${count} meals)`
              : `/ year (${count} meals)`;
        }
        return updated;
      })
    );
  };

  const handleAddFeatureToPlan = (planId: string) => {
    const text = (activeFeatureInputs[planId] || '').trim();
    if (!text) return;
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return { ...p, features: [...p.features, text] };
      })
    );
    setActiveFeatureInputs((prev) => ({ ...prev, [planId]: '' }));
  };

  const handleRemoveFeatureFromPlan = (planId: string, featureIndex: number) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return { ...p, features: p.features.filter((_, idx) => idx !== featureIndex) };
      })
    );
  };

  const handleAddTermToPlan = (planId: string) => {
    const text = (activeTermInputs[planId] || '').trim();
    if (!text) return;
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return { ...p, terms: [...(p.terms || []), text] };
      })
    );
    setActiveTermInputs((prev) => ({ ...prev, [planId]: '' }));
  };

  const handleRemoveTermFromPlan = (planId: string, termIndex: number) => {
    setPlans((prev) =>
      prev.map((p) => {
        if (p.id !== planId) return p;
        return { ...p, terms: (p.terms || []).filter((_, idx) => idx !== termIndex) };
      })
    );
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      const updated = plans.filter((p) => p.id !== planId);
      handleSaveAll(updated);
    }
  };

  const handleTogglePopular = (planId: string) => {
    const updated = plans.map((p) => ({
      ...p,
      isPopular: p.id === planId ? !p.isPopular : false,
    }));
    handleSaveAll(updated);
  };

  // Create New Plan Form handler
  const handleCreateNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanName.trim()) return;

    const billingLabel =
      newPlanType === 'Monthly'
        ? `/ month (${newPlanMealsCount} meals)`
        : newPlanType === '15 Days'
        ? `/ 15 days (${newPlanMealsCount} meals)`
        : newPlanType === 'Weekly'
        ? `/ week (${newPlanMealsCount} meals)`
        : `/ year (${newPlanMealsCount} meals)`;

    const created: SubscriptionPlan = {
      id: `plan-${currentCookProfile.id}-${Date.now()}`,
      cookId: currentCookProfile.id,
      cookName: currentCookProfile.name,
      name: newPlanName.trim(),
      category: newPlanCategory,
      type: newPlanType,
      price: Number(newPlanPrice),
      billingPeriod: billingLabel,
      mealsCount: Number(newPlanMealsCount),
      deliveryTimeWindow: newPlanTimeWindow,
      description:
        newPlanDescription.trim() ||
        `Fresh daily homestyle ${newPlanCategory.toLowerCase()} prepared with love by ${currentCookProfile.name}.`,
      features:
        newPlanFeatures.length > 0
          ? newPlanFeatures
          : ['Fresh hot homestyle meals', 'Daily rotating menu', 'Free doorstep delivery'],
      terms:
        newPlanTerms.length > 0
          ? newPlanTerms
          : ['Skip cutoff: 10:30 AM (Lunch) / 5:30 PM (Dinner)', 'Pause allowance included'],
      isPopular: newPlanIsPopular,
    };

    const updated = [...plans, created];
    handleSaveAll(updated);
    setShowAddModal(false);
    // Reset form
    setNewPlanName('');
    setNewPlanPrice(3499);
    setNewPlanDescription('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Repeat className="w-6 h-6 text-[#944a00]" />
            <span>Kitchen Subscription Plans Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Edit prices, meal counts, lunch/dinner slots, descriptions, included features, and skip policies. All updates reflect live to customers!
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-[#51634c] hover:bg-[#3d4b39] text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Plan</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="px-5 py-2.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {isSaved && (
        <div className="p-4 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-2xl flex items-center gap-2.5 shadow-sm animate-in fade-in border border-[#51634c]/30">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>🎉 Changes saved successfully! Your updated subscription plans and rates are now LIVE for customers!</span>
        </div>
      )}

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs">
          <div className="text-xs font-bold text-[#564337]">Active Plans Offered</div>
          <div className="text-2xl font-black text-[#944a00] mt-1">{plans.length}</div>
          <span className="text-[10px] text-[#564337]">Live in customer selector</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs">
          <div className="text-xs font-bold text-[#564337]">Lunch Tiffin Plans</div>
          <div className="text-2xl font-black text-[#51634c] mt-1">
            {plans.filter((p) => p.category.includes('Lunch')).length}
          </div>
          <span className="text-[10px] text-[#564337]">Office & home lunch routes</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs">
          <div className="text-xs font-bold text-[#564337]">Dinner Tiffin Plans</div>
          <div className="text-2xl font-black text-indigo-700 mt-1">
            {plans.filter((p) => p.category.includes('Dinner')).length}
          </div>
          <span className="text-[10px] text-[#564337]">Evening doorstep delivery</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs">
          <div className="text-xs font-bold text-[#564337]">Full Day Care Plans</div>
          <div className="text-2xl font-black text-[#1a1c1c] mt-1">
            {plans.filter((p) => p.category.includes('Lunch + Dinner')).length}
          </div>
          <span className="text-[10px] text-green-700 font-semibold">Dual delivery combo</span>
        </div>
      </div>

      {/* Active Plans List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#564337]">
            Active Subscription Plans for {currentCookProfile.name}
          </h3>
          <span className="text-xs text-[#564337]">
            Edit any field below and click <strong>Save Changes</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition-all relative ${
                plan.isPopular
                  ? 'border-[#944a00] shadow-[0_8px_30px_rgba(148,74,0,0.08)] ring-2 ring-[#944a00]/20'
                  : 'border-[#dcc1b1]/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]'
              }`}
            >
              {/* Top Controls: Popular Badge & Delete */}
              <div className="flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleTogglePopular(plan.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider cursor-pointer transition-colors ${
                    plan.isPopular
                      ? 'bg-[#944a00] text-white shadow-2xs'
                      : 'bg-[#faf9f8] text-[#564337] border border-[#dcc1b1]/60 hover:bg-[#ffdcc5]/40'
                  }`}
                >
                  {plan.isPopular ? '★ Most Popular' : 'Set as Popular'}
                </button>

                <div className="flex items-center gap-2">
                  <span
                    onClick={() => setCookTab('customers')}
                    className="cursor-pointer flex items-center gap-1 text-[10px] font-bold text-[#51634c] bg-[#d1e6c9]/70 hover:bg-[#b8d8ad] px-2.5 py-1 rounded-full transition-colors"
                    title="Click to view subscribers in customers panel"
                  >
                    <Users className="w-3 h-3" />
                    <span>
                      {
                        cookSubscribersList.filter(
                          (s) =>
                            s.planId === plan.id ||
                            s.planName.toLowerCase().trim() === plan.name.toLowerCase().trim()
                        ).length
                      }{' '}
                      Subscribers
                    </span>
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeletePlan(plan.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Plan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Plan Name & Category / Duration Selectors */}
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-[#564337] uppercase tracking-wider block">
                    Plan Title
                  </label>
                  <input
                    type="text"
                    value={plan.name}
                    onChange={(e) => handleUpdateField(plan.id, 'name', e.target.value)}
                    className="w-full font-extrabold text-sm text-[#1a1c1c] bg-[#faf9f8] border border-[#dcc1b1] rounded-lg px-2.5 py-1.5 focus:border-[#944a00] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#564337] block">Meal Slot</label>
                    <select
                      value={plan.category}
                      onChange={(e) => handleUpdateField(plan.id, 'category', e.target.value)}
                      className="w-full text-xs font-semibold bg-[#faf9f8] border border-[#dcc1b1] rounded-lg px-2 py-1 text-[#944a00]"
                    >
                      <option value="Lunch Only">Lunch Only</option>
                      <option value="Dinner Only">Dinner Only</option>
                      <option value="Lunch + Dinner">Lunch + Dinner</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#564337] block">Duration</label>
                    <select
                      value={plan.type}
                      onChange={(e) => handleUpdateField(plan.id, 'type', e.target.value)}
                      className="w-full text-xs font-semibold bg-[#faf9f8] border border-[#dcc1b1] rounded-lg px-2 py-1 text-[#51634c]"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="15 Days">15 Days</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Price, Total Meals & Delivery Window */}
              <div className="p-3 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1a1c1c]">Customer Price</span>
                  <div className="flex items-center gap-1">
                    <span className="font-extrabold text-base text-[#944a00]">₹</span>
                    <input
                      type="number"
                      value={plan.price}
                      onChange={(e) =>
                        handleUpdateField(plan.id, 'price', Math.max(0, parseInt(e.target.value) || 0))
                      }
                      className="w-24 text-right font-black text-lg text-[#944a00] bg-white border border-[#dcc1b1] rounded-lg px-2 py-0.5 focus:ring-1 focus:ring-[#944a00]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#564337]">Total Meals Included</span>
                  <input
                    type="number"
                    value={plan.mealsCount || 26}
                    onChange={(e) =>
                      handleUpdateField(plan.id, 'mealsCount', Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-16 text-center font-bold bg-white border border-[#dcc1b1] rounded-lg px-1 py-0.5 text-xs"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#564337]">Delivery Window</span>
                  <input
                    type="text"
                    value={plan.deliveryTimeWindow || '12:30 PM – 1:30 PM'}
                    onChange={(e) => handleUpdateField(plan.id, 'deliveryTimeWindow', e.target.value)}
                    className="w-36 text-right font-medium bg-white border border-[#dcc1b1] rounded-lg px-2 py-0.5 text-[11px]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#564337] uppercase tracking-wider block">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={plan.description}
                  onChange={(e) => handleUpdateField(plan.id, 'description', e.target.value)}
                  className="w-full text-xs text-[#564337] bg-white border border-[#dcc1b1]/60 rounded-lg p-2 focus:ring-1 focus:ring-[#944a00]"
                />
              </div>

              {/* Key Features List Manager */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-[#1a1c1c] text-[11px] uppercase tracking-wider flex justify-between items-center">
                  <span>Included Features ({plan.features.length})</span>
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                  {plan.features.map((feat, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-1.5 p-1 rounded bg-[#faf9f8] border border-[#eeeeed] text-[#564337] text-[11px]"
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#51634c] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeatureFromPlan(plan.id, i)}
                        className="text-gray-400 hover:text-red-500 p-0.5 cursor-pointer shrink-0"
                        title="Remove feature"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new feature input */}
                <div className="flex gap-1 pt-1">
                  <input
                    type="text"
                    value={activeFeatureInputs[plan.id] || ''}
                    onChange={(e) =>
                      setActiveFeatureInputs((prev) => ({ ...prev, [plan.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeatureToPlan(plan.id);
                      }
                    }}
                    placeholder="Add feature (e.g. Free sweet on Friday)"
                    className="flex-1 bg-white border border-[#dcc1b1] rounded-lg px-2 py-1 text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeatureToPlan(plan.id)}
                    className="px-2.5 py-1 bg-[#51634c] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#3d4b39]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Terms & Skip Policy Manager */}
              <div className="space-y-1.5 text-xs">
                <div className="font-bold text-[#1a1c1c] text-[11px] uppercase tracking-wider">
                  Terms & Skip Policy ({(plan.terms || []).length})
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto custom-scrollbar pr-1">
                  {(plan.terms || []).map((term, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-1.5 p-1 rounded bg-[#faf9f8] border border-[#eeeeed] text-[#564337] text-[10px]"
                    >
                      <span className="truncate">• {term}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTermFromPlan(plan.id, i)}
                        className="text-gray-400 hover:text-red-500 p-0.5 cursor-pointer shrink-0"
                        title="Remove term"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new term input */}
                <div className="flex gap-1 pt-1">
                  <input
                    type="text"
                    value={activeTermInputs[plan.id] || ''}
                    onChange={(e) =>
                      setActiveTermInputs((prev) => ({ ...prev, [plan.id]: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTermToPlan(plan.id);
                      }
                    }}
                    placeholder="Add rule (e.g. Skip notice: 2 hours)"
                    className="flex-1 bg-white border border-[#dcc1b1] rounded-lg px-2 py-1 text-[10px]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTermToPlan(plan.id)}
                    className="px-2.5 py-1 bg-[#944a00] text-white rounded-lg text-[10px] font-bold cursor-pointer hover:bg-[#713700]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Card Save Single Button */}
              <button
                type="button"
                onClick={() => handleSaveAll()}
                className="w-full py-2.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check className="w-4 h-4" />
                <span>Save Changes & Publish</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create New Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-[#dcc1b1]/60 my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-3.5 border-b border-[#eeeeed] flex justify-between items-center bg-[#faf9f8] shrink-0">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-[#944a00]" />
                <h3 className="font-bold text-base text-[#1a1c1c]">Create New Subscription Plan</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-full text-[#564337] hover:bg-[#eeeeed] cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateNewPlan} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 custom-scrollbar">
                {/* Plan Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1a1c1c]">Plan Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deluxe Office Lunch Tiffin"
                    value={newPlanName}
                    onChange={(e) => setNewPlanName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c] focus:ring-1 focus:ring-[#944a00]"
                  />
                </div>

                {/* Category & Duration Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1a1c1c]">Meal Category</label>
                    <select
                      value={newPlanCategory}
                      onChange={(e) => setNewPlanCategory(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
                    >
                      <option value="Lunch Only">Lunch Only</option>
                      <option value="Dinner Only">Dinner Only</option>
                      <option value="Lunch + Dinner">Lunch + Dinner (Both)</option>
                      <option value="Custom">Custom Plan</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#1a1c1c]">Billing Duration</label>
                    <select
                      value={newPlanType}
                      onChange={(e) => setNewPlanType(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
                    >
                      <option value="Monthly">Monthly (30 Days)</option>
                      <option value="15 Days">15 Days Trial</option>
                      <option value="Weekly">Weekly (7 Days)</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                {/* Price, Meals Count, Delivery Window */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1a1c1c]">Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={newPlanPrice}
                      onChange={(e) => setNewPlanPrice(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl font-bold text-[#944a00]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1a1c1c]">Meals Count</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={newPlanMealsCount}
                      onChange={(e) => setNewPlanMealsCount(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1a1c1c]">Delivery Window</label>
                    <input
                      type="text"
                      value={newPlanTimeWindow}
                      onChange={(e) => setNewPlanTimeWindow(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1a1c1c]">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe what makes this tiffin special..."
                    value={newPlanDescription}
                    onChange={(e) => setNewPlanDescription(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
                  />
                </div>

                {/* Features List for New Plan */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1a1c1c]">Included Features</label>
                  <div className="space-y-1">
                    {newPlanFeatures.map((feat, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-2.5 py-1 bg-[#faf9f8] border border-[#dcc1b1]/50 rounded-lg text-xs"
                      >
                        <span>• {feat}</span>
                        <button
                          type="button"
                          onClick={() => setNewPlanFeatures((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a feature point..."
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newFeatureText.trim()) {
                            setNewPlanFeatures((prev) => [...prev, newFeatureText.trim()]);
                            setNewFeatureText('');
                          }
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newFeatureText.trim()) {
                          setNewPlanFeatures((prev) => [...prev, newFeatureText.trim()]);
                          setNewFeatureText('');
                        }
                      }}
                      className="px-3 py-1.5 bg-[#51634c] text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Terms for New Plan */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1a1c1c]">Terms & Skip Policy</label>
                  <div className="space-y-1">
                    {newPlanTerms.map((term, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-2.5 py-1 bg-[#faf9f8] border border-[#dcc1b1]/50 rounded-lg text-[11px]"
                      >
                        <span>• {term}</span>
                        <button
                          type="button"
                          onClick={() => setNewPlanTerms((prev) => prev.filter((_, idx) => idx !== i))}
                          className="text-gray-400 hover:text-red-500"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add terms (e.g. Skip notice: 3 hours)"
                      value={newTermText}
                      onChange={(e) => setNewTermText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (newTermText.trim()) {
                            setNewPlanTerms((prev) => [...prev, newTermText.trim()]);
                            setNewTermText('');
                          }
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTermText.trim()) {
                          setNewPlanTerms((prev) => [...prev, newTermText.trim()]);
                          setNewTermText('');
                        }
                      }}
                      className="px-3 py-1.5 bg-[#944a00] text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Is Popular Toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="newPopular"
                    checked={newPlanIsPopular}
                    onChange={(e) => setNewPlanIsPopular(e.target.checked)}
                    className="accent-[#944a00] w-4 h-4 rounded"
                  />
                  <label htmlFor="newPopular" className="text-xs font-bold text-[#1a1c1c] cursor-pointer">
                    Highlight as 'Most Popular' plan
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-[#eeeeed] bg-[#faf9f8] flex justify-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-[#dcc1b1] text-xs font-bold text-[#564337] rounded-xl hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Publish Plan Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
