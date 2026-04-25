import { faBook, faCompass, faDownload, faHome, faList, faRadio, faRightToBracket, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react"
import { Link, useLocation } from "react-router-dom";
import CreateNewPlaylistButton from "../playlists/CreateNewPlaylistButton";
import { usePlaylists } from "../../hooks/usePlaylists";
import PlaylistItem from "../lists/PlaylistItem";
import { DummyList } from "../DataSection";
import PlaylistItemSkeleton from "../lists/PlaylistItemSkeletton";

export default function Sidebar() {
    const APP_PREFIX = "/app";

    const [show, setShow] = useState<boolean>(true);
    const location = useLocation();
    const pathname = location.pathname;

    const { playlists } = usePlaylists();

    return <section className={`hidden xl:flex ${show ? 'w-[24rem]' : 'w-[4rem]'} h-[100svh] transition-all duration-350 ease-in-out mr-2`}>
        <div className="w-[24rem] text-nowrap h-[100svh] bg-800 rounded-r-md overflow-hidden overflow-y-scroll hide-scrollbar p-1 flex flex-col gap-2 justify-between items-start">
            {/* Start */}
            <div className="w-full h-[100svh] flex flex-col overflow-hidden">
                <ul className="w-full flex flex-col gap-2 justify-start items-start px-2 py-4 border-b-2 border-black/20">
                    <li className="flex flex-row items-center gap-2 mb-2 p-2">
                        {show && <h2 className="text-2xl font-semibold">Spinize</h2>}
                        <img
                        src="/favicon.png"
                        alt="Spinize Logo"
                        width={32}
                        height={32}
                        />
                    </li>
                    <Link
                        to={`${APP_PREFIX}`}
                        className={`${pathname === '/' ? 'bg-600' : 'hover:bg-black/50'}  transition-all duration-50 w-full p-2 rounded-md font-semibold flex flex-row gap-2 ${show ? 'justify-start' : 'justify-center'} items-center`}>
                        <FontAwesomeIcon icon={faHome} /> {show && 'Homepage'}
                    </Link>
                    <Link
                        to={`${APP_PREFIX}/search`}
                        className={`${pathname === '/search' ? 'bg-600' : 'hover:bg-black/50'} transition-all duration-50 w-full p-2 rounded-md font-semibold flex flex-row gap-2 ${show ? 'justify-start' : 'justify-center'} items-center`}>
                        <FontAwesomeIcon icon={faCompass} /> {show && 'Search (ctrl + K)'}
                    </Link>
                    <Link
                        to={`${APP_PREFIX}/library`}
                        className={`${pathname === '/library' ? 'bg-600' : 'hover:bg-black/50'}  transition-all duration-50 w-full p-2 rounded-md font-semibold flex flex-row gap-2 ${show ? 'justify-start' : 'justify-center'} items-center`}>
                        <FontAwesomeIcon icon={faBook} /> {show && 'Library'}
                    </Link>
                    {/* <Link
                        to={`${APP_PREFIX}/explore`}
                        className={`${pathname === '/explore' ? 'bg-600' : 'hover:bg-black/50'} transition-all duration-50 w-full p-2 rounded-md font-semibold flex flex-row gap-2 ${show ? 'justify-start' : 'justify-center'} items-center`}>
                        <FontAwesomeIcon icon={faCompass} /> {show && 'Explore'}
                    </Link> */}
                    {/* <Link
                        to={`${APP_PREFIX}/starred`}
                        className={`${pathname === '/starred' ? 'bg-600' : 'hover:bg-black/50'}  transition-all duration-50 w-full p-2 rounded-md font-semibold flex flex-row gap-2 ${show ? 'justify-start' : 'justify-center'} items-center`}>
                        <FontAwesomeIcon icon={faStar} /> {show && 'Starred'}
                    </Link> */}
                    {/* <Link
                        to={`${APP_PREFIX}/downloads`}
                        className={`${pathname === '/downloads' ? 'bg-600' : 'hover:bg-black/50'}  transition-all duration-50 w-full p-2 rounded-md font-semibold flex flex-row gap-2 ${show ? 'justify-start' : 'justify-center'} items-center`}>
                        <FontAwesomeIcon icon={faDownload} /> {show && 'Downloads'}
                    </Link> */}
                    {/* <Link
                        to={`${APP_PREFIX}/radio`}
                        className={`${pathname === '/radio' ? 'bg-600' : 'hover:bg-black/50'}  transition-all duration-50 w-full p-2 rounded-md font-semibold flex flex-row gap-2 ${show ? 'justify-start' : 'justify-center'} items-center`}>
                        <FontAwesomeIcon icon={faRadio} /> {show && 'Public Radio Stations'}
                    </Link> */}
                </ul>

                {/* Middle */}
                <ul className="w-full h-full flex flex-col gap-2 justify-start items-start px-2 py-4 overflow-hidden">
                    <div className={`w-full flex flex-row gap-2 ${show ? 'justify-between' : 'justify-center'} items-center`}>
                        {show && <h4 className="w-full flex flex-row justify-start items-center gap-2 p-2">
                            <FontAwesomeIcon icon={faList} /> Playlists
                        </h4>}
                        <CreateNewPlaylistButton minimalist />
                    </div>
                    <ul className="w-full flex flex-col gap-2 justify-start items-start overflow-y-scroll hide-scrollbar">
                        {
                            playlists ?
                                playlists.length > 0 ?
                                    playlists.map((item) => <Link
                                        key={item.id}
                                        to={`/app/playlists/${item.id}`}
                                        className="hover:bg-black/50 rounded-md w-full transition-all duration-100">
                                        <PlaylistItem item={item} key={item.id} minimalist={show} />
                                    </Link>)
                                :
                                    <p className={`${!show && 'hidden'}`}>No playlists found.</p>
                            :
                                DummyList.map((_, index) => <PlaylistItemSkeleton key={index} />)
                        }
                    </ul>
                </ul>
            </div>

            {/* End */}
            <ul className="w-full flex flex-col gap-2 justify-start items-start px-2 py-4">
                <button onClick={() => setShow(!show)} className={`hover:bg-black/50 transition-all duration-50 w-full p-2 rounded-md text-sm font-semibold flex flex-row gap-1 ${show ? 'justify-start' : 'justify-center'} items-start`}>
                    {show ? (
                        <p>
                            <FontAwesomeIcon icon={faRightToBracket} className="rotate-180" /> Collapse
                        </p>
                    ) : (
                        <p className="aspect-square w-fit h-fit">
                            <FontAwesomeIcon icon={faRightToBracket} />
                        </p>
                    )}
                </button>
            </ul>
        </div>
        {/* Stats */}

        {/* 9. Fun Stats or Music Facts
        Add a Stats component with things like:

        “You've played 3,200 songs this month.”

        “This week’s most played: Artist Name” */}

        {/* Active Playback */}

        {/* Quick links to favorites, queue, and radio */}
    </section>
}