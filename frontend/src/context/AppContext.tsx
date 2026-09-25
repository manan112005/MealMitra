import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, normalizePhone } from './AuthContext';
import {
  UserRole,
  CustomerTab,
  CookTab,
  DeliveryTab,
  AdminTab,
  Meal,
  CookProfile,
  Order,
  SubscriptionPlan,
  UserSubscription,
  Review,
  DeliveryAssignment,
  ClusterRouteStop,
  RouteStop,
  DeliveryPartnerState,
  DayMenuSchedule,
  MealSlotItem,
  WaitlistEntry,
  UpcomingMealSlot,
  AppNotification,
} from '../types';
import {
  MOCK_COOKS,
  MOCK_MEALS,
  MOCK_ORDERS,
  MOCK_SUBSCRIPTION_PLANS,
  MOCK_USER_SUBSCRIPTION,
  MOCK_REVIEWS,
  MOCK_DELIVERY_ASSIGNMENTS,
  MOCK_SMART_CLUSTER_STOPS,
  MOCK_DELIVERY_PARTNER_STATE,
  MOCK_ROUTE_STOPS,
  INITIAL_WEEKLY_MENU,
} from '../data/mockData';
import { cookService } from '../services/cook.service';
import { mealService } from '../services/meal.service';
import { orderService } from '../services/order.service';
import { subscriptionService } from '../services/subscription.service';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  cookTab: CookTab;
  setCookTab: (tab: CookTab) => void;
  deliveryTab: DeliveryTab;
  setDeliveryTab: (tab: DeliveryTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Selected Cook for Detail Profile View
  selectedCookId: string | null;
  setSelectedCookId: (id: string | null) => void;

  // Selected Meal for Order modal
  selectedMealForOrder: Meal | null;
  setSelectedMealForOrder: (meal: Meal | null) => void;

  // Data
  cooks: CookProfile[];
  meals: Meal[];
  orders: Order[];
  subscriptionPlans: SubscriptionPlan[];
  subscriptions: UserSubscription[];
  userSubscription: UserSubscription | null;
  reviews: Review[];
  deliveryAssignments: DeliveryAssignment[];
  clusterStops: ClusterRouteStop[];
  routeStops: RouteStop[];
  deliveryPartnerState: DeliveryPartnerState;
  notifications: AppNotification[];

  waitlist: WaitlistEntry[];

  // Active Cook logged in state
  activeCookId: string;
  setActiveCookId: (id: string) => void;
  currentCookProfile: CookProfile;

  // Actions
  toggleFollowCook: (cookId: string) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
  placeOrder: (orderData: {
    meal: Meal;
    quantity: number;
    address: string;
    phone: string;
    timeSlot: string;
    specialNotes?: string;
    bookingDate?: string;
    mealPeriod?: 'Lunch' | 'Dinner';
    fulfillmentType?: 'Delivery' | 'Pickup';
    bookingType?: 'one_time' | 'subscription';
  }) => string;
  joinWaitlist: (data: {
    cookId: string;
    cookName: string;
    mealId: string;
    mealName: string;
    customerName: string;
    customerPhone: string;
    date: string;
    mealPeriod: 'Lunch' | 'Dinner';
  }) => Promise<string>;
  skipSubscriptionMeal: (slotId: string, date: string, mealPeriod: 'Lunch' | 'Dinner') => Promise<boolean>;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  updateKitchenStatus: (cookId: string, open: boolean) => void;
  updateKitchenQuantities: (
    cookId: string,
    lunchAvail: number,
    lunchTotal: number,
    dinnerAvail: number,
    dinnerTotal: number
  ) => void;
  updateCookWeeklyMenu: (cookId: string, day: string, mealType: 'lunch' | 'dinner', menuData: any) => void;
  updateCookWeeklyMenuSlot: (
    cookId: string,
    days: string[],
    mealType: 'lunch' | 'dinner',
    mealData: MealSlotItem
  ) => void;
  removeCookWeeklyMealSlot: (
    cookId: string,
    day: string,
    mealType: 'lunch' | 'dinner'
  ) => void;
  autofillCookWeeklyMenu: (cookId: string) => void;
  updateCookProfile: (cookId: string, updated: Partial<CookProfile>) => void;
  addCook: (cookData: Partial<CookProfile>) => CookProfile;
  deleteCook: (cookId: string) => void;
  clearMockCooks: () => void;
  getCookSubscriptionPlans: (cookId: string) => SubscriptionPlan[];
  updateCookSubscriptionPlans: (cookId: string, plans: SubscriptionPlan[]) => void;
  updateUserSubscription: (updated: Partial<UserSubscription>) => void;
  subscribeToPlan: (
    plan: SubscriptionPlan,
    details: {
      cookId?: string;
      cookName?: string;
      cookAvatar?: string;
      address: string;
      officeAddress?: string;
      lunchTiming: string;
      dinnerTiming: string;
      dietaryNotes?: string;
    }
  ) => void;
  addReview: (review: Omit<Review, 'id' | 'date' | 'likes'>) => void;
  confirmPickup: (assignmentId: string) => void;
  startDelivery: (assignmentId: string) => void;
  markDelivered: (assignmentId: string) => void;
  updateClusterStopStatus: (stopId: string, status: 'Completed' | 'Current' | 'Pending') => void;
  updateDeliveryDuty: (isOnDuty: boolean) => void;
  completeRouteStop: (stopId: string) => void;
  resetAllData: () => void;
  addMeal: (meal: Omit<Meal, 'id'>) => void;
  updateMeal: (mealId: string, updated: Partial<Meal>) => void;
  deleteMeal: (mealId: string) => void;
}

export const getDefaultCookSubscriptionPlans = (cookName: string = 'Home Kitchen', cookId: string = 'cook-default'): SubscriptionPlan[] => [
  {
    id: `plan-${cookId}-lunch`,
    cookId,
    cookName,
    type: 'Monthly',
    category: 'Lunch Only',
    name: `${cookName} Daily Office Lunch Tiffin`,
    price: 3499,
    billingPeriod: '/ month (26 lunch meals)',
    mealsCount: 26,
    deliveryTimeWindow: '12:30 PM – 1:30 PM',
    description: `Hot, nutritious home-cooked lunch packed fresh daily by ${cookName} and delivered directly to your office desk.`,
    features: [
      '26 Fresh Homestyle Lunch Meals',
      'Daily rotating sabzi, dal, 4 ghee phulkas & rice',
      'Free office desk or home delivery',
      'Pause or skip meals anytime with 3h notice',
      'Zero-spill thermal tiffin carrier included',
    ],
    terms: [
      'Skip cutoff: 10:30 AM on delivery day',
      'Valid for 30 calendar days from start',
      'Up to 7 days pause allowance without penalty',
    ],
    isPopular: false,
  },
  {
    id: `plan-${cookId}-dinner`,
    cookId,
    cookName,
    type: 'Monthly',
    category: 'Dinner Only',
    name: `${cookName} Evening Comfort Dinner Plan`,
    price: 3799,
    billingPeriod: '/ month (26 dinner meals)',
    mealsCount: 26,
    deliveryTimeWindow: '7:30 PM – 8:30 PM',
    description: `Light, wholesome and comforting homestyle dinners prepared by ${cookName} to unwind your evenings without cooking fatigue.`,
    features: [
      '26 Wholesome Dinner Meals',
      'Comfort menu: khichdi, kadhi, soft rotis & light sabzi',
      'Free evening doorstep delivery',
      'Digestives & fresh salad/chaas included',
      'Instant weekend customization',
    ],
    terms: [
      'Skip cutoff: 5:30 PM on delivery day',
      'Valid for 30 calendar days',
      'Up to 7 days pause allowance',
    ],
    isPopular: false,
  },
  {
    id: `plan-${cookId}-full`,
    cookId,
    cookName,
    type: 'Monthly',
    category: 'Lunch + Dinner',
    name: `${cookName} Full Day Care (Lunch + Dinner)`,
    price: 6499,
    billingPeriod: '/ month (52 meals)',
    mealsCount: 52,
    deliveryTimeWindow: 'Lunch 12:30 PM | Dinner 7:30 PM',
    description: `Complete zero-cooking lifestyle care by ${cookName}. Nutritious lunch delivered at work + comforting dinner at home.`,
    features: [
      '52 Total Meals (26 Lunch + 26 Dinner)',
      'Dual address delivery: Office for lunch, Home for dinner',
      'Priority kitchen prep slot & zero delays',
      'Unlimited pause & skip with instant waitlist credits',
      'Dedicated WhatsApp support from chef',
    ],
    terms: [
      'Dual delivery included across all active cluster routes',
      'Valid for 30 calendar days',
      'Up to 10 days pause allowance',
    ],
    isPopular: true,
  },
  {
    id: `plan-${cookId}-trial`,
    cookId,
    cookName,
    type: '15 Days',
    category: 'Lunch Only',
    name: `${cookName} 15-Day Taste Trial Tiffin`,
    price: 1999,
    billingPeriod: '/ 15 days (13 meals)',
    mealsCount: 13,
    deliveryTimeWindow: '12:30 PM – 1:30 PM',
    description: `Try out ${cookName}'s fresh cooking with zero long-term commitment. 13 authentic homestyle meals.`,
    features: [
      '13 Fresh Lunch Meals',
      'Taste all chef specialties with zero lock-in',
      'Includes sweet on Wednesdays & Fridays',
      'Skip up to 3 meals anytime',
    ],
    terms: [
      'Valid for 15 calendar days',
      'Non-transferable trial voucher',
    ],
    isPopular: false,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [role, setRoleState] = useState<UserRole>(() => {
    const savedUser = localStorage.getItem('mealmitra_currentUser');
    if (!savedUser) return 'entry';
    const saved = localStorage.getItem('mealmitra_role');
    return (saved as UserRole) || 'entry';
  });

  const [customerTab, setCustomerTabState] = useState<CustomerTab>(() => {
    return (localStorage.getItem('mealmitra_customer_tab') as CustomerTab) || 'dashboard';
  });
  const [cookTab, setCookTabState] = useState<CookTab>(() => {
    return (localStorage.getItem('mealmitra_cook_tab') as CookTab) || 'dashboard';
  });
  const [deliveryTab, setDeliveryTabState] = useState<DeliveryTab>(() => {
    return (localStorage.getItem('mealmitra_delivery_tab') as DeliveryTab) || 'dashboard';
  });
  const [adminTab, setAdminTabState] = useState<AdminTab>(() => {
    return (localStorage.getItem('mealmitra_admin_tab') as AdminTab) || 'dashboard';
  });

  const setCustomerTab = (tab: CustomerTab) => {
    setCustomerTabState(tab);
    localStorage.setItem('mealmitra_customer_tab', tab);
  };
  const setCookTab = (tab: CookTab) => {
    setCookTabState(tab);
    localStorage.setItem('mealmitra_cook_tab', tab);
  };
  const setDeliveryTab = (tab: DeliveryTab) => {
    setDeliveryTabState(tab);
    localStorage.setItem('mealmitra_delivery_tab', tab);
  };
  const setAdminTab = (tab: AdminTab) => {
    setAdminTabState(tab);
    localStorage.setItem('mealmitra_admin_tab', tab);
  };

  const [selectedCookId, setSelectedCookId] = useState<string | null>(null);
  const [selectedMealForOrder, setSelectedMealForOrder] = useState<Meal | null>(null);

  const [cooks, setCooks] = useState<CookProfile[]>(() => {
    try {
      const saved = localStorage.getItem('mealmitra_cooks');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter(
          (c: CookProfile) =>
            !['cook-1', 'cook-2', 'cook-3', 'cook-4', 'cook-5'].includes(c.id) &&
            !['Nirmala Devi', 'Chef Maria Fernandes', 'Aunt Sarah', 'Cook David', 'Ananya Sharma'].includes(c.name)
        );
      }
    } catch {}
    return [];
  });

  const [meals, setMeals] = useState<Meal[]>(() => {
    try {
      const saved = localStorage.getItem('mealmitra_meals');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter(
          (m: Meal) =>
            !['meal-1', 'meal-2', 'meal-3', 'meal-4', 'meal-5', 'meal-6'].includes(m.id) &&
            !['cook-1', 'cook-2', 'cook-3', 'cook-4', 'cook-5'].includes(m.cookId)
        );
      }
    } catch {}
    return [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('mealmitra_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter(
          (o: Order) =>
            !['cook-1', 'cook-2', 'cook-3', 'cook-4', 'cook-5'].includes(o.cookId) &&
            o.customerName !== 'Jay Shah'
        );
      }
    } catch {}
    return [];
  });

  const [subscriptionPlans] = useState<SubscriptionPlan[]>(MOCK_SUBSCRIPTION_PLANS);

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>(() => {
    try {
      const saved = localStorage.getItem('mealmitra_subscriptions');
      if (saved) {
        const parsed = JSON.parse(saved) as UserSubscription[];
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (s) =>
              !['Nirmala Devi', 'Chef Maria Fernandes', 'Aunt Sarah', 'Cook David'].includes(s.cookName) &&
              !['Jay Shah', 'Priya Mehta', 'Aarav Sharma', 'Meera Trivedi'].includes(s.customerName)
          );
        }
      }
    } catch {}
    return [];
  });

  const userSubscription = React.useMemo(() => {
    if (!currentUser) return null;
    return (
      subscriptions.find(
        (s) =>
          (s.customerId && s.customerId === currentUser.id) ||
          (s.customerName && s.customerName.toLowerCase() === currentUser.name.toLowerCase()) ||
          (currentUser.phone && s.customerPhone && normalizePhone(s.customerPhone) === normalizePhone(currentUser.phone))
      ) ||
      subscriptions[0] ||
      null
    );
  }, [subscriptions, currentUser]);

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mealmitra_reviews');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (r: Review) =>
              !['rev-1', 'rev-2', 'rev-3'].includes(r.id) &&
              !['Nirmala Devi', 'Chef Maria Fernandes', 'Ananya Sharma', 'Aunt Sarah', 'Cook David'].includes(r.cookName) &&
              !['Jay Shah', 'Pooja Verma', 'Rohan Mehra'].includes(r.customerName)
          );
        }
      } catch {
        return [];
      }
    }
    return [];
  });

  const [deliveryAssignments, setDeliveryAssignments] = useState<DeliveryAssignment[]>(() => {
    try {
      const saved = localStorage.getItem('mealmitra_delivery_assignments');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter(
          (d: DeliveryAssignment) =>
            !['cook-1', 'cook-2', 'cook-3', 'cook-4', 'cook-5'].includes(d.cookId) &&
            d.customerName !== 'Jay Shah'
        );
      }
    } catch {}
    return [];
  });

  const [clusterStops, setClusterStops] = useState<ClusterRouteStop[]>(() => {
    try {
      const saved = localStorage.getItem('mealmitra_cluster_stops');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter((c: ClusterRouteStop) => !c.title?.includes('Jay Shah'));
      }
    } catch {}
    return [];
  });

  const [deliveryPartnerState, setDeliveryPartnerState] = useState<DeliveryPartnerState>(() => {
    const saved = localStorage.getItem('mealmitra_delivery_partner');
    return saved ? JSON.parse(saved) : MOCK_DELIVERY_PARTNER_STATE;
  });

  const [routeStops, setRouteStops] = useState<RouteStop[]>(() => {
    try {
      const saved = localStorage.getItem('mealmitra_route_stops');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.filter((r: RouteStop) => r.targetName !== 'Jay Shah');
      }
    } catch {}
    return [];
  });

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    const saved = localStorage.getItem('mealmitra_waitlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem('mealmitra_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeCookId, setActiveCookId] = useState<string>('');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('mealmitra_role', newRole);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addNotification = (notifData: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      ...notifData,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    localStorage.setItem('mealmitra_cooks', JSON.stringify(cooks));
  }, [cooks]);

  useEffect(() => {
    localStorage.setItem('mealmitra_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('mealmitra_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('mealmitra_subscriptions', JSON.stringify(subscriptions));
    if (userSubscription) {
      localStorage.setItem('mealmitra_subscription', JSON.stringify(userSubscription));
    }
  }, [subscriptions, userSubscription]);

  useEffect(() => {
    localStorage.setItem('mealmitra_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('mealmitra_delivery_assignments', JSON.stringify(deliveryAssignments));
  }, [deliveryAssignments]);

  useEffect(() => {
    localStorage.setItem('mealmitra_cluster_stops', JSON.stringify(clusterStops));
  }, [clusterStops]);

  useEffect(() => {
    localStorage.setItem('mealmitra_delivery_partner', JSON.stringify(deliveryPartnerState));
  }, [deliveryPartnerState]);

  useEffect(() => {
    localStorage.setItem('mealmitra_route_stops', JSON.stringify(routeStops));
  }, [routeStops]);

  useEffect(() => {
    localStorage.setItem('mealmitra_waitlist', JSON.stringify(waitlist));
  }, [waitlist]);

  useEffect(() => {
    localStorage.setItem('mealmitra_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const resolvedCook =
    (cooks && cooks.find((c) => c.id === activeCookId)) ||
    (cooks && cooks[0]);

  const realChefName =
    currentUser?.name ||
    currentUser?.applicationDetails?.chefName ||
    resolvedCook?.chefName ||
    'Home Cook';

  const kitchenBrandName =
    currentUser?.applicationDetails?.kitchenName ||
    resolvedCook?.name ||
    (currentUser?.name ? `${currentUser.name}'s Kitchen` : 'Home Kitchen');

  const currentCookProfile: CookProfile = resolvedCook
    ? {
        ...resolvedCook,
        name: resolvedCook.name || kitchenBrandName,
        chefName: currentUser?.name || resolvedCook.chefName || realChefName,
      }
    : {
        id: 'cook-default',
        name: kitchenBrandName,
        chefName: realChefName,
        avatar:
          currentUser?.avatar ||
          'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=500&q=80',
        coverImage:
          'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
        bio: `Fresh, hygienic and authentic homemade meals cooked daily with care by ${realChefName}. Pure home spices and wholesome recipes.`,
        cuisine: ['Homemade', 'North Indian', 'Gujarati'],
        rating: 5.0,
        reviewsCount: 0,
        experienceYears: 4,
        mealsDelivered: 0,
        followersCount: 0,
        distanceKm: 1.2,
        location:
          currentUser?.applicationDetails?.kitchenAddress ||
          currentUser?.applicationDetails?.city ||
          'Ahmedabad',
        phone: currentUser?.phone || '',
        kitchenOpen: true,
        lunchAvailableQty: 25,
        lunchTotalQty: 25,
        dinnerAvailableQty: 20,
        dinnerTotalQty: 20,
        specialties: ['Special Thali', 'Phulka Roti', 'Dal Tadka', 'Jeera Rice'],
        weeklyMenu: INITIAL_WEEKLY_MENU,
        hygieneRating: 'FSSAI Verified ★★★★★',
        lunchCutoffTime: '11:00 AM',
        dinnerCutoffTime: '6:00 PM',
        pickupAddress: currentUser?.applicationDetails?.kitchenAddress || 'Ahmedabad',
        certifications: ['FSSAI Certified Home Kitchen', 'Hygiene Standard A+'],
        repeatCustomerRate: 100,
        aspectRatings: { flavor: 5.0, spiciness: 4.8, portion: 5.0, punctuality: 5.0 },
      };

  const toggleFollowCook = (cookId: string) => {
    setCooks((prev) =>
      prev.map((c) => {
        if (c.id === cookId) {
          const isFollowing = !c.isFollowing;
          return {
            ...c,
            isFollowing,
            followersCount: isFollowing ? c.followersCount + 1 : Math.max(0, c.followersCount - 1),
          };
        }
        return c;
      })
    );
  };

  const placeOrder = (orderData: {
    meal: Meal;
    quantity: number;
    address: string;
    phone: string;
    timeSlot: string;
    specialNotes?: string;
    bookingDate?: string;
    mealPeriod?: 'Lunch' | 'Dinner';
    fulfillmentType?: 'Delivery' | 'Pickup';
    bookingType?: 'one_time' | 'subscription';
  }) => {
    const newOrderId = `MM-${Math.floor(1000 + Math.random() * 9000)}`;
    const isPickup = orderData.fulfillmentType === 'Pickup';
    const chosenPeriod = orderData.mealPeriod || (orderData.meal.category === 'Dinner' ? 'Dinner' : 'Lunch');
    const chosenDate = orderData.bookingDate || 'Today';

    const currentCustomerName = currentUser?.name || currentUser?.applicationDetails?.name || 'Customer';
    const currentCustomerPhone = orderData.phone || currentUser?.phone || '+91 98251 23456';
    const currentCustomerAddress = isPickup
      ? `${orderData.meal.cookName}'s Kitchen (Self Pickup)`
      : (orderData.address || currentUser?.applicationDetails?.address || 'Flat 402, Shivalik Residency, Navrangpura');

    const newOrder: Order = {
      id: newOrderId,
      cookId: orderData.meal.cookId,
      cookName: orderData.meal.cookName,
      cookAvatar: orderData.meal.cookAvatar,
      customerName: currentCustomerName,
      customerPhone: currentCustomerPhone,
      customerAddress: currentCustomerAddress,
      mealId: orderData.meal.id,
      mealName: orderData.meal.name,
      mealImage: orderData.meal.image,
      quantity: orderData.quantity,
      pricePerUnit: orderData.meal.price,
      totalAmount: orderData.meal.price * orderData.quantity,
      orderDate: chosenDate,
      orderTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      deliveryTimeSlot: orderData.timeSlot,
      status: 'Confirmed',
      deliveryPartnerName: isPickup ? 'Direct Kitchen Pickup' : 'Ramesh Patel',
      specialNotes: orderData.specialNotes,
      bookingType: orderData.bookingType || 'one_time',
      bookingDate: chosenDate,
      mealPeriod: chosenPeriod,
      fulfillmentType: orderData.fulfillmentType || 'Delivery',
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Decrease meal available qty
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id === orderData.meal.id) {
          return {
            ...m,
            availableQty: Math.max(0, m.availableQty - orderData.quantity),
          };
        }
        return m;
      })
    );

    // Decrease cook available qty according to meal period
    setCooks((prev) =>
      prev.map((c) => {
        if (c.id === orderData.meal.cookId) {
          const isLunch = chosenPeriod === 'Lunch';
          return {
            ...c,
            lunchAvailableQty: isLunch
              ? Math.max(0, c.lunchAvailableQty - orderData.quantity)
              : c.lunchAvailableQty,
            dinnerAvailableQty: !isLunch
              ? Math.max(0, c.dinnerAvailableQty - orderData.quantity)
              : c.dinnerAvailableQty,
            mealsDelivered: c.mealsDelivered + 1,
          };
        }
        return c;
      })
    );

    // If Delivery is chosen, register delivery assignment
    if (!isPickup) {
      const newDelivery: DeliveryAssignment = {
        id: `del-${Math.floor(200 + Math.random() * 800)}`,
        orderId: newOrderId,
        customerName: newOrder.customerName,
        customerPhone: newOrder.customerPhone,
        deliveryAddress: newOrder.customerAddress,
        cookId: orderData.meal.cookId,
        cookName: orderData.meal.cookName,
        pickupAddress: orderData.meal.cookName + ' Kitchen, Navrangpura',
        mealName: `${orderData.meal.name} (${orderData.quantity} Qty)`,
        quantity: orderData.quantity,
        distanceKm: 2.1,
        estimatedTimeMin: 20,
        earningAmount: 60,
        status: 'Assigned',
        pickupTimeWindow: 'Within 20 mins',
        deliveryTimeWindow: orderData.timeSlot,
      };

      setDeliveryAssignments((prev) => [newDelivery, ...prev]);
    }

    // Backend sync with central MealMitra backend
    orderService
      .placeOrder({
        mealId: orderData.meal.id,
        quantity: orderData.quantity,
        address: newOrder.customerAddress,
        phone: newOrder.customerPhone,
        timeSlot: orderData.timeSlot,
        specialNotes: orderData.specialNotes,
        bookingDate: chosenDate,
        mealPeriod: chosenPeriod,
        fulfillmentType: orderData.fulfillmentType || 'Delivery',
        bookingType: orderData.bookingType || 'one_time',
      })
      .catch((err) => {
        console.warn('Order backend sync note:', err);
      });

    addNotification({
      title: 'Order Placed Successfully',
      message: `Your order #${newOrderId} for ${orderData.meal.name} (Qty: ${orderData.quantity}) has been confirmed!`,
      type: 'order',
    });

    return newOrderId;
  };

  const joinWaitlist = async (data: {
    cookId: string;
    cookName: string;
    mealId: string;
    mealName: string;
    customerName: string;
    customerPhone: string;
    date: string;
    mealPeriod: 'Lunch' | 'Dinner';
  }) => {
    const newWaitlistId = `WL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry: WaitlistEntry = {
      id: newWaitlistId,
      ...data,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Waiting',
    };
    setWaitlist((prev) => [newEntry, ...prev]);

    try {
      await orderService.joinWaitlist(data);
    } catch (err) {
      console.warn('Waitlist backend sync note:', err);
    }
    return newWaitlistId;
  };

  const skipSubscriptionMeal = async (slotId: string, date: string, mealPeriod: 'Lunch' | 'Dinner') => {
    if (!userSubscription) return false;

    const updatedUpcoming = (userSubscription.upcomingMeals || []).map((m) => {
      if (m.id === slotId) {
        return { ...m, status: 'Skipped' as const };
      }
      return m;
    });

    updateUserSubscription({
      upcomingMeals: updatedUpcoming,
    });

    // Release slot back to chef available pool
    setCooks((prev) =>
      prev.map((c) => {
        if (c.name === userSubscription.cookName) {
          return {
            ...c,
            lunchAvailableQty: mealPeriod === 'Lunch' ? c.lunchAvailableQty + 1 : c.lunchAvailableQty,
            dinnerAvailableQty: mealPeriod === 'Dinner' ? c.dinnerAvailableQty + 1 : c.dinnerAvailableQty,
          };
        }
        return c;
      })
    );

    try {
      await subscriptionService.skipMealSlot(userSubscription.id, slotId, date, mealPeriod);
    } catch (err) {
      console.warn('Skip sync note:', err);
    }

    return true;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    // Also update matching delivery assignment
    setDeliveryAssignments((prev) =>
      prev.map((d) => {
        if (d.orderId === orderId) {
          let deliveryStatus: DeliveryAssignment['status'] = 'Assigned';
          if (status === 'Picked Up') deliveryStatus = 'Picked Up';
          if (status === 'Out for Delivery') deliveryStatus = 'Out for Delivery';
          if (status === 'Delivered') deliveryStatus = 'Delivered';
          return { ...d, status: deliveryStatus };
        }
        return d;
      })
    );

    addNotification({
      title: `Order Update: ${status}`,
      message: `Order #${orderId} status has changed to "${status}".`,
      type: 'order',
    });
  };

  const updateKitchenStatus = (cookId: string, open: boolean) => {
    const cook = cooks.find((c) => c.id === cookId) || currentCookProfile;
    const cookName = cook?.name || 'Home Kitchen';

    setCooks((prev) =>
      prev.map((c) => (c.id === cookId ? { ...c, kitchenOpen: open } : c))
    );

    addNotification({
      title: open ? `📢 ${cookName}: Kitchen Opened` : `🚨 ${cookName}: Kitchen Closed`,
      message: open
        ? `${cookName} is now OPEN and accepting fresh homemade meal orders!`
        : `${cookName} has closed for today. New orders are paused.`,
      type: 'kitchen',
    });
  };

  const updateKitchenQuantities = (
    cookId: string,
    lunchAvail: number,
    lunchTotal: number,
    dinnerAvail: number,
    dinnerTotal: number
  ) => {
    const cook = cooks.find((c) => c.id === cookId) || currentCookProfile;
    const cookName = cook?.name || 'Home Kitchen';

    setCooks((prev) =>
      prev.map((c) =>
        c.id === cookId
          ? {
              ...c,
              lunchAvailableQty: lunchAvail,
              lunchTotalQty: lunchTotal,
              dinnerAvailableQty: dinnerAvail,
              dinnerTotalQty: dinnerTotal,
              kitchenOpen: lunchAvail > 0 || dinnerAvail > 0,
            }
          : c
      )
    );

    if (lunchAvail === 0 && dinnerAvail === 0) {
      addNotification({
        title: `🚨 ${cookName}: Lunch & Dinner Sold Out`,
        message: `All lunch and dinner tiffin slots for ${cookName} are now completely SOLD OUT for today!`,
        type: 'kitchen',
      });
    } else if (lunchAvail === 0) {
      addNotification({
        title: `🚨 ${cookName}: Lunch Sold Out`,
        message: `Today's Lunch slot for ${cookName} is now SOLD OUT. Dinner slots (${dinnerAvail} remaining) are still open!`,
        type: 'kitchen',
      });
    } else if (dinnerAvail === 0) {
      addNotification({
        title: `🚨 ${cookName}: Dinner Sold Out`,
        message: `Today's Dinner slot for ${cookName} is now SOLD OUT. Lunch slots (${lunchAvail} remaining) are available!`,
        type: 'kitchen',
      });
    } else {
      addNotification({
        title: `📢 ${cookName}: Capacity Published`,
        message: `${cookName} has ${lunchAvail} Lunch & ${dinnerAvail} Dinner slots available to order.`,
        type: 'kitchen',
      });
    }
  };

  const updateCookWeeklyMenu = (
    cookId: string,
    day: string,
    mealType: 'lunch' | 'dinner',
    menuData: any
  ) => {
    updateCookWeeklyMenuSlot(cookId, [day], mealType, menuData);
  };

  const updateCookWeeklyMenuSlot = (
    cookId: string,
    days: string[],
    mealType: 'lunch' | 'dinner',
    mealData: MealSlotItem
  ) => {
    setCooks((prevCooks) =>
      prevCooks.map((c) => {
        if (c.id !== cookId) return c;
        const currentMenu = Array.isArray(c.weeklyMenu) && c.weeklyMenu.length === 7
          ? [...c.weeklyMenu]
          : JSON.parse(JSON.stringify(INITIAL_WEEKLY_MENU));

        const updatedMenu = currentMenu.map((dayItem) => {
          if (!days.includes(dayItem.day)) return dayItem;
          return {
            ...dayItem,
            [mealType]: {
              ...dayItem[mealType],
              ...mealData,
              special: mealData.recipeTag || mealData.special || dayItem[mealType]?.special || '',
            },
          };
        });
        return { ...c, weeklyMenu: updatedMenu };
      })
    );

    // Sync with meals collection so customer views & search also reflect the updated meal
    const category = mealType === 'lunch' ? 'Lunch' : 'Dinner';
    const mealTitle = mealData.mealTitle || `${mealData.mainDish} Meal`;
    const cook = cooks.find((c) => c.id === cookId) || currentCookProfile;

    setMeals((prevMeals) => {
      const existingMeal = prevMeals.find(
        (m) => m.cookId === cookId && m.category === category && m.availableDays?.some((d) => days.includes(d))
      );

      const itemsIncluded = [
        mealData.mainDish,
        mealData.dal,
        mealData.bread,
        mealData.rice,
        ...(mealData.sides || []),
      ].filter(Boolean);

      const description = `Freshly prepared meal with ${mealData.bread}, ${mealData.dal}, ${mealData.mainDish}, and ${mealData.rice}.${
        mealData.sides?.length ? ` Includes: ${mealData.sides.join(', ')}.` : ''
      }`;

      if (existingMeal) {
        return prevMeals.map((m) =>
          m.id === existingMeal.id
            ? {
                ...m,
                name: mealTitle,
                description,
                price: mealData.price || m.price,
                dietary: mealData.dietary || m.dietary,
                timeSlot: mealData.timeSlot || m.timeSlot,
                availableDays: Array.from(new Set([...(m.availableDays || []), ...days])),
                itemsIncluded,
                image: mealData.image || m.image,
                totalQty: mealData.maxOrders || m.totalQty,
                availableQty: mealData.maxOrders || m.availableQty,
              }
            : m
        );
      } else {
        const newMeal: Meal = {
          id: `meal-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: mealTitle,
          description,
          cookId,
          cookName: cook.name,
          cookAvatar: cook.avatar,
          price: mealData.price || 180,
          category,
          timeSlot: mealData.timeSlot || (mealType === 'lunch' ? '12:30 PM - 2:00 PM' : '7:30 PM - 9:00 PM'),
          availableDays: days,
          dietary: mealData.dietary || 'Vegetarian',
          image: mealData.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
          rating: 4.8,
          reviewsCount: 14,
          itemsIncluded,
          calories: 520,
          availableQty: mealData.maxOrders || 20,
          totalQty: mealData.maxOrders || 20,
          deliveryEstimateMin: 30,
          distanceKm: cook.distanceKm || 1.2,
        };
        return [newMeal, ...prevMeals];
      }
    });
  };

  const removeCookWeeklyMealSlot = (
    cookId: string,
    day: string,
    mealType: 'lunch' | 'dinner'
  ) => {
    setCooks((prevCooks) =>
      prevCooks.map((c) => {
        if (c.id !== cookId) return c;
        const currentMenu = Array.isArray(c.weeklyMenu)
          ? [...c.weeklyMenu]
          : JSON.parse(JSON.stringify(INITIAL_WEEKLY_MENU));

        const updatedMenu = currentMenu.map((dayItem) => {
          if (dayItem.day !== day) return dayItem;
          return {
            ...dayItem,
            [mealType]: {
              mainDish: '',
              dal: '',
              bread: '',
              rice: '',
              sides: [],
              mealTitle: '',
              recipeTag: '',
              special: '',
              price: 0,
            },
          };
        });
        return { ...c, weeklyMenu: updatedMenu };
      })
    );
  };

  const autofillCookWeeklyMenu = (cookId: string) => {
    setCooks((prevCooks) =>
      prevCooks.map((c) => {
        if (c.id !== cookId) return c;
        return {
          ...c,
          weeklyMenu: JSON.parse(JSON.stringify(INITIAL_WEEKLY_MENU)),
        };
      })
    );
  };

  const addMeal = (mealData: Omit<Meal, 'id'>) => {
    const newMeal: Meal = {
      ...mealData,
      id: `m-${Math.floor(Math.random() * 10000)}`,
    };
    setMeals(prev => [newMeal, ...prev]);
  };

  const updateMeal = (mealId: string, updated: Partial<Meal>) => {
    setMeals(prev => prev.map(m => m.id === mealId ? { ...m, ...updated } : m));
  };

  const deleteMeal = (mealId: string) => {
    setMeals(prev => prev.filter(m => m.id !== mealId));
  };

  const updateCookProfile = (cookId: string, updated: Partial<CookProfile>) => {
    setCooks((prev) =>
      prev.map((c) => (c.id === cookId ? { ...c, ...updated } : c))
    );
  };

  const addCook = (cookData: Partial<CookProfile>): CookProfile => {
    const newCookId = cookData.id || `cook-${Date.now()}`;
    const newCook: CookProfile = {
      id: newCookId,
      name: cookData.name || 'Home Cook',
      chefName: cookData.chefName || 'Home Cook',
      avatar:
        cookData.avatar ||
        'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=500&q=80',
      coverImage:
        cookData.coverImage ||
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
      bio:
        cookData.bio ||
        'Passionate home cook serving authentic, nutritious, home-cooked daily meals with traditional spices and fresh ingredients.',
      cuisine: cookData.cuisine && cookData.cuisine.length > 0 ? cookData.cuisine : ['Homemade', 'Gujarati'],
      rating: cookData.rating ?? 4.9,
      reviewsCount: cookData.reviewsCount ?? 1,
      experienceYears: cookData.experienceYears ?? 4,
      mealsDelivered: cookData.mealsDelivered ?? 0,
      followersCount: cookData.followersCount ?? 0,
      distanceKm: cookData.distanceKm ?? 1.2,
      location: cookData.location || 'Navrangpura, Ahmedabad',
      phone: cookData.phone || '9876543210',
      kitchenOpen: cookData.kitchenOpen ?? true,
      lunchAvailableQty: cookData.lunchAvailableQty ?? 25,
      lunchTotalQty: cookData.lunchTotalQty ?? 25,
      dinnerAvailableQty: cookData.dinnerAvailableQty ?? 20,
      dinnerTotalQty: cookData.dinnerTotalQty ?? 20,
      specialties:
        cookData.specialties && cookData.specialties.length > 0
          ? cookData.specialties
          : ['Special Daily Thali', 'Phulka Roti', 'Dal Tadka', 'Jeera Rice'],
      weeklyMenu: cookData.weeklyMenu || JSON.parse(JSON.stringify(INITIAL_WEEKLY_MENU)),
      hygieneRating: cookData.hygieneRating || 'FSSAI Verified ★★★★★',
      lunchCutoffTime: '11:00 AM',
      dinnerCutoffTime: '6:00 PM',
      pickupAddress: cookData.location || 'Navrangpura, Ahmedabad',
      certifications: ['FSSAI Certified Home Kitchen', 'Hygiene Standard A+'],
      repeatCustomerRate: 95,
      aspectRatings: {
        flavor: 4.9,
        spiciness: 4.7,
        portion: 4.8,
        punctuality: 4.9,
      },
    };

    setCooks((prev) => {
      const exists = prev.some((c) => c.id === newCook.id || (newCook.phone && c.phone === newCook.phone));
      if (exists) {
        return prev.map((c) => (c.id === newCook.id || c.phone === newCook.phone ? { ...c, ...newCook } : c));
      }
      return [newCook, ...prev];
    });

    // Automatically create a signature meal for this newly added cook
    const newMeal: Meal = {
      id: `m-${newCook.id}`,
      cookId: newCook.id,
      cookName: newCook.name,
      cookAvatar: newCook.avatar,
      name: `${newCook.name}'s Special Daily Homemade Thali`,
      description: `Wholesome, hot homemade thali with 4 rotis, seasonal sabji, dal, steamed rice, salad & pickle.`,
      price: 130,
      category: 'Both',
      period: 'Both',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dietary: 'Vegetarian',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
      rating: 4.9,
      reviewsCount: 1,
      itemsIncluded: ['4 Phulka Rotis', 'Paneer Sabji', 'Dal Tadka', 'Jeera Rice', 'Salad', 'Pickle'],
      calories: 540,
      availableQty: newCook.lunchAvailableQty,
      totalQty: newCook.lunchTotalQty,
      deliveryEstimateMin: 30,
      distanceKm: newCook.distanceKm,
    };

    setMeals((prev) => {
      if (!prev.some((m) => m.id === newMeal.id)) {
        return [newMeal, ...prev];
      }
      return prev;
    });

    return newCook;
  };

  const deleteCook = (cookId: string) => {
    setCooks((prev) => prev.filter((c) => c.id !== cookId));
    setMeals((prev) => prev.filter((m) => m.cookId !== cookId));
  };

  const clearMockCooks = () => {
    const mockIds = ['cook-1', 'cook-2', 'cook-3', 'cook-4'];
    setCooks((prev) => prev.filter((c) => !mockIds.includes(c.id)));
    setMeals((prev) => prev.filter((m) => !mockIds.includes(m.cookId)));
  };

  const getCookSubscriptionPlans = (cookId: string): SubscriptionPlan[] => {
    // Check localStorage backup first
    try {
      const saved = localStorage.getItem(`mealmitra_cook_plans_${cookId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    const cook =
      cooks.find((c) => c.id === cookId) ||
      (currentCookProfile.id === cookId ? currentCookProfile : null) ||
      cooks[0];
    if (cook && Array.isArray(cook.subscriptionPlans) && cook.subscriptionPlans.length > 0) {
      return cook.subscriptionPlans;
    }
    const name = cook?.name || currentCookProfile.name || 'Home Kitchen';
    const id = cook?.id || currentCookProfile.id || 'cook-default';
    return getDefaultCookSubscriptionPlans(name, id);
  };

  const updateCookSubscriptionPlans = (cookId: string, plans: SubscriptionPlan[]) => {
    setCooks((prev) => {
      const exists = prev.some((c) => c.id === cookId);
      if (exists) {
        return prev.map((c) => (c.id === cookId ? { ...c, subscriptionPlans: plans } : c));
      } else {
        return [...prev, { ...currentCookProfile, id: cookId, subscriptionPlans: plans }];
      }
    });

    try {
      localStorage.setItem(`mealmitra_cook_plans_${cookId}`, JSON.stringify(plans));
    } catch {}

    addNotification({
      title: 'Subscription Plans Published',
      message: 'Your custom subscription plans and pricing are now live for customers.',
      type: 'subscription',
    });
  };

  const updateUserSubscription = (updated: Partial<UserSubscription>) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        const isTarget = userSubscription && s.id === userSubscription.id;
        return isTarget ? { ...s, ...updated } : s;
      })
    );
  };

  const subscribeToPlan = (
    plan: SubscriptionPlan,
    details: {
      cookId?: string;
      cookName?: string;
      cookAvatar?: string;
      address: string;
      officeAddress?: string;
      lunchTiming: string;
      dinnerTiming: string;
      dietaryNotes?: string;
    }
  ) => {
    const totalMeals =
      plan.type === 'Monthly'
        ? plan.category.includes('Lunch + Dinner')
          ? 52
          : 26
        : plan.category.includes('Lunch + Dinner')
        ? 600
        : 300;

    const chosenCookName = details.cookName || currentCookProfile.name || 'Home Kitchen';
    const chosenCookId = details.cookId || currentCookProfile.id || 'cook-1';
    const chosenCookAvatar = details.cookAvatar || currentCookProfile.avatar;

    const custName = currentUser?.name || 'Customer';
    const custPhone = currentUser?.phone || '+91 98251 23456';
    const custAvatar = currentUser?.avatar || '';

    const newSub: UserSubscription = {
      id: `sub-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      customerId: currentUser?.id || `usr-cust-${Date.now()}`,
      customerName: custName,
      customerPhone: custPhone,
      customerAvatar: custAvatar,
      planId: plan.id,
      planName: plan.name,
      planCategory: plan.category,
      planPeriod: plan.type,
      planPrice: plan.price,
      paymentMethod: (details as any).paymentMethod || 'UPI / Online (Paid)',
      cookId: chosenCookId,
      cookName: chosenCookName,
      cookAvatar: chosenCookAvatar,
      status: 'Active',
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      renewalDate: plan.type === 'Monthly' ? 'In 30 days' : 'In 365 days',
      remainingDays: plan.type === 'Monthly' ? 30 : 365,
      deliveryAddress: details.address || 'Home Delivery Address',
      officeAddress: details.officeAddress || 'Workplace Delivery Address',
      lunchTiming: details.lunchTiming || '1:00 PM',
      dinnerTiming: details.dinnerTiming || '8:00 PM',
      mealsDeliveredCount: 0,
      totalMealsCount: totalMeals,
      preferredMeals: ['Phulka Thali', 'Rajma Chawal', 'Paneer Tikka', 'Khichdi Kadhi'],
      dietaryNotes: details.dietaryNotes || currentUser?.applicationDetails?.dietaryPreference || 'Fresh home spices, hygienic prep',
      upcomingMeals: [
        {
          id: `up-1-${Date.now()}`,
          date: 'Tomorrow',
          dayName: 'Monday',
          mealPeriod: 'Lunch',
          mealName: 'Panchmel Dal Tadka with 4 Phulkas & Kachumber',
          status: 'Scheduled',
          cutoffTime: '10:30 AM',
          isPastCutoff: false,
        },
        {
          id: `up-2-${Date.now()}`,
          date: 'In 2 days',
          dayName: 'Tuesday',
          mealPeriod: 'Lunch',
          mealName: 'Slow-Cooked Kashmiri Rajma with Jeera Rice',
          status: 'Scheduled',
          cutoffTime: '10:30 AM',
          isPastCutoff: false,
        },
        {
          id: `up-3-${Date.now()}`,
          date: 'In 3 days',
          dayName: 'Wednesday',
          mealPeriod: 'Lunch',
          mealName: 'Paneer Makhani Homestyle & 3 Laccha Parathas',
          status: 'Scheduled',
          cutoffTime: '10:30 AM',
          isPastCutoff: false,
        },
      ],
    };

    setSubscriptions((prev) => {
      const filtered = prev.filter(
        (s) =>
          !(
            (s.customerId && s.customerId === newSub.customerId) ||
            (s.customerPhone && s.customerPhone === newSub.customerPhone)
          )
      );
      return [newSub, ...filtered];
    });

    addNotification({
      title: 'Subscription Activated',
      message: `You have successfully subscribed to ${plan.name} with ${chosenCookName}!`,
      type: 'subscription',
    });
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date' | 'likes'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Math.floor(100 + Math.random() * 900)}`,
      date: 'Just now',
      likes: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
  };

  const confirmPickup = (assignmentId: string) => {
    setDeliveryAssignments((prev) =>
      prev.map((d) => (d.id === assignmentId ? { ...d, status: 'Picked Up' } : d))
    );
    // sync order status
    const item = (deliveryAssignments || []).find((d) => d.id === assignmentId);
    if (item) {
      updateOrderStatus(item.orderId, 'Picked Up');
    }
  };

  const startDelivery = (assignmentId: string) => {
    setDeliveryAssignments((prev) =>
      prev.map((d) => (d.id === assignmentId ? { ...d, status: 'Out for Delivery' } : d))
    );
    const item = (deliveryAssignments || []).find((d) => d.id === assignmentId);
    if (item) {
      updateOrderStatus(item.orderId, 'Out for Delivery');
    }
  };

  const markDelivered = (assignmentId: string) => {
    setDeliveryAssignments((prev) =>
      prev.map((d) => (d.id === assignmentId ? { ...d, status: 'Delivered' } : d))
    );
    const item = (deliveryAssignments || []).find((d) => d.id === assignmentId);
    if (item) {
      updateOrderStatus(item.orderId, 'Delivered');
    }
  };

  const updateClusterStopStatus = (stopId: string, status: 'Completed' | 'Current' | 'Pending') => {
    setClusterStops((prev) =>
      prev.map((s) => (s.id === stopId ? { ...s, status } : s))
    );
  };

  const updateDeliveryDuty = (isOnDuty: boolean) => {
    setDeliveryPartnerState((prev) => ({
      ...prev,
      isOnDuty,
    }));
  };

  const completeRouteStop = (stopId: string) => {
    setRouteStops((prev) => {
      const updated = prev.map((s) => {
        if (s.id === stopId) {
          return { ...s, status: 'Completed' as const };
        }
        return s;
      });
      // Move next pending stop to 'In Progress'
      const hasInProgress = updated.some((s) => s.status === 'In Progress');
      if (!hasInProgress) {
        const nextPendingIndex = updated.findIndex((s) => s.status === 'Pending');
        if (nextPendingIndex !== -1) {
          updated[nextPendingIndex] = { ...updated[nextPendingIndex], status: 'In Progress' };
        }
      }
      return updated;
    });

    // Update partner earnings and stats if delivery completed
    setDeliveryPartnerState((prev) => ({
      ...prev,
      todayDeliveries: prev.todayDeliveries + 1,
      todayEarnings: prev.todayEarnings + 60,
    }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setCooks(MOCK_COOKS);
    setMeals(MOCK_MEALS);
    setOrders(MOCK_ORDERS);
    setSubscriptions([MOCK_USER_SUBSCRIPTION]);
    setReviews(MOCK_REVIEWS);
    setDeliveryAssignments(MOCK_DELIVERY_ASSIGNMENTS);
    setClusterStops(MOCK_SMART_CLUSTER_STOPS);
    setDeliveryPartnerState(MOCK_DELIVERY_PARTNER_STATE);
    setRouteStops(MOCK_ROUTE_STOPS);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        customerTab,
        setCustomerTab,
        cookTab,
        setCookTab,
        deliveryTab,
        setDeliveryTab,
        adminTab,
        setAdminTab,
        selectedCookId,
        setSelectedCookId,
        selectedMealForOrder,
        setSelectedMealForOrder,
        cooks,
        meals,
        orders,
        subscriptionPlans,
        subscriptions,
        userSubscription,
        reviews,
        deliveryAssignments,
        clusterStops,
        routeStops,
        deliveryPartnerState,
        notifications,
        waitlist,
        activeCookId,
        setActiveCookId,
        currentCookProfile,
        toggleFollowCook,
        addNotification,
        markNotificationsAsRead,
        clearNotifications,
        placeOrder,
        joinWaitlist,
        skipSubscriptionMeal,
        updateOrderStatus,
        updateKitchenStatus,
        updateKitchenQuantities,
        updateCookWeeklyMenu,
        updateCookWeeklyMenuSlot,
        removeCookWeeklyMealSlot,
        autofillCookWeeklyMenu,
        updateCookProfile,
        addCook,
        getCookSubscriptionPlans,
        updateCookSubscriptionPlans,
        updateUserSubscription,
        subscribeToPlan,
        addReview,
        confirmPickup,
        startDelivery,
        markDelivered,
        updateClusterStopStatus,
        updateDeliveryDuty,
        completeRouteStop,
        resetAllData,
        addMeal,
        updateMeal,
        deleteMeal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
