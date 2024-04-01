import { model as User } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError } from "../errors/bad-request.js";
import { UnauthenticatedError } from "../errors/unauthenticated.js";
import dotenv from "dotenv";

dotenv.config();

// create user, create token, send response back to frontend
export const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token }); // send user obj with the user's name and token to the frontend
};

// validate email and password, find user using the email, compare passwords, generate token, send response back to frontend
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) throw new BadRequestError("Please provide an email and password");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const token = user.createJWT(); // Remember the JWT token will be generated as the same token if the user's name matches, if they register as "bob" and the JWT is generated as "b1b", if "bob" logins in, when we create a new token with "bob" it will be generated as "b1b"
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};
