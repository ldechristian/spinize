import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Layout from './components/Layout';
import ArtistDetail from './pages/ArtistDetail';
import NotFound from './pages/NotFound';
import LogOut from './pages/LogOut';
import Auth from './pages/Auth';
import SongDetail from './pages/SongDetail';
import Songs from './pages/Songs';
import Artists from './pages/Artists';
import Albums from './pages/Albums';
import Search from './pages/Search';
import AlbumDetail from './pages/AlbumDetail';
import Playlists from './pages/Playlists';
import PlaylistDetail from './pages/PlaylistDetail';
import Starred from './pages/Starred';
import { SongPlayerProvider } from './context/SongPlayerProvider';
import AudioPlayer from './components/AudioPlayer';
import { ThemeProvider } from './hooks/themeProvider';
import { useRef } from 'react';
import Downloads from './pages/Downloads';
import { DownloadProvider } from './hooks/DownloadProvider';
import Radio from './pages/Radio';
import AboutProject from './pages/project/AboutProject';
import Library from './pages/Library';

export default function App() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  return (
    <BrowserRouter>
      <ThemeProvider initialTheme="violet">
        <SongPlayerProvider>
          <DownloadProvider>
            <AudioPlayer audioRef={audioRef} />
            <Routes>
              {/* About the Project page */}
              <Route path='/' element={<AboutProject />} />

              <Route path="/app" element={<Layout audioRef={audioRef} />}>
                {/* Homepage */}
                <Route index element={<Home />} />
                {/* Search */}
                <Route path="search">
                  <Route index element={<Search />} />
                  <Route path=":query" element={<Search />} />
                </Route>
                {/* Downloads */}
                <Route path="downloads" element={<Downloads />} />
                {/* Auth & Log out */}
                <Route path="auth" element={<Auth />} />
                <Route path="log-out" element={<LogOut />} />
                {/* Starred */}
                <Route path="starred" element={<Starred />} />
                {/* Starred */}
                <Route path="library" element={<Library />} />
                {/* Songs */}
                <Route path="songs">
                  <Route index element={<Songs />} />
                  <Route path=":id" element={<SongDetail />} />
                </Route>
                {/* Albums */}
                <Route path="albums">
                  <Route index element={<Albums />} />
                  <Route path=":id" element={<AlbumDetail />} />
                </Route>
                {/* Artists */}
                <Route path="artists">
                  <Route index element={<Artists />} />
                  <Route path=":id" element={<ArtistDetail />} />
                </Route>
                {/* Playlists */}
                <Route path="playlists">
                  <Route index element={<Playlists />} />
                  <Route path=":id" element={<PlaylistDetail />} />
                </Route>
                {/* Blindtest */}
                {/* <Route path="blintest" element={<Blindtest />} /> */}




                {/* Radio */}
                {/* <Route path="radio" element={<Radio />} /> */}




                {/* Not Found */}
                <Route path='*' element={<NotFound />} />
              </Route>
            </Routes>
          </DownloadProvider>
        </SongPlayerProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
