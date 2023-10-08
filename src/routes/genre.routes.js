import { Router } from "express";
import { ctrlCreateGenre } from "../controllers/genre.controller.js";

const genreRouther = Router();

genreRouther.post('/api/genre', ctrlCreateGenre)

export {genreRouther}