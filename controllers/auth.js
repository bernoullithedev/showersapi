import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";

export const register = async (req, res, next) => {
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.passwordn, salt);

    // Prepare new user object with all necessary fields
    const newUser = {
      username: req.body.usernamei,
      email: req.body.email,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      level_: req.body.level_,

      course: req.body.course,
      phone: req.body.phone,
      password: hash,
      img: req.body.img,
      sex: req.body.sex,
    };

    // Insert new user into the database
    const [result] = await req.db.query(
      "INSERT INTO users (username, email, firstname, lastname, level_, course, phone, password, img,sex) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?,?)",
      [
        newUser.username,
        newUser.email,
        newUser.firstname,
        newUser.lastname,
        newUser.level_,
        newUser.course,
        newUser.phone,
        newUser.password,
        newUser.img,
        newUser.sex,
      ]
    );
    const [rows] = await req.db.query(
      "SELECT * FROM users WHERE username = ?",
      [newUser.username]
    );
    const user = rows[0];
    if (!user) {
      return next(createError(404, "Account not Created"));
    }

    // res.status(200).send("User has been created.");
    res.status(200).json({
      message: "Login successful",
      details: {
        id: user.id,
        username: user.username,
        img: user.img,
        // Include any other user details you want to send
      },
    });
    next();
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    // Retrieve user by username
    const [rows] = await req.db.query(
      "SELECT * FROM users WHERE username = ?",
      [req.body.username]
    );

    const user = rows[0];
    console.log(user);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    // Compare provided password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(createError(400, "Wrong password or username!"));
    }
    // Send success response
    res.status(200).json({
      message: "Login successful",
      details: {
        id: user.id,
        username: user.username,
        email: user.email,
        img: user.img,
        // Include any other user details you want to send
      },
    });
    next();
  } catch (err) {
    next(err);
  }
};

// ADMIN AUTHORIZATION
export const adminRegister = async (req, res, next) => {
  try {
    // Log request body to check the incoming data
    console.log("Request body:", req.body);

    // Validate input datah
    const { username, email, phoneNumber, password, img } = req.body;
    if (!username || !email || !phoneNumber || !password || !img) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Prepare new user object with all necessary fields
    const newAdmin = {
      username,
      email,
      phoneNumber,
      password: hash,
      img,
    };

    // Insert new user into the database
    const [result] = await req.db.query(
      "INSERT INTO admin (username, email, password, img, phoneNumber) VALUES (?, ?, ?, ?, ?)",
      [
        newAdmin.username,
        newAdmin.email,
        newAdmin.password,
        newAdmin.img,
        newAdmin.phoneNumber,
      ]
    );

    res.status(200).send("Admin has been created.");
  } catch (err) {
    next(err);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    // Retrieve user by username
    const [rows] = await req.db.query(
      "SELECT * FROM admin WHERE username = ?",
      [req.body.username]
    );

    const user = rows[0];

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    // Compare provided password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isPasswordCorrect) {
      return next(createError(400, "Wrong password or username!"));
    }

    // Send success response
    res.status(200).json({
      message: "Login successful",
      details: {
        id: user.id,
        username: user.username,
        img: user.img,
        // Include any other user details you want to send
      },
    });
  } catch (err) {
    next(err);
  }
};
