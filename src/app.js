import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import fileUpload from "express-fileupload";

const app = express();

// Importo rutas y DB
import { connectionMongoBD } from "./config/database.js";
import { authorRouther } from "./routes/author.routes.js";
import { bookRouther } from "./routes/book.routes.js";
import { genreRouther } from "./routes/genre.routes.js";


// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(helmet());
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 20 * 1024 * 1024 },
    abortOnLimit: true,
    responseOnLimit: "Archivo muy grande",
  })
);

// Routes
app.use(authorRouther);
app.use(bookRouther);
app.use(genreRouther);

// Listening Server
app.listen(3000, () => {
  console.log("listening on port 3000");
  connectionMongoBD();
});
