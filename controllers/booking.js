export const getBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id; // Assuming the booking ID is passed as a URL parameter

    const [rows] = await req.db.query(
      "SELECT bookings.id AS booking_id, users.firstname AS user_fname, users.lastname AS user_lname, rooms.roomNumber AS room_number, bookings.created_at AS booking_date FROM bookings JOIN users ON bookings.user_id = users.id JOIN rooms ON bookings.room_id = rooms.id WHERE bookings.id = ?",
      [bookingId] // Pass the booking ID as a parameter to the query
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(rows[0]); // Return the specific booking
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const [rows] = await req.db.query(
      "SELECT bookings.id AS booking_id, users.firstName AS user_fname,users.lastName AS user_lname, rooms.roomNumber AS room_number,rooms.maxPeople,rooms.amenities,rooms.price, bookings.created_at AS booking_date FROM bookings JOIN users ON bookings.user_id = users.id JOIN rooms ON bookings.room_id = rooms.id;"
    );

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};
export const getBookingStatus = async (req, res, next) => {
  try {
    const [rows] = await req.db.query(
      `SELECT 
            rooms.id AS room_id,
            rooms.roomNumber,
            rooms.price,
             rooms.amenities,
            rooms.maxPeople,
            rooms.gender, 
            COUNT(bookings.id) AS booking_count,
            (CASE WHEN COUNT(bookings.id) = rooms.maxPeople THEN 'Full' ELSE 'Available' END) AS booking_status
         FROM 
            rooms
         LEFT JOIN 
            bookings ON rooms.id = bookings.room_id
         GROUP BY 
            rooms.id;`
    );

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};

export const getBookingStatusId = async (req, res, next) => {
  try {
    const [rows] = await req.db.query(
      `SELECT 
            rooms.id AS room_id,
            rooms.roomNumber,
            rooms.price,
             rooms.amenities,
            rooms.maxPeople,
            rooms.gender, 
            COUNT(bookings.id) AS booking_count,
            (CASE WHEN COUNT(bookings.id) = rooms.maxPeople THEN 'Full' ELSE 'Available' END) AS booking_status
         FROM 
            rooms
         LEFT JOIN 
            bookings ON rooms.id = bookings.room_id
            WHERE rooms.id = ?
         GROUP BY 
            rooms.id;`,
      [req.params.id]
    );

    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
};
