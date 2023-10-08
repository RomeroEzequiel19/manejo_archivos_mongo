import { Schema, model } from "mongoose";

const BookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    year_publication: {
      type: Number,
      required: true,
    },
    url_front_page: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Author",
    },
    genre: {
      type: Schema.Types.ObjectId,
      ref: "Genre",
    },
  },
  {
    timestamps: true,
  }
);

export const BookModel = model("Book", BookSchema);
