import dotenv from "dotenv";
dotenv.config();
import { createError } from "../utils/error.js";

export const createHostel = async (req, res, next) => {
  try {
    const [result] = await req.db.query(
      "INSERT INTO hostels (name, address, photos, title, description) VALUES (?, ?, ?, ?, ?)",
      [
        req.body.name,
        req.body.address,
        JSON.stringify(req.body.photos),
        req.body.title,
        req.body.description,
      ]
    );
    res.status(200).json({ id: result.insertId, ...req.body });
  } catch (err) {
    next(createError(500, "Failed to create hostel"));
  }
};

export const updateHostel = async (req, res, next) => {
  try {
    await req.db.query(
      "UPDATE hostels SET name=?, address=?,  photos=?, title=?, description=?, WHERE id=?",
      [
        req.body.name,
        req.body.address,
        JSON.stringify(req.body.photos),
        req.body.photos,
        req.body.title,
        req.body.description,
        req.params.id,
      ]
    );
    res.status(200).json({ id: req.params.id, ...req.body });
  } catch (err) {
    next(createError(500, "Failed to update hostel"));
  }
};

export const deleteHostel = async (req, res, next) => {
  try {
    await req.db.query("DELETE FROM hostels WHERE id=?", [req.params.id]);
    res.status(200).json("Hostel has been deleted.");
  } catch (err) {
    next(createError(500, "Failed to delete hostel"));
  }
};

export const getHostel = async (req, res, next) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM hostels WHERE id=?", [
      req.params.id,
    ]);
    console.log("getHostel rows:", rows); // Add this line to log the result
    res.status(200).json(rows[0]);
  } catch (err) {
    next(createError(500, "Failed to get hostel"));
  }
};

export const getAllRooms = async (req, res, next) => {
  const { min, max, ...others } = req.query;
  try {
    const [rows] = await req.db.query(
      "SELECT * FROM rooms WHERE price > ? AND price < ? AND isAvailable",
      [min || 0, max || 5000]
    );

    if (!Array.isArray(rows)) {
      throw new TypeError("Query result is not an array");
    }
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error in getAllRooms:", err);
    next(createError(500, "Failed to get all rooms"));
  }
};

export const getHostelRooms = async (req, res, next) => {
  try {
    const [rooms] = await req.db.query(
      "SELECT r.id AS room_id, r.title AS room_title, r.price, r.maxPeople, r.description, r.roomNumber, r.floor, r.amenities, r.isAvailable, h.name AS hostel_name, h.address AS hostel_address FROM rooms r JOIN hostels h ON r.hostel_id = h.id WHERE r.hostel_id = ?",
      [req.params.id]
    );
    console.log("getHostelRooms rooms:", rooms.length); // Log the result
    res.status(200).json(rooms);
  } catch (err) {
    next(createError(500, "Failed to get hostel rooms"));
  }
};
