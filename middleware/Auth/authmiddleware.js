import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      //Get token from header
      token = req.headers.authorization.split(" ")[1];

      //Verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from The token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("Not authorizated");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not Token");
  }
});

export { protect };
