import express from 'express';
import cors from 'cors';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Express
const app = express();
const port = process.env.PORT || 3001;

// Load environment variables if needed (dotenv is already in package.json)
import dotenv from 'dotenv';
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize SQLite DB
const dbPath = join(__dirname, 'mealmitra.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    
    // Create Tables
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT,
        order_id TEXT,
        subscription_id TEXT,
        payment_type TEXT,
        amount INTEGER,
        currency TEXT,
        razorpay_order_id TEXT UNIQUE,
        razorpay_payment_id TEXT,
        payment_signature TEXT,
        payment_status TEXT,
        transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        refund_status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS subscription_payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subscription_id TEXT,
        payment_id INTEGER,
        billing_cycle TEXT,
        amount INTEGER,
        due_date DATETIME,
        paid_date DATETIME,
        status TEXT,
        FOREIGN KEY(payment_id) REFERENCES payments(id)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        cook_id TEXT,
        meal_id TEXT,
        booking_type TEXT,
        booking_date TEXT,
        meal_period TEXT,
        fulfillment_type TEXT,
        quantity INTEGER,
        status TEXT,
        address TEXT,
        phone TEXT,
        time_slot TEXT,
        special_notes TEXT,
        total_amount INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS waitlist (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        customer_name TEXT,
        customer_phone TEXT,
        cook_id TEXT,
        meal_id TEXT,
        booking_date TEXT,
        meal_period TEXT,
        status TEXT DEFAULT 'Waiting',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS chef_capacities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cook_id TEXT,
        slot_date TEXT,
        meal_period TEXT,
        total_capacity INTEGER,
        subscription_allocated INTEGER DEFAULT 0,
        reserved_count INTEGER DEFAULT 0,
        cutoff_time TEXT,
        UNIQUE(cook_id, slot_date, meal_period)
      )`);

      db.run(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT UNIQUE,
        role TEXT,
        status TEXT DEFAULT 'approved',
        avatar TEXT,
        details TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Seed default accounts if users table is empty
      db.get(`SELECT COUNT(*) as count FROM users`, (err, row) => {
        if (!err && row && row.count === 0) {
          const defaultSeedUsers = [
            {
              id: 'usr-cook-1',
              name: 'Nirmala Devi',
              email: 'nirmala.kitchen@example.com',
              phone: '9876543210',
              role: 'cook',
              status: 'approved',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
              details: JSON.stringify({ kitchenAddress: 'B-12 Krishna Kunj, Sector 14, Navrangpura', city: 'Ahmedabad', foodCategory: 'Vegetarian Only' })
            },
            {
              id: 'usr-delivery-1',
              name: 'Ramesh Patel',
              email: 'ramesh.delivery@example.com',
              phone: '9898011223',
              role: 'delivery',
              status: 'approved',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
              details: JSON.stringify({ residentialAddress: 'C-104, Shanti Nagar, SG Highway', city: 'Ahmedabad', vehicleType: 'Motorcycle' })
            },
            {
              id: 'usr-cust-1',
              name: 'Jay Shah',
              email: 'jay.shah@example.com',
              phone: '9825123456',
              role: 'customer',
              status: 'approved',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
              details: JSON.stringify({ address: 'A-402, Shivalik Residency, Navrangpura', city: 'Ahmedabad' })
            },
            {
              id: 'usr-admin-1',
              name: 'Admin Manager',
              email: 'admin@mealmitra.com',
              phone: '9999999999',
              role: 'admin',
              status: 'approved',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
              details: JSON.stringify({})
            }
          ];

          const stmt = db.prepare(`INSERT OR IGNORE INTO users (id, name, email, phone, role, status, avatar, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
          for (const u of defaultSeedUsers) {
            stmt.run([u.id, u.name, u.email, u.phone, u.role, u.status, u.avatar, u.details]);
          }
          stmt.finalize();
          console.log('Seeded default MealMitra users into SQLite database.');
        }
      });
    });
  }
});

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder',
});

// Helper for DB queries
const runQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

const getQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const allQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// API Endpoints

// 1. Create Razorpay Order
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { type, orderId, subscriptionId, amount } = req.body;
    
    // In a real app, calculate the amount from the DB. 
    // Here we use the amount provided by frontend or fallback to a standard amount.
    // Razorpay amount is in paise (e.g. 180 INR = 18000 paise)
    const amountInPaise = amount ? amount * 100 : 18000; 

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Store in DB as PENDING
    await runQuery(
      `INSERT INTO payments (user_id, order_id, subscription_id, payment_type, amount, currency, razorpay_order_id, payment_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'user_123', // hardcoded user for prototype
        orderId || null,
        subscriptionId || null,
        type,
        amountInPaise,
        'INR',
        razorpayOrder.id,
        'PENDING'
      ]
    );

    res.status(200).json({
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    });
  } catch (error) {
    console.error('Error creating order:', error);
    const errorMessage = error?.error?.description || error?.message || 'Failed to create payment order';
    res.status(500).json({ error: errorMessage });
  }
});

// 2. Verify Payment
app.post('/api/payments/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret_placeholder';

    // Generate expected signature
    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Signature is valid
      // Update DB
      await runQuery(
        `UPDATE payments SET 
          razorpay_payment_id = ?, 
          payment_signature = ?, 
          payment_status = ?, 
          updated_at = CURRENT_TIMESTAMP 
         WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_signature, 'SUCCESS', razorpay_order_id]
      );

      // Here you would typically trigger order confirmation logic, etc.
      res.status(200).json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      // Signature is invalid
      await runQuery(
        `UPDATE payments SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE razorpay_order_id = ?`,
        ['FAILED', razorpay_order_id]
      );
      res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// 3. Webhook (Optional but requested for robustness)
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'rzp_webhook_secret';
    const signature = req.headers['x-razorpay-signature'];
    
    // Express raw body is needed if you want to verify webhook signatures perfectly
    // Because we used express.json() globally, req.body is already parsed.
    // For proper webhook verification, we use crypto on JSON.stringify(req.body)
    // Note: It's better to use raw body parsing for webhooks.
    
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (expectedSignature === signature) {
      const event = req.body.event;
      const paymentEntity = req.body.payload.payment.entity;
      
      if (event === 'payment.captured') {
        // Update DB if not already updated via verify
        await runQuery(
          `UPDATE payments SET payment_status = 'SUCCESS' WHERE razorpay_order_id = ? AND payment_status != 'SUCCESS'`,
          [paymentEntity.order_id]
        );
      } else if (event === 'payment.failed') {
        await runQuery(
          `UPDATE payments SET payment_status = 'FAILED' WHERE razorpay_order_id = ?`,
          [paymentEntity.order_id]
        );
      } else if (event === 'refund.processed') {
        // Update refund status
        await runQuery(
          `UPDATE payments SET refund_status = 'PROCESSED' WHERE razorpay_payment_id = ?`,
          [paymentEntity.id]
        );
      }

      res.status(200).send('Webhook processed');
    } else {
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Webhook processing failed');
  }
});

// --- Capacity-Aware Reservations & Waitlist Endpoints ---

// 4. Check Slot Capacity & Cutoff
app.post('/api/reservations/check-capacity', async (req, res) => {
  try {
    const { cookId, date, mealPeriod, quantity = 1 } = req.body;
    const targetDate = date || new Date().toISOString().split('T')[0];
    const period = mealPeriod || 'Lunch';

    let row = await getQuery(
      `SELECT * FROM chef_capacities WHERE cook_id = ? AND slot_date = ? AND meal_period = ?`,
      [cookId, targetDate, period]
    );

    if (!row) {
      // Initialize default capacity for this slot (e.g., 40 total, 15 pre-allocated/reserved)
      const defaultTotal = period === 'Lunch' ? 50 : 40;
      const defaultAllocated = 10;
      const defaultReserved = 15;
      const defaultCutoff = period === 'Lunch' ? '10:30 AM' : '05:30 PM';

      await runQuery(
        `INSERT INTO chef_capacities (cook_id, slot_date, meal_period, total_capacity, subscription_allocated, reserved_count, cutoff_time)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [cookId, targetDate, period, defaultTotal, defaultAllocated, defaultReserved, defaultCutoff]
      );

      row = {
        cook_id: cookId,
        slot_date: targetDate,
        meal_period: period,
        total_capacity: defaultTotal,
        subscription_allocated: defaultAllocated,
        reserved_count: defaultReserved,
        cutoff_time: defaultCutoff,
      };
    }

    const availableSlots = Math.max(0, row.total_capacity - row.subscription_allocated - row.reserved_count);
    const canBook = availableSlots >= quantity;

    res.status(200).json({
      cookId,
      date: targetDate,
      mealPeriod: period,
      totalCapacity: row.total_capacity,
      subscriptionAllocated: row.subscription_allocated,
      reservedCount: row.reserved_count,
      availableSlots,
      canBook,
      cutoffTime: row.cutoff_time || (period === 'Lunch' ? '10:30 AM' : '05:30 PM'),
    });
  } catch (error) {
    console.error('Error checking capacity:', error);
    res.status(500).json({ error: 'Failed to check capacity' });
  }
});

// 5. Reserve Tiffin Slot
app.post('/api/reservations/reserve', async (req, res) => {
  try {
    const {
      reservationId,
      userId = 'user_123',
      cookId,
      mealId,
      bookingType = 'one_time',
      bookingDate,
      mealPeriod = 'Lunch',
      fulfillmentType = 'Delivery',
      quantity = 1,
      address,
      phone,
      timeSlot,
      specialNotes,
      totalAmount,
    } = req.body;

    const id = reservationId || `RES-${Date.now()}`;
    const date = bookingDate || new Date().toISOString().split('T')[0];

    // Check slot limit
    let row = await getQuery(
      `SELECT * FROM chef_capacities WHERE cook_id = ? AND slot_date = ? AND meal_period = ?`,
      [cookId, date, mealPeriod]
    );

    if (row) {
      const remaining = row.total_capacity - row.subscription_allocated - row.reserved_count;
      if (remaining < quantity) {
        return res.status(400).json({
          error: 'Slot is full. You can join the waitlist or select an alternative date.',
          isFull: true,
        });
      }
      // Increment reserved count
      await runQuery(
        `UPDATE chef_capacities SET reserved_count = reserved_count + ? WHERE id = ?`,
        [quantity, row.id]
      );
    }

    await runQuery(
      `INSERT INTO reservations (id, user_id, cook_id, meal_id, booking_type, booking_date, meal_period, fulfillment_type, quantity, status, address, phone, time_slot, special_notes, total_amount)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        userId,
        cookId,
        mealId,
        bookingType,
        date,
        mealPeriod,
        fulfillmentType,
        quantity,
        'Confirmed',
        address || '',
        phone || '',
        timeSlot || '',
        specialNotes || '',
        totalAmount || 0,
      ]
    );

    res.status(200).json({
      success: true,
      reservationId: id,
      message: 'Tiffin slot booked successfully!',
    });
  } catch (error) {
    console.error('Error reserving slot:', error);
    res.status(500).json({ error: 'Failed to reserve slot' });
  }
});

// 6. Join Waitlist for Sold Out Slot
app.post('/api/reservations/waitlist', async (req, res) => {
  try {
    const {
      userId = 'user_123',
      customerName,
      customerPhone,
      cookId,
      mealId,
      bookingDate,
      mealPeriod = 'Lunch',
    } = req.body;

    const id = `WL-${Date.now()}`;
    const date = bookingDate || new Date().toISOString().split('T')[0];

    await runQuery(
      `INSERT INTO waitlist (id, user_id, customer_name, customer_phone, cook_id, meal_id, booking_date, meal_period, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, customerName || 'Valued Customer', customerPhone || '', cookId, mealId, date, mealPeriod, 'Waiting']
    );

    res.status(200).json({
      success: true,
      waitlistId: id,
      message: 'You have been added to the waitlist! If a slot is released before the cutoff, you will be notified.',
    });
  } catch (error) {
    console.error('Error joining waitlist:', error);
    res.status(500).json({ error: 'Failed to join waitlist' });
  }
});

// 7. Subscription Skip Meal & Release Slot
app.post('/api/subscriptions/skip', async (req, res) => {
  try {
    const { subscriptionId, cookId, date, mealPeriod = 'Lunch' } = req.body;

    // Release slot in chef_capacities
    if (cookId && date) {
      await runQuery(
        `UPDATE chef_capacities 
         SET subscription_allocated = MAX(0, subscription_allocated - 1)
         WHERE cook_id = ? AND slot_date = ? AND meal_period = ?`,
        [cookId, date, mealPeriod]
      );
    }

    res.status(200).json({
      success: true,
      subscriptionId,
      skippedDate: date,
      mealPeriod,
      message: 'Meal skipped successfully. Your slot has been released back to the kitchen pool.',
    });
  } catch (error) {
    console.error('Error skipping subscription meal:', error);
    res.status(500).json({ error: 'Failed to skip subscription meal' });
  }
});

// --- Authentication & User Management Endpoints ---

const cleanPhone = (p) => {
  if (!p) return '';
  const digits = String(p).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
};

// 8. Get All Users
app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await allQuery(`SELECT * FROM users ORDER BY created_at DESC`);
    res.status(200).json({
      success: true,
      users: users.map(u => ({
        ...u,
        details: u.details ? JSON.parse(u.details) : {}
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 9. Check Phone Existence
app.post('/api/auth/check-phone', async (req, res) => {
  try {
    const { phone } = req.body;
    const normalized = cleanPhone(phone);
    if (!normalized) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const user = await getQuery(`SELECT * FROM users WHERE phone = ?`, [normalized]);
    if (user) {
      return res.status(200).json({
        exists: true,
        user: {
          ...user,
          details: user.details ? JSON.parse(user.details) : {}
        }
      });
    }

    res.status(200).json({ exists: false });
  } catch (error) {
    console.error('Error checking phone:', error);
    res.status(500).json({ error: 'Failed to check phone number' });
  }
});

// 10. Register User (First-time)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { id, name, email, phone, role, details, avatar, status = 'approved' } = req.body;
    const normalized = cleanPhone(phone);

    if (!normalized) {
      return res.status(400).json({ error: 'Valid phone number is required' });
    }
    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    // Check if duplicate
    const existing = await getQuery(`SELECT * FROM users WHERE phone = ?`, [normalized]);
    if (existing) {
      return res.status(400).json({
        error: 'This phone number is already registered. Please log in instead.'
      });
    }

    const userId = id || `usr-${Date.now()}`;
    const defaultAvatar = avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
    const serializedDetails = typeof details === 'object' ? JSON.stringify(details) : (details || '{}');

    await runQuery(
      `INSERT INTO users (id, name, email, phone, role, status, avatar, details)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name || 'User', email || '', normalized, role, status, defaultAvatar, serializedDetails]
    );

    const newUser = {
      id: userId,
      name: name || 'User',
      email: email || '',
      phone: normalized,
      role,
      status,
      avatar: defaultAvatar,
      details: typeof details === 'object' ? details : JSON.parse(serializedDetails)
    };

    res.status(200).json({
      success: true,
      message: 'Account created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message || 'Failed to create user account' });
  }
});

// 11. Login with Phone & OTP
app.post('/api/auth/login-otp', async (req, res) => {
  try {
    const { phone, otp } = req.body;
    const normalized = cleanPhone(phone);

    if (!normalized) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const user = await getQuery(`SELECT * FROM users WHERE phone = ?`, [normalized]);
    if (!user) {
      return res.status(404).json({
        error: 'No account found with this phone number. Please register first.'
      });
    }

    if (!otp || String(otp).length < 4) {
      return res.status(400).json({ error: 'Please enter a valid 4-digit or 6-digit OTP' });
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your account has been rejected.' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended.' });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        details: user.details ? JSON.parse(user.details) : {}
      }
    });
  } catch (error) {
    console.error('Error during OTP login:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

