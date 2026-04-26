import { useEffect, useState } from 'react';
import { getCredentials, type Credentials } from '../lib/credentials';
import { CLIENT, VERSION } from '../pages/Home';
import axios from 'axios';
import type { ArtistInfo } from '../types/ArtistInfo';

export function useArtistInfo(id: string | undefined): undefined | ArtistInfo | null {
  const [item, setItem] = useState<undefined | ArtistInfo | null>(undefined);

  useEffect(() => {
    if (!id) return;

    const fetchCover = async () => {
      try {
        const creds = (await getCredentials() as unknown) as Credentials;

        // Perform search3 request using axios
        const res = await axios.get(`${creds.url}/rest/getArtistInfo`, {
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

        setItem(res.data['subsonic-response'].artistInfo);
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



