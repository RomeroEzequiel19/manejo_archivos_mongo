import { BookModel } from "../models/Book.js";
import { AuthorModel } from "../models/Author.js";
import fs from "fs";

export const ctrlCreateBook = async (req, res) => {
  const { author, title, year_publication, genre } = req.body;

  try {
    //Verifico si se adjunta el archivo
    if (!req.files || Object.keys(req.files).length === 0) {
      res.status(400).send("No se adjuntaron archivos.");
      return;
    }

    //Verifico si existe el autor
    const getAuthor = await AuthorModel.findById(author);

    if (!getAuthor) {
      throw {
        status: 404,
        message: "No encuentra el autor",
      };
    }

    //Coloco en una contante el objeto que manda el archivo
    const file = req.files.url_front_page;

    const book = await BookModel.create({
      title,
      year_publication,
      //Coloco el nombre del archivo
      url_front_page: file.name,
      author,
      genre,
    });

    if (!book) {
      throw {
        status: 404,
        message: "No se pudo crear el libro",
      };
    }

    //Subo el archivo en la carpeta
    let path = `src/public/images/${file.name}`;
    file.mv(path, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
    });

    //Realizo el push del ID libro dentro del array de libros del autor
    getAuthor.books.push(book);

    await getAuthor.save();
    await book.save();

    return res.status(201).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const ctrlFindAllBooks = async (req, res) => {
  try {
    const books = await BookModel.find().populate("author");

    if (!books) {
      throw {
        status: 404,
        message: "No hay libros",
      };
    }

    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const ctrlFindBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await BookModel.findById(id).populate("author");

    if (!book) {
      throw {
        status: 404,
        message: "No se encuentra el libro",
      };
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const ctrlUpdateBook = async (req, res) => {
  const { id } = req.params;
  const { author } = req.body;

  try {
    //Busca y modifica el libro
    const updateBook = await BookModel.findByIdAndUpdate(id, {
      $set: req.body,
    });

    //Si le coloca un autor, se agrega el libro al mismo
    if (author !== undefined && author !== null && author !== "") {
      const findAuthor = await AuthorModel.findById(author);

      if (findAuthor) {
        // Verifica si el libro no está en el array de books
        if (!findAuthor.books.includes(id)) {
          findAuthor.books.push(updateBook);
          await findAuthor.save();
        }
      }
    }

    return res.status(202).json({ message: "Modificado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const ctrlDeleteBook = async (req, res) => {
  const { id } = req.params;
  const { author } = req.body;

  try {
    //Busco el libro a eliminar
    const deleteBook = await BookModel.findById(id);

    // Busca el libro por ID y obtén la URL de la imagen de portada
    const imageUrlToDelete = deleteBook.url_front_page;

    // Elimina la imagen correspondiente en la carpeta src/public/images
    const imagePathToDelete = `src/public/images/${imageUrlToDelete}`;
    fs.unlinkSync(imagePathToDelete);

    // Elimina el libro de la base de datos
    await BookModel.findByIdAndDelete(id);

    // Busca el autor relacionado en la base de datos
    const getAuthor = await AuthorModel.findById(author);

    if (!getAuthor) {
      throw {
        status: 404,
        message: "El autor no existe",
      };
    }

    // Elimina la referencia al libro que se eliminó del arreglo de libros del autor
    getAuthor.books.pull(deleteBook);

    //Guarda el autor actualizado en la base de datos
    await getAuthor.save();

    return res.status(201).json({ message: "Eliminado correctamente" });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const ctrlGroupBooksByGenre = async (req, res) => {
  try {
    const groupedBooks = await BookModel.aggregate([
      {
        $group: {
          _id: "$genre",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "genres",
          localField: "_id",
          foreignField: "_id",
          as: "info_genre",
        },
      },
    ]);

    if (!groupedBooks || groupedBooks.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron libros agrupados por género" });
    }

    return res.status(200).json(groupedBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};
