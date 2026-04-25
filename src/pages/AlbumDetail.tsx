import { Link, useParams } from 'react-router-dom';
import FormatDuration from '../components/tools/FormatDuration';
import { useCoverArt } from '../hooks/useCoverArt';
import { useAlbum } from '../hooks/useAlbum';
import DataSection from '../components/DataSection';
import PlaylistButton from '../components/album/PlaylistButton';
import StarToggle from '../components/player/StarToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { useStarred } from '../hooks/useStarred';
import DownloadAllToggle from '../components/player/DownloadAllToggle';

export default function AlbumDetail() {
  const { id } = useParams();

  const { album } = useAlbum(id);
  // const { cover } = useCoverArt(album?.id, 'album');
  const { cover } = useCoverArt(album?.id);
  const { starred } = useStarred();

  if (album === null) return <>
    Loading...
  </>

  return (
    <>
      <div className='flex flex-row gap-2 justify-between items-center mb-4'>
        <Link to='/app/albums' className="flex items-center gap-1 hover:underline">
          <FontAwesomeIcon icon={faAngleLeft} /> Albums
        </Link>
      </div>

      <div>
        <div className="relative flex flex-col xl:flex-row justify-center xl:justify-between items-center gap-4 mb-4">
          <img
            src={cover}
            alt={album.name}
            width={300}
            height={300}
            className="mb-4 w-fit max-w-full h-[50svh] object-contain rounded-lg z-[2]"
            />
          <img
            src={cover}
            alt={album.name}
            width={64}
            height={64}
            className="w-[75svh] h-[75svh] blur-[10rem] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          />

          <div className='flex flex-col gap-2 w-full md:w-[50svh] z-[2]'>
            <h1 className="text-3xl font-bold mb-4">
              {album.name || '--'}
            </h1>

            <div className='flex flex-row justify-between xl:justify-start items-start gap-1 xl:gap-4'>
              <Link
                to={`/app/artists/${album.artistId}`}
                className='text-gray-300'
                >
                {album.artist}
              </Link>

              -

              <p className='text-gray-300'>
                {album.year || '--'}
              </p>
            </div>

            <section className="mt-6 text-gray-300">
              <p className='text-white'><span className='text-gray-300'>Duration :</span> <FormatDuration duration={album.duration}/></p>
            </section>
          </div>
        </div>
      </div>

      {/* Album details */}
      <div className='relative'>
        {/* Action buttons */}
        {album.song && album.song.length > 0 && (
          <section id='play' className="flex flex-row gap-4 justify-center items-center mt-6">
            <PlaylistButton referenceId={album.id} playlist={album.song} shuffle={false} overwriteLabel="Play discography" />
            <PlaylistButton referenceId={album.id} playlist={album.song} shuffle={true} />
            <StarToggle id={album.id} />
            <DownloadAllToggle list={album.song} />
          </section>
        )}

        {/* Songs section */}
        <DataSection type='songs' data={album.song} list starred={starred} noTitle viewAll={false} />
      </div>
    </>
  )
}
