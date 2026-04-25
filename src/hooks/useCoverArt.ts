import { useEffect, useState } from "react";
import { getCredentials, type Credentials } from "../lib/credentials";

const DEFAULT_COVER = "/songCover.jpg";

async function buildCoverUrl(id: string): Promise<string> {
  const creds = (await getCredentials()) as Credentials;

  return (
    `${creds.url}/rest/getCoverArt?id=${id}` +
    `&u=${creds.username}` +
    `&t=${creds.token}` +
    `&s=${creds.salt}` +
    `&c=your-client-name` +
    `&v=1.16.1`
  );
}

// Test if an image actually loads
function testImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

export function useCoverArt(
  songId?: string,
  albumId?: string
) {
  const [cover, setCover] = useState<string>(DEFAULT_COVER);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchCover() {
      if (!songId && !albumId) {
        setCover(DEFAULT_COVER);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // 1. Try song cover
        if (songId) {
          const songUrl = await buildCoverUrl(songId);
          if (await testImage(songUrl)) {
            if (!cancelled) setCover(songUrl);
            return;
          }
        }

        // 2. Try album cover
        if (albumId) {
          const albumUrl = await buildCoverUrl(albumId);
          if (await testImage(albumUrl)) {
            if (!cancelled) setCover(albumUrl);
            return;
          }
        }

        // 3. Fallback
        if (!cancelled) setCover(DEFAULT_COVER);

      } catch {
        if (!cancelled) setCover(DEFAULT_COVER);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchCover();

    return () => {
      cancelled = true;
    };
  }, [songId, albumId]);

  return { cover, loading };
}