import { db } from './index.ts';
import { bookings } from './schema.ts';
import { eq, and, gte, lte } from 'drizzle-orm';
import { services } from '../data/services.ts';

export async function getBookingsByDate(date: string) {
  return await db.select().from(bookings).where(and(eq(bookings.date, date), eq(bookings.status, 'confirmed')));
}

export async function getAllBookings() {
  return await db.select().from(bookings).orderBy(bookings.date, bookings.startTime);
}

export async function createBooking(data: {
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}) {
  const result = await db.insert(bookings).values({
    ...data,
    status: 'confirmed',
  }).returning();
  return result[0];
}

export async function updateBookingStatus(id: number, status: string) {
  const result = await db.update(bookings).set({ status }).where(eq(bookings.id, id)).returning();
  return result[0];
}

export async function deleteBooking(id: number) {
  const result = await db.delete(bookings).where(eq(bookings.id, id)).returning();
  return result[0];
}

export async function deleteBookingsByEmail(email: string) {
  const result = await db.delete(bookings).where(eq(bookings.customerEmail, email)).returning();
  return result;
}
