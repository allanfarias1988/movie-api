import path from "node:path";
import fs from "node:fs";
import { TMP_FOLDER, UPLOAD_FOLDER } from "../config/upload.js";
import { error } from "node:console";

class DiskStorage {
  async saveFile(file) {
    try {
      await fs.promises.rename(
        path.resolve(TMP_FOLDER, file),
        path.resolve(UPLOAD_FOLDER, file)
      );

      return true;
    } catch (error) {
      console.error("Não foi possível salvar o arquivo!", error.message);
      return false;
    }
  }

  async deleteFile(file) {
    const filePath = path.resolve(UPLOAD_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
      await fs.promises.unlink(filePath);
      return true;
    } catch (error) {
      console.error("Não foi possível deletar o arquivo!", error.message);
      return false;
    }
  }

  async getFilePath(file) {
    return path.resolve(UPLOAD_FOLDER, file);
  }
}

export default DiskStorage;
