import type { Album } from "./Album";
import type { Song } from "./Song";

export interface Artist {
  id: string;
  musicBrainzId?: string;
  name: string;
  song?: Song[]; // Optional list of songs
  album?: Album[]; // Optional list of albums
  coverArt: string;
}