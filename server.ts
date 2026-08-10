import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { requireAdminAuth } from "./src/middleware/adminAuth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { getBookingsByDate, createBooking } from "./src/db/bookings.ts";
import { services } from "./src/data/services.ts";
import { getSupabaseAdmin } from "./src/lib/supabase-admin.ts";
import jwt from 'jsonwebtoken';
import { parse, addMinutes, isBefore, isEqual, format } from 'date-fns';

dotenv.config({ path: '.env.local' });
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-admin-key-for-salon';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes FIRST
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/admin/bookings", requireAdminAuth, async (req, res) => {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const { data, error } = await supabaseAdmin
        .from('bookings')
        .select('*')
        .order('start_at', { ascending: true });

      if (error) throw error;

      res.json((data || []).map(row => ({
        id: row.id,
        serviceId: row.service_id,
        date: format(new Date(row.start_at), 'yyyy-MM-dd'),
        startTime: format(new Date(row.start_at), 'HH:mm'),
        endTime: format(new Date(row.end_at), 'HH:mm'),
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        customerNote: row.customer_note,
        status: row.status,
      })));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/admin/bookings/:id", requireAdminAuth, async (req, res) => {
    try {
      const allowedStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'];
      if (!allowedStatuses.includes(req.body.status)) {
        res.status(400).json({ error: 'Neplatný stav rezervace.' });
        return;
      }

      const supabaseAdmin = getSupabaseAdmin();
      const { data: updated, error } = await supabaseAdmin
        .from('bookings')
        .update({ status: req.body.status })
        .eq('id', req.params.id)
        .select()
        .single();

      if (error) throw error;
      res.json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/admin/bookings/:id", requireAdminAuth, async (req, res) => {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const { data: deleted, error } = await supabaseAdmin
        .from('bookings')
        .delete()
        .eq('id', req.params.id)
        .select('id')
        .single();

      if (error) throw error;
      res.json(deleted);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/admin/contacts/:email", requireAdminAuth, async (req, res) => {
    try {
      const supabaseAdmin = getSupabaseAdmin();
      const { data: deleted, error } = await supabaseAdmin
        .from('bookings')
        .delete()
        .eq('customer_email', req.params.email.toLowerCase())
        .select('id');

      if (error) throw error;
      res.json(deleted);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/bookings/available", async (req, res) => {
    try {
      const { date, serviceId } = req.query;
      if (!date || !serviceId) return res.status(400).json({ error: "Missing date or serviceId" });

      const service = services.find(s => s.id === serviceId);
      if (!service) return res.status(404).json({ error: "Service not found" });

      const totalDuration = service.durationMinutes + service.bufferBeforeMinutes + service.bufferAfterMinutes;
      const existingBookings = await getBookingsByDate(date as string);

      // Simple time slot generation: 09:00 to 18:00
      const slots = [];
      let current = parse("09:00", "HH:mm", new Date());
      const endOfDay = parse("18:00", "HH:mm", new Date());
      
      const now = new Date();
      const isToday = date === format(now, "yyyy-MM-dd");

      while (isBefore(addMinutes(current, totalDuration), endOfDay) || isEqual(addMinutes(current, totalDuration), endOfDay)) {
        const slotStart = current;
        const slotEnd = addMinutes(current, totalDuration);
        const slotEndWithGap = addMinutes(slotEnd, 15);

        // Skip past times if booking for today
        if (isToday && isBefore(slotStart, now)) {
          current = addMinutes(current, 15);
          continue;
        }

        const isOverlapping = existingBookings.some(b => {
          const bStart = parse(b.startTime, "HH:mm", new Date());
          const bEnd = parse(b.endTime, "HH:mm", new Date());
          const bEndWithGap = addMinutes(bEnd, 15);
          return (
            (isBefore(slotStart, bEndWithGap) && isBefore(bStart, slotEndWithGap))
          );
        });

        if (!isOverlapping) {
          slots.push(format(slotStart, "HH:mm"));
        }
        
        current = addMinutes(current, 15); // 15 min increments for better flexibility
      }

      res.json({ slots });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const { serviceId, date, startTime, customerName, customerEmail, customerPhone } = req.body;
      const service = services.find(s => s.id === serviceId);
      if (!service) return res.status(404).json({ error: "Service not found" });

      const totalDuration = service.durationMinutes + service.bufferBeforeMinutes + service.bufferAfterMinutes;
      const start = parse(startTime, "HH:mm", new Date());
      const end = addMinutes(start, totalDuration);
      const endTime = format(end, "HH:mm");

      const booking = await createBooking({
        serviceId,
        date,
        startTime,
        endTime,
        customerName,
        customerEmail,
        customerPhone
      });

      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/users/sync", requireAuth, async (req: AuthRequest, res) => {
    try {
      if (!req.user || !req.user.uid || !req.user.email) {
        return res.status(400).json({ error: "Missing user info" });
      }
      const user = await getOrCreateUser(req.user.uid, req.user.email);
      res.json(user);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Important: In Express v4 use '*', in v5 use '*all'
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
