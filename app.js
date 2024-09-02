import express from "express";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

import axios from "axios";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hostelRoute from "./routes/hostels.js";
import roomsRoute from "./routes/rooms.js";
import bookingsRoute from "./routes/bookings.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";

dotenv.config();
const PORT = process.env.PORT || 8080;

const app = express();

// Create a connection pool (recommended for production use)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to pass MySQL connection to routes
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hostels", hostelRoute);
app.use("/api/rooms", roomsRoute);
app.use("/api/bookings", bookingsRoute);

// PAAYYYSTAACKKKKK

const paystackApiKey = process.env.SK_PAYSTACKKEY;
const paystackApiUrl = process.env.API_PAYSTACK;

// Initialize transaction function
async function initializeTransaction(email, amount, currency, metadata) {
  try {
    const params = {
      email,
      amount,
      currency,
      metadata,
    };

    const response = await axios.post(paystackApiUrl, params, {
      headers: {
        Authorization: `Bearer ${paystackApiKey}`,
        "Content-Type": "application/json",
      },
    });
    console.log(JSON.parse(response.config.data));
    return response.data;
  } catch (error) {
    throw new Error(`Error initializing transaction: ${error.message}`);
  }
}

app.post("/api/initialize-transaction", async (req, res) => {
  try {
    const { email, amount, currency, metadata } = req.body;

    if (!email || !amount || !metadata) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const response = await initializeTransaction(
      email,
      amount,
      currency,
      metadata
    );
    console.log(response);
    res.json(response);
  } catch (error) {
    console.error("Error initializing transaction:", error);
    res.status(500).json({ error: "Failed to initialize transaction" });
  }
});

app.post("/api/store-transaction", async (req, res) => {
  try {
    const {
      room_id,
      user_id,
      amount,
      reference,
      transaction_date,
      payment_status,
      metadata,
    } = req.body;

    // Insert transaction into database
    const query = `
      INSERT INTO transactions (
        room_id,
        user_id,
        amount,
        reference,
        transaction_date,
        payment_status,
        metadata
      )
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [
      room_id,
      user_id,
      amount,
      reference,
      transaction_date,
      payment_status,
      JSON.stringify(metadata),
    ];

    const [result] = await req.db.query(query, values);

    if (result.affectedRows > 0) {
      res.json({ success: true, transaction_id: result.insertId });
    } else {
      throw new Error("Failed to insert transaction");
    }
  } catch (error) {
    console.error("Error storing transaction:", error);
    try {
      await req.db.rollback(); // Rollback transaction on error
    } catch (rollbackError) {
      console.error("Rollback error:", rollbackError);
    }
    res.status(500).json({ error: "Failed to store transaction" });
  }
});

// Verify transaction endpoint (optional, but recommended)
app.get("/api/verify-transaction/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    const verifyUrl = `https://api.paystack.co/transaction/verify/${reference}`;

    const response = await axios.get(verifyUrl, {
      headers: {
        Authorization: `Bearer ${paystackApiKey}`,
      },
    });

    if (response.data.status && response.data.data.status === "success") {
      res.json({ verified: true, data: response.data.data });
    } else {
      res.json({ verified: false });
    }
  } catch (error) {
    console.error("Error verifying transaction:", error);
    res.status(500).json({ error: "Failed to verify transaction" });
  }
});

/// PPPAAAYYYSSSTTTAAACCCKKK ENDDDDDD

// Error Handling Middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  console.error(err.stack); // Log the stack trace
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
  });
});
passport.use(new Strategy(function verify(username, password, cb) {}));
app.listen(PORT, () => {
  console.log(`Backend server running on port :${PORT}.`);
});
