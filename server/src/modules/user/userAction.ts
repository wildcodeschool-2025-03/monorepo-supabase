import type { RequestHandler } from "express";

// Import access to data
import userRepository from "./userRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const users = await userRepository.readAll();

    // Respond with the items in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const myAccount: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const user = await userRepository.read(Number(req.userId));

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { read, browse, myAccount };
