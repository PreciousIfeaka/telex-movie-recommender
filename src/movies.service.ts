import axios, { AxiosInstance } from "axios";
import { config } from "./config";
import { Genre, Movie } from "./movies.types";
import { BadRequest, ResourceNotFound } from "./middleware/error";

export class MovieService {
  axiosInstance: AxiosInstance;
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.TMDB_API_BASE_URL,
      timeout: 100000,
      headers: {"Authorization": `Bearer ${config.TMDB_JWT}`}
    });
  };

  async getListOfAvailableGenres(): Promise<{
    genres: Genre[]
  }> {
    const moviesGenres: Genre[] = await this.axiosInstance.get("/genre/movie/list")
      .then((response) => response.data.genres)
      .catch((error) => { console.error(error); throw new BadRequest(error.message) });

    const tvShowsGenres: Genre[] = await this.axiosInstance.get("/genre/tv/list")
      .then((response) => response.data.genres)
      .catch((error) => { throw new Error(error.message) });

    console.log(tvShowsGenres, moviesGenres)

    return {
      genres: [...new Set([...moviesGenres, ...tvShowsGenres])]
    };
  };

  async getGenreByName(genreName: string): Promise<Genre> {
    const data = await this.getListOfAvailableGenres();
    const genre = data.genres.find((genre) => genre.name === genreName);
    if (!genre) throw new ResourceNotFound("Invalid genre");

    return genre
  };

  async getGenreByIds(ids: number[]): Promise<string[]> {
    const data = await this.getListOfAvailableGenres();
    const genres = ids.map((id) => {
      const genre = data.genres.find((g) => g.id === id);
      return genre!.name
    });
    return genres;
  };

  async getMoviesByGenre(genreName: string): Promise<Record<string, any>[]> {
    const genre = await this.getGenreByName(genreName);
    const page = Math.floor(Math.random() * 500) + 1;

    const movies = await this.axiosInstance.get(`/discover/movie?with_genres=${genre.id}&page=${page}`)
      .then((response) => response.data )
      .catch((error) => { throw new Error(error) });

    const filteredMovies: Movie[] = await Promise.all(movies.results.map(async (movie: Record<string, any>) => {
      return {
        adult: movie.adult,
        title: movie.title.split(" ").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        language: movie.original_language.toUpperCase(),
        genres: await this.getGenreByIds(movie.genre_ids),
        release_date: new Date(movie.release_date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric"}),
        rating: `${(movie.vote_average * 10).toFixed(0)}%`,
        overview: movie.overview
      };
    }));

    return filteredMovies;
  };

  async tickResponder(genreName: string, returnUrl: string) {
    const movies = await this.getMoviesByGenre(genreName);

    const formattedMovies = movies.map(movie => {
      return `\n🎬 ${movie.title}\n📅 Release Date: ${movie.release_date}\n🌍 Language: ${movie.language}\n🎭 Genres: ${movie.genres.join(", ")}\n⭐ Rating: ${movie.rating}\n📖 Overview: ${movie.overview}\n`;
    });

    const message = formattedMovies.join("\n");

    const data = {
      event_name: "Recommended Movies",
      message,
      status: "success",
      username: "Movie Recommender"
    };

    axios.post(returnUrl, data);
  };
}