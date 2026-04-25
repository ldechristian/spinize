import { Link } from "react-router-dom";
import type { Album } from "../types/Album";
import type { Artist } from "../types/Artist";
import type { Playlist } from "../types/Playlist";
import type { Song } from "../types/Song";
import type { Starred } from "../types/Starred";
import AlbumCard from "./cards/AlbumCard";
import ArtistCard from "./cards/ArtistCard";
import PlaylistCard from "./cards/PlaylistCard";
import SongCard from "./cards/SongCard";
import SongBrickItem from "./item/SongBrickItem";
import SongListItem from "./lists/SongListItem";
import AlbumCardSkeletton from "./cards/AlbumCardSkeletton";
import ArtistCardSkeletton from "./cards/ArtistCardSkeletton";
import SongCardSkeletton from "./cards/SongCardSkeletton";
import SongBrickItemSkeletton from "./item/SongBrickItemSkeletton";
import PlaylistCardSkeletton from "./cards/PlaylistCardSkeletton";
import SongListItemSkeletton from "./lists/SongListItemSkeletton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompactDisc, faMicrophone, faMusic } from "@fortawesome/free-solid-svg-icons";

type SectionType = 'songs' | 'albums' | 'artists' | 'playlists' | 'recently played' | 'your favorite artist' | 'starred rewind' | 'underrated gems' | 'favorite highlight' | 'daily mix';

const brickTypes: SectionType[] = [
  'recently played',
  'starred rewind',
  'underrated gems',
  'favorite highlight',
  'daily mix',
  'your favorite artist',
];

interface Props {
    type: SectionType;
    data: Song[] | Album[] | Artist[] | Playlist[] | null;
    gallery?: boolean;
    list?: boolean;
    bricks?: boolean;
    starred: Starred | null;
    noTitle?: boolean;
    viewAll?: boolean;
}

export const skeletonCount = 6;
export const DummyList = Array.from({ length: skeletonCount });

export default function DataSection({ type, data, gallery = false, list = false, bricks = false, starred, noTitle = false, viewAll = true }: Props) {
  const isBrickLayout = bricks || brickTypes.includes(type);

  return <section id={type} className="mx-auto w-full h-fit">
    <div className="h-full flex justify-between items-center mt-4">
      {
        !noTitle && <h2 className="text-2xl font-semibold mb-4">
          {
            type === 'recently played'
              ? 'Recently Played'
              : type === 'starred rewind'
              ? 'Your Rewind'
              : type === 'underrated gems'
              ? 'Your Underrated Gems'
              : type === 'favorite highlight'
              ? 'Your Highlight'
              : type === 'daily mix'
              ? 'Your Daily Mix'
              : type === 'your favorite artist'
              ? 'Your Favorite Artist'
              : type.charAt(0).toUpperCase() + type.slice(1)
          }
        </h2>
      }
      {viewAll && !['recently played', 'your favorite artist'].includes(type) && (
        <Link to={`/app/${type}`} className="text-500 font-semibold italic hover:underline">
          View all {type} {(type === 'songs' || type === 'albums' || type === 'artists') && <FontAwesomeIcon icon={type === 'songs' ? faMusic : type === 'albums' ? faCompactDisc : faMicrophone} />}
        </Link>
      )}
    </div>

    <div className={`relative hide-scrollbar ${
      isBrickLayout ?
        'grid grid-flow-col auto-cols-[calc(95%-0.5rem)] md:auto-cols-[calc(80%-0.5rem)] lg:auto-cols-[calc(65%-0.5rem)] xl:auto-cols-[calc(45%-0.5rem)] grid-rows-2 gap-2 hide-scrollbar overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth'
      : list ?
        'w-full flex flex-col gap-4 justify-between items-between'
      : gallery ?
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4" : "flex space-x-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth"
    }`}>
      {
        data === null ? DummyList.map((_, index) => (
          <div key={index} className={list ? 'border-b-1 border-white/50' : isBrickLayout ? '' : gallery ? '' : "flex-shrink-0 w-36 md:w-40 lg:w-54 xl:w-60"}>
            {
              type === 'albums' ? (
                <AlbumCardSkeletton />
              ) : type === 'artists' ? (
                <ArtistCardSkeletton />
              ) : type === 'playlists' ? (
                <PlaylistCardSkeletton />
              // ) : type === 'your favorite artist' ? (
              //   <DataSection type="your favorite artist" data={[favoriteArtist]} starred={starred} />
              ) : list ? (
                <SongListItemSkeletton />
              ) : brickTypes ? (
                <SongBrickItemSkeletton />
              ) : (type === 'recently played' || type === 'starred rewind' || type === 'underrated gems' || type === 'favorite highlight' || type === 'daily mix' || type === 'your favorite artist') ? (
                <SongBrickItemSkeletton />
              ) : (
                <SongCardSkeletton />
              )
            }
          </div>
        )) : data?.length > 0 ? data?.map((media: Song | Album | Artist | Playlist, index: number) => (
          <div key={media.id} className={list ? 'border-b-1 border-white/50' : isBrickLayout ? '' : gallery ? "" : "flex-shrink-0 w-36 md:w-40 lg:w-54 xl:w-60"}>
            {
              type === 'albums' ? (
                <AlbumCard isStarred={starred?.album?.some((item: Album) => item.id === media.id)} album={media as Album} />
              ) : type === 'artists' ? (
                <ArtistCard isStarred={starred?.artist?.some((item: Artist) => item.id === media.id)} artist={media as Artist} />
              ) : type === 'playlists' ? (
                <PlaylistCard playlist={media as Playlist} />
              // ) : type === 'your favorite artist' ? (
              //   <DataSection type="your favorite artist" data={[favoriteArtist]} starred={starred} />
              ) : list ? (
                <SongListItem song={media as Song} index={(media as Song).track || index} />
              ) : bricks ? (
                <SongBrickItem song={media as Song} />
              ) : (type === 'recently played' || type === 'starred rewind' || type === 'underrated gems' || type === 'favorite highlight' || type === 'daily mix' || type === 'your favorite artist') ? (
                <SongBrickItem song={media as Song} />
              ) : (
                <SongCard isStarred={starred?.song?.some((item: Song) => item.id === media.id)} song={media as Song} />
              )
            }
          </div>
        )) : (
            <p className="text-gray-500 italic">No {type} found.</p>
        )
      }
      {/* {(data === null || data.length > 0) && !gallery && (
        <div className="absolute top-1/2 -translate-y-1/2 right-0 bg-gradient-to-r from-transparent to-black w-16 h-full text-xl grid place-items-center">
          <FontAwesomeIcon icon={faRightLong} />
        </div>
      )} */}
    </div>
  </section>
}