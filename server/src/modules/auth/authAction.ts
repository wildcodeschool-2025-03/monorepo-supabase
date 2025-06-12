import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";
const signIn: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  // Valider les données d'entrée
  const user = await userRepository.signIn(email, password);

  // Si l'utilisateur n'existe pas, renvoyer une erreur 401
  if (!user) {
    return res.status(401).send({ message: "Gros va voir ailleurs" });
  }

  // Generate a JWT token
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

  res.send({ message: "Gros c'est bon", token: token, userId: user.id });
};

const signUp: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  const userId = await userRepository.create({ email, password });

  if (!userId) {
    return res.status(400).send({ message: "Gros va voir ailleurs" });
  }
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET);

  res.send({ message: "Gros c'est bon", token: token, userId: userId });
};

export default { signIn, signUp };
