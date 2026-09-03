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

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
