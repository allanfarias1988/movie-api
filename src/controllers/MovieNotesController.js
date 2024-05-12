import knexConnect from "../database/knex/index.js";
import AppError from "../utils/AppError.js";

class MovieNotesController {
  async index(req, res) {
    const user_id = req.user.id;
  
    if (!user_id) {
      throw new AppError("Por favor, entre com ID do usuário!", 400);
    }

    const allNotes = await knexConnect("movieNotes").where({ user_id });

    if (!allNotes) {
      return res.json("Lista de notas vazia!.");
    }

    return res.json(allNotes);
  }

  async create(req, res) {
    const { title, description, rating, tags } = req.body;
    const user_id = req.user.id;

    if (!title || !description || !rating || !tags) {
      throw new AppError("Por favor preencha todas as informações!", 400);
    }

    const movieNotes = { title, description, rating, user_id };

    const [note_id] = await knexConnect("movieNotes").insert(movieNotes);

    const movieTags = tags.map((name) => {
      return {
        note_id,
        user_id,
        name,
      };
    });

    await knexConnect("movieTags").insert(movieTags);

    res.status(201).json({ message: "Nota de vídeo criada com sucesso!" });
  }

  async show(req, res) {
    const user_id = req.user.id;

    if (!user_id) {
      throw new AppError("Por favor, entre com o ID do usuário!", 400);
    }

    const [note] = await knexConnect("movieNotes").where({ id });

    if (!note) {
      throw new AppError("Nota de vídeo não encontrada!", 404);
    }

    const noteWidthTags = await knexConnect("movieTags")
      .where({ note_id: id })
      .orderBy("name");

    res.status(200).json(noteWidthTags);
  }

  async delete(req, res) {
    const user_id = req.user.id;

    if (!user_id) {
      throw new AppError("Por favor, informe o ID da nota!", 400);
    }

    const [note_id] = await knexConnect("movieNotes").where({ id });

    if (!note_id) {
      throw new AppError("Nota do vídeo não econtrada!", 404);
    }

    await knexConnect("movieNotes").where({ id }).delete();

    res.status(200).json({ message: "Nota de vídeo deletada com sucesso!" });
  }

  async update(req, res) {
    const user_id = req.user.id;
    const { title, description, rating } = req.body;

    if (!id) {
      throw new AppError("Por favor, informe o ID da nota!", 400);
    }

    const isValidId = Number.isNaN(Number(id));

    if (isValidId) {
      throw new AppError("Por favor , informe um ID válido!", 400);
    }

    const [note] = await knexConnect("movieNotes").where({ id });

    if (!note) {
      throw new AppError("Nota do vídeo não encontrada!", 404);
    }

    await knexConnect("movieNotes")
      .where({ id })
      .update({
        title: title ? title : note.title,
        description: description ? description : note.description,
        rating: rating ? rating : note.rating,
      });

    res.status(200).json({ message: "Nota do vídeo atualizada com sucesso!" });
  }
}

export default MovieNotesController;
