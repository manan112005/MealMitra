import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flame,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  Save,
} from 'lucide-react';

export const CookKitchenManager: React.FC = () => {
  const { currentCookProfile, updateKitchenStatus, updateKitchenQuantities } = useApp();

  const [kitchenOpen, setKitchenOpen] = useState(currentCookProfile.kitchenOpen);
  const [lunchAvailableQty, setLunchAvailableQty] = useState(currentCookProfile.lunchAvailableQty);
  const [lunchTotalQty, setLunchTotalQty] = useState(currentCookProfile.lunchTotalQty);
  const [dinnerAvailableQty, setDinnerAvailableQty] = useState(currentCookProfile.dinnerAvailableQty);
  const [dinnerTotalQty, setDinnerTotalQty] = useState(currentCookProfile.dinnerTotalQty);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateKitchenStatus(currentCookProfile.id, kitchenOpen);
    updateKitchenQuantities(
      currentCookProfile.id,
      lunchAvailableQty,
      lunchTotalQty,
      dinnerAvailableQty,
      dinnerTotalQty
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleMarkLunchSoldOut = () => {
    setLunchAvailableQty(0);
    updateKitchenQuantities(
      currentCookProfile.id,
      0,
      lunchTotalQty,
      dinnerAvailableQty,
      dinnerTotalQty
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePublishLunchSlot = (customQty?: number) => {
    const targetQty = customQty !== undefined ? customQty : (lunchAvailableQty === 0 ? lunchTotalQty : lunchAvailableQty);
    const newTotal = Math.max(lunchTotalQty, targetQty);
    setLunchAvailableQty(targetQty);
    setLunchTotalQty(newTotal);
    setKitchenOpen(true);
    updateKitchenStatus(currentCookProfile.id, true);
    updateKitchenQuantities(
      currentCookProfile.id,
      targetQty,
      newTotal,
      dinnerAvailableQty,
      dinnerTotalQty
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleMarkDinnerSoldOut = () => {
    setDinnerAvailableQty(0);
    updateKitchenQuantities(
      currentCookProfile.id,
      lunchAvailableQty,
      lunchTotalQty,
      0,
      dinnerTotalQty
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePublishDinnerSlot = (customQty?: number) => {
    const targetQty = customQty !== undefined ? customQty : (dinnerAvailableQty === 0 ? dinnerTotalQty : dinnerAvailableQty);
    const newTotal = Math.max(dinnerTotalQty, targetQty);
    setDinnerAvailableQty(targetQty);
    setDinnerTotalQty(newTotal);
    setKitchenOpen(true);
    updateKitchenStatus(currentCookProfile.id, true);
    updateKitchenQuantities(
      currentCookProfile.id,
      lunchAvailableQty,
      lunchTotalQty,
      targetQty,
      newTotal
    );
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDailyBatch = () => {
    setLunchAvailableQty(25);
    setLunchTotalQty(25);
    setDinnerAvailableQty(20);
    setDinnerTotalQty(20);
    setKitchenOpen(true);
    updateKitchenStatus(currentCookProfile.id, true);
    updateKitchenQuantities(currentCookProfile.id, 25, 25, 20, 20);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
            <Flame className="w-6 h-6 text-[#944a00]" />
            <span>Today's Kitchen & Capacity Manager</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#564337]">
            Control your kitchen's open/closed state and adjust real-time meal quantities for lunch and dinner slots.
          </p>
        </div>

        <button
          onClick={handleResetDailyBatch}
          className="px-3.5 py-2 bg-white border border-[#dcc1b1] hover:bg-[#faf9f8] text-[#564337] text-xs font-bold rounded-xl transition-colors self-start sm:self-auto shadow-2xs"
        >
          Reset to Standard Batch (25/20)
        </button>
      </div>

      {isSaved && (
        <div className="p-3.5 bg-[#d1e6c9] text-[#51634c] text-xs font-bold rounded-xl flex items-center gap-2 shadow-2xs">
          <CheckCircle className="w-4 h-4" />
          <span>Kitchen status updated and broadcasted to customers!</span>
        </div>
      )}

      {/* Global Master Switch */}
      <div className="bg-white rounded-2xl border-2 border-[#dcc1b1]/60 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="space-y-1">
            <div className="text-sm font-bold uppercase tracking-wider text-[#564337]">
              Master Kitchen Status
            </div>
            <div className="text-xl font-extrabold text-[#1a1c1c] flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  kitchenOpen ? 'bg-green-500 animate-ping' : 'bg-red-500'
                }`}
              />
              <span>{kitchenOpen ? 'Kitchen is Active & OPEN' : 'Kitchen is Temporarily CLOSED'}</span>
            </div>
            <p className="text-xs text-[#564337]">
              When closed, your profile shows 'Kitchen Closed — Sold Out' and stops accepting new customer orders.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const newStatus = !kitchenOpen;
              setKitchenOpen(newStatus);
              updateKitchenStatus(currentCookProfile.id, newStatus);
            }}
            className={`px-6 py-3 rounded-xl font-bold text-xs shadow-xs transition-all ${
              kitchenOpen
                ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                : 'bg-[#51634c] hover:bg-[#3d4b39] text-white'
            }`}
          >
            {kitchenOpen ? 'Turn Kitchen Offline' : 'Turn Kitchen Online'}
          </button>
        </div>
      </div>

      {/* Slot Availability Cards */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Lunch Manager */}
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-base text-[#944a00] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Today's Lunch Slot</span>
                </h3>
                <p className="text-xs text-[#564337] mt-0.5">Service: 12:30 PM – 2:00 PM</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  lunchAvailableQty > 0
                    ? 'bg-[#ffdcc5] text-[#944a00]'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {lunchAvailableQty > 0 ? `${lunchAvailableQty} Available` : 'Sold Out'}
              </span>
            </div>

            {/* Direct Input & Stepper for Available Qty */}
            <div className="p-4 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#1a1c1c] block">Available to Order</span>
                  <span className="text-[10px] text-[#564337]">Type any number directly</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLunchAvailableQty((q) => Math.max(0, q - 1))}
                    className="w-8 h-8 rounded-lg border border-[#dcc1b1] bg-white flex items-center justify-center text-[#564337] hover:bg-[#f2ece9] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    value={lunchAvailableQty}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setLunchAvailableQty(val);
                      if (val > lunchTotalQty) setLunchTotalQty(val);
                    }}
                    min={0}
                    max={500}
                    className="w-16 h-8 text-center font-extrabold text-sm bg-white border border-[#dcc1b1] rounded-lg text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#944a00]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = lunchAvailableQty + 1;
                      setLunchAvailableQty(nextVal);
                      if (nextVal > lunchTotalQty) setLunchTotalQty(nextVal);
                    }}
                    className="w-8 h-8 rounded-lg border border-[#dcc1b1] bg-white flex items-center justify-center text-[#564337] hover:bg-[#f2ece9] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Preset Badges */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#564337] font-medium mr-1">Quick Add:</span>
                {[1, 5, 10, 20].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => {
                      const next = lunchAvailableQty + delta;
                      setLunchAvailableQty(next);
                      if (next > lunchTotalQty) setLunchTotalQty(next);
                    }}
                    className="px-2 py-0.5 bg-white hover:bg-[#ffdcc5]/50 border border-[#dcc1b1] text-[#944a00] text-[10px] font-bold rounded-md transition-colors"
                  >
                    +{delta}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setLunchAvailableQty(lunchTotalQty)}
                  className="px-2 py-0.5 bg-white hover:bg-[#ffdcc5]/50 border border-[#dcc1b1] text-[#564337] text-[10px] font-bold rounded-md transition-colors ml-auto"
                >
                  All ({lunchTotalQty})
                </button>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#dcc1b1]/30">
                <span className="text-xs text-[#564337]">Total Daily Target Prep</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={lunchTotalQty}
                    onChange={(e) => setLunchTotalQty(Math.max(0, parseInt(e.target.value) || 0))}
                    min={1}
                    max={500}
                    className="w-16 px-2 py-1 text-xs bg-white border border-[#dcc1b1] rounded-lg text-center font-bold"
                  />
                  <span className="text-xs text-[#564337]">meals</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleMarkLunchSoldOut}
                className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Mark Lunch Sold Out</span>
              </button>
              <button
                type="button"
                onClick={() => handlePublishLunchSlot()}
                className="py-2.5 px-3 bg-[#d1e6c9] hover:bg-[#b8d9ad] text-[#51634c] text-xs font-bold rounded-xl border border-[#51634c]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>
                  {lunchAvailableQty === 0
                    ? `Mark Available (${lunchTotalQty})`
                    : `Publish Lunch (${lunchAvailableQty})`}
                </span>
              </button>
            </div>
          </div>

          {/* Dinner Manager */}
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-6 shadow-2xs space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-base text-[#51634c] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Today's Dinner Slot</span>
                </h3>
                <p className="text-xs text-[#564337] mt-0.5">Service: 7:30 PM – 9:00 PM</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  dinnerAvailableQty > 0
                    ? 'bg-[#d1e6c9] text-[#51634c]'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {dinnerAvailableQty > 0 ? `${dinnerAvailableQty} Available` : 'Sold Out'}
              </span>
            </div>

            {/* Direct Input & Stepper for Available Qty */}
            <div className="p-4 bg-[#faf9f8] rounded-xl border border-[#dcc1b1]/40 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-[#1a1c1c] block">Available to Order</span>
                  <span className="text-[10px] text-[#564337]">Type any number directly</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDinnerAvailableQty((q) => Math.max(0, q - 1))}
                    className="w-8 h-8 rounded-lg border border-[#dcc1b1] bg-white flex items-center justify-center text-[#564337] hover:bg-[#f2ece9] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    value={dinnerAvailableQty}
                    onChange={(e) => {
                      const val = Math.max(0, parseInt(e.target.value) || 0);
                      setDinnerAvailableQty(val);
                      if (val > dinnerTotalQty) setDinnerTotalQty(val);
                    }}
                    min={0}
                    max={500}
                    className="w-16 h-8 text-center font-extrabold text-sm bg-white border border-[#dcc1b1] rounded-lg text-[#1a1c1c] focus:outline-none focus:ring-2 focus:ring-[#51634c]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const nextVal = dinnerAvailableQty + 1;
                      setDinnerAvailableQty(nextVal);
                      if (nextVal > dinnerTotalQty) setDinnerTotalQty(nextVal);
                    }}
                    className="w-8 h-8 rounded-lg border border-[#dcc1b1] bg-white flex items-center justify-center text-[#564337] hover:bg-[#f2ece9] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Preset Badges */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-[#564337] font-medium mr-1">Quick Add:</span>
                {[1, 5, 10, 20].map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => {
                      const next = dinnerAvailableQty + delta;
                      setDinnerAvailableQty(next);
                      if (next > dinnerTotalQty) setDinnerTotalQty(next);
                    }}
                    className="px-2 py-0.5 bg-white hover:bg-[#d1e6c9]/50 border border-[#dcc1b1] text-[#51634c] text-[10px] font-bold rounded-md transition-colors"
                  >
                    +{delta}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDinnerAvailableQty(dinnerTotalQty)}
                  className="px-2 py-0.5 bg-white hover:bg-[#d1e6c9]/50 border border-[#dcc1b1] text-[#564337] text-[10px] font-bold rounded-md transition-colors ml-auto"
                >
                  All ({dinnerTotalQty})
                </button>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#dcc1b1]/30">
                <span className="text-xs text-[#564337]">Total Daily Target Prep</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={dinnerTotalQty}
                    onChange={(e) => setDinnerTotalQty(Math.max(0, parseInt(e.target.value) || 0))}
                    min={1}
                    max={500}
                    className="w-16 px-2 py-1 text-xs bg-white border border-[#dcc1b1] rounded-lg text-center font-bold"
                  />
                  <span className="text-xs text-[#564337]">meals</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={handleMarkDinnerSoldOut}
                className="py-2.5 px-3 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl border border-red-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Mark Dinner Sold Out</span>
              </button>
              <button
                type="button"
                onClick={() => handlePublishDinnerSlot()}
                className="py-2.5 px-3 bg-[#d1e6c9] hover:bg-[#b8d9ad] text-[#51634c] text-xs font-bold rounded-xl border border-[#51634c]/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>
                  {dinnerAvailableQty === 0
                    ? `Mark Available (${dinnerTotalQty})`
                    : `Publish Dinner (${dinnerAvailableQty})`}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Save Button Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#944a00] hover:bg-[#713700] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Publish Live Capacity</span>
          </button>
        </div>
      </form>
    </div>
  );
};
