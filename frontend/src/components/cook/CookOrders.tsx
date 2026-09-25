import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Clock,
  MapPin,
  Bike,
  User,
  CheckCircle2,
  AlertCircle,
  Phone,
  Filter,
  Search,
  ChefHat,
} from 'lucide-react';

export const CookOrders: React.FC = () => {
  const { currentCookProfile, orders, updateOrderStatus } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const cookOrders = (orders || []).filter((o) => currentCookProfile && o.cookName === currentCookProfile.name);

  const filteredOrders = cookOrders.filter((order) => {
    const matchStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.mealName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ((order as any).items && (order as any).items.some((i: any) => i.mealName.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-[#1a1c1c] tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#944a00]" />
          <span>Kitchen Order Processing Pipeline</span>
        </h2>
        <p className="text-xs sm:text-sm text-[#564337]">
          Manage incoming meal orders, update prep stages, and hand off packed tiffins to delivery partners.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#dcc1b1]/60 shadow-2xs flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#564337] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search order ID or customer name..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#faf9f8] border border-[#dcc1b1] rounded-xl text-[#1a1c1c]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
          {['All', 'Confirmed', 'Preparing', 'Picked Up', 'Out for Delivery', 'Delivered'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  filterStatus === status
                    ? 'bg-[#944a00] text-white shadow-2xs'
                    : 'bg-[#faf9f8] text-[#564337] hover:bg-[#eeeeed] border border-[#dcc1b1]/40'
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-8 text-center space-y-2">
            <ShoppingBag className="w-10 h-10 text-[#564337]/40 mx-auto" />
            <h3 className="font-bold text-sm text-[#1a1c1c]">No orders found for this filter</h3>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-[#dcc1b1]/60 p-5 shadow-2xs space-y-4 hover:shadow-xs transition-all"
            >
              {/* Order Head */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-[#eeeeed]">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-[#1a1c1c]">{order.id}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      order.status === 'Confirmed'
                        ? 'bg-amber-100 text-amber-900'
                        : order.status === 'Preparing'
                        ? 'bg-[#ffdcc5] text-[#944a00]'
                        : order.status === 'Delivered'
                        ? 'bg-[#d1e6c9] text-[#51634c]'
                        : 'bg-blue-100 text-blue-900'
                    }`}
                  >
                    ● {order.status}
                  </span>
                  <span className="text-xs text-[#564337]">Slot: {order.deliveryTimeSlot}</span>
                </div>

                <div className="text-xs font-extrabold text-[#944a00]">
                  Amount: ₹{order.totalAmount} (Paid Online)
                </div>
              </div>

              {/* Order Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                {/* Customer Details */}
                <div className="md:col-span-4 space-y-1 bg-[#faf9f8] p-3 rounded-xl border border-[#dcc1b1]/40">
                  <div className="font-bold text-[#1a1c1c] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#564337]" />
                    <span>Customer: {order.customerName}</span>
                  </div>
                  <div className="text-[#564337] flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#564337]" />
                    <a href={`tel:${order.customerPhone}`} className="hover:underline">
                      {order.customerPhone}
                    </a>
                  </div>
                  <div className="text-[#564337] flex items-start gap-1 pt-1">
                    <MapPin className="w-3 h-3 text-[#944a00] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.customerAddress}</span>
                  </div>
                </div>

                {/* Items in Order */}
                <div className="md:col-span-5 space-y-1.5">
                  <div className="font-bold text-[#1a1c1c]">Prepared Meal Items:</div>
                  {(order as any).items ? (
                    (order as any).items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-[#564337]">
                        <span>
                          {item.quantity}x {item.mealName}
                        </span>
                        <span className="font-semibold text-[#1a1c1c]">₹{(item.price || item.pricePerUnit) * item.quantity}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex justify-between text-[#564337]">
                      <span>
                        {order.quantity}x {order.mealName}
                      </span>
                      <span className="font-semibold text-[#1a1c1c]">₹{order.pricePerUnit * order.quantity}</span>
                    </div>
                  )}
                  {order.specialNotes && (
                    <div className="mt-2 p-2 bg-[#ffdcc5]/40 rounded-lg text-[11px] text-[#944a00] font-medium">
                      Customer Note: "{order.specialNotes}"
                    </div>
                  )}
                </div>

                {/* Delivery Rider & Pipeline Action */}
                <div className="md:col-span-3 flex flex-col justify-between space-y-2">
                  <div className="bg-[#faf9f8] p-2.5 rounded-xl border border-[#dcc1b1]/40">
                    <div className="text-[11px] font-bold text-[#4e6074] flex items-center gap-1">
                      <Bike className="w-3.5 h-3.5" /> Delivery Partner
                    </div>
                    <div className="text-xs font-semibold text-[#1a1c1c] mt-0.5">
                      {order.deliveryPartnerName || 'Assigning...'}
                    </div>
                  </div>

                  {/* Cook Actions */}
                  <div className="space-y-1.5">
                    {order.status === 'Confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Preparing')}
                        className="w-full py-2 bg-[#944a00] hover:bg-[#713700] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ChefHat className="w-3.5 h-3.5" />
                        <span>Accept & Start Prepping</span>
                      </button>
                    )}
                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                        className="w-full py-2 bg-[#51634c] hover:bg-[#3d4b39] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Bike className="w-3.5 h-3.5" />
                        <span>Handover to Rider (Ready)</span>
                      </button>
                    )}
                    {order.status === 'Picked Up' && (
                      <div className="space-y-1">
                        <div className="text-center text-[11px] font-bold text-[#4e6074] py-1 bg-blue-50 rounded-lg">
                          Dispatched with Rider
                        </div>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'Delivered')}
                          className="w-full py-1.5 bg-[#51634c] hover:bg-[#3d4b39] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          Mark as Delivered ✓
                        </button>
                      </div>
                    )}
                    {order.status === 'Delivered' && (
                      <div className="text-center text-[11px] font-bold text-[#51634c] py-1 bg-[#d1e6c9]/40 rounded-lg">
                        ✓ Completed & Delivered
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
