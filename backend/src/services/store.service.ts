import {
  CookProfile,
  Meal,
  Order,
  SubscriptionPlan,
  UserSubscription,
  Review,
  WaitlistEntry,
  DayMenuSchedule,
} from "../types/app.types.js";

export const INITIAL_WEEKLY_MENU: DayMenuSchedule[] = [
  {
    day: 'Monday',
    lunch: {
      mealTitle: 'Traditional Gujarati Lunch',
      recipeTag: 'Traditional Gujarati Recipe',
      special: 'Traditional Gujarati Recipe',
      mainDish: 'Panchmel Dal Tadka',
      dal: 'Yellow Moong Dal',
      bread: '4 Phulka Rotis (Ghee)',
      breadQty: 4,
      breadType: 'Phulka Rotis',
      breadGhee: true,
      rice: 'Steamed Basmati Rice',
      sides: ['Bhindi Masala', 'Roasted Papad', 'Cucumber Kachumber', 'Fresh Chaas'],
      price: 180,
      dietary: 'Vegetarian',
      timeSlot: '12:30 PM - 2:00 PM',
      maxOrders: 20,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    },
    dinner: {
      mealTitle: 'Aloo Gobhi Adraki Homestyle Meal',
      recipeTag: 'North Indian',
      special: 'North Indian Comfort',
      mainDish: 'Aloo Gobhi Adraki',
      dal: 'Dal Fry',
      bread: '3 Multigrain Rotis',
      breadQty: 3,
      breadType: 'Multigrain Rotis',
      breadGhee: false,
      rice: 'Jeera Rice',
      sides: ['Spiced Curd', 'Green Salad'],
      price: 160,
      dietary: 'Vegetarian',
      timeSlot: '7:30 PM - 9:00 PM',
      maxOrders: 20,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80',
    },
  },
  {
    day: 'Tuesday',
    lunch: {
      mealTitle: 'Rajma Rice Feast',
      recipeTag: 'North Indian',
      special: 'Chef Special Rajma Chawal',
      mainDish: 'Punjabi Rajma Masala',
      dal: 'Slow Cooked Kashmiri Rajma',
      bread: '3 Butter Rotis',
      breadQty: 3,
      breadType: 'Butter Rotis',
      breadGhee: true,
      rice: 'Fragrant Jeera Rice',
      sides: ['Boondi Raita', 'Sirka Pyaz Salad', 'Crispy Papad'],
      price: 170,
      dietary: 'Vegetarian',
      timeSlot: '12:30 PM - 2:00 PM',
      maxOrders: 25,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
    },
    dinner: {
      mealTitle: 'Paneer Roti Light Supper',
      recipeTag: 'Healthy',
      special: 'Homestyle Light Supper',
      mainDish: 'Lauki Kofta Curry',
      dal: 'Toor Dal Tadka',
      bread: '4 Whole Wheat Phulkas',
      breadQty: 4,
      breadType: 'Whole Wheat Phulkas',
      breadGhee: false,
      rice: 'Steamed Rice',
      sides: ['Roasted Papad', 'Beetroot Salad'],
      price: 150,
      dietary: 'Vegetarian',
      timeSlot: '7:30 PM - 9:00 PM',
      maxOrders: 20,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80',
    },
  },
  {
    day: 'Wednesday',
    lunch: {
      mealTitle: 'Gujarati Thali Special',
      recipeTag: 'Traditional Gujarati',
      special: 'North Indian Deluxe',
      mainDish: 'Paneer Makhani Homestyle',
      dal: 'Dal Makhani (Light Ghee)',
      bread: '3 Laccha Parathas',
      breadQty: 3,
      breadType: 'Laccha Parathas',
      breadGhee: true,
      rice: 'Matar Pulao',
      sides: ['Mint Onion Salad', 'Sweet Gulab Jamun (1 pc)', 'Salted Chaas'],
      price: 190,
      dietary: 'Vegetarian',
      timeSlot: '12:30 PM - 2:00 PM',
      maxOrders: 20,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    },
    dinner: {
      mealTitle: 'Kathiyawadi Khichdi & Bharta',
      recipeTag: 'Traditional Gujarati',
      special: 'Winter Special',
      mainDish: 'Baingan Bharta (Smoky)',
      dal: 'Yellow Dal',
      bread: '3 Bajra Rotlas / Phulkas',
      breadQty: 3,
      breadType: 'Bajra Rotlas',
      breadGhee: true,
      rice: 'Khichdi',
      sides: ['Garlic Chutney', 'Buttermilk'],
      price: 150,
      dietary: 'Vegetarian',
      timeSlot: '7:30 PM - 9:00 PM',
      maxOrders: 25,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
    },
  },
  {
    day: 'Thursday',
    lunch: {
      mealTitle: 'Chole Rice Lunch',
      recipeTag: 'North Indian',
      special: 'Rajasthani Kadhi Feast',
      mainDish: 'Kadhi Pakora',
      dal: 'Besan Kadhi with Methi Pakora',
      bread: '4 Soft Phulkas',
      breadQty: 4,
      breadType: 'Soft Phulkas',
      breadGhee: false,
      rice: 'Jeera Rice',
      sides: ['Sukhi Aloo Sabzi', 'Fried Green Chillies', 'Masala Papad'],
      price: 160,
      dietary: 'Vegetarian',
      timeSlot: '12:30 PM - 2:00 PM',
      maxOrders: 20,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=500&q=80',
    },
    dinner: {
      mealTitle: 'Dal Roti & Mix Veg',
      recipeTag: 'Healthy',
      special: 'Balanced Homestyle',
      mainDish: 'Mix Vegetable Jalfrezi',
      dal: 'Chana Dal Tadka',
      bread: '3 Chapattis',
      breadQty: 3,
      breadType: 'Chapattis',
      breadGhee: false,
      rice: 'Veg Pulao',
      sides: ['Cucumber Raita', 'Carrot Salad'],
      price: 150,
      dietary: 'Vegetarian',
      timeSlot: '7:30 PM - 9:00 PM',
      maxOrders: 20,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    },
  },
  {
    day: 'Friday',
    lunch: {
      mealTitle: 'Veg Thali Deluxe',
      recipeTag: 'High Protein',
      special: 'Amritsari Chole Chawal',
      mainDish: 'Chole Masala (Amritsari)',
      dal: 'Black Chickpeas Gravy',
      bread: '2 Kulchas / 3 Rotis',
      breadQty: 3,
      breadType: 'Rotis',
      breadGhee: true,
      rice: 'Jeera Onion Rice',
      sides: ['Aloo Tikki Side', 'Imli Chutney', 'Lassi'],
      price: 180,
      dietary: 'Vegetarian',
      timeSlot: '12:30 PM - 2:00 PM',
      maxOrders: 25,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
    },
    dinner: {
      mealTitle: 'Paneer Rice & Methi Malai',
      recipeTag: 'North Indian',
      special: 'Royal Evening',
      mainDish: 'Methi Malai Matar',
      dal: 'Dal Tadka',
      bread: '3 Wheat Rotis',
      breadQty: 3,
      breadType: 'Wheat Rotis',
      breadGhee: false,
      rice: 'Basmati Rice',
      sides: ['Mixed Sprouts Salad', 'Roasted Papad'],
      price: 170,
      dietary: 'Vegetarian',
      timeSlot: '7:30 PM - 9:00 PM',
      maxOrders: 20,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80',
    },
  },
  {
    day: 'Saturday',
    lunch: {
      mealTitle: 'Kathiyawadi Meal Feast',
      recipeTag: 'Traditional Gujarati',
      special: 'Weekend Feast',
      mainDish: 'Gujarati Kathiyawadi Thali',
      dal: 'Sev Tameta Nu Shaak & Dal',
      bread: '3 Bhakhri with White Butter',
      breadQty: 3,
      breadType: 'Bhakhri with White Butter',
      breadGhee: true,
      rice: 'Vaghareli Khichdi',
      sides: ['Gor (Jaggery)', 'Chaas', 'Kachumber', 'Sukhdi Sweet'],
      price: 200,
      dietary: 'Vegetarian',
      timeSlot: '12:30 PM - 2:00 PM',
      maxOrders: 30,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    },
    dinner: {
      mealTitle: 'Palak Paneer & Khichdi',
      recipeTag: 'Healthy',
      special: 'Green Power Meal',
      mainDish: 'Palak Paneer',
      dal: 'Moong Dal',
      bread: '3 Missi Rotis',
      breadQty: 3,
      breadType: 'Missi Rotis',
      breadGhee: true,
      rice: 'Steamed Rice',
      sides: ['Tomato Raita', 'Papad'],
      price: 160,
      dietary: 'Vegetarian',
      timeSlot: '7:30 PM - 9:00 PM',
      maxOrders: 20,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
    },
  },
  {
    day: 'Sunday',
    lunch: {
      mealTitle: 'Special Thali Celebration',
      recipeTag: 'Traditional Gujarati',
      special: 'Sunday Grand Lunch',
      mainDish: 'Royal Shahi Thali Special',
      dal: 'Dal Maharani',
      bread: '2 Butter Naan + 2 Phulkas',
      breadQty: 4,
      breadType: 'Butter Naan + Phulkas',
      breadGhee: true,
      rice: 'Dum Biryani / Veg Pulao',
      sides: ['Kadhai Paneer', 'Moong Dal Halwa', 'Pineapple Raita', 'Papad'],
      price: 220,
      dietary: 'Vegetarian',
      timeSlot: '12:30 PM - 2:00 PM',
      maxOrders: 35,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    },
    dinner: {
      mealTitle: 'Light Pulao & Khichdi Detox',
      recipeTag: 'Healthy',
      special: 'Light Sunday Detox',
      mainDish: 'Comfort Moong Dal Khichdi',
      dal: 'Panchratna Khichdi with Pure Ghee',
      bread: '2 Roasted Phulkas',
      breadQty: 2,
      breadType: 'Roasted Phulkas',
      breadGhee: false,
      rice: 'Khichdi',
      sides: ['Curd', 'Papad', 'Mango Pickle', 'Chaas'],
      price: 140,
      dietary: 'Vegetarian',
      timeSlot: '7:30 PM - 9:00 PM',
      maxOrders: 20,
      availableFor: 'Both',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=500&q=80',
    },
  },
];

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
      'Insulated 3-tier hot tiffin carrier included',
      'Zero-preservative, 100% pure home cooked',
    ],
    isPopular: true,
  },
  {
    id: `plan-${cookId}-dinner`,
    cookId,
    cookName,
    type: 'Monthly',
    category: 'Dinner Only',
    name: `${cookName} Evening Comfort Dinner Plan`,
    price: 3899,
    billingPeriod: '/ month (26 dinner meals)',
    mealsCount: 26,
    deliveryTimeWindow: '7:30 PM – 8:30 PM',
    description: `Light, soothing homestyle dinner by ${cookName} to unwind your evening with wholesome, fresh preparation.`,
    features: [
      '26 Light & Wholesome Dinners',
      'Digestive soups, warm khichdi or soft rotis with light curries',
      'Guaranteed delivery before 8:30 PM',
      'Weekend customization & spice preference',
      'Daily salad & homemade chaas / digestives',
    ],
  },
  {
    id: `plan-${cookId}-fullday`,
    cookId,
    cookName,
    type: 'Monthly',
    category: 'Lunch + Dinner',
    name: `${cookName} Full Day Care Plan (Lunch + Dinner)`,
    price: 6499,
    billingPeriod: '/ month (52 meals: 26 Lunch + 26 Dinner)',
    mealsCount: 52,
    deliveryTimeWindow: 'Lunch 12:30 PM | Dinner 7:30 PM',
    description: `Complete daily nourishment by ${cookName} with zero cooking stress — lunch delivered to office, dinner delivered home!`,
    features: [
      '52 Complete Meals (26 Lunch + 26 Dinner)',
      'Split delivery addresses (Office for lunch + Home for dinner)',
      'Priority delivery slot with real-time tracking',
      'Weekend special treats and complimentary sweets twice a month',
      'Dedicated support & instant pause/skip in 1-click',
      'Save ₹899 compared to individual slot plans',
    ],
  },
];

class MemoryStore {
  private cooks: CookProfile[] = [];
  private meals: Meal[] = [];
  private orders: Order[] = [];
  private subscriptionPlans: SubscriptionPlan[] = [];
  private userSubscriptions: UserSubscription[] = [];
  private reviews: Review[] = [];
  private waitlist: WaitlistEntry[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const defaultCook: CookProfile = {
      id: "cook-1",
      name: "Sunita Sharma",
      rating: 4.8,
      reviewCount: 142,
      specialty: "North Indian & Gujarati Thali",
      distance: "1.2 km",
      verified: true,
      hygieneRating: "A+",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      coverImage: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
      bio: "Cooking authentic home-style food with pure ghee and handpicked spices for over 18 years.",
      totalOrders: 1240,
      dishesCount: 14,
      isOpen: true,
      openingTime: "11:00 AM",
      closingTime: "10:00 PM",
      address: "B-402, Shanti Niketan, Satellite, Ahmedabad",
      phone: "+91 98765 43210",
      fssaiNumber: "FSSAI-2023-AHM-9812",
      specialties: ["Gujarati Thali", "Dal Makhani", "Phulkas", "Bajra Rotla"],
      badges: ["Top Rated Cook", "Super Hygienic", "Fast Preparation"],
      followersCount: 384,
      isFollowed: true,
      weeklyMenu: INITIAL_WEEKLY_MENU,
      lunchAvailable: 15,
      lunchTotal: 25,
      dinnerAvailable: 18,
      dinnerTotal: 25,
    };

    defaultCook.subscriptionPlans = getDefaultCookSubscriptionPlans(defaultCook.name, defaultCook.id);
    this.cooks.push(defaultCook);

    const defaultMeal: Meal = {
      id: "meal-1",
      name: "Traditional Gujarati Thali",
      cookId: defaultCook.id,
      cookName: defaultCook.name,
      cookAvatar: defaultCook.image,
      price: 180,
      rating: 4.8,
      reviewCount: 94,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80",
      description: "Authentic Gujarati feast with Panchmel Dal, Bhindi Masala, 4 soft ghee phulkas, Steamed Rice, Kachumber salad and freshly churned spiced Chaas.",
      dietary: "Vegetarian",
      prepTime: "25-30 min",
      calories: 580,
      protein: "16g",
      carbs: "82g",
      fat: "14g",
      availableCount: 15,
      totalCount: 25,
      tags: ["Pure Veg", "Homestyle", "Low Oil"],
      ingredients: ["Toor Dal", "Whole Wheat", "Pure Ghee", "Fresh Bhindi", "Basmati Rice", "Curd"],
      isSpecial: true,
      mealType: "Both",
      lunchTime: "12:30 PM - 2:00 PM",
      dinnerTime: "7:30 PM - 9:00 PM",
    };
    this.meals.push(defaultMeal);

    this.subscriptionPlans = [...(defaultCook.subscriptionPlans || [])];
  }

  // --- Cook operations ---
  public getCooks(): CookProfile[] {
    return this.cooks;
  }

  public getCookById(id: string): CookProfile | undefined {
    return this.cooks.find((c) => c.id === id);
  }

  public addCook(cook: Partial<CookProfile>): CookProfile {
    const id = cook.id || `cook-${Date.now()}`;
    const name = cook.name || "Home Cook";
    const newCook: CookProfile = {
      id,
      name,
      rating: cook.rating || 5.0,
      reviewCount: cook.reviewCount || 0,
      specialty: cook.specialty || "Homestyle Cooking",
      distance: cook.distance || "1.0 km",
      verified: cook.verified ?? true,
      hygieneRating: cook.hygieneRating || "A+",
      image: cook.image || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      coverImage: cook.coverImage || "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
      bio: cook.bio || "Passionate home chef providing nutritious homemade meals.",
      totalOrders: cook.totalOrders || 0,
      dishesCount: cook.dishesCount || 1,
      isOpen: cook.isOpen ?? true,
      openingTime: cook.openingTime || "11:00 AM",
      closingTime: cook.closingTime || "10:00 PM",
      address: cook.address || "Home Kitchen Address",
      phone: cook.phone || "+91 98765 00000",
      fssaiNumber: cook.fssaiNumber || `FSSAI-${Math.floor(1000 + Math.random() * 9000)}`,
      specialties: cook.specialties || ["Homestyle Cooking"],
      badges: cook.badges || ["New Verified Cook"],
      followersCount: cook.followersCount || 0,
      weeklyMenu: cook.weeklyMenu || INITIAL_WEEKLY_MENU,
      subscriptionPlans: cook.subscriptionPlans || getDefaultCookSubscriptionPlans(name, id),
      lunchAvailable: cook.lunchAvailable ?? 20,
      lunchTotal: cook.lunchTotal ?? 20,
      dinnerAvailable: cook.dinnerAvailable ?? 20,
      dinnerTotal: cook.dinnerTotal ?? 20,
    };
    this.cooks.push(newCook);
    return newCook;
  }

  public updateCook(id: string, updated: Partial<CookProfile>): CookProfile | null {
    const idx = this.cooks.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.cooks[idx] = { ...this.cooks[idx], ...updated };
    return this.cooks[idx];
  }

  public deleteCook(id: string): boolean {
    const lenBefore = this.cooks.length;
    this.cooks = this.cooks.filter((c) => c.id !== id);
    return this.cooks.length < lenBefore;
  }

  // --- Meals operations ---
  public getMeals(filters?: { cookId?: string; dietary?: string; mealType?: string }): Meal[] {
    let result = [...this.meals];
    if (filters?.cookId) {
      result = result.filter((m) => m.cookId === filters.cookId);
    }
    if (filters?.dietary && filters.dietary !== "All") {
      result = result.filter((m) => m.dietary.toLowerCase() === filters.dietary?.toLowerCase());
    }
    if (filters?.mealType && filters.mealType !== "All") {
      result = result.filter((m) => m.mealType === "Both" || m.mealType === filters.mealType);
    }
    return result;
  }

  public getMealById(id: string): Meal | undefined {
    return this.meals.find((m) => m.id === id);
  }

  public addMeal(meal: Omit<Meal, "id"> & { id?: string }): Meal {
    const newMeal: Meal = {
      ...meal,
      id: meal.id || `meal-${Date.now()}`,
    };
    this.meals.push(newMeal);
    return newMeal;
  }

  public updateMeal(id: string, updated: Partial<Meal>): Meal | null {
    const idx = this.meals.findIndex((m) => m.id === id);
    if (idx === -1) return null;
    this.meals[idx] = { ...this.meals[idx], ...updated };
    return this.meals[idx];
  }

  public deleteMeal(id: string): boolean {
    const lenBefore = this.meals.length;
    this.meals = this.meals.filter((m) => m.id !== id);
    return this.meals.length < lenBefore;
  }

  // --- Orders operations ---
  public getOrders(filters?: { customerPhone?: string; cookId?: string }): Order[] {
    let result = [...this.orders];
    if (filters?.customerPhone) {
      result = result.filter((o) => o.customerPhone === filters.customerPhone);
    }
    if (filters?.cookId) {
      result = result.filter((o) => o.cookId === filters.cookId);
    }
    return result;
  }

  public createOrder(order: Partial<Order>): Order {
    const cook = order.cookId ? this.getCookById(order.cookId) : this.cooks[0];
    const newOrder: Order = {
      id: order.id || `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      mealId: order.mealId || "meal-custom",
      mealName: order.mealName || "Delicious Home Cooked Meal",
      cookId: cook ? cook.id : "cook-1",
      cookName: cook ? cook.name : "Home Cook",
      cookAvatar: cook?.image,
      quantity: order.quantity || 1,
      totalPrice: order.totalPrice || 180,
      status: order.status || "Placed",
      orderTime: order.orderTime || new Date().toISOString(),
      deliveryTime: order.deliveryTime || "Estimated 35-45 mins",
      deliveryAddress: order.deliveryAddress || "Home Address",
      customerPhone: order.customerPhone || "+91 98765 43210",
      customerName: order.customerName || "Customer",
      otp: order.otp || `${Math.floor(1000 + Math.random() * 9000)}`,
      dietary: order.dietary || "Vegetarian",
      specialNotes: order.specialNotes,
      bookingDate: order.bookingDate || new Date().toISOString().split("T")[0],
      mealPeriod: order.mealPeriod || "Lunch",
      fulfillmentType: order.fulfillmentType || "Delivery",
      bookingType: order.bookingType || "one_time",
      paymentMethod: order.paymentMethod || "UPI",
      paymentId: order.paymentId,
    };

    if (cook) {
      if (newOrder.mealPeriod === "Lunch" && cook.lunchAvailable > 0) {
        cook.lunchAvailable = Math.max(0, cook.lunchAvailable - newOrder.quantity);
      } else if (newOrder.mealPeriod === "Dinner" && cook.dinnerAvailable > 0) {
        cook.dinnerAvailable = Math.max(0, cook.dinnerAvailable - newOrder.quantity);
      }
      cook.totalOrders = (cook.totalOrders || 0) + 1;
    }

    this.orders.unshift(newOrder);
    return newOrder;
  }

  public updateOrderStatus(orderId: string, status: Order["status"]): Order | null {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return null;
    order.status = status;
    return order;
  }

  // --- Subscriptions operations ---
  public getSubscriptions(filters?: { cookId?: string }): UserSubscription[] {
    if (filters?.cookId) {
      return this.userSubscriptions.filter((s) => s.cookId === filters.cookId);
    }
    return this.userSubscriptions;
  }

  public getUserSubscription(): UserSubscription | null {
    return this.userSubscriptions[0] || null;
  }

  public createSubscription(data: Partial<UserSubscription>): UserSubscription {
    const plan = data.planId ? this.subscriptionPlans.find((p) => p.id === data.planId) : undefined;
    const cook = data.cookId ? this.getCookById(data.cookId) : (plan?.cookId ? this.getCookById(plan.cookId) : this.cooks[0]);

    const newSub: UserSubscription = {
      id: `sub-${Date.now()}`,
      planId: data.planId || plan?.id || "plan-custom",
      planName: data.planName || plan?.name || "Monthly Tiffin Plan",
      planCategory: data.planCategory || plan?.category || "Lunch Only",
      cookId: cook?.id || data.cookId || "cook-1",
      cookName: cook?.name || data.cookName || "Sunita Sharma",
      cookAvatar: cook?.image || data.cookAvatar,
      status: "Active",
      startDate: data.startDate || new Date().toISOString().split("T")[0],
      renewalDate: data.renewalDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      mealsRemaining: data.mealsRemaining ?? (plan?.mealsCount || 26),
      pricePerMonth: data.pricePerMonth ?? (plan?.price || 3499),
      planType: data.planType || plan?.type || "Monthly",
      deliveryAddress: data.deliveryAddress || "Home Address",
      officeAddress: data.officeAddress,
      lunchTiming: data.lunchTiming || "12:30 PM – 1:30 PM",
      dinnerTiming: data.dinnerTiming || "7:30 PM – 8:30 PM",
      dietaryNotes: data.dietaryNotes || "Medium spice, fresh phulkas",
      skippedMealsCount: 0,
      skippedDates: [],
      upcomingMeals: [],
      paymentMethod: data.paymentMethod || "Razorpay UPI",
      paymentId: data.paymentId,
      createdAt: new Date().toISOString(),
    };

    this.userSubscriptions.unshift(newSub);
    return newSub;
  }

  public updateSubscription(id: string, updated: Partial<UserSubscription>): UserSubscription | null {
    const idx = this.userSubscriptions.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    this.userSubscriptions[idx] = { ...this.userSubscriptions[idx], ...updated };
    return this.userSubscriptions[idx];
  }

  // --- Waitlist operations ---
  public getWaitlist(): WaitlistEntry[] {
    return this.waitlist;
  }

  public joinWaitlist(entry: Omit<WaitlistEntry, "id" | "position" | "joinedAt" | "status">): WaitlistEntry {
    const countForSlot = this.waitlist.filter(
      (w) => w.cookId === entry.cookId && w.date === entry.date && w.mealPeriod === entry.mealPeriod
    ).length;

    const newEntry: WaitlistEntry = {
      ...entry,
      id: `wl-${Date.now()}`,
      position: countForSlot + 1,
      joinedAt: new Date().toISOString(),
      status: "waiting",
    };

    this.waitlist.push(newEntry);
    return newEntry;
  }

  // --- Reviews operations ---
  public getReviews(cookId?: string): Review[] {
    if (cookId) {
      return this.reviews.filter((r) => r.cookId === cookId);
    }
    return this.reviews;
  }

  public addReview(review: Omit<Review, "id" | "date" | "likes">): Review {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
      likes: 0,
    };
    this.reviews.unshift(newReview);
    return newReview;
  }
}

export const memoryStore = new MemoryStore();
