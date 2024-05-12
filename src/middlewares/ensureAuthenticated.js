import AppError from "../utils/AppError.js";
import Jwt from "jsonwebtoken";
import auth from "../config/auth.js";
import knexConnect from "../database/knex/index.js";

async function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token não informado.", 401);
  }

  const [, token] = authHeader.split(" ");
  try {
    const { sub: tokenDecoded } = Jwt.verify(token, auth.jwt.secret);

    const [user] = await knexConnect("users").where("uuid", "=", tokenDecoded);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    request.user = user;

    return next();
  } catch (error) {
    throw new AppError("JWT token inválido.", 401);
  }
}

export default ensureAuthenticated;
