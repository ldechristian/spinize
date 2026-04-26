import { useTheme } from "../../hooks/useTheme";
import useUserAuth from "../../hooks/useUserAuth";

export default function Footer() {
    const { currentTheme, themeList, setTheme } = useTheme();
    const { authenticated, username, url } = useUserAuth();

    return <footer className='bg-600 text-white p-4 mb-[9rem] xl:mb-1 xl:rounded-l-md'>
        <div className="mx-auto w-full max-w-[80rem] flex flex-col justify-center items-center gap-2">
            <nav className="w-full">
                <ul className="flex flex-col gap-1 justify-start items-start">
                    <li>
                        <p>2025-26 The Spinize Project - Developped with ⭐ <span className="text-golden font-semibold italic">passion</span> ⭐ by Christian LDE</p>
                    </li>
                    <li>
                        <i>What is this platform? : A navidrome and subsonic client to make the overall user experience better.</i>
                    </li>
                    <li>
                        <button
                            className="border-2 border-color-golden text-golden p-1 md:p-2 rounded-md hover:bg-black/20"
                            onClick={() => setTheme(themeList.indexOf(currentTheme) === themeList.length - 1 ? themeList[0] : themeList[themeList.indexOf(currentTheme) + 1])}>
                            Toggle theme: <b className="text-white">{currentTheme}</b>
                        </button>
                    </li>
                    {/* <li>
                        <small>Version : {version}</small>
                    </li> */}
                </ul>
            </nav>

            <div className="w-full h-[1px] bg-white/50 my-2"></div>

            <nav className="w-full">
                <ul className="flex flex-col gap-1 justify-start items-start">
                    <li className="flex flex-col md:flex-row md:gap-1 justify-center md:justify-start items-start md:items-center">
                        <p>
                            Authenticated as:
                        </p>
                        <b>{username || 'no username found'}</b>
                    </li>
                    <li className="flex flex-col md:flex-row md:gap-1 justify-center md:justify-start items-start md:items-center">
                        <p>
                            Connected to subsonic server with url:
                        </p>
                        <b>{url || 'no url found'}</b>
                    </li>
                    <li className="flex flex-col md:flex-row md:gap-1 justify-center md:justify-start items-start md:items-center">
                        <p>
                            Connection status:
                        </p>
                        <b>{authenticated ? 'connected' : 'disconnected'}</b>
                    </li>
                </ul>
            </nav>
        </div>
    </footer>
}