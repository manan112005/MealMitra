export interface MealSlotItem {
  mealTitle: string;
  recipeTag: string;
  special: string;
  mainDish: string;
  dal: string;
  bread: string;
  breadQty: number;
  breadType: string;
  breadGhee: boolean;
  rice: string;
  sides: string[];
  price: number;
  dietary: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain';
  timeSlot: string;
  maxOrders: number;
  availableFor: 'Lunch' | 'Dinner' | 'Both';
  image: string;
}

export interface DayMenuSchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday' | string;
  lunch: MealSlotItem;
  dinner: MealSlotItem;
}

export interface CookProfile {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  specialty: string;
  distance: string;
  verified: boolean;
  hygieneRating: string;
  image: string;
  coverImage: string;
  bio: string;
  totalOrders: number;
  dishesCount: number;
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
  address: string;
  phone: string;
  fssaiNumber: string;
  specialties: string[];
  badges: string[];
  followersCount: number;
  isFollowed?: boolean;
  weeklyMenu?: DayMenuSchedule[];
  subscriptionPlans?: SubscriptionPlan[];
  lunchAvailable: number;
  lunchTotal: number;
  dinnerAvailable: number;
  dinnerTotal: number;
}

export interface Meal {
  id: string;
  name: string;
  cookId: string;
  cookName: string;
  cookAvatar?: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  dietary: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Jain';
  prepTime: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
  availableCount: number;
  totalCount: number;
  tags: string[];
  ingredients: string[];
  isSpecial?: boolean;
  mealType?: 'Lunch' | 'Dinner' | 'Both';
  lunchTime?: string;
  dinnerTime?: string;
  date?: string;
}

export interface Order {
  id: string;
  mealId: string;
  mealName: string;
  cookId: string;
  cookName: string;
  cookAvatar?: string;
  quantity: number;
  totalPrice: number;
  status: 'Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  orderTime: string;
  deliveryTime: string;
  deliveryAddress: string;
  customerPhone?: string;
  customerName?: string;
  otp?: string;
  dietary?: string;
  specialNotes?: string;
  bookingDate?: string;
  mealPeriod?: 'Lunch' | 'Dinner';
  fulfillmentType?: 'Delivery' | 'Pickup';
  bookingType?: 'one_time' | 'subscription';
  paymentMethod?: string;
  paymentId?: string;
}

export interface SubscriptionPlan {
  id: string;
  type: 'Weekly' | 'Monthly';
  category?: 'Lunch Only' | 'Dinner Only' | 'Lunch + Dinner' | string;
  name: string;
  price: number;
  billingPeriod: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  cookId?: string;
  cookName?: string;
  cookAvatar?: string;
  mealsCount?: number;
  deliveryTimeWindow?: string;
}

export interface UpcomingMealSlot {
  id: string;
  date: string;
  day: string;
  mealPeriod: 'Lunch' | 'Dinner';
  dishName: string;
  cookName: string;
  timeSlot: string;
  isSkipped: boolean;
  canSkip: boolean;
}

export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  planCategory?: 'Lunch Only' | 'Dinner Only' | 'Lunch + Dinner' | string;
  cookId?: string;
  cookName?: string;
  cookAvatar?: string;
  status: 'Active' | 'Paused' | 'Cancelled';
  startDate: string;
  renewalDate: string;
  mealsRemaining: number;
  pricePerMonth: number;
  planType: 'Weekly' | 'Monthly';
  deliveryAddress: string;
  officeAddress?: string;
  lunchTiming: string;
  dinnerTiming: string;
  dietaryNotes?: string;
  skippedMealsCount: number;
  skippedDates?: string[];
  upcomingMeals?: UpcomingMealSlot[];
  paymentMethod?: string;
  paymentId?: string;
  createdAt?: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  cookId: string;
  rating: number;
  date: string;
  comment: string;
  mealName: string;
  likes: number;
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
  position: number;
  joinedAt: string;
  status: 'waiting' | 'notified' | 'expired';
}

export interface CreateOrderPayload {
  mealId: string;
  quantity: number;
  address: string;
  phone: string;
  timeSlot: string;
  specialNotes?: string;
  bookingDate?: string;
  mealPeriod?: 'Lunch' | 'Dinner';
  fulfillmentType?: 'Delivery' | 'Pickup';
  bookingType?: 'one_time' | 'subscription';
  paymentMethod?: string;
  paymentId?: string;
}

export interface CreateRazorpayOrderPayload {
  amount: number; // in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, string | number>;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  orderData?: CreateOrderPayload;
  subscriptionData?: {
    planId: string;
    cookId?: string;
    address: string;
    officeAddress?: string;
    lunchTiming?: string;
    dinnerTiming?: string;
    dietaryNotes?: string;
  };
}
