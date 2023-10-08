import { Schema, model } from "mongoose";

const GenreSchema = new Schema(
  {
    name_genre: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const GenreModel = model("Genre", GenreSchema);
