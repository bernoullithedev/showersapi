import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import dotenv from "dotenv";
dotenv.config();

export const updateUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    let hash;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }

    await req.db.query(
      "UPDATE users SET username=?, email=?, password=? WHERE id=?",
      [username, email, hash, req.params.id]
    );
    res.status(200).json({ id: req.params.id, username, email });
  } catch (err) {
    next(createError(500, "Failed to update user"));
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await req.db.query("DELETE FROM users WHERE id=?", [req.params.id]);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(createError(500, "Failed to delete user"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM users WHERE id=?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return next(createError(404, "User not found"));
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    next(createError(500, "Failed to get user"));
    console.log("Failed to get users");
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (err) {
    next(createError(500, "Failed to get users"));
  }
};
