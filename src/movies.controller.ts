import { Request, Response } from "express";
import { MovieService } from "./movies.service";
import { asyncHandler } from "./asyncHandler";
import { BadRequest } from "./middleware/error";

const moviesService = new MovieService();

const getListOfAvailableGenres = asyncHandler(async (req: Request, res: Response) => {
  const genres = await moviesService.getListOfAvailableGenres();

  res.status(200).json(genres);
});

const getGenreByName = asyncHandler(async (req: Request, res: Response) => {
  const genre = await moviesService.getGenreByName(req.query.genre as string);

  res.status(200).json(genre);
});

const getMoviesByGenre = asyncHandler(async (req: Request, res: Response) => {
  const genre = await moviesService.getMoviesByGenre(req.query.genre as string);

  res.status(200).json(genre);
});

const telexTickResponder = asyncHandler(async (req: Request, res: Response) => {
  const { channel_id, return_url, settings } = req.body;
  if (channel_id !== return_url.split("/").at(-1)) throw new BadRequest("Invalid Channel id or return url");

  res.status(202).json({ message: "Accepted" });

  const genre = settings.find((setting: Record<string, unknown>) => setting.label === "Select Genre");

  await moviesService.tickResponder(genre.default, return_url);
});

export { getListOfAvailableGenres, getGenreByName, getMoviesByGenre, telexTickResponder };