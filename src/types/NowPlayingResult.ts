import type { Album } from "./Album";
import type { Artist } from "./Artist";
import type { Song } from "./Song";

export interface NowPlayingResult {
  'subsonic-response' : {
    nowPlaying : {
      album: Album[];
      artist: Artist[];
      song: Song[];
    }
  }
}