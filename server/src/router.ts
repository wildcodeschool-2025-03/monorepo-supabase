import express from "express";
import check from "./modules/middlewares/security";
const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

// Define item-related routes
import itemActions from "./modules/item/itemActions";

router.get("/api/items/joint", check.checkToken, itemActions.joint);
router.get("/api/items", check.checkToken, itemActions.browse);
router.get("/api/items/:id([0-9]+)", check.checkToken, itemActions.read);
router.post("/api/items", check.checkToken, itemActions.add);

import userAction from "./modules/user/userAction";
router.get(
  "/api/users/:id([0-9]+)",
  check.checkToken,
  check.isAdmin,
  userAction.read,
);
router.get("/api/users/my-account", check.checkToken, userAction.myAccount);

import authAction from "./modules/auth/authAction";
router.post("/api/auth/signin", authAction.signIn);
router.post("/api/auth/signup", authAction.signUp);

/* ************************************************************************* */

export default router;
