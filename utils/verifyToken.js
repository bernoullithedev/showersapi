import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    // if (req.user.id === req.params.id || req.user.isAdmin) {
    //   next();
    // } else {
    //   return next(createError(403, "You are not authorized!"));
    // }
  });
};

export const verifyAdmin = (req, res, next) => {
  // verifyToken(req, res, next, () => {
  //   try {
  //     const [rows] = await req.db.query("SELECT * FROM admin where id = ?",[req.user.id]);
  //     if (rows.length === 0) {
  //       return next(createError(404, "User not found"));
  //     }
  //     res.status(200).json(rows[0]);
  //   } catch (err) {
  //     next(createError(500, "Failed to get users"));
  //   }
  // });
};
