export type UserRole = 'entry' | 'customer' | 'cook' | 'delivery' | 'admin';

export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'applications'
  | 'orders'
  | 'financials'
  | 'settings';

export type CustomerTab =
  | 'dashboard'
  | 'discover'
  | 'meals'
  | 'orders'
  | 'following'
  | 'reviews'
  | 'profile';

export type CookTab =
  | 'dashboard'
  | 'profile'
  | 'kitchen'
  | 'menu'
  | 'orders'
  | 'customers'
  | 'earnings';

export type DeliveryTab =
  | 'dashboard'
  | 'deliveries'
  | 'route'
  | 'pickup'
  | 'active'
  | 'history'
  | 'earnings'
  | 'performance';

export type OrderStatus =
  | 'Confirmed'
  | 'Preparing'
  | 'Ready'
  | 'Picked Up'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface Meal {
  id: string;
  name: string;
  cookId: string;
  cookName: string;
  cookAvatar: string;
  price: number;
  rating: number;
  reviewsCount: number;
  category: 'Lunch' | 'Dinner' | 'Both';
  timeSlot?: string;
  availableDays?: string[];
  dietary: 'Vegetarian' | 'High Protein' | 'Vegan' | 'Jain' | 'Gluten-Free' | 'Non-Veg';
  image: string;
  description: string;
  itemsIncluded: string[];
  calories: number;
  availableQty: number;
  totalQty: number;
  deliveryEstimateMin: number;
  distanceKm: number;
  isPopular?: boolean;
}

export interface DayMenuSchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  lunch: {
    mainDish: string;
    dal: string;
    bread: string;
    rice: string;
    sides: string[];
    special?: string;
  };
  dinner: {
    mainDish: string;
    dal: string;
    bread: string;
    rice: string;
    sides: string[];
    special?: string;
  };
}

export interface CookProfile {
  id: string;
  name: string;
  avatar: string;
  coverImage?: string;
  bio: string;
  cuisine: string[];
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  mealsDelivered: number;
  followersCount: number;
  isFollowing?: boolean;
  distanceKm: number;
  location: string;
  phone: string;
  kitchenOpen: boolean;
  lunchAvailableQty: number;
  lunchTotalQty: number;
  dinnerAvailableQty: number;
  dinnerTotalQty: number;
  specialties: string[];
  weeklyMenu: DayMenuSchedule[];
  hygieneRating: string;
}

export interface Order {
  id: string;
  cookId: string;
  cookName: string;
  cookAvatar: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  mealId: string;
  mealName: string;
  mealImage: string;
  quantity: number;
  pricePerUnit: number;
  totalAmount: number;
  orderDate: string;
  orderTime: string;
  deliveryTimeSlot: string;
  status: OrderStatus;
  deliveryPartnerId?: string;
  deliveryPartnerName?: string;
  specialNotes?: string;
}

export interface SubscriptionPlan {
  id: string;
  type: 'Monthly' | 'Yearly';
  name: string;
  category: 'Lunch Only' | 'Dinner Only' | 'Lunch + Dinner' | 'Family Plan' | 'Corporate Plan';
  price: number;
  billingPeriod: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  planCategory: string;
  cookName: string;
  cookAvatar: string;
  status: 'Active' | 'Paused' | 'Expired';
  startDate: string;
  renewalDate: string;
  remainingDays: number;
  deliveryAddress: string;
  officeAddress?: string;
  lunchTiming: string;
  dinnerTiming: string;
  mealsDeliveredCount: number;
  totalMealsCount: number;
  preferredMeals: string[];
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  cookId: string;
  cookName: string;
  mealName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

export interface DeliveryAssignment {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  cookId: string;
  cookName: string;
  pickupAddress: string;
  mealName: string;
  quantity: number;
  distanceKm: number;
  estimatedTimeMin: number;
  earningAmount: number;
  status: 'Assigned' | 'Picked Up' | 'Out for Delivery' | 'Delivered';
  pickupTimeWindow: string;
  deliveryTimeWindow: string;
}

export interface ClusterRouteStop {
  id: string;
  sequence: number;
  type: 'pickup' | 'dropoff';
  title: string;
  subtitle: string;
  address: string;
  ordersCount: number;
  status: 'Completed' | 'Current' | 'Pending';
  eta: string;
  distanceFromPrevKm: number;
}

export interface RouteStop {
  id: string;
  stopOrder: number;
  type: 'Cook Pickup' | 'Customer Drop';
  targetName: string;
  address: string;
  phone: string;
  itemsSummary: string;
  eta: string;
  distanceKm: number;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export interface DeliveryPartnerState {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  isOnDuty: boolean;
  activeCluster: string;
  todayDeliveries: number;
  todayEarnings: number;
  rating: number;
}

