import { Router } from "express";
import {
  ctrlCreateBook,
  ctrlDeleteBook,
  ctrlFindAllBooks,
  ctrlFindBookById,
  ctrlGroupBooksByGenre,
  ctrlUpdateBook,
} from "../controllers/book.controller.js";

const bookRouther = Router();

bookRouther.post("/api/book", ctrlCreateBook);
bookRouther.get("/api/book", ctrlFindAllBooks);
bookRouther.get("/api/book/group_genre", ctrlGroupBooksByGenre);
bookRouther.get("/api/book/:id", ctrlFindBookById);
bookRouther.put("/api/book/:id", ctrlUpdateBook);
bookRouther.delete("/api/book/:id", ctrlDeleteBook);

export { bookRouther };
