import UsersAvatarController from "../controllers/UsersAvatarController.js";
import { Router } from "express";
import multer from "multer";
import { MULTER } from "../config/upload.js";
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";

const upload = multer(MULTER);
const usersAvatarRoutes = Router();

const userAvatarController = new UsersAvatarController();

usersAvatarRoutes.patch(
  "/",
  ensureAuthenticated,
  upload.single("avatar"),
  (request, response) => userAvatarController.update(request, response)
);

usersAvatarRoutes.get(
  "/",
  ensureAuthenticated,
  (request, response) => userAvatarController.get(request, response)
);

export default usersAvatarRoutes;
