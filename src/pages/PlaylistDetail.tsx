import { Link, useParams } from 'react-router-dom';
import { useCoverArt } from '../hooks/useCoverArt';
import { usePlaylist } from '../hooks/usePlaylist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import FormatDuration from '../components/tools/FormatDuration';
import PlaylistButton from '../components/album/PlaylistButton';
import StarToggle from '../components/player/StarToggle';
import DataSection from '../components/DataSection';
import { useStarred } from '../hooks/useStarred';
import { formatDate } from '../components/tools/formatDate';
import DownloadAllToggle from '../components/player/DownloadAllToggle';

export default function PlaylistDetail() {
  const { id } = useParams();

  const { playlist } = usePlaylist(id);
  const { starred } = useStarred();
  // const { cover } = useCoverArt(playlist?.id, 'playlist');
  const { cover } = useCoverArt(playlist?.id);

  if (playlist === null) return <>
    Loading...
  </>

  return (
    <>
      <div className='flex flex-row gap-2 justify-between items-center mb-4'>
        <Link to='/app/playlists' className="flex items-center gap-1 hover:underline">
          <FontAwesomeIcon icon={faAngleLeft} /> Playlists
        </Link>
      </div>

      <div>
        <div className="relative flex flex-col xl:flex-row justify-center xl:justify-between items-center gap-4 mb-4">
          <img
            src={cover}
            alt={playlist.name}
            width={300}
            height={300}
            className="mb-4 w-fit max-w-full h-[50svh] object-contain rounded-lg z-[2]"
            />
          <img
            src={cover}
            alt={playlist.name}
            width={64}
            height={64}
            className="w-[75svh] h-[75svh] blur-[10rem] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          />

          <div className='flex flex-col gap-2 w-full md:w-[50svh] z-[2]'>
            <h1 className="text-3xl font-bold mb-4">
              {playlist.name || '--'}
            </h1>

            <div className='flex flex-row justify-between xl:justify-start items-start gap-1 xl:gap-4'>
              <p className='text-gray-300'>
                {formatDate(playlist.created, 'dMy') || '--'}
              </p>
            </div>

            <section className="mt-6 text-gray-300">
              <p className='text-white'><span className='text-gray-300'>Duration :</span> <FormatDuration duration={playlist.duration}/></p>
            </section>
          </div>
        </div>
      </div>

      {/* Album details */}
      <div className='relative'>
        {/* Action buttons */}
        {playlist.entry && playlist.entry.length > 0 && (
          <section id='play' className="flex flex-row gap-4 justify-center items-center mt-6">
            <PlaylistButton referenceId={playlist.id} playlist={playlist.entry} shuffle={false} overwriteLabel="Play discography" />
            <PlaylistButton referenceId={playlist.id} playlist={playlist.entry} shuffle={true} />
            <StarToggle id={playlist.id} />
            <DownloadAllToggle list={playlist.entry} />
          </section>
        )}

        {/* Songs section */}
        <DataSection type='songs' data={playlist.entry} list starred={starred} noTitle viewAll={false} />
      </div>
    </>
  )
}
