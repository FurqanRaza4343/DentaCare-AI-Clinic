import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { google } from "googleapis";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("dental_clinic.db");
const JWT_SECRET = process.env.JWT_SECRET || "dental-secret-key-123";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    service TEXT NOT NULL,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    payment_method TEXT,
    payment_details TEXT,
    payment_screenshot TEXT,
    status TEXT DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    timings TEXT NOT NULL,
    image TEXT
  );

  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Seed Doctors if empty
const doctorCount = db.prepare("SELECT COUNT(*) as count FROM doctors").get() as { count: number };
if (doctorCount.count === 0) {
  const insertDoctor = db.prepare("INSERT INTO doctors (name, specialization, timings, image) VALUES (?, ?, ?, ?)");
  insertDoctor.run("Dr Ahmed Khan", "Orthodontist", "10AM - 3PM", "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800");
  insertDoctor.run("Dr Sarah Malik", "Dental Surgeon", "3PM - 8PM", "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800");
  insertDoctor.run("Dr Ali Raza", "Implant Specialist", "6PM - 10PM", "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Email Setup
  const OAuth2 = google.auth.OAuth2;
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "938064270142-9d5jmr7u26in0tgm1psl39gfbd6450gq.apps.googleusercontent.com";
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "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";

  const getAppUrl = (req?: any) => {
    if (process.env.APP_URL) return process.env.APP_URL;
    if (req) {
      const protocol = req.headers['x-forwarded-proto'] || 'http';
      const host = req.headers['host'];
      return `${protocol}://${host}`;
    }
    return 'http://localhost:3000';
  };

  const createTransporter = async (req?: any) => {
    const oauth2Client = new OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      `${getAppUrl(req)}/api/admin/google-callback`
    );

    const settings = db.prepare("SELECT value FROM settings WHERE key = 'google_refresh_token'").get() as any;
    const refreshToken = settings?.value || process.env.GOOGLE_REFRESH_TOKEN;

    if (!refreshToken) {
      console.error("No Google Refresh Token found. Please authorize at /api/admin/google-auth");
      return null;
    }

    oauth2Client.setCredentials({ refresh_token: refreshToken });

    try {
      const accessToken = await oauth2Client.getAccessToken();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: "forworking4343@gmail.com",
          accessToken: accessToken.token,
          clientId: GOOGLE_CLIENT_ID,
          clientSecret: GOOGLE_CLIENT_SECRET,
          refreshToken: refreshToken
        }
      } as any);
      return transporter;
    } catch (error) {
      console.error("Error creating email transporter:", error);
      return null;
    }
  };

  const sendConfirmationEmail = async (to: string, details: any, req?: any) => {
    const transporter = await createTransporter(req);
    if (!transporter) return;

    const mailOptions = {
      from: "DentaCare AI Clinic <forworking4343@gmail.com>",
      to,
      subject: "Appointment Confirmation - DentaCare AI Clinic",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">Appointment Confirmed!</h2>
          <p>Hello,</p>
          <p>Your appointment at <strong>DentaCare AI Clinic</strong> has been successfully booked.</p>
          <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #e2e8f0;">
            <p style="margin: 5px 0;"><strong>Doctor:</strong> ${details.doctor_name}</p>
            <p style="margin: 5px 0;"><strong>Service:</strong> ${details.service}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${details.date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${details.time}</p>
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${details.payment_method === 'onsite' ? 'Pay Onsite' : 'Pay Online'}</p>
            ${details.payment_details ? `<p style="margin: 5px 0;"><strong>Payment Details:</strong> ${details.payment_details}</p>` : ''}
          </div>
          <div style="background: #fff7ed; padding: 15px; border-radius: 8px; border: 1px solid #ffedd5; margin-bottom: 20px;">
            <p style="color: #9a3412; font-weight: bold; margin: 0; font-size: 14px;">
              ⚠️ Important: Please show this email at the clinic reception on your arrival.
            </p>
          </div>
          <p>Thank you for choosing DentaCare AI Clinic!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 11px; color: #94a3b8; text-align: center;">DentaCare AI Clinic - Your Smile, Our Priority</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Confirmation email sent to ${to}`);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API Routes
  app.get("/api/health", (req, res) => {
    try {
      const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as any;
      res.json({ status: "ok", users: userCount.count });
    } catch (error) {
      res.status(500).json({ status: "error", message: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/auth/signup", async (req, res) => {
    const { name, email, password, phone } = req.body;
    console.log("Signup attempt for:", email);
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare("INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)");
      const result = stmt.run(name, email, hashedPassword, phone);
      const userId = Number(result.lastInsertRowid);
      const token = jwt.sign({ id: userId, email, name }, JWT_SECRET);
      
      console.log("Signup successful for:", email, "ID:", userId);
      res.json({ token, user: { id: userId, name, email, phone } });
    } catch (error: any) {
      console.error("Signup error details:", error);
      if (error.message.includes("UNIQUE constraint failed")) {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Internal server error during signup" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    try {
      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
      if (!user) {
        console.log("Login failed: User not found ->", email);
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log("Login failed: Invalid password for ->", email);
        return res.status(400).json({ error: "Invalid email or password" });
      }

      const userId = Number(user.id);
      const token = jwt.sign({ id: userId, email: user.email, name: user.name }, JWT_SECRET);
      
      console.log("Login successful for:", email, "ID:", userId);
      res.json({ token, user: { id: userId, name: user.name, email: user.email, phone: user.phone } });
    } catch (error) {
      console.error("Login error details:", error);
      res.status(500).json({ error: "Internal server error during login" });
    }
  });

  app.get("/api/me", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT id, name, email, phone FROM users WHERE id = ?").get(req.user.id) as any;
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  });

  app.get("/api/doctors", (req, res) => {
    const doctors = db.prepare("SELECT * FROM doctors").all();
    res.json(doctors);
  });

  // Admin Google Auth Routes
  app.get("/api/admin/google-auth", (req, res) => {
    const oauth2Client = new OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      `${getAppUrl(req)}/api/admin/google-callback`
    );

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/gmail.send"],
      prompt: "consent"
    });
    res.redirect(url);
  });

  app.get("/api/admin/google-callback", async (req, res) => {
    const { code } = req.query;
    const oauth2Client = new OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      `${getAppUrl(req)}/api/admin/google-callback`
    );

    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      if (tokens.refresh_token) {
        db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run('google_refresh_token', tokens.refresh_token);
        res.send("<h1>Google Auth Successful!</h1><p>The app can now send emails. You can close this window.</p>");
      } else {
        res.send("<h1>Auth Successful, but no refresh token received.</h1><p>Try revoking access from your Google account and trying again.</p>");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.status(500).send("Auth failed");
    }
  });

  app.get("/api/appointments", authenticateToken, (req: any, res) => {
    const appointments = db.prepare(`
      SELECT a.*, d.name as doctor_name 
      FROM appointments a 
      JOIN doctors d ON a.doctor_id = d.id 
      WHERE a.user_id = ? 
      ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `).all(req.user.id);
    res.json(appointments);
  });

  app.post("/api/appointments", authenticateToken, async (req: any, res) => {
    const { doctor_id, service, appointment_date, appointment_time, payment_method, payment_details, payment_screenshot, confirmation_email } = req.body;
    const stmt = db.prepare(`
      INSERT INTO appointments (user_id, doctor_id, service, appointment_date, appointment_time, payment_method, payment_details, payment_screenshot) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(req.user.id, doctor_id, service, appointment_date, appointment_time, payment_method, payment_details, payment_screenshot);
    
    // Send Confirmation Email
    if (confirmation_email) {
      const doctor = db.prepare("SELECT name FROM doctors WHERE id = ?").get(doctor_id) as any;
      sendConfirmationEmail(confirmation_email, {
        doctor_name: doctor?.name,
        service,
        date: appointment_date,
        time: appointment_time,
        payment_method,
        payment_details
      }, req).catch(console.error);
    }

    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/appointments/:id", authenticateToken, (req: any, res) => {
    const { id } = req.params;
    const userId = Number(req.user.id);
    console.log(`Attempting to delete appointment ${id} for user ${userId}`);
    const stmt = db.prepare("DELETE FROM appointments WHERE id = ? AND user_id = ?");
    const result = stmt.run(Number(id), userId);
    if (result.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Appointment not found or unauthorized" });
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
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
