export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    vote_average: number;
    poster_path: string | null;
    backdrop_path: string | null;
    genres: Genre[];
    runtime: number;
}

interface Genre {
    id: number;
    name: string;
}

// Define the new types for the additional data
interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
}

interface VideoResponse {
  results: Video[];
}

interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string | null;
  display_priority: number;
}

interface WatchProvidersResponse {
  results: Record<string, { flatrate?: WatchProvider[]; rent?: WatchProvider[]; buy?: WatchProvider[] }>;
}

interface SimilarMovie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

// Extend the original Movie interface
export interface MovieDetails extends Movie {
  videos?: VideoResponse;
  watch_providers?: WatchProvidersResponse;
  similar_movies?: SimilarMovie[];
  // you can add other new fields returned by the API here
}
