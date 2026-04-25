import { Link } from "react-router-dom";
import { useSongPlayer } from "../../context/useSongPlayer";
import { useCoverArt } from "../../hooks/useCoverArt";
import type { Album } from "../../types/Album";
import PlayingIcon from "../player/PlayingIcon";
import AutoImage from "../AutoImage";

interface AlbumCardProps {
  isStarred?: boolean;
  album: Album;
}

export default function AlbumCard({ isStarred, album }: AlbumCardProps) {
  const { currentSong } = useSongPlayer();
  const { cover, loading } = useCoverArt(album.id);
  const albumUrl = `/app/albums/${album.id}`;

  return (
    <div className={`snap-start relative w-full h-fit aspect-square rounded-lg overflow-hidden shadow-lg border-1 ${isStarred ? 'border-color-golden' : 'border-color-500'} group`}>
      <Link to={albumUrl} className="block w-full h-full">
        {/* Image */}
        {(!loading && cover !== undefined) ? (
          <AutoImage
            src={cover}
            alt={`${album.name} cover art`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            width={175} // Set width for Image component
            height={175} // Set height for Image component
            loading='lazy'
            type="album"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 animate-pulse" /> // placeholder
        )}
        {
          currentSong?.albumId == album.id && (
            <div className="absolute top-2 right-2 w-[2rem] h-auto aspect-square grid place-items-center bg-black/75 rounded-lg">
                <PlayingIcon />
            </div>
          )
        }

        {isStarred && <div className="absolute top-0 left-0 w-0 h-0 border-t-[1rem] md:border-t-[3rem] border-r-[1.5rem] lg:border-r-[4rem] border-t-color-golden border-r-transparent"></div>}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-2 text-white">
          <h3 className="text-sm font-semibold truncate">{album.name}</h3>
          <p className="text-xs truncate text-gray-400">{album.artist}</p>
          <p className="text-xs text-gray-400 italic">Released: {album.year}</p>
        </div>
      </Link>
    </div>
  );
};
