import { GenreModel } from "../models/Genre.js";

export const ctrlCreateGenre = async (req, res) => {
  try {
    const genre = await GenreModel.create(req.body);

    if (!genre) {
      throw {
        status: 404,
        message: "No se pudo crear el género",
      };
    }
    return res.status(201).json(genre);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
