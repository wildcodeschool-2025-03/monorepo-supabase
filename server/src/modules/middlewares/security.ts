import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const checkToken: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded: any) => {
    if (err) {
      console.error("Token verification failed:", err);
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin: RequestHandler = async (req, res, next) => {
  if (req.userId) {
    next();
  } else {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

export default { checkToken, isAdmin };
