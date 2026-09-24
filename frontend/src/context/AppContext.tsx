import React, { createContext, useContext, useState, useEffect } from 'react';
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
  userSubscription: UserSubscription | null;
  reviews: Review[];
  deliveryAssignments: DeliveryAssignment[];
  clusterStops: ClusterRouteStop[];
  routeStops: RouteStop[];
  deliveryPartnerState: DeliveryPartnerState;

  waitlist: WaitlistEntry[];

  // Active Cook logged in state
  activeCookId: string;
  setActiveCookId: (id: string) => void;
  currentCookProfile: CookProfile;

  // Actions
  toggleFollowCook: (cookId: string) => void;
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
  updateUserSubscription: (updated: Partial<UserSubscription>) => void;
  subscribeToPlan: (plan: SubscriptionPlan, details: { address: string; lunchTiming: string; dinnerTiming: string }) => void;
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

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('mealmitra_role');
    return (saved as UserRole) || 'entry';
  });

  const [customerTab, setCustomerTab] = useState<CustomerTab>('dashboard');
  const [cookTab, setCookTab] = useState<CookTab>('dashboard');
  const [deliveryTab, setDeliveryTab] = useState<DeliveryTab>('dashboard');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  const [selectedCookId, setSelectedCookId] = useState<string | null>(null);
  const [selectedMealForOrder, setSelectedMealForOrder] = useState<Meal | null>(null);

  const [cooks, setCooks] = useState<CookProfile[]>(() => {
    const saved = localStorage.getItem('mealmitra_cooks');
    return saved ? JSON.parse(saved) : MOCK_COOKS;
  });

  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem('mealmitra_meals');
    return saved ? JSON.parse(saved) : MOCK_MEALS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('mealmitra_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  const [subscriptionPlans] = useState<SubscriptionPlan[]>(MOCK_SUBSCRIPTION_PLANS);

  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(() => {
    const saved = localStorage.getItem('mealmitra_subscription');
    return saved ? JSON.parse(saved) : MOCK_USER_SUBSCRIPTION;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('mealmitra_reviews');
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  const [deliveryAssignments, setDeliveryAssignments] = useState<DeliveryAssignment[]>(() => {
    const saved = localStorage.getItem('mealmitra_delivery_assignments');
    return saved ? JSON.parse(saved) : MOCK_DELIVERY_ASSIGNMENTS;
  });

  const [clusterStops, setClusterStops] = useState<ClusterRouteStop[]>(() => {
    const saved = localStorage.getItem('mealmitra_cluster_stops');
    return saved ? JSON.parse(saved) : MOCK_SMART_CLUSTER_STOPS;
  });

  const [deliveryPartnerState, setDeliveryPartnerState] = useState<DeliveryPartnerState>(() => {
    const saved = localStorage.getItem('mealmitra_delivery_partner');
    return saved ? JSON.parse(saved) : MOCK_DELIVERY_PARTNER_STATE;
  });

  const [routeStops, setRouteStops] = useState<RouteStop[]>(() => {
    const saved = localStorage.getItem('mealmitra_route_stops');
    return saved ? JSON.parse(saved) : MOCK_ROUTE_STOPS;
  });

  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    const saved = localStorage.getItem('mealmitra_waitlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCookId, setActiveCookId] = useState<string>('cook-1');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('mealmitra_role', newRole);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if (userSubscription) {
      localStorage.setItem('mealmitra_subscription', JSON.stringify(userSubscription));
    }
  }, [userSubscription]);

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

  const currentCookProfile =
    (cooks && cooks.find((c) => c.id === activeCookId)) ||
    (cooks && cooks[0]) ||
    MOCK_COOKS[0];

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

    const newOrder: Order = {
      id: newOrderId,
      cookId: orderData.meal.cookId,
      cookName: orderData.meal.cookName,
      cookAvatar: orderData.meal.cookAvatar,
      customerName: 'Jay Shah',
      customerPhone: orderData.phone || '+91 99250 12345',
      customerAddress: isPickup
        ? `${orderData.meal.cookName}'s Kitchen (Self Pickup)`
        : orderData.address || 'Flat 402, Shivalik Heights, Bodakdev',
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

    // Backend sync with SQLite
    fetch('http://localhost:3001/api/reservations/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reservationId: newOrderId,
        cookId: orderData.meal.cookId,
        mealId: orderData.meal.id,
        bookingType: orderData.bookingType || 'one_time',
        bookingDate: chosenDate,
        mealPeriod: chosenPeriod,
        fulfillmentType: orderData.fulfillmentType || 'Delivery',
        quantity: orderData.quantity,
        address: newOrder.customerAddress,
        phone: newOrder.customerPhone,
        timeSlot: orderData.timeSlot,
        specialNotes: orderData.specialNotes,
        totalAmount: newOrder.totalAmount,
      }),
    }).catch(() => {
      // Backend optional / offline fallback
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
      await fetch('http://localhost:3001/api/reservations/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cookId: data.cookId,
          mealId: data.mealId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          bookingDate: data.date,
          mealPeriod: data.mealPeriod,
        }),
      });
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

    setUserSubscription({
      ...userSubscription,
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
      await fetch('http://localhost:3001/api/subscriptions/skip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId: userSubscription.id,
          cookId: cooks.find((c) => c.name === userSubscription.cookName)?.id || 'cook-1',
          date,
          mealPeriod,
        }),
      });
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
  };

  const updateKitchenStatus = (cookId: string, open: boolean) => {
    setCooks((prev) =>
      prev.map((c) => (c.id === cookId ? { ...c, kitchenOpen: open } : c))
    );
  };

  const updateKitchenQuantities = (
    cookId: string,
    lunchAvail: number,
    lunchTotal: number,
    dinnerAvail: number,
    dinnerTotal: number
  ) => {
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

  const updateUserSubscription = (updated: Partial<UserSubscription>) => {
    setUserSubscription((prev) => (prev ? { ...prev, ...updated } : null));
  };

  const subscribeToPlan = (
    plan: SubscriptionPlan,
    details: { address: string; lunchTiming: string; dinnerTiming: string }
  ) => {
    const newSub: UserSubscription = {
      id: `usr-sub-${Math.floor(100 + Math.random() * 900)}`,
      planId: plan.id,
      planName: plan.name,
      planCategory: plan.category,
      cookName: 'Nirmala Devi',
      cookAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      status: 'Active',
      startDate: 'Today',
      renewalDate: plan.type === 'Monthly' ? 'In 30 days' : 'In 365 days',
      remainingDays: plan.type === 'Monthly' ? 30 : 365,
      deliveryAddress: details.address || 'Flat 402, Shivalik Heights, Bodakdev',
      officeAddress: 'Tech Park B, 3rd Floor, SG Highway',
      lunchTiming: details.lunchTiming || '1:00 PM',
      dinnerTiming: details.dinnerTiming || '8:00 PM',
      mealsDeliveredCount: 0,
      totalMealsCount: plan.type === 'Monthly' ? 26 : 300,
      preferredMeals: ['Phulka Thali', 'Rajma Chawal', 'Paneer Tikka', 'Khichdi Kadhi'],
    };
    setUserSubscription(newSub);
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
    setUserSubscription(MOCK_USER_SUBSCRIPTION);
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
        userSubscription,
        reviews,
        deliveryAssignments,
        clusterStops,
        routeStops,
        deliveryPartnerState,
        waitlist,
        activeCookId,
        setActiveCookId,
        currentCookProfile,
        toggleFollowCook,
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
