import { compare, hash } from "bcrypt";
import { validate as isUUID, v4 as uuid } from "uuid";
import knexConnect from "../database/knex/index.js";
import AppError from "../utils/AppError.js";
import EmailCheck from "../utils/EmailCheck.js";

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new AppError("Preencha todos os campos!", 400);
    }

    const emailCheck = new EmailCheck(email);

    if (!emailCheck.isValid()) {
      throw new AppError("Email inválido. Tente novamente!", 400);
    }

    const [checkUserExist] = await knexConnect("users").where(
      "email",
      "=",
      email
    );

    if (checkUserExist) {
      throw new AppError("Desculpe, e-mail já está em uso!", 400);
    }

    const user_uuid = uuid();
    const encryptedPassword = await hash(password, 8);

    const user = {
      uuid: user_uuid,
      name,
      email,
      password: encryptedPassword,
    };

    await knexConnect("users").insert(user);
    res.status(201).json({ message: "Usuário criado com sucesso!" });
  }

  async show(req, res) {
    const user_uuid = req.user.uuid;

    if (!user_uuid) {
      throw new AppError("Please enter your user ID!", 401);
    }

    const [user] = await knexConnect("users")
      .where("uuid", "=", user_uuid)
      .catch((err) => {
        throw new AppError(
          "Desculpe, houve algum erro ao processar os dados, tente novamente mais tarde.",
          500,
          err
        );
      });

    if (!user) {
      throw new AppError("Usuário não encontrado!", 400);
    }

    return res.json({ user, user_uuid });
  }

  async update(req, res) {
    const user_uuid = req.user.uuid;
    const { name, email, password, old_password } = req.body.user;

    if (!isUUID(user_uuid)) {
      throw new AppError("ID do usuário inválido!", 404);
    }

    if (!name) {
      throw new AppError("Por favor, informe seu nome!", 400);
    }

    if (!email) {
      throw new AppError("Por favor, entre com um e-mail válido!", 400);
    }

    const [dbUser] = await knexConnect("users").where("uuid", "=", user_uuid);
    const [dbUserEmail] = await knexConnect("users").where("email", "=", email);

    if (!dbUser) {
      throw new AppError("Usuário não encontrado!", 404);
    }

    if (dbUserEmail && dbUserEmail.uuid !== user_uuid) {
      throw new AppError("Desculpe, esse e-mail já está em uso!", 400);
    }

    if((!password && old_password) || (password && !old_password)){
      throw new AppError("Por favor informe sua senha atual e/ou nova senha", 400);
    }

    if(password && old_password && !(await compare(old_password, dbUser.password))){
      throw new AppError("Desculpe, sua senha atual está incorreta!", 400);
    }

    const encryptedPassword = password && old_password ? await hash(password, 8) : dbUser.password;

    await knexConnect("users").where("uuid", "=", user_uuid).update({
      name,
      email,
      password: encryptedPassword,
    });

    res.json({ message: "Usuário atualizado com sucesso!" });
  }

  async delete(req, res) {
    const user_uuid = req.user.uuid;

    const { email, password } = req.body;

    if (!isUUID(user_uuid)) {
      throw new AppError("ID do usuário inválido!", 400);
    }

    if (!email || !password) {
      throw new AppError("Por favor, informe seu e-mail e senha!", 400);
    }

    const [user] = await knexConnect("users").where("uuid", "=", user_uuid);

    if (!user) {
      throw new AppError("Usuário não encontrado!", 400);
    }

    const checkEmail = user.email === email;
    const checkPassword = await compare(password, user.password);
    const checkUserID = user.uuid === user_uuid;

    if (!checkEmail || !checkPassword || !checkUserID) {
      throw new AppError("Por favor, verifique suas informações!", 400);
    }

    await knexConnect("users").where("uuid", "=", user.uuid).delete();
    res.json({ message: "Usuário deletado com sucesso!" });
  }
}

export default UsersController;
