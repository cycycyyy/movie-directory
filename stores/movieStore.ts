import { defineStore } from "pinia";

// Export interface for type checking

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: Genre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface MovieCast {
  id: number;
  cast: CastMember[];
}

export interface Image {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface MovieImages {
  id: number;
  backdrops: Image[];
  logos: Image[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
}

export const useMovieStore = defineStore({
  id: "useMovieStore",
  state: () => ({}),
  actions: {
    fetchTrendingMovies: async () => {
      try {
        const API_URL = useRuntimeConfig().public.TMDB_API_URL;
        const API_KEY = useRuntimeConfig().public.TMDB_API_KEY;
        const response = await fetch(
          `${API_URL}/trending/movie/day?language=en-US&api_key=${API_KEY}`
        );

        const data = await response.json();
        const movies = data.results as Movie[];

        // Get full movie data
        const moviePromises = movies.map(async (movie) => {
          const movieData = await useMovieStore().fetchMovieByID(
            movie.id.toString()
          );
          // Update movie with full data
          Object.assign(movie, movieData);
        });

        // Wait for all movie data to be fetched
        await Promise.all(moviePromises);

        return movies as Movie[];
      } catch (error) {
        console.error(error);
      }
    },
    fetchMovieByID: async (id: string) => {
      try {
        const API_URL = useRuntimeConfig().public.TMDB_API_URL;
        const API_KEY = useRuntimeConfig().public.TMDB_API_KEY;
        const response = await fetch(
          `${API_URL}/movie/${id}?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        return data as Movie;
      } catch (error) {
        console.error(error);
      }
    },
    fetchCreditsByID: async (id: string) => {
      try {
        const API_URL = useRuntimeConfig().public.TMDB_API_URL;
        const API_KEY = useRuntimeConfig().public.TMDB_API_KEY;
        const response = await fetch(
          `${API_URL}/movie/${id}/credits?api_key=${API_KEY}&language=en-US`
        );
        const data = await response.json();
        return data as MovieCast;
      } catch (error) {
        console.error(error);
      }
    },
    fetchImagesByID: async (id: string) => {
      try {
        const API_URL = useRuntimeConfig().public.TMDB_API_URL;
        const API_KEY = useRuntimeConfig().public.TMDB_API_KEY;
        const response = await fetch(
          `${API_URL}/movie/${id}/images?api_key=${API_KEY}`
        );
        const data = await response.json();
        return data as MovieImages;
      } catch (error) {
        console.error(error);
      }
    },
  },
});
