import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
} from "../controllers/user.js";
// import { verifyAdmin, verifyToken, verifyUser } from "../utils/verifyToken.js";

const usersRoute = express.Router();

// UPDATE
usersRoute.put("/:id", updateUser);

// DELETE
usersRoute.delete("/:id", deleteUser);

// GET
usersRoute.get("/:id", getUser);

// GET ALL
usersRoute.get("/", getUsers);

export default usersRoute;
