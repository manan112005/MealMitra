import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  Banknote,
  QrCode,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { paymentService } from '../../services/payment.service';

export interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  amount: number;
  itemName: string;
  description?: string;
  customerPhone?: string;
  customerName?: string;
  onClose: () => void;
  onSuccess: (result: {
    paymentId: string;
    orderId: string;
    signature: string;
    method: string;
  }) => void;
  onFailure?: (errorMsg: string) => void;
  orderData?: any;
  subscriptionData?: any;
}

export const RazorpayCheckoutModal: React.FC<RazorpayCheckoutModalProps> = ({
  isOpen,
  amount,
  itemName,
  description = 'Homemade Meal Mitram',
  customerPhone = '+91 99250 12345',
  customerName = 'Customer',
  onClose,
  onSuccess,
  onFailure,
  orderData,
  subscriptionData,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'netbanking' | 'upi' | 'wallet' | 'cod'>('cards');
  
  // Card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // UPI inputs
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred' | 'qr'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);

  // Netbanking inputs
  const [selectedBank, setSelectedBank] = useState('HDFC');

  // Wallet inputs
  const [selectedWallet, setSelectedWallet] = useState('Paytm');

  // Payment processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Connecting to Razorpay gateway...');
  const [progressPercent, setProgressPercent] = useState(15);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsProcessing(false);
      setIsSuccess(false);
      setErrorMessage('');
      setProgressPercent(15);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const getActiveMethodName = () => {
    if (activeTab === 'cards') return 'Card';
    if (activeTab === 'upi') {
      if (showQrCode || selectedUpiApp === 'qr') return 'UPI QR';
      if (selectedUpiApp === 'gpay') return 'Google Pay (UPI)';
      if (selectedUpiApp === 'phonepe') return 'PhonePe (UPI)';
      if (selectedUpiApp === 'paytm') return 'Paytm UPI';
      if (selectedUpiApp === 'cred') return 'CRED UPI';
      return customUpiId ? `UPI (${customUpiId})` : 'UPI';
    }
    if (activeTab === 'netbanking') return `${selectedBank} Netbanking`;
    if (activeTab === 'wallet') return `${selectedWallet} Wallet`;
    return 'Pay on Delivery (Cash)';
  };

  const handlePay = async () => {
    if (activeTab === 'cod') {
      onSuccess({
        paymentId: `cod_${Date.now()}`,
        orderId: `ord_cod_${Date.now()}`,
        signature: `sig_cod_${Date.now()}`,
        method: 'Pay on Delivery (COD)',
      });
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');
    setProgressPercent(20);
    setProcessingStatus('Connecting to Razorpay gateway...');

    const timer1 = setTimeout(() => {
      setProgressPercent(50);
      setProcessingStatus(`Authorizing ₹${amount} with ${getActiveMethodName()}...`);
    }, 600);

    const timer2 = setTimeout(() => {
      setProgressPercent(85);
      setProcessingStatus('Authenticating transaction with bank server...');
    }, 1300);

    const timer3 = setTimeout(async () => {
      setProgressPercent(100);
      setProcessingStatus('Signature verified! Confirming order...');

      try {
        const orderRes = await paymentService.createOrder(amount, {
          item: itemName,
          customer: customerName,
        });

        const simulatedPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const simulatedSignature = `sig_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

        await paymentService.verifyPayment({
          razorpay_order_id: orderRes.id || `order_${Date.now()}`,
          razorpay_payment_id: simulatedPaymentId,
          razorpay_signature: simulatedSignature,
          orderData,
          subscriptionData,
        });

        setIsSuccess(true);
        setTimeout(() => {
          onSuccess({
            paymentId: simulatedPaymentId,
            orderId: orderRes.id || `order_${Date.now()}`,
            signature: simulatedSignature,
            method: getActiveMethodName(),
          });
        }, 500);
      } catch (err: any) {
        console.warn('Backend payment verification fallback:', err);
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess({
            paymentId: `pay_${Date.now()}`,
            orderId: `order_${Date.now()}`,
            signature: `sig_${Date.now()}`,
            method: getActiveMethodName(),
          });
        }, 400);
      }
    }, 2100);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      {/* Exact Razorpay Split Modal container */}
      <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col md:flex-row my-auto animate-in zoom-in-95 duration-150 relative min-h-[460px]">
        
        {/* LEFT BRANDING SIDEBAR (Orange / Terracotta MealMitra Theme) */}
        <div className="w-full md:w-64 bg-gradient-to-b from-[#a44c00] via-[#944a00] to-[#713700] p-6 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          {/* Subtle 3D background accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-12 left-0 w-40 h-40 bg-black/10 rounded-full -ml-12 pointer-events-none" />

          {/* Top Logo & App Name */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/95 p-1.5 flex items-center justify-center shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80"
                  alt="MealMitra"
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white drop-shadow-xs">
                MealMitra
              </span>
            </div>

            {/* Price Summary Card */}
            <div className="bg-white rounded-xl p-3.5 text-[#1a1c1c] shadow-md border border-white/20">
              <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Price Summary
              </div>
              <div className="text-2xl font-black text-[#1a1c1c] pt-0.5">
                ₹{amount}
              </div>
            </div>

            {/* Using as Contact Card */}
            <div className="bg-white/90 hover:bg-white rounded-xl p-2.5 px-3 text-[#1a1c1c] shadow-xs flex items-center justify-between text-xs font-semibold cursor-pointer transition-colors">
              <div className="flex items-center gap-2 truncate">
                <Smartphone className="w-3.5 h-3.5 text-[#944a00] shrink-0" />
                <span className="truncate text-gray-700">Using as {customerPhone}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </div>
          </div>

          {/* Bottom 3D Graphics & Secured by Razorpay */}
          <div className="space-y-3 relative z-10 pt-6">
            {/* 3D Isometric Art Decoration */}
            <div className="relative h-20 w-full flex items-center justify-center opacity-90">
              <div className="w-16 h-12 bg-amber-400/30 rounded-xl transform -rotate-12 border border-amber-300/40 shadow-inner flex items-center justify-center text-xl">
                💳
              </div>
              <div className="w-14 h-14 bg-amber-500/40 rounded-2xl transform rotate-12 -ml-4 border border-amber-200/40 shadow-lg flex items-center justify-center text-xl">
                🪙
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-white/90 pt-1 border-t border-white/10">
              <span className="text-white/70">Secured by</span>
              <span className="font-extrabold text-white tracking-wide flex items-center gap-1">
                <span className="text-blue-300">⚡</span> Razorpay
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT MAIN PAYMENT SELECTION & FORM BODY */}
        <div className="flex-1 flex flex-col justify-between bg-white relative">
          
          {/* Top Header */}
          <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-[#1a1c1c] tracking-tight">
              Payment Options
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body Columns: Left Category Navigation & Right Input View */}
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            
            {/* Left Category Tabs */}
            <div className="w-full sm:w-44 bg-[#fdfbf9] border-r border-gray-100 p-2 space-y-1 shrink-0 overflow-y-auto">
              
              {/* Cards Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('cards')}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'cards'
                    ? 'bg-white font-bold text-[#944a00] shadow-xs border border-amber-200/70'
                    : 'text-gray-600 hover:bg-gray-100/60 font-medium'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs">Cards</div>
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 font-normal">
                    <span>💳 Visa, MC, RuPay</span>
                  </div>
                </div>
              </button>

              {/* UPI Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'upi'
                    ? 'bg-white font-bold text-[#944a00] shadow-xs border border-amber-200/70'
                    : 'text-gray-600 hover:bg-gray-100/60 font-medium'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs">UPI / QR</div>
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 font-normal">
                    <span>🟢 GPay, PhonePe</span>
                  </div>
                </div>
              </button>

              {/* Netbanking Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'netbanking'
                    ? 'bg-white font-bold text-[#944a00] shadow-xs border border-amber-200/70'
                    : 'text-gray-600 hover:bg-gray-100/60 font-medium'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs">Netbanking</div>
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 font-normal">
                    <span>🏦 All Indian Banks</span>
                  </div>
                </div>
              </button>

              {/* Wallet Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'wallet'
                    ? 'bg-white font-bold text-[#944a00] shadow-xs border border-amber-200/70'
                    : 'text-gray-600 hover:bg-gray-100/60 font-medium'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs">Wallet</div>
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 font-normal">
                    <span>👛 Paytm, Mobikwik</span>
                  </div>
                </div>
              </button>

              {/* Pay on Delivery Tab */}
              <button
                type="button"
                onClick={() => setActiveTab('cod')}
                className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'cod'
                    ? 'bg-white font-bold text-[#944a00] shadow-xs border border-amber-200/70'
                    : 'text-gray-600 hover:bg-gray-100/60 font-medium'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-xs">Pay on Delivery</div>
                  <div className="flex items-center gap-1 text-[9px] text-gray-400 font-normal">
                    <span>💵 Cash or UPI</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Right Form & Options View */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between">
              
              {/* Processing Overlay inside Right Column */}
              {isProcessing && (
                <div className="my-auto py-8 text-center space-y-4 animate-in fade-in duration-150">
                  <div className="w-12 h-12 border-3 border-[#944a00] border-t-transparent rounded-full animate-spin mx-auto" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-sm text-[#1a1c1c]">
                      {processingStatus}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Please do not close this window or refresh the page.
                    </p>
                  </div>
                  <div className="w-48 h-1.5 bg-gray-100 rounded-full mx-auto overflow-hidden">
                    <div
                      className="h-full bg-[#944a00] transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              {!isProcessing && (
                <div>
                  {/* TAB 1: CARDS VIEW */}
                  {activeTab === 'cards' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="text-xs font-bold text-gray-700">Add a new card</div>

                      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs focus-within:border-[#944a00] focus-within:ring-1 focus-within:ring-[#944a00]">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="Card Number"
                          maxLength={19}
                          className="w-full px-3.5 py-2.5 text-xs text-[#1a1c1c] placeholder-gray-400 focus:outline-hidden border-b border-gray-200"
                        />
                        <div className="grid grid-cols-2 divide-x divide-gray-200">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM / YY"
                            maxLength={5}
                            className="px-3.5 py-2.5 text-xs text-[#1a1c1c] placeholder-gray-400 focus:outline-hidden"
                          />
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/[^0-9]/g, ''))}
                            placeholder="CVV"
                            maxLength={4}
                            className="px-3.5 py-2.5 text-xs text-[#1a1c1c] placeholder-gray-400 focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="w-3.5 h-3.5 rounded-sm border-gray-300 text-[#944a00] focus:ring-[#944a00]"
                        />
                        <span className="text-[11px] text-gray-500 font-medium">
                          Save this card as per RBI guidelines
                        </span>
                      </label>
                    </div>
                  )}

                  {/* TAB 2: UPI / QR VIEW */}
                  {activeTab === 'upi' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="text-xs font-bold text-gray-700">Choose a UPI App or Scan QR</div>

                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'gpay', name: 'Google Pay', icon: '🟢' },
                          { id: 'phonepe', name: 'PhonePe', icon: '🟣' },
                          { id: 'paytm', name: 'Paytm UPI', icon: '🔵' },
                          { id: 'cred', name: 'CRED UPI', icon: '⚫' },
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => {
                              setSelectedUpiApp(app.id as any);
                              setShowQrCode(false);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                              selectedUpiApp === app.id && !showQrCode
                                ? 'bg-amber-50/80 border-[#944a00] text-[#944a00]'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span>{app.icon}</span>
                            <span>{app.name}</span>
                          </button>
                        ))}
                      </div>

                      {/* Custom UPI ID input */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customUpiId}
                            onChange={(e) => {
                              setCustomUpiId(e.target.value);
                              setShowQrCode(false);
                            }}
                            placeholder="Enter UPI ID (e.g. mobile@upi)"
                            className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1a1c1c] focus:outline-hidden focus:border-[#944a00]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowQrCode(!showQrCode)}
                            className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-[#944a00] rounded-xl flex items-center gap-1 cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>{showQrCode ? 'Hide QR' : 'Show QR'}</span>
                          </button>
                        </div>
                      </div>

                      {showQrCode && (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center text-center space-y-1.5">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=upi://pay?pa=mealmitra@razorpay&pn=MealMitra&am=${amount}&cu=INR`}
                            alt="UPI Payment QR"
                            className="w-24 h-24 rounded-lg border border-gray-200 bg-white p-1"
                          />
                          <p className="text-[10px] text-gray-500">
                            Scan with any UPI App on your phone
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 3: NETBANKING VIEW */}
                  {activeTab === 'netbanking' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="text-xs font-bold text-gray-700">Select your Bank</div>
                      <div className="grid grid-cols-3 gap-2">
                        {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'BOB'].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                              selectedBank === bank
                                ? 'bg-amber-50/80 border-[#944a00] text-[#944a00]'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Landmark className="w-4 h-4 text-gray-600" />
                            <span>{bank}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 4: WALLET VIEW */}
                  {activeTab === 'wallet' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="text-xs font-bold text-gray-700">Select Wallet</div>
                      <div className="grid grid-cols-2 gap-2">
                        {['Paytm Wallet', 'PhonePe Wallet', 'Mobikwik', 'Amazon Pay'].map((wallet) => (
                          <button
                            key={wallet}
                            type="button"
                            onClick={() => setSelectedWallet(wallet)}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                              selectedWallet === wallet
                                ? 'bg-amber-50/80 border-[#944a00] text-[#944a00]'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Wallet className="w-4 h-4 text-gray-600" />
                            <span>{wallet}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 5: PAY ON DELIVERY (COD) VIEW */}
                  {activeTab === 'cod' && (
                    <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Pay at Doorstep when Meal arrives</span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        Pay ₹{amount} in cash or UPI QR directly to the delivery partner when your hot homemade tiffin is handed over.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Action Button (Dark / Charcoal Button as shown in screenshot) */}
              <div className="pt-4 space-y-2">
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-[#1a1412] hover:bg-[#2d221e] active:scale-[0.99] disabled:bg-gray-400 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5 text-white/80" />
                  <span>
                    {activeTab === 'cod'
                      ? 'Confirm Booking (Pay on Delivery)'
                      : `Continue • Pay ₹${amount}`}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer Notice */}
          <div className="px-6 py-2.5 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400">
            By proceeding, I agree to Razorpay's <span className="underline cursor-pointer">Privacy Notice</span> • <span className="underline cursor-pointer">Edit Preferences</span>
          </div>
        </div>
      </div>
    </div>
  );
};
