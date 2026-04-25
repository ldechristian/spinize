import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import type { Song } from "../../types/Song";
import { useSongPlayer } from "../../context/useSongPlayer";
import { useCoverArt } from "../../hooks/useCoverArt";
import FormatDuration from "../tools/FormatDuration";
import PlayingIcon from "../player/PlayingIcon";
import RemoveSongFromQueueButton from "../song/RemoveSongFromQueueButton";
import StarToggle from "../player/StarToggle";
import { Link } from "react-router-dom";
import AutoImage from "../AutoImage";

interface SongQueueItemProps {
  song: Song;
  minimal?: boolean;
}

export default function SongQueueItem({ song, minimal }: SongQueueItemProps) {
  const APP_PREFIX = "/app";

  const { currentSong, handleSongClick } = useSongPlayer();
  const { cover, loading } = useCoverArt(song.id);

  return (
    <li className="w-full max-w-[100vw] flex items-center justify-between py-2 border-b last:border-none">
      <div className="flex items-center space-x-4">
        {/* Song number */}
        <span className="text-sm text-500 whitespace-nowrap hidden md:block">
          <RemoveSongFromQueueButton song={song} />
        </span>

        {/* Cover image */}
        {!minimal && (
          currentSong?.id == song.id ? (
            <div className="relative w-fit grid rounded-lg place-items-center text-white font-semibold text-3xl">
              {!loading ? (
                <AutoImage
                  src={cover}
                  alt={`${song.album} cover art`}
                  className="relative max-w-18 h-full object-cover aspect-square rounded-lg bg-black"
                  width={72}
                  height={72}
                  loading='lazy'
                  type="song"
                />
              ) : (
                <div className="w-full h-full bg-zinc-800 animate-pulse" /> // placeholder
              )}
              <div className="absolute inset-0 grid place-items-center bg-black/75 rounded-lg overflow-hidden">
                <PlayingIcon />
              </div>
            </div>
          ) : (
            <button
              onClick={() => handleSongClick(song)}
              className="relative w-fit group"
              aria-label={`Play ${song.title}`}
            >
              <AutoImage
                src={cover}
                alt={`${song.album} cover art`}
                className="relative max-w-18 h-full object-cover aspect-square rounded-lg bg-black"
                width={72}
                height={72}
                loading='lazy'
                type='song'
              />
              <div className="hidden group-hover:grid absolute inset-0 bg-black/75 rounded-lg place-items-center text-white font-semibold text-3xl">
                <FontAwesomeIcon icon={faPlay} className="text-2xl" />
              </div>
            </button>
          )
        )}

        {/* Song text details */}
        <div className="py-1 w-50 sm:w-96 md:w-96 lg:w-150 h-full flex flex-col gap-0 justify-start items-start">
          <Link
            to={`${APP_PREFIX}/songs/${song.id}`}
            className="hover:underline text-sm font-semibold truncate w-fit max-w-[65vw]">
            {song.title}
          </Link>

          <Link
            to={`${APP_PREFIX}/artists/${song.artistId}`}
            className="hover:underline text-xs text-gray-300 truncate w-fit max-w-[65vw]">
              {song.artist}
          </Link>

          {!minimal && (
            <Link
              to={`${APP_PREFIX}/albums/${song.albumId}`}
              className="hover:underline text-xs text-gray-300 truncate w-fit max-w-[65vw]">
                {`${song.album} (${song.year})`}
            </Link>
          )}
        </div>
      </div>

      <div className="hidden md:flex flex-row gap-32 justify-between items-center">
        {/* Song duration */}
        {!minimal && (
          <div className="hidden xl:block text-xs text-gray-500">
            <FormatDuration duration={song.duration} />
          </div>
        )}

        {/* Song actions */}
        {!minimal && (
          <div className="flex flex-row gap-4 justify-between items-center">
            {/* Play Button */}
            <div>
              {currentSong?.id == song.id ? (
                <PlayingIcon />
              ) : (
                <button
                  onClick={() => handleSongClick(song)}
                  className="text-sm text-500 hover:text-700 font-semibold"
                  aria-label={`Play ${song.title}`}
                >
                  <FontAwesomeIcon icon={faPlay} />
                </button>
              )}
            </div>

            <StarToggle id={song.id} />
          </div>
        )}
      </div>
    </li>
  );
}
