import type { RequestHandler } from "express";

// Import access to data
import itemRepository from "./itemRepository";

const joint: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const items = await itemRepository.joint();

    // Respond with the items in JSON format
    res.json(items);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};
// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const items = await itemRepository.readAll();

    // Respond with the items in JSON format
    res.json(items);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const itemId = Number(req.params.id);
    const item = await itemRepository.read(itemId);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (item == null) {
      res.sendStatus(404);
    } else {
      res.json(item);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Cr
// eate) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Extract the item data from the request body
    const newItem = {
      title: req.body.title,
      user_id: req.body.user_id,
    };

    // Create the item
    const insertId = await itemRepository.create(newItem);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted item
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const itemId = Number(req.params.id);
    const item = await itemRepository.destroy(itemId);

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.body);

    // Fetch a specific item based on the provided ID
    const newItem = { title: req.body.title, id: Number(req.params.id) };
    const item = await itemRepository.update(newItem);

    res.status(200).json({ message: "Item update successfully" });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { joint, browse, read, add, destroy, update };
