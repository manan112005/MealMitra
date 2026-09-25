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
  | 'subscriptions'
  | 'orders'
  | 'following'
  | 'reviews'
  | 'profile';

export type CookTab =
  | 'dashboard'
  | 'profile'
  | 'kitchen'
  | 'menu'
  | 'subscriptions'
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
  | 'Slot Reserved'
  | 'Confirmed'
  | 'Preparing'
  | 'Meal Ready'
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
  isSpecial?: boolean;
  period?: string;
  lunchCutoffTime?: string;
  dinnerCutoffTime?: string;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
}

export interface MealSlotItem {
  mealTitle?: string;
  recipeTag?: string;
  special?: string;
  mainDish: string;
  dal: string;
  bread: string;
  breadQty?: number;
  breadType?: string;
  breadGhee?: boolean;
  rice: string;
  sides: string[];
  image?: string;
  price?: number;
  timeSlot?: string;
  maxOrders?: number;
  dietary?: 'Vegetarian' | 'High Protein' | 'Vegan' | 'Jain' | 'Gluten-Free' | 'Non-Veg';
  availableFor?: 'Daily orders' | 'Tiffin subscribers' | 'Both';
}

export interface DayMenuSchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  lunch: MealSlotItem;
  dinner: MealSlotItem;
}

export interface CookProfile {
  id: string;
  name: string; // Kitchen / Brand Name (e.g. Magic mom)
  chefName?: string; // Chef Personal Name (e.g. Nilam Patel)
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
  subscriptionPlans?: SubscriptionPlan[];
  hygieneRating: string;
  lunchCutoffTime?: string;
  dinnerCutoffTime?: string;
  pickupAddress?: string;
  certifications?: string[];
  repeatCustomerRate?: number;
  aspectRatings?: {
    flavor: number;
    spiciness: number;
    portion: number;
    punctuality: number;
  };
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
  bookingType?: 'one_time' | 'subscription';
  bookingDate?: string;
  mealPeriod?: 'Lunch' | 'Dinner';
  fulfillmentType?: 'Delivery' | 'Pickup';
}

export interface SubscriptionPlan {
  id: string;
  cookId?: string;
  cookName?: string;
  type: 'Monthly' | '15 Days' | 'Weekly' | 'Yearly';
  name: string;
  category: 'Lunch Only' | 'Dinner Only' | 'Lunch + Dinner' | 'Family Plan' | 'Corporate Plan' | 'Custom';
  price: number;
  billingPeriod: string;
  description: string;
  features: string[];
  terms?: string[];
  deliveryTimeWindow?: string;
  mealsCount?: number;
  isPopular?: boolean;
}

export interface UpcomingMealSlot {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // "Monday", etc.
  mealPeriod: 'Lunch' | 'Dinner';
  mealName: string;
  status: 'Scheduled' | 'Skipped' | 'Meal Ready' | 'Delivered' | 'Picked Up';
  cutoffTime: string;
  isPastCutoff: boolean;
}

export interface WaitlistEntry {
  id: string;
  cookId: string;
  cookName: string;
  mealId: string;
  mealName: string;
  customerName: string;
  customerPhone: string;
  date: string;
  mealPeriod: 'Lunch' | 'Dinner';
  createdAt: string;
  status: 'Waiting' | 'Notified' | 'Booked' | 'Expired';
}

export interface UserSubscription {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;
  planId: string;
  planName: string;
  planCategory: string;
  planPeriod?: 'Monthly' | '15 Days' | 'Weekly' | 'Yearly';
  planPrice?: number;
  paymentMethod?: string;
  cookId?: string;
  cookName: string;
  cookAvatar?: string;
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
  preferredMeals?: string[];
  dietaryNotes?: string;
  upcomingMeals?: UpcomingMealSlot[];
}

export interface Review {
  id: string;
  customerName: string;
  customerAvatar: string;
  cookId: string;
  cookName: string;
  mealName: string;
  dishName?: string;
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

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'kitchen' | 'delivery' | 'system' | 'subscription';
  read: boolean;
}

