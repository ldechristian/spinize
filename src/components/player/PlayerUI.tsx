import { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown, faPlay, faPause, faForwardStep, faBackwardStep, faRotateLeft, faRotateRight, faShuffle, faRepeat, faList, fa1, fa0, fa2, faQuoteLeft, faBan } from '@fortawesome/free-solid-svg-icons';
import { useSongPlayer } from '../../context/useSongPlayer';
import ButtonClassic from '../ButtonClassic';
import FormatDuration from '../tools/FormatDuration';
import { Howl } from 'howler';
import { useCoverArt } from '../../hooks/useCoverArt';
import Lyrics from './Lyrics';
import Queue from './Queue';
import StarToggle from './StarToggle';
import AutoImage from '../AutoImage';
import { get_linear_volume, get_normal_volume, updateVolume } from '../../compUtils/updateVolume';

interface PlayerProps {
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function PlayerUI({ audioRef }: PlayerProps) {
    const {
        currentSong, repeat, shuffle, live, paused, setPaused,
        playNextSong, playPrevSong, setRepeat, setShuffle
    } = useSongPlayer();

    const [currentVolume, setCurrentVolume] = useState<number>(get_linear_volume() * 100.0); // Load the last volume from the localStorage or indexedDB (preferably localStorage)

    useEffect(() => {
        const audio = audioRef?.current;
        if (!audio) return;

        audio.volume = get_normal_volume();

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updatePlayState = () => setPaused(audio.paused);

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('play', updatePlayState);
        audio.addEventListener('pause', updatePlayState);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('play', updatePlayState);
            audio.removeEventListener('pause', updatePlayState);
        };
    }, [audioRef, setPaused]);

    useEffect(() => {
        const audio = audioRef?.current;
        if (!audio) return;

        const handleCanPlay = () => setIsBuffering(false);
        const handleWaiting = () => setIsBuffering(true);

        audio.addEventListener('canplay', handleCanPlay);
        audio.addEventListener('waiting', handleWaiting);

        return () => {
            audio.removeEventListener('canplay', handleCanPlay);
            audio.removeEventListener('waiting', handleWaiting);
        };
    }, [audioRef]);

    const { cover: defaultCover } = useCoverArt(currentSong?.id); // Load the cover, which updates automatically when currentSong?.id is changing.
    const cover = (live && currentSong?.cover) ? currentSong.cover : defaultCover;

    const [currentTime, setCurrentTime] = useState<number>(0);

    const [isExpanded, setIsExpanded] = useState<boolean>(false); // Only applies to the Extended Version I believe
    const [isPeeking, setIsPeeking] = useState<boolean>(false);
    const [screenHeight, setScreenHeight] = useState<number>(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        // Call immediately in case the screen changed before mount
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const [isBuffering, setIsBuffering] = useState<boolean>(false);
    
    const [viewQueue, setViewQueue] = useState<boolean>(false); // Queue.
    const [viewLyrics, setViewLyrics] = useState<boolean>(false); // Synced Lyrics.
    
    const howlRef = useRef<Howl | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    
    const PEEK_HEIGHT = 80;
    const SWIPE_THRESHOLD = 60;
    
    const [startY, setStartY] = useState<number | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    const setSongTime = (new_time: number = 0.0) => {
        const audio = audioRef?.current;
        if (!audio) return;
        if (audio.currentTime && new_time > 0.0 && new_time < audio.duration) {
            audio.currentTime = new_time;
            setCurrentTime(new_time);
        }
    };

    const pause = () => {
        const audio = audioRef?.current;
        if (!audio) return;
        audio.pause();
        setPaused(true);
    }

    const play = () => {
        const audio = audioRef?.current;
        if (!audio) return;
        audio.play();
        setPaused(false);
    }

    const handlePause = () => {
        const audio = audioRef?.current;
        if (!audio) return;
        if (audio.paused) {
            play();
        } else {
            pause();
        }
    };

    const handlePrev = () => {
        const audio = audioRef?.current;
        if (!audio) return;
        const MIN_DURATION_TO_SKIP = 15.0;
        if (audio.currentTime > MIN_DURATION_TO_SKIP) {
            audio.currentTime = 0;
            setCurrentTime(0);
        } else {
            playPrevSong();
        }
        if (paused) pause();
    };

    const handleNext = () => {
        const audio = audioRef?.current;
        if (!audio) return;
        const MIN_DURATION_TO_SKIP = 15.0;
        if (audio.currentTime > MIN_DURATION_TO_SKIP) {
            audio.currentTime = 0;
            setCurrentTime(0);
        } else {
            pause();
            playNextSong();
        }
        if (paused) pause();
    };

    const handleBackward = () => {
        const audio = audioRef?.current;
        if (!audio) return;
        const newTime = Math.max(0, audio.currentTime - 15);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleForward = () => {
        const audio = audioRef?.current;
        if (!audio || !audio.duration) return;
        const newTime = Math.min(audio.duration, audio.currentTime + 15);
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const syncTime = useCallback(() => {
        const sound = howlRef.current;
        if (!sound || !sound.playing()) return;
        setCurrentTime(sound.seek() as number);
        requestAnimationFrame(syncTime);
    }, []);

    useEffect(() => {
        setScreenHeight(window.innerHeight);
    }, []);

    const setTranslateY = (value: number, animate = true) => {
        const el = containerRef.current;
        if (!el) return;
        el.style.transition = animate ? 'transform 0.3s ease-out' : 'none';
        el.style.transform = `translate3d(0, ${value}px, 0)`;
    };

    const openPlayer = () => {
        setTranslateY(0);
        setIsExpanded(true);
        setIsPeeking(false);
    };

    const closePlayer = () => {
        setTranslateY(screenHeight);
        setIsExpanded(false);
        setIsPeeking(false);
    };

    const handlePointerDown = (e: React.PointerEvent) => {
        setStartY(e.clientY);
        setIsDragging(true);
        if (containerRef.current) containerRef.current.style.transition = 'none';
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || startY === null) return;

        const deltaY = e.clientY - startY;
        const baseY = isExpanded ? 0 : (isPeeking ? screenHeight - PEEK_HEIGHT : screenHeight);

        const targetY = Math.min(Math.max(baseY + deltaY, 0), screenHeight); // Clamp between 0 and screenHeight

        const el = containerRef.current;
        if (el) {
            el.style.transform = `translate3d(0, ${targetY}px, 0)`;
        }
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (startY === null) return;
        const deltaY = e.clientY - startY;

        if (deltaY < -SWIPE_THRESHOLD) {
            openPlayer();
        } else if (deltaY > SWIPE_THRESHOLD) {
            closePlayer();
        } else {
            if (isExpanded) openPlayer()
            else closePlayer();
        }

        setStartY(null);
        setIsDragging(false);
    };

    const toggleViewQueue = () => setViewQueue(!viewQueue);
    const toggleViewLyrics = () => setViewLyrics(!viewLyrics);

    return (
        <>
            {/* Mini Player */}
            <div className={`z-[50] fixed xl:relative xl:w-full ${currentSong?.id ? 'bottom-[6rem] md:bottom-[6rem] xl:bottom-0 h-[4.1rem]' : 'bottom-[-5rem] h-[0]'} left-0 right-0 text-white p-2 xl:p-0 cursor-pointer touch-none transition-all duration-200`} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
                <div className='text-white bg-700/60 backdrop-blur-sm w-full h-[4.1rem] bg-gray-900 p-2 flex flex-col justify-between items-between rounded-md xl:rounded-none xl:rounded-tl-md'>
                    <div className="text-sm underline w-full h-[0.1rem] grid place-items-center">
                        <FontAwesomeIcon icon={isExpanded ? faChevronDown : faChevronUp} />
                    </div>
                    <div className='w-full h-[4rem] flex flex-row gap-2 justify-start items-center'>
                        <ButtonClassic size='large' className='aspect-square' onClick={handlePause} >
                            <FontAwesomeIcon icon={paused ? faPlay : faPause} className='aspect-square' />
                        </ButtonClassic>
                        <div className='w-fit h-full hidden md:block max-h-[3.5rem] aspect-square'>
                            <AutoImage
                            src={cover ?? '/songConver.jpg'}
                            alt='Song Cover Image'
                            width={48}
                            height={48}
                            className='w-full h-full object-cover rounded-md bg-black'
                            type='song'
                            />
                        </div>
                        <button className='w-full flex flex-col justify-start items-start' onClick={openPlayer}>
                            <p className='text-lg w-fit max-w-[50vw] sm:max-w-[60vw] md:max-w-[55vw] lg:max-w-[60vw] truncate'>{currentSong?.title || 'unknown'}</p>
                            <p className='text-xs w-fit max-w-[50vw] sm:max-w-[60vw] md:max-w-[55vw] lg:max-w-[60vw] truncate'>{currentSong?.artist || 'unknown'}</p>
                        </button>
                        {!live && (
                            <>
                                <div className='hidden lg:block'>
                                    <ButtonClassic size='medium' className='aspect-square' onClick={handlePrev} >
                                        <FontAwesomeIcon icon={faBackwardStep} className='aspect-square' />
                                    </ButtonClassic>
                                </div>
                                <div className='hidden md:block'>
                                    <ButtonClassic size='medium' className='aspect-square' onClick={handleBackward} >
                                        <FontAwesomeIcon icon={faRotateLeft} className='aspect-square' />
                                    </ButtonClassic>
                                </div>
                                <div className='hidden md:block'>
                                    <ButtonClassic size='medium' className='aspect-square' onClick={handleForward} >
                                        <FontAwesomeIcon icon={faRotateRight} className='aspect-square' />
                                    </ButtonClassic>
                                </div>
                                <StarToggle id={currentSong?.id || ''} className='text-xl' />
                                <ButtonClassic size='large' className='aspect-square' onClick={handleNext} >
                                    <FontAwesomeIcon icon={faForwardStep} className='aspect-square' />
                                </ButtonClassic>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Full Player (swipeable) */}
            <div
                ref={containerRef}
                className={`w-full fixed inset-0 h-[100svh] overflow-hidden bg-black text-white z-50 touch-none select-none overflow-hidden flex flex-row justify-center pt-4 transition-all duration-500`}
                style={{ transform: `translate3d(0, ${screenHeight}px, 0)` }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <button className='absolute top-0 left-0 right-0 w-full h-full max-h-[5svh] grid place-items-center' onClick={() => closePlayer()}>
                    <FontAwesomeIcon icon={faChevronDown} />
                </button>

                {/* Close the player on large screens by just clicking on an empty space */}
                <button onClick={() => closePlayer()} className="z-[-1] w-full h-full absolute inset-0 hidden xl:block" style={{ cursor: 'zoom-out'}} />

                {!live && (
                    <div
                        className={`
                            fixed left-0 right-0 bottom-0 xl:relative xl:max-w-[32vw] z-[1000]
                            transition-all duration-500
                            overflow-hidden
                            xl:h-auto
                            my-auto
                            ${viewQueue ? 'h-[80svh] w-full xl:w-120' : 'h-0 xl:w-0'}
                        `}
                        >
                        <div
                            className={`
                            transition-all duration-300
                            w-full
                            h-[80svh] min-h-[14rem]
                            bg-white/10 backdrop-blur-3xl
                            xl:bg-transparent xl:backdrop-blur-none xl:h-[90svh] xl:max-h-[90svh]
                            `}
                        >
                            <button onClick={toggleViewQueue} className="sticky top-0 xl:backdrop-blur-sm w-full p-2 flex flex-row justify-center items-center">
                                {viewQueue ? 'Close Queue' : 'View Queue'}
                            </button>
                            <Queue />
                        </div>
                    </div>
                )}

                <div className="flex flex-col w-full 2xl:max-w-[32vw] h-[80svh] my-auto overflow-hidden">
                    <div className="flex-1 flex flex-col items-center justify-center gap-2 w-full px-4 md:px-6 lg:px-8">
                        <AutoImage
                            src={cover ?? '/songConver.jpg'}
                            alt='Song Cover Image'
                            width={32}
                            height={32}
                            className='absolute inset-0 z-[-1] bg-black/50 animate-song-bg w-full h-full object-cover'
                            type='song'
                        />
                        {/* <div className='aspect-square w-full h-fit max-w-[42svh] max-h-[42svh] sm:max-w-[55svh] sm:max-h-[55svh] md:max-w-[60svh] md:max-h-[60svh]'> */}
                        <div className='relative aspect-square w-fit h-fit overflow-hidden max-h-[60svh]'>
                            <AutoImage
                            src={cover ?? '/songConver.jpg'}
                            alt='Song Cover Image'
                            width={576}
                            height={576}
                            className='2xl:w-[32vw] h-full object-cover rounded-lg bg-black'
                            type='song'
                            />
                            {
                                !live && (
                                    <>
                                        <button
                                            onClick={toggleViewQueue}
                                            className={`absolute left-2 bottom-2 rounded-md backdrop-blur-sm p-1 w-8 h-8 aspect-square ${viewQueue && 'bg-white text-black'} transition-all duration-100`}>
                                            <FontAwesomeIcon icon={faList} />
                                        </button>
                                        <button
                                            onClick={toggleViewLyrics}
                                            className={`absolute right-2 bottom-2 rounded-md backdrop-blur-sm p-1 w-8 h-8 aspect-square ${viewLyrics && 'bg-white text-black'} transition-all duration-100`}>
                                            <FontAwesomeIcon icon={faQuoteLeft} />
                                        </button>
                                    </>
                                )
                            }
                        </div>
                        <div className='w-full max-w-[60svh] flex flex-row justify-between items-center gap-1'>
                            <div className='w-full flex flex-col justify-center items-center gap-1'>
                                <p className='text-lg md:text-xl font-semibold text-center'>
                                    {currentSong?.title || 'unknown'}
                                </p>
                                <p className='text-xs text-center'>
                                    <u>
                                        {currentSong?.artist || 'unknown'}
                                    </u> - <i>
                                        {currentSong?.album || 'unknown'} {currentSong?.year && <span>({currentSong.year})</span>}
                                    </i>
                                </p>
                            </div>
                            {!live && (<StarToggle id={currentSong?.id || ''} className='text-lg md:text-xl' />)}
                        </div>
                        <div className='flex flex-row gap-4 justify-center items-center'>
                        {
                            !live && (
                                <>
                                {
                                    repeat == 0 && (
                                    <ButtonClassic size='large' className='relative aspect-square text-white scale-[0.6]' onClick={() => setRepeat(1)}>
                                        <FontAwesomeIcon icon={faRepeat} className='absolute inset-0 w-full h-full scale-[0.5]' />
                                        <FontAwesomeIcon icon={faBan} className='absolute inset-0 w-full h-full' />
                                    </ButtonClassic>
                                    )
                                }

                                {
                                    repeat == 1 && (
                                    <ButtonClassic size='large' className='relative aspect-square text-white scale-[0.6]' onClick={() => setRepeat(2)}>
                                        <FontAwesomeIcon icon={faRepeat} className='absolute inset-0 w-full h-full scale-[0.5]' />
                                    </ButtonClassic>
                                    )
                                }

                                {
                                    repeat == 2 && (
                                    <ButtonClassic size='large' className='relative aspect-square text-white scale-[0.6]' onClick={() => setRepeat(0)} >
                                        <FontAwesomeIcon icon={faRepeat} className='absolute inset-0 w-full h-full scale-[0.5]' />
                                        <FontAwesomeIcon icon={fa1} className='absolute bottom-0 right-0 scale-[0.5]' />
                                    </ButtonClassic>
                                    )
                                }

                                    <ButtonClassic size='large' className='relative aspect-square text-white/70 scale-[0.6]' onClick={handlePrev} >
                                        <FontAwesomeIcon icon={faBackwardStep} className='absolute inset-0 w-full h-full' />
                                    </ButtonClassic>
                                </>
                            )
                        }
                        <ButtonClassic size='xlarge' className='aspect-square text-white/70' onClick={handlePause} disabled={isBuffering} >
                            <FontAwesomeIcon icon={paused ? faPlay : faPause} />
                        </ButtonClassic>
                        {
                            !live && (
                                <>
                                    <ButtonClassic size='large' className='relative aspect-square text-white/70 scale-[0.6]' onClick={handleNext} >
                                        <FontAwesomeIcon icon={faForwardStep} className='absolute inset-0 w-full h-full' />
                                    </ButtonClassic>
                                    <ButtonClassic size='large' className='relative aspect-square text-white/70 scale-[0.6]' onClick={() => setShuffle(!shuffle)} >
                                        <FontAwesomeIcon icon={shuffle ? faShuffle : faList} className='absolute inset-0 w-full h-full' />
                                    </ButtonClassic>
                                </>
                            )
                        }
                        </div>
                        <div className='w-full max-w-[60svh] flex flex-col justify-center items-between gap-1'>
                            {
                                live ? (
                                    <div className='h-[.5rem] flex flex-row gap-1 items-center'>
                                        <div className='w-full h-full bg-red-700 rounded-md'></div>
                                        <p>live</p>
                                        <div className='w-full h-full bg-red-700 rounded-md'></div>
                                    </div>
                                ) : (
                                    <>
                                    <input
                                        type="range"
                                        min={0}
                                        max={currentSong ? currentSong.duration : 0}
                                        value={currentTime}
                                        className="w-full range-slider-transparent"
                                        onChange={(e) => {
                                            const newTime = parseFloat(e.target.value);
                                            // if (howlRef.current) {
                                            //     howlRef.current.seek(newTime);
                                            //     setCurrentTime(newTime);
                                            // }
                                            const audio = audioRef?.current;
                                            if (audio) {
                                                audio.currentTime = newTime;
                                                setCurrentTime(newTime);
                                            }
                                        }}
                                        style={{
                                        '--progress': currentSong && currentSong.duration
                                            ? `${(currentTime / currentSong.duration) * 100}%`
                                            : '0%',
                                        } as React.CSSProperties}
                                    />
                                    <div className='flex flex-row justify-between items-center gap-2'>
                                        <small>{isBuffering ? '--:--' : <FormatDuration duration={currentTime ? currentTime : 0} />}</small>
                                        {currentSong?.contentType && currentSong.bitRate && (
                                            <small>{currentSong.contentType} / {currentSong.bitRate}</small>
                                        )}
                                        <small>-{isBuffering ? '--:--' : <FormatDuration duration={currentSong?.duration ? Math.max(currentSong?.duration - currentTime, 0) : 0} />}</small>
                                    </div>
                                    </>
                                )
                            }
                        </div>
                        <div className='w-full max-w-[60svh] flex flex-col justify-center items-between gap-1'>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={currentVolume}
                                className="w-full range-slider-transparent"
                                onChange={(e) => {
                                    const newVolume = parseFloat(e.target.value);
                                    setCurrentVolume(newVolume);
                                    updateVolume(newVolume / 100.0); //

                                    const audio = audioRef?.current;
                                    if (audio) {
                                        audio.volume = get_normal_volume(); //
                                    }
                                }}
                                style={{
                                '--progress': currentVolume
                                    ? `${currentVolume}%`
                                    : '0%',
                                } as React.CSSProperties}
                            />
                            <p className='text-center text-xs text-white/50'>
                                volume
                            </p>
                        </div>
                    </div>
                </div>

                {!live && (
                    <div
                        className={`
                            fixed left-0 right-0 bottom-0 xl:relative xl:max-w-[32vw] z-[1000]
                            transition-all duration-500
                            overflow-hidden
                            xl:h-auto
                            my-auto
                            ${currentSong && viewLyrics ? 'h-[80svh] w-full xl:w-120' : 'h-0 xl:w-0'}
                        `}
                        >
                        <div
                            className={`
                            transition-all duration-300
                            overflow-hidden
                            w-full
                            h-[80svh] min-h-[14rem]
                            bg-white/10 backdrop-blur-3xl
                            xl:bg-transparent xl:backdrop-blur-none xl:h-[90svh] xl:max-h-[90svh]
                            `}
                        >
                            <button onClick={toggleViewLyrics} className="sticky top-0 xl:backdrop-blur-sm w-full p-2 flex flex-row justify-center items-center">
                                {currentSong && viewLyrics ? 'Close Lyrics' : 'View Lyrics'}
                            </button>
                            {currentSong &&  (
                                <Lyrics audioRef={audioRef} song={currentSong} currentTime={currentTime} setSongTime={setSongTime} viewLyrics={viewLyrics} />
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
