import { useEffect, useState } from 'react';
import { getCredentials, type Credentials } from '../lib/credentials';
import { CLIENT, VERSION } from '../pages/Home';
import type { Song } from '../types/Song';
import axios from 'axios';

export function useSong(id: string | undefined) {
    const [item, setItem] = useState<Song | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    setError(null);

  useEffect(() => {
    if (!id) return;

    const fetchCover = async () => {
      try {
        setLoading(true);
        const creds = (await getCredentials() as unknown) as Credentials;

        // Perform search3 request using axios
        const res = await axios.get(`${creds.url}/rest/getSong`, {
          params: {
            u: creds.username,
            t: creds.token,
            s: creds.salt,
            c: CLIENT,
            v: VERSION,
            id,
            f: 'json',
          },
        });

        setItem(res.data['subsonic-response'].song);
      } catch {
        // setError(err?.message || 'Error fetching cover art');
      } finally {
        setLoading(false);
      }
    };

    fetchCover();
  }, [id]);

  return { song: item, loading, error };
}



