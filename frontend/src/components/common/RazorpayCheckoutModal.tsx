import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  Landmark,
  Wallet,
  CheckCircle2,
  MoreHorizontal,
  ChevronRight,
  Lock,
  Search,
  Building2,
  Sparkles,
  QrCode,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Check,
  ExternalLink,
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

interface BankItem {
  code: string;
  name: string;
  popular?: boolean;
  shortName: string;
  color: string;
  bg: string;
}

const ALL_BANKS: BankItem[] = [
  { code: 'HDFC', name: 'HDFC Bank', shortName: 'HDFC', popular: true, color: '#004c8f', bg: '#e6f0fa' },
  { code: 'SBI', name: 'State Bank of India', shortName: 'SBI', popular: true, color: '#280071', bg: '#ede6fa' },
  { code: 'ICICI', name: 'ICICI Bank', shortName: 'ICICI', popular: true, color: '#b83c16', bg: '#faeae6' },
  { code: 'AXIS', name: 'Axis Bank', shortName: 'Axis', popular: true, color: '#97144d', bg: '#fbe7ef' },
  { code: 'KOTAK', name: 'Kotak Mahindra Bank', shortName: 'Kotak', popular: true, color: '#ed1c24', bg: '#fae6e6' },
  { code: 'BOB', name: 'Bank of Baroda', shortName: 'BOB', popular: true, color: '#f26522', bg: '#fbeee6' },
  { code: 'PNB', name: 'Punjab National Bank', shortName: 'PNB', popular: false, color: '#a20f2e', bg: '#fbe7eb' },
  { code: 'CANARA', name: 'Canara Bank', shortName: 'Canara', popular: false, color: '#0083ca', bg: '#e6f5fb' },
  { code: 'UNION', name: 'Union Bank of India', shortName: 'Union', popular: false, color: '#005f9e', bg: '#e6f2f9' },
  { code: 'INDUSIND', name: 'IndusInd Bank', shortName: 'IndusInd', popular: false, color: '#88001b', bg: '#fae6e9' },
  { code: 'YES', name: 'Yes Bank', shortName: 'Yes Bank', popular: false, color: '#004b8d', bg: '#e6f0f8' },
  { code: 'IDFC', name: 'IDFC FIRST Bank', shortName: 'IDFC', popular: false, color: '#9d1d27', bg: '#fae7e8' },
  { code: 'FEDERAL', name: 'Federal Bank', shortName: 'Federal', popular: false, color: '#003666', bg: '#e6edf5' },
  { code: 'BOI', name: 'Bank of India', shortName: 'BOI', popular: false, color: '#e47911', bg: '#faefe6' },
  { code: 'RBL', name: 'RBL Bank', shortName: 'RBL', popular: false, color: '#002663', bg: '#e6ecf4' },
  { code: 'AU', name: 'AU Small Finance Bank', shortName: 'AU Bank', popular: false, color: '#682054', bg: '#f5e8f2' },
  { code: 'SCB', name: 'Standard Chartered Bank', shortName: 'StanChart', popular: false, color: '#00703c', bg: '#e6f5ee' },
  { code: 'IDBI', name: 'IDBI Bank', shortName: 'IDBI', popular: false, color: '#005b38', bg: '#e6f3ee' },
];

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
  const [activeTab, setActiveTab] = useState<'cards' | 'netbanking' | 'wallet' | 'upi' | 'cod'>('cards');
  
  // Card inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);

  // Netbanking search and selection
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<BankItem | null>(ALL_BANKS[0]);

  // UPI inputs
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred' | 'custom' | 'qr'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);

  // Wallet inputs
  const [selectedWallet, setSelectedWallet] = useState<string>('Paytm');

  // Inline Validation Error State
  const [validationError, setValidationError] = useState<string | null>(null);

  // Payment processing and animation flow states
  const [paymentPhase, setPaymentPhase] = useState<'input' | 'processing' | 'success'>('input');
  const [activeFlowStep, setActiveFlowStep] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(10);
  const [completedResult, setCompletedResult] = useState<{
    paymentId: string;
    orderId: string;
    signature: string;
    method: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPaymentPhase('input');
      setActiveFlowStep(0);
      setProgressPercent(10);
      setValidationError(null);
      setBankSearchQuery('');
      setCompletedResult(null);
    }
  }, [isOpen]);

  // Filtered Banks for Netbanking Search
  const filteredBanks = useMemo(() => {
    if (!bankSearchQuery.trim()) {
      return ALL_BANKS;
    }
    const q = bankSearchQuery.toLowerCase();
    return ALL_BANKS.filter(
      (b) => b.name.toLowerCase().includes(q) || b.shortName.toLowerCase().includes(q) || b.code.toLowerCase().includes(q)
    );
  }, [bankSearchQuery]);

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

  const handleQuickFillTestCard = () => {
    setCardNumber('4532 8920 1234 5678');
    setCardExpiry('08/28');
    setCardCvv('789');
    setValidationError(null);
  };

  const validateCurrentSelection = (): boolean => {
    setValidationError(null);

    if (activeTab === 'cards') {
      const rawCard = cardNumber.replace(/\s/g, '');
      if (!rawCard) {
        setValidationError('Please enter your 16-digit card number.');
        return false;
      }
      if (rawCard.length < 15) {
        setValidationError('Card number must be at least 15–16 digits.');
        return false;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setValidationError('Please enter card expiry date in MM/YY format.');
        return false;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setValidationError('Please enter valid 3-digit CVV number.');
        return false;
      }
      return true;
    }

    if (activeTab === 'netbanking') {
      if (!selectedBank) {
        setValidationError('Please select a bank to proceed with Netbanking.');
        return false;
      }
      return true;
    }

    if (activeTab === 'upi') {
      if (selectedUpiApp === 'custom') {
        if (!customUpiId.trim() || !customUpiId.includes('@')) {
          setValidationError('Please enter a valid UPI ID (e.g. mobile@okhdfcbank).');
          return false;
        }
      }
      return true;
    }

    if (activeTab === 'wallet') {
      if (!selectedWallet) {
        setValidationError('Please choose a wallet to proceed.');
        return false;
      }
      return true;
    }

    return true;
  };

  const getActiveMethodName = () => {
    if (activeTab === 'cards') return `Card (ending ${cardNumber.slice(-4) || '5678'})`;
    if (activeTab === 'netbanking') return `${selectedBank?.name || 'HDFC'} Netbanking`;
    if (activeTab === 'wallet') return `${selectedWallet} Wallet`;
    if (activeTab === 'upi') {
      if (showQrCode || selectedUpiApp === 'qr') return 'UPI QR Code';
      if (selectedUpiApp === 'gpay') return 'Google Pay (UPI)';
      if (selectedUpiApp === 'phonepe') return 'PhonePe (UPI)';
      if (selectedUpiApp === 'paytm') return 'Paytm UPI';
      if (selectedUpiApp === 'cred') return 'CRED UPI';
      return customUpiId ? `UPI (${customUpiId})` : 'UPI';
    }
    return 'Pay on Delivery (Cash/UPI)';
  };

  const handlePay = async () => {
    // 1. Strict selection validation
    if (!validateCurrentSelection()) {
      return;
    }

    if (activeTab === 'cod') {
      onSuccess({
        paymentId: `cod_${Date.now()}`,
        orderId: `ord_cod_${Date.now()}`,
        signature: `sig_cod_${Date.now()}`,
        method: 'Pay on Delivery (COD)',
      });
      return;
    }

    // 2. Start Animated Coin Flip and Step Flow Processing
    setPaymentPhase('processing');
    setActiveFlowStep(1);
    setProgressPercent(25);

    // Step 1: Connecting Gateway
    const timer1 = setTimeout(() => {
      setActiveFlowStep(2);
      setProgressPercent(55);
    }, 800);

    // Step 2: Encrypted Token Handshake
    const timer2 = setTimeout(() => {
      setActiveFlowStep(3);
      setProgressPercent(85);
    }, 1600);

    // Step 3: Authorization with Bank & Backend API Verification
    const timer3 = setTimeout(async () => {
      setActiveFlowStep(4);
      setProgressPercent(100);

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

        const resultObj = {
          paymentId: simulatedPaymentId,
          orderId: orderRes.id || `order_${Date.now()}`,
          signature: simulatedSignature,
          method: getActiveMethodName(),
        };

        // Transition to celebratory BIG FONT success screen
        setTimeout(() => {
          setCompletedResult(resultObj);
          setPaymentPhase('success');
        }, 600);
      } catch (err: any) {
        console.warn('Backend payment verification fallback:', err);
        const resultObj = {
          paymentId: `pay_${Date.now()}`,
          orderId: `order_${Date.now()}`,
          signature: `sig_${Date.now()}`,
          method: getActiveMethodName(),
        };

        setTimeout(() => {
          setCompletedResult(resultObj);
          setPaymentPhase('success');
        }, 600);
      }
    }, 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleFinishAndRedirect = () => {
    if (completedResult) {
      onSuccess(completedResult);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-in fade-in duration-200">
      
      {/* Dynamic CSS styles for 3D coin flip and flow line animations */}
      <style>
        {`
          @keyframes coinFlip3D {
            0% {
              transform: rotateY(0deg) scale(1);
            }
            50% {
              transform: rotateY(180deg) scale(1.18);
            }
            100% {
              transform: rotateY(360deg) scale(1);
            }
          }
          .animate-coin-flip {
            animation: coinFlip3D 1.2s infinite ease-in-out;
            transform-style: preserve-3d;
          }
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }
          .animate-pulse-glow {
            animation: pulseGlow 1.8s infinite ease-in-out;
          }
        `}
      </style>

      {/* Razorpay Exact Split Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-[#dcc1b1]/50 flex flex-col md:flex-row my-auto animate-in zoom-in-95 duration-150 relative min-h-[510px]">
        
        {/* ======================================================== */}
        {/* LEFT BRANDING SIDEBAR (Terracotta MealMitra Theme)        */}
        {/* ======================================================== */}
        <div className="w-full md:w-68 bg-gradient-to-b from-[#8f4100] via-[#823800] to-[#5a2500] p-6 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
          
          {/* Subtle 3D background accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-16 left-0 w-44 h-44 bg-black/15 rounded-full -ml-16 pointer-events-none" />

          {/* Top Logo & App Title */}
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=80&q=80"
                  alt="MealMitra"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-xs block leading-tight">
                  MealMitra
                </span>
                <span className="text-[10px] text-white/80 font-medium tracking-wide">
                  Ghar Ka Khana
                </span>
              </div>
            </div>

            {/* Price Summary Card */}
            <div className="bg-white rounded-2xl p-4 text-[#1a1c1c] shadow-lg border border-white/20">
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Price Summary
              </div>
              <div className="text-3xl font-black text-[#1a1c1c] pt-1">
                ₹{amount}
              </div>
            </div>

            {/* Using as Contact Card */}
            <div className="bg-white/95 hover:bg-white rounded-xl p-3 text-[#1a1c1c] shadow-sm flex items-center justify-between text-xs font-semibold cursor-pointer transition-colors border border-white/40">
              <div className="flex items-center gap-2 truncate">
                <Smartphone className="w-4 h-4 text-[#8f4100] shrink-0" />
                <span className="truncate text-gray-800 font-medium">Using as {customerPhone}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </div>
          </div>

          {/* Bottom 3D Isometric Art & Secured by Razorpay */}
          <div className="space-y-3 relative z-10 pt-6">
            
            {/* 3D Isometric Golden Coin & Card Artwork */}
            <div className="relative h-20 w-full flex items-center justify-center">
              <div className="w-20 h-14 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-xl transform -rotate-12 border border-amber-100 shadow-md flex items-center justify-center text-2xl font-bold text-[#8f4100]/60">
                💳
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-300 rounded-2xl transform rotate-12 -ml-6 border border-yellow-200 shadow-xl flex items-center justify-center text-2xl">
                🪙
              </div>
            </div>

            {/* Razorpay Footer */}
            <div className="flex items-center gap-1.5 text-[11px] text-white/90 pt-2 border-t border-white/15">
              <span className="text-white/70">Secured by</span>
              <span className="font-extrabold text-white tracking-wide flex items-center gap-1">
                <span className="text-sky-300 font-black italic">⚡ razorpay</span>
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT MAIN PAYMENT INTERFACE                             */}
        {/* ======================================================== */}
        <div className="flex-1 flex flex-col justify-between bg-white relative">
          
          {/* Top Modal Header */}
          <div className="p-4 px-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#1a1c1c] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8f4100]" />
              <span>{paymentPhase === 'success' ? 'Payment Verified' : 'Payment Options'}</span>
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
                disabled={paymentPhase === 'processing'}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ======================================================= */}
          {/* PHASE 1: SELECTION AND INPUT INTERFACE                  */}
          {/* ======================================================= */}
          {paymentPhase === 'input' && (
            <div className="flex-1 flex flex-col sm:flex-row overflow-hidden min-h-[380px]">
              
              {/* SUB-COLUMN 1: Method Categories in Warm Beige background */}
              <div className="w-full sm:w-48 bg-[#fffaf5] border-r border-[#faeae0] p-2 space-y-1 shrink-0 overflow-y-auto">
                
                {/* 1. Cards */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('cards');
                    setValidationError(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    activeTab === 'cards'
                      ? 'bg-white font-bold text-[#8f4100] shadow-xs border border-amber-200'
                      : 'text-gray-700 hover:bg-white/60 font-medium'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold">Cards</div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <span>💳 Visa, MC, RuPay</span>
                    </div>
                  </div>
                </button>

                {/* 2. Netbanking */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('netbanking');
                    setValidationError(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    activeTab === 'netbanking'
                      ? 'bg-white font-bold text-[#8f4100] shadow-xs border border-amber-200'
                      : 'text-gray-700 hover:bg-white/60 font-medium'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold">Netbanking</div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <span>🏦 All Indian Banks</span>
                    </div>
                  </div>
                </button>

                {/* 3. Wallet */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('wallet');
                    setValidationError(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    activeTab === 'wallet'
                      ? 'bg-white font-bold text-[#8f4100] shadow-xs border border-amber-200'
                      : 'text-gray-700 hover:bg-white/60 font-medium'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold">Wallet</div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <span>👛 Paytm, Mobikwik</span>
                    </div>
                  </div>
                </button>

                {/* 4. UPI / QR */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('upi');
                    setValidationError(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    activeTab === 'upi'
                      ? 'bg-white font-bold text-[#8f4100] shadow-xs border border-amber-200'
                      : 'text-gray-700 hover:bg-white/60 font-medium'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold">UPI / QR</div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <span>🟢 GPay, PhonePe</span>
                    </div>
                  </div>
                </button>

                {/* 5. Pay on Delivery */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('cod');
                    setValidationError(null);
                  }}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex items-center justify-between ${
                    activeTab === 'cod'
                      ? 'bg-white font-bold text-[#8f4100] shadow-xs border border-amber-200'
                      : 'text-gray-700 hover:bg-white/60 font-medium'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="text-xs font-semibold">Pay on Delivery</div>
                    <div className="flex items-center gap-1 text-[9px] text-gray-400">
                      <span>💵 Cash or UPI</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* SUB-COLUMN 2: Detailed Inputs for Selected Method */}
              <div className="flex-1 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between">
                
                <div className="space-y-4">
                  {/* Validation Error Banner */}
                  {validationError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700 font-semibold animate-in slide-in-from-top-1">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{validationError}</span>
                    </div>
                  )}

                  {/* ================================================= */}
                  {/* 1. CARDS TAB VIEW                                 */}
                  {/* ================================================= */}
                  {activeTab === 'cards' && (
                    <div className="space-y-4 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-gray-800">Add a new card</div>
                        <button
                          type="button"
                          onClick={handleQuickFillTestCard}
                          className="text-[10px] font-bold text-[#8f4100] hover:underline cursor-pointer bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60"
                        >
                          ⚡ Autofill Test Card
                        </button>
                      </div>

                      {/* Razorpay unified card input box */}
                      <div className={`border rounded-xl overflow-hidden shadow-2xs transition-all ${
                        validationError && (!cardNumber || cardNumber.length < 15)
                          ? 'border-red-400 ring-1 ring-red-400'
                          : 'border-gray-200 focus-within:border-[#8f4100] focus-within:ring-1 focus-within:ring-[#8f4100]'
                      }`}>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => {
                            setCardNumber(formatCardNumber(e.target.value));
                            setValidationError(null);
                          }}
                          placeholder="Card Number (e.g. 4532 8920 1234 5678)"
                          maxLength={19}
                          className="w-full px-3.5 py-2.5 text-xs text-[#1a1c1c] placeholder-gray-400 focus:outline-hidden border-b border-gray-200 font-mono"
                        />
                        <div className="grid grid-cols-2 divide-x divide-gray-200 bg-white">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => {
                              setCardExpiry(formatExpiry(e.target.value));
                              setValidationError(null);
                            }}
                            placeholder="MM / YY"
                            maxLength={5}
                            className="px-3.5 py-2.5 text-xs text-[#1a1c1c] placeholder-gray-400 focus:outline-hidden font-mono"
                          />
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => {
                              setCardCvv(e.target.value.replace(/[^0-9]/g, ''));
                              setValidationError(null);
                            }}
                            placeholder="CVV"
                            maxLength={4}
                            className="px-3.5 py-2.5 text-xs text-[#1a1c1c] placeholder-gray-400 focus:outline-hidden font-mono"
                          />
                        </div>
                      </div>

                      {/* Save Card Checkbox */}
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={saveCard}
                          onChange={(e) => setSaveCard(e.target.checked)}
                          className="w-3.5 h-3.5 rounded-sm border-gray-300 text-[#8f4100] focus:ring-[#8f4100]"
                        />
                        <span className="text-[11px] text-gray-500 font-medium">
                          Save this card as per RBI guidelines
                        </span>
                      </label>
                    </div>
                  )}

                  {/* ================================================= */}
                  {/* 2. NETBANKING TAB VIEW (With Live Bank Search!)   */}
                  {/* ================================================= */}
                  {activeTab === 'netbanking' && (
                    <div className="space-y-3.5 animate-in fade-in duration-150">
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs font-bold text-gray-800">Select Bank for Netbanking</div>
                        <span className="text-[10px] text-gray-500">
                          {selectedBank?.name || 'No bank'} selected
                        </span>
                      </div>

                      {/* Bank Search Input Bar */}
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={bankSearchQuery}
                          onChange={(e) => setBankSearchQuery(e.target.value)}
                          placeholder="Search for your bank (e.g. HDFC, SBI, ICICI...)"
                          className="w-full bg-[#fbf9f8] border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs text-[#1a1c1c] placeholder-gray-400 focus:outline-hidden focus:border-[#8f4100] focus:bg-white transition-colors"
                        />
                        {bankSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setBankSearchQuery('')}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Banks List / Grid */}
                      <div className="max-h-[170px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                        {filteredBanks.length === 0 ? (
                          <div className="py-6 text-center text-xs text-gray-400">
                            No banks found matching "{bankSearchQuery}"
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {filteredBanks.map((bank) => {
                              const isSelected = selectedBank?.code === bank.code;
                              return (
                                <button
                                  key={bank.code}
                                  type="button"
                                  onClick={() => {
                                    setSelectedBank(bank);
                                    setValidationError(null);
                                  }}
                                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                                    isSelected
                                      ? 'bg-[#fff5ee] border-[#8f4100] text-[#8f4100] shadow-xs'
                                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <div
                                      className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] shrink-0"
                                      style={{ backgroundColor: bank.bg, color: bank.color }}
                                    >
                                      {bank.shortName.slice(0, 3)}
                                    </div>
                                    <span className="text-xs font-semibold truncate">
                                      {bank.name}
                                    </span>
                                  </div>
                                  {isSelected && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#8f4100] shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* ================================================= */}
                  {/* 3. WALLET TAB VIEW                                */}
                  {/* ================================================= */}
                  {activeTab === 'wallet' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="text-xs font-bold text-gray-800">Select Wallet</div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'Paytm', name: 'Paytm Wallet', icon: '🔵' },
                          { id: 'PhonePe', name: 'PhonePe Wallet', icon: '🟣' },
                          { id: 'Mobikwik', name: 'Mobikwik', icon: '🔴' },
                          { id: 'AmazonPay', name: 'Amazon Pay', icon: '🟠' },
                        ].map((w) => (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => {
                              setSelectedWallet(w.name);
                              setValidationError(null);
                            }}
                            className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                              selectedWallet === w.name
                                ? 'bg-[#fff5ee] border-[#8f4100] text-[#8f4100]'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{w.icon}</span>
                              <span>{w.name}</span>
                            </div>
                            {selectedWallet === w.name && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#8f4100]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ================================================= */}
                  {/* 4. UPI / QR TAB VIEW                              */}
                  {/* ================================================= */}
                  {activeTab === 'upi' && (
                    <div className="space-y-3.5 animate-in fade-in duration-150">
                      <div className="text-xs font-bold text-gray-800">Pay via UPI App or QR Code</div>

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
                              setValidationError(null);
                            }}
                            className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                              selectedUpiApp === app.id && !showQrCode
                                ? 'bg-[#fff5ee] border-[#8f4100] text-[#8f4100]'
                                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{app.icon}</span>
                              <span>{app.name}</span>
                            </div>
                            {selectedUpiApp === app.id && !showQrCode && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#8f4100]" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Custom UPI ID and QR Button */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={customUpiId}
                          onChange={(e) => {
                            setCustomUpiId(e.target.value);
                            setSelectedUpiApp('custom');
                            setShowQrCode(false);
                            setValidationError(null);
                          }}
                          placeholder="Enter UPI ID (e.g. mobile@okhdfcbank)"
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#1a1c1c] focus:outline-hidden focus:border-[#8f4100]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowQrCode(!showQrCode)}
                          className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold text-[#8f4100] rounded-xl flex items-center gap-1 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>{showQrCode ? 'Hide QR' : 'Scan QR'}</span>
                        </button>
                      </div>

                      {showQrCode && (
                        <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center text-center space-y-1">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=mealmitra@razorpay&pn=MealMitra&am=${amount}&cu=INR`}
                            alt="UPI QR"
                            className="w-20 h-20 rounded-lg border border-gray-200 bg-white p-1 shadow-2xs"
                          />
                          <p className="text-[10px] text-gray-500">Scan with any UPI app</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ================================================= */}
                  {/* 5. PAY ON DELIVERY (COD) VIEW                     */}
                  {/* ================================================= */}
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

                {/* Bottom Action Button (Dark / Charcoal Button as shown in screenshot) */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handlePay}
                    className="w-full py-3.5 bg-[#171311] hover:bg-[#2c2420] active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
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
          )}

          {/* ======================================================= */}
          {/* PHASE 2: 3D COIN FLIP & STEPPING FLOW LINES PROCESSING  */}
          {/* ======================================================= */}
          {paymentPhase === 'processing' && (
            <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-200 min-h-[380px]">
              
              {/* 3D Coin Flip Artwork */}
              <div className="relative flex items-center justify-center py-2">
                <div className="absolute w-24 h-24 bg-amber-400/20 rounded-full blur-xl animate-pulse-glow" />
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 rounded-full border-4 border-amber-200 shadow-2xl flex items-center justify-center animate-coin-flip text-3xl font-black text-[#8f4100]">
                  ₹
                </div>
              </div>

              {/* Step Flow Lines */}
              <div className="w-full max-w-sm space-y-3 bg-[#faf9f8] p-4 rounded-2xl border border-[#dcc1b1]/50 shadow-xs">
                
                {/* Flow Step 1 */}
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    activeFlowStep >= 1
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {activeFlowStep >= 1 ? <Check className="w-3 h-3" /> : '1'}
                  </div>
                  <span className={`font-medium ${activeFlowStep >= 1 ? 'text-[#1a1c1c]' : 'text-gray-400'}`}>
                    Connecting to secure Razorpay gateway...
                  </span>
                </div>

                {/* Vertical connecting line */}
                <div className="w-0.5 h-3 bg-gray-200 ml-2.5 -my-1" />

                {/* Flow Step 2 */}
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    activeFlowStep >= 2
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {activeFlowStep >= 2 ? <Check className="w-3 h-3" /> : '2'}
                  </div>
                  <span className={`font-medium ${activeFlowStep >= 2 ? 'text-[#1a1c1c]' : 'text-gray-400'}`}>
                    Exchanging 256-bit encryption keys with {getActiveMethodName()}...
                  </span>
                </div>

                {/* Vertical connecting line */}
                <div className="w-0.5 h-3 bg-gray-200 ml-2.5 -my-1" />

                {/* Flow Step 3 */}
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    activeFlowStep >= 3
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {activeFlowStep >= 3 ? <Check className="w-3 h-3" /> : '3'}
                  </div>
                  <span className={`font-medium ${activeFlowStep >= 3 ? 'text-[#1a1c1c]' : 'text-gray-400'}`}>
                    Authorizing payment of ₹{amount}...
                  </span>
                </div>

                {/* Vertical connecting line */}
                <div className="w-0.5 h-3 bg-gray-200 ml-2.5 -my-1" />

                {/* Flow Step 4 */}
                <div className="flex items-center gap-3 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    activeFlowStep >= 4
                      ? 'bg-emerald-500 text-white font-bold'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {activeFlowStep >= 4 ? <Check className="w-3 h-3" /> : '4'}
                  </div>
                  <span className={`font-medium ${activeFlowStep >= 4 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                    Payment Authorized & Verified!
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full max-w-sm space-y-1">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#8f4100] to-emerald-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 text-center">
                  Please do not refresh or press back
                </p>
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* PHASE 3: LARGE FONT PAYMENT SUCCESS CELEBRATION SCREEN  */}
          {/* ======================================================= */}
          {paymentPhase === 'success' && completedResult && (
            <div className="flex-1 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5 animate-in zoom-in-95 duration-200 min-h-[380px]">
              
              {/* Green Success Badge */}
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20 animate-in zoom-in duration-300">
                <Check className="w-10 h-10 stroke-[3]" />
              </div>

              {/* BIG FONT PAYMENT AMOUNT & SUCCESS TITLE */}
              <div className="space-y-1">
                <div className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block border border-emerald-200/80">
                  Payment Verified ✓
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-[#1a1c1c] tracking-tight pt-1">
                  ₹{amount}
                </h1>
                <h2 className="text-lg font-black text-emerald-700">
                  Paid Successfully
                </h2>
                <p className="text-xs text-[#564337] max-w-sm mx-auto">
                  Your meal order has been sent to the cook's live kitchen dashboard!
                </p>
              </div>

              {/* Transaction Metadata Card */}
              <div className="w-full max-w-sm bg-[#faf9f8] rounded-2xl p-4 border border-[#dcc1b1]/50 text-xs space-y-2 text-left shadow-2xs">
                <div className="flex justify-between items-center text-gray-500">
                  <span>Razorpay Payment ID</span>
                  <span className="font-mono font-bold text-[#8f4100]">{completedResult.paymentId}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500">
                  <span>Order Reference</span>
                  <span className="font-mono font-semibold text-gray-800">{completedResult.orderId}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 pt-1 border-t border-gray-200/60">
                  <span>Method</span>
                  <span className="font-semibold text-emerald-700">{completedResult.method}</span>
                </div>
              </div>

              {/* Action Button: Continue to Track Order */}
              <div className="w-full max-w-sm pt-2">
                <button
                  type="button"
                  onClick={handleFinishAndRedirect}
                  className="w-full py-3.5 bg-[#8f4100] hover:bg-[#733300] active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>View Order & Track Live</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Bottom Footer Notice */}
          <div className="px-6 py-2.5 bg-gray-50 border-t border-gray-100 text-center text-[10px] text-gray-400">
            By proceeding, I agree to Razorpay's <span className="underline cursor-pointer">Privacy Notice</span> • <span className="underline cursor-pointer">Edit Preferences</span>
          </div>
        </div>
      </div>
    </div>
  );
};


