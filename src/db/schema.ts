import { relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const bookings = pgTable('bookings', {
  id: serial('id').primaryKey(),
  serviceId: text('service_id').notNull(),
  date: date('date').notNull(), // YYYY-MM-DD
  startTime: text('start_time').notNull(), // HH:MM
  endTime: text('end_time').notNull(), // HH:MM
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(),
  status: text('status').default('confirmed').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

