import express from "express";
import {
  getBooking,
  getAllBookings,
  getBookingStatus,
  getBookingStatusId,
} from "../controllers/booking.js";
// import { verifyAdmin } from "../utils/verifyToken.js";

const bookingsRoute = express.Router();

// // CREATE
// bookingsRoute.post("/", verifyAdmin, createHostel);

// // UPDATE
// bookingsRoute.put("/:id", verifyAdmin, updateHostel);

// // DELETE
// bookingsRoute.delete("/:id", verifyAdmin, deleteHostel);

// GET
bookingsRoute.get("/find/:id", getBooking);

// GET ALL
bookingsRoute.get("/", getAllBookings);

//GET ALL ROOM STATUS
bookingsRoute.get("/status", getBookingStatus);

//GET ROOM STATUS
bookingsRoute.get("/status/:id", getBookingStatusId);

export default bookingsRoute;
