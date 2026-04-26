import { useEffect, useState, useCallback } from 'react';
import { getCredentials, type Credentials } from '../lib/credentials';
import { CLIENT, VERSION } from '../pages/Home';
import type { SearchResult3 } from '../types/SearchResult3';
import axios from 'axios';
import type { Song } from '../types/Song';
import type { Album } from '../types/Album';
import type { Artist } from '../types/Artist';

export function useSearch3(query: string = '') {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [artists, setArtists] = useState<Artist[] | null>(null);
  const [albums, setAlbums] = useState<Album[] | null>(null);
  const [songs, setSongs] = useState<Song[] | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const creds = (await getCredentials()) as Credentials;

      const res: { data: SearchResult3 } = await axios.get(`${creds.url}/rest/search3`, {
        params: {
          u: creds.username,
          t: creds.token,
          s: creds.salt,
          c: CLIENT,
          v: VERSION,
          query,
          f: 'json',
        },
      });

      const result = res.data['subsonic-response'].searchResult3;
      setSongs(result.song || []);
      setAlbums(result.album || []);
      setArtists(result.artist || []);
    } catch {
      // console.error('Search error:', err);
      // setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { songs, albums, artists, loading, error, refresh: fetchData };
}
