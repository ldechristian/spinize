import { useEffect, useState } from 'react';
import { getCredentials, type Credentials } from '../lib/credentials';
import { CLIENT, VERSION } from '../pages/Home';
import axios from 'axios';
import type { Artist } from '../types/Artist';

export function useArtist(id: string | undefined): undefined | Artist | null { // undefined = loading, Artist = result, null = not_found
  const [item, setItem] = useState<Artist | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCover = async () => {
      try {
        const creds = (await getCredentials() as unknown) as Credentials;

        // Perform search3 request using axios
        const res = await axios.get(`${creds.url}/rest/getArtist`, {
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

        setItem(res.data['subsonic-response'].artist);
      } catch {
        // setError(err?.message || 'Error fetching cover art');
      } finally {
        // setLoading(false);
      }
    };

    fetchCover();
  }, [id]);

  // return { artist: item, loading, error };
  return item;
}



