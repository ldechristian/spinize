import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBroom, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState, type RefObject } from 'react';
import { useNavigate, useParams } from "react-router-dom";

export default function SearchInput({ defaultValue = '' }: { defaultValue?: string }) {
  const { query } = useParams();
  const inputRef: RefObject<HTMLInputElement | null> = useRef(null);

  const APP_PREFIX = "/app";

  // Focus input on Ctrl+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Windows/Linux: Ctrl+K, macOS: Meta+K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = useNavigate(); // Initialize navigate hook
  const [searchQuery, setSearchQuery] = useState(query ? query : defaultValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${APP_PREFIX}/search/${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    navigate(`${APP_PREFIX}/search`);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full xl:w-[50rem] h-[2.5rem] flex flex-row justify-between items-center border-2 border-color-500 rounded-md">
      <label
        htmlFor="search"
        className='aspect-square h-full grid w-fit place-items-center'>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </label>
      <input
        ref={inputRef}
        type="text"
        name="search"
        id="search"
        placeholder="Search a ... song, artist, album"
        value={searchQuery}
        onFocus={() => {
          navigate(`${APP_PREFIX}/search/${encodeURIComponent(searchQuery.trim())}`);
        }}
        onChange={(e) => {
          e.preventDefault();
          setSearchQuery(e.target.value);
          navigate(`${APP_PREFIX}/search/${encodeURIComponent(e.target.value.trim())}`);
        }}
        className="w-full h-full p-2 outline-none bg-600 rounded-md text-white placeholder-white"
      />
      <span className="h-full px-2 grid place-items-center text-nowrap text-golden">Ctrl K</span>
      <span className="w-1 h-full bg-600"></span>
      <button
        type="button" // Important: this should NOT be "submit"
        onClick={handleClear}
        className='aspect-square h-full grid w-fit place-items-center'>
        <FontAwesomeIcon icon={faBroom} />
      </button>
    </form>
  );
}
