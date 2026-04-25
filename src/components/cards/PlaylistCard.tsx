import { Link } from "react-router-dom";
import { useSongPlayer } from "../../context/useSongPlayer";
import { useCoverArt } from "../../hooks/useCoverArt";
import type { Playlist } from "../../types/Playlist";
import PlayingIcon from "../player/PlayingIcon";
import { formatDate } from "../tools/formatDate";
import AutoImage from "../AutoImage";

interface PlaylistCardProps {
  playlist: Playlist;
}

export default function PlaylistCard({ playlist }: PlaylistCardProps) {
  const { currentSong } = useSongPlayer();
  const { cover, loading } = useCoverArt(playlist.id);
  const playlistUrl = `/app/playlists/${playlist.id}`;

  return (
    <div className={`snap-start relative w-full h-fit aspect-square rounded-lg overflow-hidden shadow-lg border-4 border-color-500 group`}>
      <Link to={playlistUrl} className="block w-full h-full">
        {/* Image */}
        {(!loading && cover !== undefined) ? (
          <AutoImage
            src={cover}
            alt={`${playlist.name} cover art`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            width={175} // Set a fixed width for Image component (optional)
            height={175} // Set a fixed height for Image component (optional)
            loading='lazy'
            type="playlist"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 animate-pulse" /> // placeholder
        )}
        {
          currentSong?.albumId == playlist.id && (
            <div className="absolute top-2 right-2 w-[2rem] h-auto aspect-square grid place-items-center bg-black/75 rounded-lg">
                <PlayingIcon />
            </div>
          )
        }

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-2 text-white">
          <h3 className="text-sm font-semibold truncate">{playlist.name}</h3>
          <p className="text-xs truncate text-gray-400">{playlist.owner}</p>
          <p className="text-xs text-gray-400 italic">Created: {formatDate(playlist.created)}</p>
        </div>
      </Link>
    </div>
  );
};
