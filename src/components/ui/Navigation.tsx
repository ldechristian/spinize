import { faBook, faDownload, faGlobe, faHome, faRightToBracket, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { makeLink } from "./makeLink";
import useUserAuth from "../../hooks/useUserAuth";
import SearchInput from "../search/SearchInput";

export default function Navigation() {
  const location = useLocation();
  const pathname = location.pathname;
  const { authenticated } = useUserAuth();

    return (
      <header className="fixed xl:sticky bottom-0 xl:top-0 left-0 right-0 w-full mx-auto h-full max-h-[5rem] md:max-h-[4rem] z-[25] text-white overflow-hidden bg-black flex flex-row gap-2 justify-between items-center pb-2 xl:pb-0">
        <nav className="px-4 py-0 w-full flex flex-row gap-2 justify-between items-center">
          <ul className="w-full hidden xl:flex flex-row gap-4 md:gap-6 lg:gap-8 xl:gap-10 items-center justify-between">
            <SearchInput />
          </ul>
          <ul className="px-3 py-1 rounded-full mx-auto w-full max-w-[24rem] flex flex-row gap-4 md:gap-6 lg:gap-8 xl:gap-10 items-center justify-between xl:hidden">
            {makeLink('', 'Home', faHome, pathname)}
            {makeLink('search', 'Search', faSearch, pathname)}
            {/* {makeLink('playlists', 'Playlists', faList, pathname, false)} */}
            {/* {makeLink('songs', 'Songs', faMusic, pathname, false)} */}
            {/* {makeLink('albums', 'Albums', faCompactDisc, pathname, false)} */}
            {/* {makeLink('artists', 'Artists', faMicrophoneLines, pathname, false)} */}
            {/* {makeLink('starred', 'Starred', faStar, pathname)} */}
            {makeLink('library', 'Library', faBook, pathname)}
            {/* {makeLink('blindtest', 'Blindtest', faEyeSlash, pathname, false)} */}
            {/* {makeLink('radio', 'Radio', faRadio, pathname, false)} */}
            {makeLink('downloads', 'Downloads', faDownload, pathname)}
          </ul>
        </nav>

        <nav className="px-4 py-2 hidden xl:flex flex-row gap-2 justify-between items-center">
          <ul className="w-full flex flex-row gap-4 md:gap-6 lg:gap-8 xl:gap-10 items-center justify-between text-nowrap">
          {
            (authenticated !== null) && (authenticated ? (
              makeLink('log-out', 'Log out', faRightToBracket, pathname)
            ) : (
              makeLink('auth', 'Authenticate', faGlobe, pathname)
            ))
          }
          </ul>
        </nav>
      </header>
    );
}
