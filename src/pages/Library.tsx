import { faList, faMicrophone, faMusic, faRecordVinyl, faStar } from '@fortawesome/free-solid-svg-icons';
import DataSection from '../components/DataSection';
import { useStarred } from '../hooks/useStarred';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { makeLink } from '../components/ui/makeLink';

export default function Library() {
  const { starred } = useStarred();

  return (
    <>
      <section>
        {makeLink('songs', 'Songs', faMusic, '/library')}
      </section>

      <section>
        {makeLink('albums', 'Albums', faRecordVinyl, '/library')}
      </section>

      <section>
        {makeLink('artists', 'Artists', faMicrophone, '/library')}
      </section>

      <section>
        {makeLink('playlists', 'Playlists', faList, '/library')}
      </section>

      <section>
        {makeLink('starred', 'Starred', faStar, '/library')}
      </section>

      <section>
        Your downloaded songs, albums or your favourited (starred) songs will be displayed here.
      </section>

      {/* <div className='z-[2] flex flex-row gap-2 justify-between items-center'>
        <FontAwesomeIcon icon={faStar} /> Starred
      </div>

      <DataSection data={starred?.song || null} type='songs' bricks starred={starred} />
      <DataSection data={starred?.album || null} type='albums' starred={starred} />
      <DataSection data={starred?.artist || null} type='artists' starred={starred} /> */}
    </>
  )
}
