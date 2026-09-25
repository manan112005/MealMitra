import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth, getDeterministicAvatar } from '../../context/AuthContext';
import { Users, ChefHat, Bike, Search, Phone, Mail, MapPin, ShoppingBag, Calendar, CheckCircle, Clock } from 'lucide-react';

export const AvatarImage: React.FC<{
  src?: string;
  name: string;
  className?: string;
  variant?: 'customer' | 'cook' | 'delivery';
}> = ({ src, name, className = 'w-10 h-10', variant = 'customer' }) => {
  const [hasError, setHasError] = useState(false);
  const initial = name ? name.trim().charAt(0).toUpperCase() : 'U';

  const colorStyles = {
    customer: 'bg-[#ffdcc5] text-[#944a00] border-[#dcc1b1]/50',
    cook: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    delivery: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  if (!src || hasError) {
    return (
      <div className={`${className} rounded-full flex items-center justify-center font-extrabold text-sm border shadow-2xs shrink-0 select-none ${colorStyles[variant]}`}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      onError={() => setHasError(true)}
      className={`${className} rounded-full object-cover border border-[#dcc1b1]/40 shrink-0`}
    />
  );
};

export const AdminUsers: React.FC = () => {
  const { cooks, deleteCook, orders, subscriptions, clusterStops } = useApp();
  const { users, updateUserStatus } = useAuth();
  const [activeTab, setActiveTab] = useState<'customers' | 'cooks' | 'delivery'>('customers');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all distinct customers from auth users + orders + subscriptions
  const authCustomers = users.filter(u => u.role === 'customer');
  const allCustomerIdentifiers = new Set<string>();
  authCustomers.forEach(c => allCustomerIdentifiers.add(c.name.toLowerCase()));
  orders.forEach(o => allCustomerIdentifiers.add(o.customerName.toLowerCase()));
  subscriptions.forEach(s => allCustomerIdentifiers.add(s.customerName.toLowerCase()));

  const customerList = Array.from(allCustomerIdentifiers).map(nameLower => {
    const authUser = authCustomers.find(u => u.name.toLowerCase() === nameLower);
    const userOrders = orders.filter(o => o.customerName.toLowerCase() === nameLower);
    const userSubs = subscriptions.filter(s => s.customerName.toLowerCase() === nameLower && s.status === 'Active');
    const totalSpent = userOrders.reduce((sum, o) => sum + o.totalAmount, 0) + 
      userSubs.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    
    const address = authUser?.applicationDetails?.address || 
      userOrders[0]?.customerAddress || 
      userSubs[0]?.deliveryAddress || 
      'A-402, Shivalik Residency, Navrangpura, Ahmedabad';
    
    const phone = authUser?.phone || (nameLower.includes('vaidehi') ? '7385738512' : '9825123456');
    const email = authUser?.email || `${nameLower.replace(/\s+/g, '')}@mealmitra.com`;
    const resolvedName = authUser?.name || userOrders[0]?.customerName || userSubs[0]?.customerName || 'Customer';
    
    // Check avatar: prioritize auth user avatar, then specific known avatars, or null for graceful initial fallback
    let avatar = authUser?.avatar;
    if (!avatar || avatar.includes('dicebear')) {
      if (nameLower.includes('manan')) {
        avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
      } else if (nameLower.includes('vaidehi')) {
        avatar = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80';
      } else {
        avatar = '';
      }
    }

    return {
      id: authUser?.id || `cust-${nameLower.replace(/\s+/g, '-')}`,
      name: resolvedName,
      phone,
      email,
      address,
      orderCount: userOrders.length,
      activeSubsCount: userSubs.length,
      totalSpent,
      status: authUser?.status || 'approved',
      avatar,
      rawAuth: authUser
    };
  });

  // Delivery fleet (real registered delivery partners)
  const authDelivery = users.filter(u => u.role === 'delivery' && u.name !== 'Hardik Joshi' && u.name !== 'Ramesh Patel');
  const defaultDeliveryPartners = [
    {
      id: 'usr-del-manan',
      name: 'MANAN PATEL (Fleet Lead)',
      phone: '9825123456',
      email: 'patelmanan4057@gmail.com',
      vehicle: 'Hero Electric Optima (EV Bike)',
      status: 'approved',
      assignedStops: clusterStops.length,
      completedToday: orders.filter(o => o.status === 'Delivered').length,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const deliveryList = authDelivery.length > 0 ? authDelivery.map(d => {
    const assigned = clusterStops.length;
    const completed = orders.filter(o => o.status === 'Delivered').length;
    return {
      id: d.id,
      name: d.name,
      phone: d.phone || '9825123456',
      email: d.email || 'delivery@mealmitra.com',
      vehicle: d.applicationDetails?.vehicleType || 'Hero Electric Optima (EV Bike)',
      status: d.status,
      assignedStops: assigned,
      completedToday: completed,
      avatar: d.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };
  }) : defaultDeliveryPartners;

  // Filtered lists based on search
  const filteredCustomers = customerList.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCooks = cooks.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  const filteredDelivery = deliveryList.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.phone.includes(searchQuery) ||
    d.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1a1c1c]">User Management</h2>
          <p className="text-[#564337] mt-1">Live real-time accounts across Customers, Home Cooks, and Delivery Fleet</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#564337]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, phone, area..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dcc1b1] rounded-xl text-sm focus:outline-none focus:border-[#944a00] focus:ring-1 focus:ring-[#944a00]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-[#dcc1b1]/50 w-full sm:w-fit shadow-xs">
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none justify-center
            ${activeTab === 'customers' ? 'bg-[#944a00] text-white shadow-md' : 'text-[#564337] hover:bg-[#faf9f8]'}`}
        >
          <Users className="w-4 h-4" /> 
          <span>Customers</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${activeTab === 'customers' ? 'bg-white/20 text-white' : 'bg-[#f4efe6] text-[#564337]'}`}>
            {customerList.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('cooks')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none justify-center
            ${activeTab === 'cooks' ? 'bg-[#006e2c] text-white shadow-md' : 'text-[#564337] hover:bg-[#faf9f8]'}`}
        >
          <ChefHat className="w-4 h-4" /> 
          <span>Home Cooks</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${activeTab === 'cooks' ? 'bg-white/20 text-white' : 'bg-[#f4efe6] text-[#564337]'}`}>
            {cooks.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('delivery')}
          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all flex-1 sm:flex-none justify-center
            ${activeTab === 'delivery' ? 'bg-[#005cb8] text-white shadow-md' : 'text-[#564337] hover:bg-[#faf9f8]'}`}
        >
          <Bike className="w-4 h-4" /> 
          <span>Delivery Fleet</span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${activeTab === 'delivery' ? 'bg-white/20 text-white' : 'bg-[#f4efe6] text-[#564337]'}`}>
            {deliveryList.length}
          </span>
        </button>
      </div>

      {/* Content table */}
      <div className="bg-white rounded-2xl border border-[#dcc1b1]/50 shadow-xs overflow-hidden">
        {/* CUSTOMERS TAB */}
        {activeTab === 'customers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/40 text-xs font-bold text-[#564337] uppercase tracking-wider">
                  <th className="p-4">Customer Profile</th>
                  <th className="p-4">Delivery Address</th>
                  <th className="p-4">Direct Orders</th>
                  <th className="p-4">Active Subscriptions</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4">Account Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dcc1b1]/20">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#faf9f8]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <AvatarImage src={cust.avatar} name={cust.name} variant="customer" className="w-10 h-10" />
                        <div>
                          <p className="font-bold text-[#1a1c1c] text-sm">{cust.name}</p>
                          <div className="flex items-center gap-2 text-xs text-[#564337] mt-0.5">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#944a00]" /> {cust.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#1a1c1c] max-w-[220px]">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#944a00] shrink-0 mt-0.5" />
                        <span className="truncate">{cust.address}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-orange-50 text-[#944a00]">
                        <ShoppingBag className="w-3.5 h-3.5" /> {cust.orderCount} Orders
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700">
                        <Calendar className="w-3.5 h-3.5" /> {cust.activeSubsCount} Active
                      </span>
                    </td>
                    <td className="p-4 text-sm font-extrabold text-[#1a1c1c]">
                      ₹{cust.totalSpent.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-emerald-50 text-emerald-700">
                        <CheckCircle className="w-3 h-3" /> Verified Active
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => alert(`Customer Details:\nName: ${cust.name}\nPhone: ${cust.phone}\nAddress: ${cust.address}\nTotal Spend: ₹${cust.totalSpent}`)}
                        className="px-3 py-1.5 bg-[#f4efe6] hover:bg-[#ebd9c8] text-[#944a00] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCustomers.length === 0 && (
              <div className="p-12 text-center text-[#564337]">
                <Users className="w-10 h-10 text-[#dcc1b1] mx-auto mb-2" />
                <p className="font-bold">No customers found</p>
              </div>
            )}
          </div>
        )}

        {/* COOKS TAB */}
        {activeTab === 'cooks' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/40 text-xs font-bold text-[#564337] uppercase tracking-wider">
                  <th className="p-4">Home Chef Profile</th>
                  <th className="p-4">Kitchen Location</th>
                  <th className="p-4">Rating & Reviews</th>
                  <th className="p-4">Dishes Offered</th>
                  <th className="p-4">Meals Delivered</th>
                  <th className="p-4">Kitchen Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dcc1b1]/20">
                {filteredCooks.map((cook) => (
                  <tr key={cook.id} className="hover:bg-[#faf9f8]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <AvatarImage src={cook.avatar} name={cook.name} variant="cook" className="w-11 h-11" />
                        <div>
                          <p className="font-bold text-[#1a1c1c] text-sm">{cook.name}</p>
                          <p className="text-xs text-[#564337] flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-[#006e2c]" /> {cook.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#1a1c1c] max-w-[200px]">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#006e2c] shrink-0 mt-0.5" />
                        <span className="truncate">{cook.location}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#1a1c1c] bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-xs">★ {cook.rating.toFixed(1)}</span>
                        <span className="text-xs text-[#564337]">({cook.reviewsCount} reviews)</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-[#1a1c1c]">
                      {cook.dishes?.length || 0} Special Menus
                    </td>
                    <td className="p-4 text-sm font-bold text-[#1a1c1c]">
                      {cook.mealsDelivered} meals
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${cook.kitchenOpen ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
                        {cook.kitchenOpen ? '● Kitchen Open' : '○ Closed'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Remove cook "${cook.name}" from active listings?`)) {
                            deleteCook(cook.id);
                          }
                        }}
                        className="text-red-600 font-bold text-xs hover:underline cursor-pointer px-3 py-1.5 rounded-lg hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCooks.length === 0 && (
              <div className="p-12 text-center text-[#564337]">
                <ChefHat className="w-10 h-10 text-[#dcc1b1] mx-auto mb-2" />
                <p className="font-bold">No home cooks found</p>
              </div>
            )}
          </div>
        )}

        {/* DELIVERY FLEET TAB */}
        {activeTab === 'delivery' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#faf9f8] border-b border-[#dcc1b1]/40 text-xs font-bold text-[#564337] uppercase tracking-wider">
                  <th className="p-4">Rider Details</th>
                  <th className="p-4">Assigned Vehicle</th>
                  <th className="p-4">Cluster Stops Active</th>
                  <th className="p-4">Completed Deliveries</th>
                  <th className="p-4">Fleet Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#dcc1b1]/20">
                {filteredDelivery.map((rider) => (
                  <tr key={rider.id} className="hover:bg-[#faf9f8]/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <AvatarImage src={rider.avatar} name={rider.name} variant="delivery" className="w-11 h-11" />
                        <div>
                          <p className="font-bold text-[#1a1c1c] text-sm">{rider.name}</p>
                          <p className="text-xs text-[#564337] flex items-center gap-1 mt-0.5"><Phone className="w-3 h-3 text-[#005cb8]" /> {rider.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-semibold text-[#1a1c1c]">
                      {rider.vehicle}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-[#005cb8]">
                        <MapPin className="w-3.5 h-3.5" /> {rider.assignedStops} Cluster Stops
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-[#1a1c1c]">
                      {rider.completedToday} orders completed
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-emerald-50 text-emerald-700">
                        <CheckCircle className="w-3 h-3" /> Active on Route
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => alert(`Delivery Partner: ${rider.name}\nVehicle: ${rider.vehicle}\nActive Route Stops: ${rider.assignedStops}`)}
                        className="px-3 py-1.5 bg-[#f4efe6] hover:bg-[#ebd9c8] text-[#005cb8] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        Inspect Route
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredDelivery.length === 0 && (
              <div className="p-12 text-center text-[#564337]">
                <Bike className="w-10 h-10 text-[#dcc1b1] mx-auto mb-2" />
                <p className="font-bold">No delivery partners found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

