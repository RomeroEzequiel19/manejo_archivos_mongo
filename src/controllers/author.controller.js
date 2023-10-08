import { AuthorModel } from "../models/Author.js";
import { BookModel } from "../models/Book.js";

//Controlador para eliminar los autores
export const ctrlCreateAuthor = async (req, res) => {
  try {
    const author = await AuthorModel.create(req.body);

    if (!author) {
      throw {
        status: 404,
        message: "No se pudo crear al autor",
      };
    }

    return res.status(201).json(author);
  } catch (error) {
    return res.status(500).json({ message: "Error interino del servidor" });
  }
};

//Controlador para buscar todos los autores
export const ctrlFindAllAuthors = async (req, res) => {
  try {
    const authors = await AuthorModel.find().populate("books");

    if (!authors) {
      throw {
        status: 404,
        message: "No hay authors",
      };
    }

    return res.status(200).json(authors);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Controlador para buscar un autor por ID
export const ctrlFindAuthorById = async (req, res) => {
  const { id } = req.params;

  try {
    const author = await AuthorModel.findById(id);

    if (!author) {
      throw {
        status: 404,
        message: "No existe author",
      };
    }

    return res.status(200).json(author);
  } catch (error) {}
};

//Controlador para modificar un autor
export const ctrlUpdateAuthor = async (req, res) => {
  const { id } = req.params;

  try {
    await AuthorModel.findByIdAndUpdate(id, req.body);

    res.status(200).json({message: "Modificado correctamente"});
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

//Controlador para eliminar un author
export const ctrlDeleteAuthor = async (req, res) => {
  const { id } = req.params;

  try {
    // Encuentra y obtén el autor que deseas eliminar
    const author = await AuthorModel.findById(id);

    if (!author) {
      return res.status(404).json({ message: "El autor no existe" });
    }

    // Encuentra todos los libros asociados a este autor
    const books = await BookModel.find({ author: id });

    // Itera sobre la lista de libros y elimina la referencia al autor
    for (const book of books) {
      book.author = null;
      await book.save();
    }

    await AuthorModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
