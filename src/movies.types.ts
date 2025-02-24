export interface Genre {
  id: number,
  name: string
};

export interface Movie {
  adult: boolean,
  title: string,
  language: string,
  genres: string[],
  release_date: string,
  rating: string,
  overview: string
}