import { Link, useParams } from 'react-router-dom';
// import formatName from '../components/tools/FormatName';
import { useCoverArt } from '../hooks/useCoverArt';
import { useArtist } from '../hooks/useArtist';
// import { useStarred } from '../hooks/useStarred';
import StarToggle from '../components/player/StarToggle';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PlaylistButton from '../components/album/PlaylistButton';
import AlbumCard from '../components/cards/AlbumCard';
import { useStarred } from '../hooks/useStarred';
import { useEffect, useState } from 'react';
import type { Song } from '../types/Song';
import type { Album } from '../types/album';
import { useAlbum } from '../hooks/useAlbum';
import SongListItem from '../components/lists/SongListItem';

export default function ArtistDetail() {
  const { id } = useParams();

  const { artist } = useArtist(id);
  const { starred } = useStarred();
  const { cover } = useCoverArt(artist?.id);

  const albums: Album[] = artist?.album || [];

  function AlbumSongsLoader({ albumId, onLoad }) {
    const { album } = useAlbum(albumId);

    useEffect(() => {
      if (!album?.song) return;

      onLoad(album.song);
    }, [album, onLoad]);

    return null;
  }

  const [songs, setSongs] = useState<Song[]>([]);

  function handleSongs(newSongs: Song[]) {
    setSongs(prev => {
      const merged = [...prev, ...newSongs];

      return Array.from(
        new Map(merged.map(song => [song.id, song])).values()
      );
    });
  }


  if (artist === null) return <>Loading...</>;

  return (
    <>
    {albums.map(album => (
  <AlbumSongsLoader
    key={album.id}
    albumId={album.id}
    onLoad={handleSongs}
  />
))}
      {/* HERO */}
      <div className="relative w-full h-[85vh] overflow-hidden">
        <img
          src={cover}
          alt={artist.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black" />

        {/* Top nav */}
        <div className="absolute top-4 left-4 z-20">
          <Link
            to="/app/artists"
            className="text-white flex items-center gap-2 bg-black/40 px-3 py-1 rounded-lg backdrop-blur"
          >
            <FontAwesomeIcon icon={faAngleLeft} />
            artists
          </Link>
        </div>

        {/* Artist info */}
        <div className="absolute bottom-8 left-6 right-6 z-20 text-white">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-[90%]">
            {artist.name || '--'}
          </h1>

          <div className="flex flex-wrap gap-4 mt-4 items-center">
            <PlaylistButton playlist={songs} shuffle={false} />
            <StarToggle id={artist.id} />
          </div>
        </div>
      </div>

      {/* CONTENT (OUTSIDE HERO ✅) */}
      <div className="relative z-10 -mt-8 bg-black rounded-t-3xl p-6 min-h-screen">
        <h2 className="text-white text-xl font-semibold mb-4">
          Top Songs
        </h2>

        <div className="flex flex-col gap-2 mb-8">
          {songs.slice(0, 10).map((song, index) => (
            // <div
            //   key={song.id}
            //   className="flex items-center justify-between bg-white/5 hover:bg-white/10 transition rounded-lg px-4 py-2"
            // >
            //   <div className="flex items-center gap-4 overflow-hidden">
            //     <span className="text-gray-400 w-6 text-sm">
            //       {index + 1}
            //     </span>

            //     <div className="flex flex-col overflow-hidden">
            //       <span className="text-white truncate">
            //         {song.title}
            //       </span>
            //       <span className="text-gray-400 text-sm truncate">
            //         {song.album}
            //       </span>
            //     </div>
            //   </div>

            //   <div className="text-gray-400 text-sm">
            //     {Math.floor(song.duration / 60)}:
            //     {(song.duration % 60).toString().padStart(2, '0')}
            //   </div>
            // </div>
            <SongListItem song={song} index={song.track ?? index} />
          ))}
        </div>

        <h2 className="text-white text-xl font-semibold mb-4">
          Albums
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {albums?.map((album) => (
            <AlbumCard
              key={album.id}
              album={album}
              isStarred={starred?.album?.includes(album.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
}