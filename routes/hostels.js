import express from "express";
import {
  createHostel,
  deleteHostel,
  getHostel,
  getHostelRooms,
  getAllRooms,
  updateHostel,
} from "../controllers/hostel.js";
import { verifyAdmin } from "../utils/verifyToken.js";

const hostelRoute = express.Router();

// CREATE
hostelRoute.post("/", verifyAdmin, createHostel);

// UPDATE
hostelRoute.put("/:id", verifyAdmin, updateHostel);

// DELETE
hostelRoute.delete("/:id", verifyAdmin, deleteHostel);

// GET
hostelRoute.get("/find/:id", getHostel);

// GET ALL
hostelRoute.get("/", getAllRooms);

hostelRoute.get("/room/:id", getHostelRooms);

export default hostelRoute;
