import type { Song } from "../types/Song";

export function setMediaSessionMetadata(song: Song, cover: string = 'songCover.jpg') {
  if ('mediaSession' in navigator && song) {
    // navigator.mediaSession.metadata = new window.MediaMetadata({
    navigator.mediaSession.metadata = new MediaMetadata({
      title: song.title,
      artist: song.artist,
      album: song.album || '', // fallback if album is undefined
      artwork: [
        { src: cover, sizes: '512x512', type: 'image/png' },
        { src: cover, sizes: '256x256', type: 'image/png' },
        { src: cover, sizes: '128x128', type: 'image/png' },
      ],
    });
  }
}
