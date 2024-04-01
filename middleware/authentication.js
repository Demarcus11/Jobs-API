import jwt from "jsonwebtoken";
import { model as User } from "../models/User.js";
import { UnauthenticatedError } from "../errors/unauthenticated.js";

// check autherization header, verify the token, all job CRUD features are protected, so we can add a user obj to each job CRUD request with the id and name of the user who's making the request, that way in the job controllers we can only CRUD for that user's id
export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // decode the token to get the payload of the token
    req.user = { userId: payload.userId, name: payload.name };
    next(); // pass the the next middleware function (login())
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};
