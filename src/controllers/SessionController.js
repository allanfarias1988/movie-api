import knexConnect from "../database/knex/index.js";
import AppError from "../utils/AppError.js";
import { compare } from "bcrypt";
import auth from "../config/auth.js";
import Jwt from "jsonwebtoken";

export class SessionController {
  async create(request, response) {
    const { email, password } = request.body;

    const user = await knexConnect("users").where({ email }).first();

    if (!user) {
      throw new AppError("E-mail e/ou senha incorretos", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("E-mail e/ou senha incorretos", 401);
    }

    const { secret, expiresIn } = auth.jwt;

    const token = Jwt.sign({}, secret, {
      subject: String(user.uuid),
      expiresIn,
    });

    return response.json({ user, token });
  }
}

export default SessionController;
