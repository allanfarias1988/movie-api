import { Router } from "express";
import UserController from "../controllers/UsersController.js";
import UsersAvatarController from "../controllers/UsersAvatarController.js";
import ensureAuthenticated from "../middlewares/ensureAuthenticated.js";
import multer from "multer";
import { MULTER } from "../config/upload.js";

const upload = multer(MULTER);
const usersRoutes = Router();
const userController = new UserController();
const userAvatarController = new UsersAvatarController();

usersRoutes.post("/", userController.create);

usersRoutes.use(ensureAuthenticated);

usersRoutes.get("/", userController.show);
usersRoutes.put("/", userController.update);
usersRoutes.delete("/", userController.delete);

export default usersRoutes;
