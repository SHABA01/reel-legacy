/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  Subtitles,
  RectangleHorizontal,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Check,
  RotateCw
} from 'lucide-react';

export interface ReelMediaPlayerProps {
  src?: string;
  poster?: string;
  title?: string;
  subTitle?: string;
  captionsText?: string;
  autoPlay?: boolean;
  loop?: boolean;
  durationSec?: number;
  showNextPrev?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  isTheater?: boolean;
  onToggleTheater?: () => void;
  customOverlay?: React.ReactNode;
  className?: string;
}

export function ReelMediaPlayer({
  src,
  poster,
  title = 'ReelLegacy Video Player',
  subTitle,
  captionsText,
  autoPlay = false,
  loop = true,
  durationSec = 180,
  showNextPrev = false,
  onNext,
  onPrev,
  isTheater = false,
  onToggleTheater,
  customOverlay,
  className = '',
}: ReelMediaPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // States
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(durationSec);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Ripple feedback animation when play/pause/seek is triggered
  const [overlayFeedback, setOverlayFeedback] = useState<{
    type: 'play' | 'pause' | 'forward' | 'rewind';
    id: number;
  } | null>(null);

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format seconds to mm:ss or hh:mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const formattedS = s < 10 ? `0${s}` : `${s}`;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      const remainingM = m % 60;
      const formattedM = remainingM < 10 ? `0${remainingM}` : `${remainingM}`;
      return `${h}:${formattedM}:${formattedS}`;
    }
    return `${m}:${formattedS}`;
  };

  // Trigger temporary center feedback ripple
  const triggerFeedback = (type: 'play' | 'pause' | 'forward' | 'rewind') => {
    setOverlayFeedback({ type, id: Date.now() });
    if (feedbackTimeoutRef.current) clearTimeout(feedbackTimeoutRef.current);
    feedbackTimeoutRef.current = setTimeout(() => {
      setOverlayFeedback(null);
    }, 750);
  };

  // Video element sync when real video src is provided
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, src]);

  // Handle HTML5 video events
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && !isNaN(videoRef.current.duration) && videoRef.current.duration > 0) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleVideoEnded = () => {
    if (loop) {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      } else {
        setCurrentTime(0);
      }
    } else {
      setIsPlaying(false);
      if (onNext) onNext();
    }
  };

  // Simulated timer if video src is poster/image asset preview
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!src && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= duration) {
            if (loop) {
              return 0;
            } else {
              setIsPlaying(false);
              return duration;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [src, isPlaying, duration, loop, playbackSpeed]);

  // Auto-hide controls logic
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
        setShowSettingsMenu(false);
      }, 3000);
    }
  };

  // Play / Pause Toggle
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      triggerFeedback(next ? 'play' : 'pause');
      return next;
    });
  }, []);

  // Volume slider change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    if (videoRef.current) {
      videoRef.current.volume = val / 100;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (videoRef.current) {
        videoRef.current.muted = next;
        if (!next) videoRef.current.volume = volume / 100;
      }
      return next;
    });
  }, [volume]);

  // Seek bar click / drag
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  // Native Fullscreen Toggle
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          await (containerRef.current as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch {
        setIsFullscreen(true);
      }
    } else {
      try {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        setIsFullscreen(false);
      } catch {
        setIsFullscreen(false);
      }
    }
  }, []);

  // Listen to standard fullscreen change events
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  // Keyboard Shortcuts Handler (Space, f, m, c, t, Arrows, 0-9)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept typing in input or textarea elements
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      // Check if container or document is active
      const isFocused = containerRef.current && (containerRef.current.contains(document.activeElement) || isHovered || isFullscreen);
      if (!isFocused) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;

        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;

        case 'm':
          e.preventDefault();
          toggleMute();
          break;

        case 'c':
          e.preventDefault();
          setShowCaptions((prev) => !prev);
          break;

        case 't':
          e.preventDefault();
          if (onToggleTheater) onToggleTheater();
          break;

        case 'arrowleft':
        case 'j':
          e.preventDefault();
          setCurrentTime((prev) => {
            const next = Math.max(0, prev - 5);
            if (videoRef.current) videoRef.current.currentTime = next;
            return next;
          });
          triggerFeedback('rewind');
          break;

        case 'arrowright':
        case 'l':
          e.preventDefault();
          setCurrentTime((prev) => {
            const next = Math.min(duration, prev + 5);
            if (videoRef.current) videoRef.current.currentTime = next;
            return next;
          });
          triggerFeedback('forward');
          break;

        case 'arrowup':
          e.preventDefault();
          setVolume((prev) => {
            const next = Math.min(100, prev + 10);
            if (videoRef.current) {
              videoRef.current.volume = next / 100;
              videoRef.current.muted = false;
            }
            setIsMuted(false);
            return next;
          });
          break;

        case 'arrowdown':
          e.preventDefault();
          setVolume((prev) => {
            const next = Math.max(0, prev - 10);
            if (videoRef.current) {
              videoRef.current.volume = next / 100;
            }
            if (next === 0) setIsMuted(true);
            return next;
          });
          break;

        case 'escape':
          if (isFullscreen) {
            toggleFullscreen();
          }
          break;

        default:
          if (/^[0-9]$/.test(e.key)) {
            e.preventDefault();
            const pct = parseInt(e.key, 10) / 10;
            const targetSec = duration * pct;
            setCurrentTime(targetSec);
            if (videoRef.current) videoRef.current.currentTime = targetSec;
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, isFullscreen, isHovered, onToggleTheater, toggleFullscreen, toggleMute, togglePlay]);

  // Speed change handler
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
  };

  const progressPct = useMemo(() => {
    if (!duration || duration <= 0) return 0;
    return Math.min(100, Math.max(0, (currentTime / duration) * 100));
  }, [currentTime, duration]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (isPlaying) setShowControls(false);
      }}
      className={`relative bg-black rounded-2xl overflow-hidden group select-none shadow-2xl transition-all duration-300 font-sans focus:outline-none focus:ring-2 focus:ring-cinema-amber-500/50 ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] rounded-none w-screen h-screen flex flex-col justify-center bg-black'
          : isTheater
          ? 'w-full aspect-[21/9] max-h-[70vh]'
          : 'w-full aspect-video'
      } ${className}`}
      id="reel-media-player"
    >
      {/* 1. MEDIA SCREEN (VIDEO TAG OR POSTER IMAGE) */}
      <div
        className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={(e) => {
          e.stopPropagation();
          toggleFullscreen();
        }}
      >
        {src ? (
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            playsInline
            loop={loop}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            {poster ? (
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-cinema-amber-500/40 animate-pulse" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
          </div>
        )}

        {/* Custom Overlay Children (e.g. Camera Guides, Title Overlays) */}
        {customOverlay && <div className="absolute inset-0 pointer-events-none z-10">{customOverlay}</div>}

        {/* Subtitles / Captions Banner */}
        {showCaptions && captionsText && (
          <div className="absolute bottom-16 left-6 right-6 text-center pointer-events-none z-20">
            <div className="inline-block bg-black/85 border border-white/10 text-white font-sans text-xs md:text-sm px-4 py-2 rounded-lg shadow-2xl backdrop-blur-md max-w-xl leading-relaxed">
              {captionsText}
            </div>
          </div>
        )}

        {/* YOUTUBE-STYLE ANIMATED ON-SCREEN RIPPLE FEEDBACK (PLAY, PAUSE, REWIND, FORWARD) */}
        {overlayFeedback && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-in fade-in zoom-in-75 duration-200">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/75 border border-cinema-amber-500/40 backdrop-blur-md text-cinema-amber-500 flex flex-col items-center justify-center shadow-2xl animate-pulse">
              {overlayFeedback.type === 'play' && (
                <Play className="w-10 h-10 md:w-12 md:h-12 fill-cinema-amber-500 ml-1" />
              )}
              {overlayFeedback.type === 'pause' && (
                <Pause className="w-10 h-10 md:w-12 md:h-12 fill-cinema-amber-500" />
              )}
              {overlayFeedback.type === 'rewind' && (
                <div className="flex flex-col items-center">
                  <RotateCcw className="w-8 h-8 text-cinema-amber-500" />
                  <span className="text-[10px] font-mono font-bold mt-1 text-cinema-amber-400">-5s</span>
                </div>
              )}
              {overlayFeedback.type === 'forward' && (
                <div className="flex flex-col items-center">
                  <RotateCw className="w-8 h-8 text-cinema-amber-500" />
                  <span className="text-[10px] font-mono font-bold mt-1 text-cinema-amber-400">+5s</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. TOP GRADIENT & TITLE BAR */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between z-30 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cinema-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
          <div>
            <h4 className="text-xs md:text-sm font-bold text-white font-sans tracking-wide drop-shadow-md">
              {title}
            </h4>
            {subTitle && (
              <p className="text-[10px] text-white/70 font-mono">
                {subTitle}
              </p>
            )}
          </div>
        </div>

        {isFullscreen && (
          <button
            onClick={toggleFullscreen}
            className="p-2 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 rounded-full cursor-pointer transition-colors"
            title="Exit Fullscreen (Esc)"
          >
            <Minimize className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 3. SETTINGS MENU POPUP */}
      {showSettingsMenu && (
        <div className="absolute bottom-16 right-4 z-40 bg-slate-900/95 border border-cinema-amber-500/30 rounded-xl p-2.5 shadow-2xl backdrop-blur-md text-white text-xs w-48 space-y-1">
          <div className="px-2 py-1 border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-cinema-amber-400">
            Playback Speed
          </div>
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`w-full px-2.5 py-1.5 rounded-md flex items-center justify-between text-left cursor-pointer transition-colors ${
                playbackSpeed === speed
                  ? 'bg-cinema-amber-500 text-slate-950 font-bold'
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              <span>{speed === 1 ? 'Normal' : `${speed}x`}</span>
              {playbackSpeed === speed && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      )}

      {/* 4. GOLD CINEMA-STYLED BOTTOM CONTROLS BAR */}
      <div
        className={`absolute bottom-0 left-0 right-0 pt-8 pb-3 px-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col justify-end z-30 transition-opacity duration-300 ${
          showControls || !isPlaying || isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* GOLD PROGRESS / SEEK BAR */}
        <div className="relative group/seeker w-full h-3 flex items-center cursor-pointer mb-2">
          {/* Background Track */}
          <div className="w-full h-1 group-hover/seeker:h-2 bg-white/25 rounded-full overflow-hidden transition-all relative">
            {/* Buffer bar simulation */}
            <div className="absolute top-0 bottom-0 left-0 bg-white/40 rounded-full" style={{ width: `${Math.min(100, progressPct + 15)}%` }} />
            {/* Gold Filled Progress */}
            <div className="absolute top-0 bottom-0 left-0 bg-cinema-amber-500 rounded-full" style={{ width: `${progressPct}%` }} />
          </div>

          {/* Interactive Range Input */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          />

          {/* Gold Scrubber Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -ml-2 w-3.5 h-3.5 rounded-full bg-cinema-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.9)] scale-0 group-hover/seeker:scale-100 transition-transform pointer-events-none z-10"
            style={{ left: `${progressPct}%` }}
          />
        </div>

        {/* CONTROLS ROW */}
        <div className="flex items-center justify-between gap-3 text-white text-xs">
          {/* LEFT GROUP: PLAY/PAUSE, NEXT/PREV, VOLUME, TIMECODE */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Play / Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 text-white/90 hover:text-cinema-amber-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause (k / Space)' : 'Play (k / Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            {/* Prev / Next buttons if requested */}
            {showNextPrev && (
              <>
                <button
                  onClick={onPrev}
                  disabled={!onPrev}
                  className="p-1.5 text-white/80 hover:text-cinema-amber-400 disabled:opacity-30 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Previous Scene"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={onNext}
                  disabled={!onNext}
                  className="p-1.5 text-white/80 hover:text-cinema-amber-400 disabled:opacity-30 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                  title="Next Scene"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Volume with expand-on-hover slider */}
            <div className="flex items-center group/vol relative">
              <button
                onClick={toggleMute}
                className="p-1.5 text-white/90 hover:text-cinema-amber-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title={isMuted ? 'Unmute (m)' : 'Mute (m)'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5 text-cinema-amber-500" />
                ) : volume < 50 ? (
                  <Volume1 className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>

              <div className="w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-300 flex items-center pl-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 accent-cinema-amber-500 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Timecode display */}
            <div className="font-sans text-xs text-white/80 font-medium tracking-tight pl-1 select-none">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-white/40">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* RIGHT GROUP: CAPTIONS, SETTINGS, THEATER, FULLSCREEN */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Captions / Subtitles Toggle */}
            {captionsText && (
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer relative ${
                  showCaptions ? 'text-cinema-amber-400' : 'text-white/50 hover:text-white'
                }`}
                title="Subtitles / Closed Captions (c)"
              >
                <Subtitles className="w-5 h-5" />
                {showCaptions && (
                  <span className="absolute bottom-0.5 left-2 right-2 h-0.5 bg-cinema-amber-500 rounded-full" />
                )}
              </button>
            )}

            {/* Settings Speed Menu */}
            <button
              onClick={() => setShowSettingsMenu(!showSettingsMenu)}
              className={`p-1.5 text-white/80 hover:text-cinema-amber-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer ${
                showSettingsMenu ? 'rotate-45 text-cinema-amber-400' : ''
              }`}
              title="Playback Speed & Settings"
            >
              <Settings className="w-5 h-5 transition-transform duration-200" />
            </button>

            {/* Theater Mode Toggle */}
            {onToggleTheater && (
              <button
                onClick={onToggleTheater}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isTheater ? 'text-cinema-amber-400 hover:text-cinema-amber-300' : 'text-white/80 hover:text-cinema-amber-400 hover:bg-white/10'
                }`}
                title="Theater Mode (t)"
              >
                <RectangleHorizontal className="w-5 h-5" />
              </button>
            )}

            {/* Fullscreen Mode Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 text-white/90 hover:text-cinema-amber-400 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Full Screen (f / Esc)' : 'Full Screen (f / Double Click)'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
