import { Link, useParams } from 'react-router-dom';
import FormatDuration from '../components/tools/FormatDuration';
import FormatSize from '../components/tools/FormatSize';
import { useCoverArt } from '../hooks/useCoverArt';
import { useSong } from '../hooks/useSong';
import StarToggle from '../components/player/StarToggle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import PlayButton from '../components/song/PlayButton';

export default function SongDetail() {
  const { id } = useParams();

  const song = useSong(id);
  // const { cover } = useCoverArt(song?.id, 'song');
  const { cover } = useCoverArt(song?.id);

  // console.log(song)

  if (song === null) return <>
    No song found
  </>

  if (song === undefined) return <>
    Loading...
  </>

  return (
    <>
      <div className='flex flex-row gap-2 justify-between items-center mb-4'>
        <Link to='/app/songs' className="flex items-center gap-1 hover:underline">
          <FontAwesomeIcon icon={faAngleLeft} /> Songs
        </Link>
      </div>

      <div>
        <div className="relative flex flex-col xl:flex-row justify-center xl:justify-between items-center gap-4 mb-4">
          <img
            src={cover}
            alt={song.title}
            width={300}
            height={300}
            className="mb-4 w-fit max-w-full h-[50svh] object-contain rounded-lg z-[2]"
            />
          <img
            src={cover}
            alt={song.title}
            width={64}
            height={64}
            className="w-[75svh] h-[75svh] blur-[10rem] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
          />

          <div className='flex flex-col gap-2 w-full md:w-[50svh] z-[2]'>
            <h1 className="text-3xl font-bold mb-4">
              {song.title || '--'}
            </h1>

            <Link
              to={`/app/albums/${song.albumId}`}
              className='text-gray-300'
              >
              {song.album}
            </Link>

            <div className='flex flex-row justify-between xl:justify-start items-start gap-1 xl:gap-4'>
              <Link
                to={`/app/artists/${song.artistId}`}
                className='text-gray-300'
                >
                {song.artist}
              </Link>

              -

              <p className='text-gray-300'>
                {song.year || '--'}
              </p>
            </div>

            <section className="mt-6 text-gray-300">
              <p className='text-white'><span className='text-gray-300'>Play count :</span> {song.playCount}</p>
              <p className='text-white'><span className='text-gray-300'>Bit rate :</span> {song.bitRate} <i>kbps</i></p>
              <p className='text-white'><span className='text-gray-300'>Duration :</span> <FormatDuration duration={song.duration}/> <i>mm:ss</i></p>
              <p className='text-white'><span className='text-gray-300'>Content type :</span> {song.contentType}</p>
              <p className='text-white'><span className='text-gray-300'>Size :</span> <FormatSize size={song.size}/></p>
            </section>
          </div>
        </div>
      </div>

      {/* Song details */}
      <div className='relative'>
        {/* Action buttons */}
        {song && (
          <section id='play' className="flex flex-row gap-4 justify-center items-center mt-6">
            <PlayButton song={song} />
            {/* <StarToggle defaultStatus={false} id={song.id} /> */}
            <StarToggle id={song.id} />
          </section>
        )}
      </div>
    </>
  )
}
