import dotenv from "dotenv";
dotenv.config();

export const createRoom = async (req, res, next) => {
  // const hostelId = req.params.hostelid;

  try {
    // Insert the new room into the rooms table
    const [result] = await req.db.query(
      "INSERT INTO rooms (hostel_id, title, price, maxPeople, description, roomNumber, floor, amenities, isAvailable,gender) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        req.body.hostelId,
        req.body.title,
        req.body.price,
        req.body.maxPeople,
        req.body.description,
        req.body.roomNumber, // Assuming this field exists in the request body
        req.body.floor, // Assuming this field exists in the request body
        JSON.stringify(req.body.amenities), // Store amenities as JSON
        req.body.isAvailable || true, // Default to false if not provided
        req.body.gender,
      ]
    );

    const roomId = result.insertId;

    res.status(200).json({ id: roomId, ...req.body });
  } catch (err) {
    next(err);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const [result] = await req.db.query(
      "UPDATE rooms SET title = ?, price = ?, maxPeople = ?, description = ?, roomNumber = ?, floor = ?, amenities = ?,isAvailable = ? gender = ?  WHERE id = ?",
      [
        req.body.title,
        req.body.price,
        req.body.maxPeople,
        req.body.description,
        req.body.roomNumber, // Assuming this field exists in the request body
        req.body.floor, // Assuming this field exists in the request body
        JSON.stringify(req.body.amenities), // Convert amenities to JSON
        req.body.isAvailable, // Default value should be handled in the request body

        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({ id: req.params.id, ...req.body });
  } catch (err) {
    next(err);
  }
};

export const updateRoomAvailability = async (req, res, next) => {
  try {
    // Fetch the current availability status of the room
    const [room] = await req.db.query("SELECT * FROM rooms WHERE id = ?", [
      req.params.id,
    ]);

    if (room.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Get the current availability status and toggle it
    const currentAvailability = room[0].isAvailable;
    const newAvailability = !currentAvailability;

    // Update the room's availability status
    await req.db.query(
      "UPDATE rooms SET isAvailable = ? WHERE roomNumber = ?",
      [newAvailability, req.params.roomNumber]
    );

    res
      .status(200)
      .json({ message: `Room availability updated to ${newAvailability}` });
  } catch (err) {
    next(err);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    // Delete the room
    await req.db.query("DELETE FROM rooms WHERE id = ?", [req.params.id]);

    // Optionally, if you need to remove related photos or perform additional operations,
    // you can handle them here. Since the foreign keys with `ON DELETE CASCADE` will
    // automatically handle related entries, this may not be necessary.

    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
export const getSpecRoom = async (req, res, next) => {
  const { maxPeople, gender, amenities } = req.query;

  try {
    const [rows] = await req.db.query(
      "SELECT * FROM rooms WHERE maxPeople <= ? AND gender = ?",
      [maxPeople, gender]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No Room of such" });
    }

    const requiredAmenities = amenities ? amenities.split(",") : [];

    const filteredRooms = rows.filter((room) => {
      let roomAmenities;
      try {
        // Parse the amenities twice to handle double stringification
        roomAmenities = JSON.parse(JSON.parse(room.amenities));
      } catch (error) {
        console.error("Error parsing room amenities:", error);
        return false;
      }

      // Check if all required amenities are present in the room's amenities
      const hasAllAmenities = requiredAmenities.every((amenity) => {
        return (
          roomAmenities.hasOwnProperty(amenity) &&
          roomAmenities[amenity] === true
        );
      });

      return hasAllAmenities;
    });

    res.status(200).json(filteredRooms);
  } catch (err) {
    console.error("Error in getSpecRoom:", err);
    next(err);
  }
};
export const getRoom = async (req, res, next) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM rooms WHERE id=?", [
      req.params.id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
};
export const getPayments = async (req, res, next) => {
  try {
    const [rows] = await req.db.query("SELECT amount FROM payments");
    let totalAmount = 0;
    rows.forEach((row) => {
      totalAmount += row.amount;
    });
    res.status(200).json(totalAmount);
  } catch (err) {
    next(err);
  }
};

export const getPaymentsAll = async (req, res, next) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM payments");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getRooms = async (req, res, next) => {
  try {
    const [rows] = await req.db.query("SELECT * FROM rooms");
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};
