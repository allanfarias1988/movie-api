import { Router } from "express";
import SessionController from "../controllers/SessionController.js";

const sessionController = new SessionController();
const sessionRoutes = new Router();

sessionRoutes.post("/", sessionController.create);

export default sessionRoutes;
