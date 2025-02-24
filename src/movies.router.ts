import { Router } from "express";
import { getGenreByName, getListOfAvailableGenres, getMoviesByGenre } from "./movies.controller";

const moviesRouter = Router();

moviesRouter.get(
  "/genres",
  getListOfAvailableGenres
);

moviesRouter.get(
  "/genres/name",
  getGenreByName
);

moviesRouter.get(
  "/genres/all-movies",
  getMoviesByGenre
);

export { moviesRouter }