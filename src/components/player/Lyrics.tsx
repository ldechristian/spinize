'use client';

import { useEffect, useRef, useState } from "react";
import type { Song } from "../../types/Song";

type ParsedLine = {
    timestamp: number;
    text: string;
};

export default function Lyrics({
    song,
    currentTime,
    setSongTime,
    audioRef,
    viewLyrics,
}: {
    song: Song;
    currentTime: number;
    setSongTime: (new_time: number) => void;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    viewLyrics: boolean;
}) {
    const [lyrics, setLyrics] = useState<ParsedLine[]>([]);
    const activeLineRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        const fetchLyrics = async () => {
            try {
                const res = await fetch(
                    `https://lrclib.net/api/get?artist_name=${song.artist}&track_name=${song.title}`
                );
                if (res.ok) {
                    const data = await res.json();
                    const lines = parseLyrics(data.syncedLyrics);
                    setLyrics(lines);
                } else {
                    setLyrics([]);
                }
            } catch {
                setLyrics([]);
            }
        };
        fetchLyrics();
    }, [song, audioRef]);

    // Parse the raw syncedLyrics into structured format
    const parseLyrics = (lyrics: string): ParsedLine[] => {
        return lyrics
            .split('\n')
            .map((line) => {
                const parts = line.split(']');
                if (parts.length > 1) {
                    const rawTime = parts[0].slice(1); // remove '['
                    const [min, sec] = rawTime.split(':');
                    const timestamp = parseInt(min) * 60 + parseFloat(sec);
                    const text = parts[1].trim();
                    return { timestamp, text };
                }
                return null;
            })
            .filter((line): line is ParsedLine => line !== null);
    };

    // Find the index of the last line whose timestamp <= currentTime
    const getActiveIndex = () => {
        let active = -1;
        for (let i = 0; i < lyrics.length; i++) {
            if (currentTime >= lyrics[i].timestamp) {
                active = i;
            } else {
                break;
            }
        }
        return active;
    };

    const activeIndex = getActiveIndex();

    // Scroll to the active line when it changes
    useEffect(() => {
        if (activeLineRef.current) {
            activeLineRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [activeIndex]);

    if (!viewLyrics) return null;

    if (lyrics.length === 0) return <>
        <i>There are no Lyrics.</i>
    </>;

    return (
        <div className="w-full h-[80svh] my-auto overflow-y-scroll hide-scrollbar">
            <div className="w-full pt-20 pb-[40svh] flex flex-col gap-1">
                {lyrics.map((line, index) => (
                    <button
                        key={index}
                        onClick={() => setSongTime(line.timestamp)}
                        ref={index === activeIndex ? activeLineRef : null}
                        className={`${
                            index === activeIndex
                                ? "text-3xl font-bold text-white"
                                : "text-lg text-white/50"
                        } transition-all duration-200 min-h-[1rem] w-fit mx-auto`}
                    >
                        {line.text}
                    </button>
                ))}
            </div>
        </div>
    );
}
