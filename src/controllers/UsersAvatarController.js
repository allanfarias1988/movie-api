import knexConnect from "../database/knex/index.js";
import DiskStorage from "../providers/DiskStorage.js";
import AppError from "../utils/AppError.js";

class UsersAvatarController {
  async update(request, response) {
    const user_uuid = request.user.uuid;
    const avatarFileName = request.file.filename;

    if (!user_uuid) {
      throw new AppError("ID do usuário não informado!", 400)
    }

    if (!avatarFileName) {
      throw new AppError("Nome do arquivo não informado!", 400);
    }

    const avatarFileNameValidate = String(avatarFileName).includes(
      ".png" | ".jpeg" | ".jpg"
    );


    const diskStorage = new DiskStorage();

    const user = await knexConnect("users").where({ uuid: user_uuid }).first();

    if (!user) {
      throw new AppError(
        "Somente usuários autorizados podem alterar o avatar",
        401
      );
    }

    if (user.avatar) {
      const isAvatarDeleted = await diskStorage.deleteFile(user.avatar);
      if (!isAvatarDeleted) {
        throw new AppError("Error ao deletar o avatar!", 400);
      }
    }

    const isFileSaved = await diskStorage.saveFile(avatarFileName);

    if (!isFileSaved) {
      throw new AppError("Não foi possível salvar o avatar!", 400);
    }
    user.avatar = avatarFileName;

    await knexConnect("users")
      .update({ avatar: avatarFileName })
      .where({ uuid: user_uuid });

    return response.json({ user });
  }

  async get(request, response) {
    const diskStorage = new DiskStorage();

    const user_uuid = request.user.uuid;

    const user = await knexConnect("users").where({ uuid: user_uuid }).first();
    
    const file = await diskStorage.getFilePath(user.avatar);

    return response.download(file);
  }
}

export default UsersAvatarController;
