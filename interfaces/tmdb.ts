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

export interface Video {
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

<<<<<<< HEAD
interface SimilarMoviesResponse {
=======
export interface SimilarMoviesResponse {
>>>>>>> 5c94f84224c3ccbe70f9bcc6d2cbf732cffb3c0c
  page: number;
  results: SimilarMovie[];
  total_pages: number;
  total_results: number;
}


interface MovieCredits {
  cast: CastMember[]
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
  known_for_department: string;
  order: number;
}

export interface MovieDetails extends Movie {
  videos?: VideoResponse;
  watch_providers?: WatchProvidersResponse;
  similar?: SimilarMoviesResponse;
  credits?: MovieCredits;
  certification?: string;
}
export interface ReleaseDateInfo {
  certification: string;
  iso_639_1: string;
  note: string;
  release_date: string;
  type: number;
}

export interface ReleaseDatesResult {
  iso_3166_1: string;
  release_dates: ReleaseDateInfo[];
}