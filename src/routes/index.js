import { Router } from "express";
import usersRoutes from "./users.routes.js";
import movieNotesRoutes from "./movie.notes.routes.js";
import sessionRoutes from "./session.routes.js";
import usersAvatarRoutes from "./users.avatar.routes.js";

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/avatar", usersAvatarRoutes);
routes.use("/notes", movieNotesRoutes);
routes.use("/session", sessionRoutes);

export default routes;
