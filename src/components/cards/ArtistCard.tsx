import { Link } from "react-router-dom";
import { useSongPlayer } from "../../context/useSongPlayer";
import { useCoverArt } from "../../hooks/useCoverArt";
import type { Artist } from "../../types/Artist";
import PlayingIcon from "../player/PlayingIcon";
import AutoImage from "../AutoImage";

interface ArtistCardProps {
  isStarred?: boolean;
  artist: Artist;
}

export default function ArtistCard({ isStarred, artist }: ArtistCardProps) {
  const { currentSong } = useSongPlayer();
  const { cover, loading } = useCoverArt(artist.id);
  const artistUrl = `/app/artists/${artist.id}`;

  return (
    <div className={`snap-start relative w-full h-full rounded-full overflow-hidden shadow-lg border-1 ${isStarred ? 'border-color-golden' : 'border-color-500'} group`}>
      <Link to={artistUrl} className="block w-full h-full">
        {/* Image */}
        {(!loading && cover !== undefined) ? (
          <AutoImage
            src={cover}
            alt={`${artist.name} cover art`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            width={184} // Set width for Image component
            height={184} // Set height for Image component
            loading='lazy'
            type="artist"
          />
        ) : (
          <div className="w-full h-full bg-zinc-800 animate-pulse" /> // placeholder
        )}
        {
          currentSong?.artistId == artist.id && (
            <div className="absolute top-2 right-2 w-[2rem] h-auto aspect-square grid place-items-center bg-black/75 rounded-lg">
                <PlayingIcon />
            </div>
          )
        }

        {isStarred && <div className="absolute top-0 left-0 w-0 h-0 border-t-[1rem] md:border-t-[3rem] border-r-[1.5rem] lg:border-r-[4rem] border-t-color-golden border-r-transparent"></div>}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center justify-center text-white p-2">
          <h3 className="text-sm font-semibold text-center truncate">{artist.name}</h3>
        </div>
      </Link>
    </div>
  );
};
