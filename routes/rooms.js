import express from "express";
import {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  getPayments,
  getPaymentsAll,
  updateRoomAvailability,
  getSpecRoom,
} from "../controllers/room.js";
// import { verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", createRoom);

// UPDATE
router.put("/availability/:id", updateRoomAvailability);
router.put("/:id", updateRoom);

// DELETE
router.delete("/:id/", deleteRoom);

// GET
router.get("/:id", getRoom);
router.get("/payments/all", getPayments);
router.get("/payments/table", getPaymentsAll);

// GET ALL
router.get("/", getRooms);
router.get("/specific/all", getSpecRoom);

export default router;
