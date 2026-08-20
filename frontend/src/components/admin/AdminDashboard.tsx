import React from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingUp, Users, ChefHat, Bike, Activity, ClipboardList, Banknote } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders, cooks } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const activeOrders = orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length;
  const platformFee = totalRevenue * 0.15; // 15% platform fee

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">Platform Overview</h2>
          <p className="text-[#564337] mt-1">Real-time metrics and system health</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          System Live
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Users className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#564337]">Customers</h3>
          </div>
          <div className="text-3xl font-bold text-[#1a1c1c]">1,248</div>
          <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% this week
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <ChefHat className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#564337]">Home Cooks</h3>
          </div>
          <div className="text-3xl font-bold text-[#1a1c1c]">{cooks.length}</div>
          <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +3 pending approval
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Bike className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bike className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#564337]">Delivery Partners</h3>
          </div>
          <div className="text-3xl font-bold text-[#1a1c1c]">45</div>
          <p className="text-xs text-[#564337] mt-2 font-medium">
            18 currently active
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Banknote className="w-24 h-24" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-[#564337]">Platform Revenue</h3>
          </div>
          <div className="text-3xl font-bold text-[#1a1c1c]">₹{platformFee.toLocaleString()}</div>
          <p className="text-xs text-[#564337] mt-2 font-medium">
            Gross Volume: ₹{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#dcc1b1]/50 shadow-2xs">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-[#1a1c1c] text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Live Platform Activity
            </h3>
            <button className="text-indigo-600 text-xs font-semibold hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {orders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-start justify-between p-3 rounded-xl hover:bg-[#faf9f8] transition-colors border border-transparent hover:border-[#dcc1b1]/30">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img src={order.mealImage} alt={order.mealName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1a1c1c]">{order.customerName} ordered {order.mealName}</p>
                    <p className="text-xs text-[#564337] mt-0.5">from {order.cookName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-indigo-100 text-indigo-700'}`}>
                    {order.status}
                  </span>
                  <p className="text-[10px] text-[#564337] mt-1">{order.orderTime}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-700 p-6 rounded-2xl shadow-lg relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 opacity-20 pointer-events-none">
            <ClipboardList className="w-48 h-48" />
          </div>
          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-2">Live Order Status</h3>
            <p className="text-indigo-100 text-sm mb-6">Real-time overview of current order cycle</p>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-indigo-50">Confirmed / Preparing</span>
                  <span className="font-bold">{activeOrders} active</span>
                </div>
                <div className="w-full bg-indigo-900 rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-indigo-50">Out for Delivery</span>
                  <span className="font-bold">12 en route</span>
                </div>
                <div className="w-full bg-indigo-900 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-indigo-50">Successfully Delivered Today</span>
                  <span className="font-bold">84 delivered</span>
                </div>
                <div className="w-full bg-indigo-900 rounded-full h-2">
                  <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
            
            <button className="mt-8 w-full py-2.5 bg-white text-indigo-700 font-bold rounded-xl shadow-md hover:bg-indigo-50 transition-colors">
              Manage Live Operations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
