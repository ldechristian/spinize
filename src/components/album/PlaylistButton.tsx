'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faShuffle } from "@fortawesome/free-solid-svg-icons";
import type { Song } from "../../types/Song";
import { useSongPlayer } from "../../context/useSongPlayer";

interface Props {
  referenceId?: string;
  playlist: Song[];
  shuffle?: boolean;
  overwriteLabel?: string;
  children?: React.ReactNode;
}

export default function PlaylistButton({ referenceId = '', playlist, shuffle = false, overwriteLabel, children }: Props) {
    const { currentSong, handlePlaylistClick } = useSongPlayer();

    return <button onClick={() => {
      if (playlist) handlePlaylistClick(playlist, shuffle);
    }} disabled={referenceId == currentSong?.albumId || referenceId == currentSong?.artistId}>
      {overwriteLabel ? overwriteLabel : shuffle ? (
        <FontAwesomeIcon icon={faShuffle} size="2xl" />
       ) : (
        <FontAwesomeIcon icon={faPlay} size="2xl" />
      )}
      {children}
    </button>
}