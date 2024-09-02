import express from "express";
import {
  adminRegister,
  adminLogin,
  login,
  register,
} from "../controllers/auth.js";

const router = express.Router();

//User Login and Register
router.post("/register", register);
router.post("/login", login);

//ADMIN LOGIN AND REGISTER
router.post("/owner/register", adminRegister);
router.post("/owner/login", adminLogin);

export default router;
