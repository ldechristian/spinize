async function fetchArtistInfo(artist: Artist, setAbout: React.Dispatch<SetStateAction<string>>) {
  try {
    let mbid = artist?.musicBrainzId;

    // 🔹 fallback: search by name if no MBID
    if (!mbid && artist?.name) {
      const searchRes = await fetch(
        `https://musicbrainz.org/ws/2/artist/?query=artist:${encodeURIComponent(
          artist.name
        )}&fmt=json&limit=1`
      );

      const searchData = await searchRes.json();
      mbid = searchData.artists?.[0]?.id;
    }

    if (!mbid) {
      setAbout('No external data found.');
      return;
    }

    // 🔹 fetch artist details
    const res = await fetch(
      `https://musicbrainz.org/ws/2/artist/${mbid}?fmt=json&inc=url-rels+tags`
    );

    const data = await res.json();

    const country =
      data.country ||
      data.area?.name ||
      data['begin-area']?.name ||
      'Unknown';

    const tags =
      data.tags?.map((t: { name: string }) => t.name).join(', ') || '';

    const wikiRel = data.relations?.find(
      (rel: { type: string }) => rel.type === 'wikipedia'
    );

    if (wikiRel?.url?.resource) {
      await fetchWikipediaExtract(wikiRel.url.resource, setAbout);
    } else {
      setAbout(`From ${country}${tags ? ' • ' + tags : ''}`);
    }
  } catch (err) {
    console.error(err);
    setAbout('Failed to load artist information.');
  }
}




  // 🔹 Wikipedia fetch
  async function fetchWikipediaExtract(url: string, setAbout: React.Dispatch<SetStateAction<string>>) {
    try {
      const title = decodeURIComponent(url.split('/').pop() || '');

      const res = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`
      );

      const data = await res.json();

      if (data.extract) {
        setAbout(data.extract);
      } else {
        setAbout('No description available.');
      }
    } catch (err) {
      console.error(err);
      setAbout('Failed to load biography.');
    }
  }







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
import { useEffect, useState, type SetStateAction } from 'react';
import type { Song } from '../types/Song';
import type { Album } from '../types/album';
import { useAlbum } from '../hooks/useAlbum';
import SongListItem from '../components/lists/SongListItem';
import SearchInput from '../components/search/SearchInput';
import type { Artist } from '../types/Artist';
import { useArtistInfo } from '../hooks/useArtistInfo';
import { useSearch3 } from '../hooks/useSearch3';

export default function ArtistDetail() {
  const { id } = useParams();

  const { starred } = useStarred();

  // Biography from Navidrome API
  const artistInfo = useArtistInfo(id);

  const artist = useArtist(id);
  const { cover } = useCoverArt(artist?.id);

  // const albums: Album[] = artist?.album || [];


  const [albums, setAlbums] = useState<Album[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [artistName, setArtistName] = useState<string>('--');
  const [biography, setBiography] = useState<string>('--');

  const res = useSearch3(artistName);
  
  useEffect(() => {
    setAlbums(res?.albums ?? [])
    setSongs(res?.songs?.filter(s => s.artistId === id) ?? []);
    setArtistName(artist?.name ?? '--');
    setBiography(artistInfo?.biography ?? '--');
  }, [id, res, artist, artistInfo]);



  // function AlbumSongsLoader({ albumId, onLoad }:{ albumId: string, onLoad: any }) {
  //   const { album } = useAlbum(albumId);

  //   useEffect(() => {
  //     if (!album?.song) return;

  //     onLoad(album.song);
  //   }, [album, onLoad]);

  //   return null;
  // }

  // const [songs, setSongs] = useState<Song[]>([]);

  function handleSongs(newSongs: Song[]) {
    setSongs(prev => {
      const merged = [...prev, ...newSongs];

      return Array.from(
        new Map(merged.map(song => [song.id, song])).values()
      );
    });
  }

  // const [about, setAbout] = useState<string>('');

  // useEffect(() => {
  //   if (!artist) return;

  //   fetchArtistInfo(artist, setAbout);
  // }, [artist]);

  if (artist === null) return <>Loading...</>;

  return <>
    {/* Get the Songs from the Albums */}
    {/* {albums.map(album => (
      <AlbumSongsLoader
        key={album.id}
        albumId={album.id}
        onLoad={handleSongs}
      />
    ))} */}

    {/* Top nav */}
    <div className="absolute top-0 left-0 right-0 z-20">
      <div className='mx-auto w-full max-w-6xl p-6 flex flex-row gap-6'>
        <Link
          to="/app/artists"
          className="w-fit text-white flex items-center gap-2
          px-3 py-1 rounded-lg backdrop-blur
          bg-black/40"
          // bg-violet-950/40
          // MAKE IT USE THE THEME
        >
          <FontAwesomeIcon icon={faAngleLeft} />
          artists
        </Link>

        <SearchInput />
      </div>
    </div>

    <div className='relative w-full min-h-[14rem] h-screen'>
      <img
        src={cover}
        alt={artistName}
        className="z-[-1] absolute inset-0 w-full h-full object-cover"
      />

      <div className="z-[-1] absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black" />
    </div>

    <div className='z-20 mt-[-25vh] mx-auto w-full max-w-6xl text-white p-6 rounded-xl'>
      <div className='flex flex-col gap-4'>
        {/* Artist info */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-[90%]">
            {artistName}
          </h1>

          <PlaylistButton playlist={songs} shuffle={false} />
          {/* <StarToggle id={artist.id} /> */}
        </div>

        {/* Artist about from API */}
        <div>
          <p>
            {biography}
            {/* {about} */}
          </p>
        </div>
      </div>

      {/* CONTENT (OUTSIDE HERO ✅) */}
      <div className="min-h-[32rem] p-6">
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


    </div>
  </>

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

    </>
  );
}

