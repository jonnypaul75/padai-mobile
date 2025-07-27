import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { apiProxyRequest } from '../../lib/api-client-proxy';
import type { AudioFFMPEGResponse } from '../../types/media';
import { useChatPanelStore } from '../../store/chatStore';

export default function HtmlViewer({ url }: { url: string }) {
  const [htmlContent, setHtmlContent] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const [zoom, setZoom] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [highlightedElements, setHighlightedElements] = useState<HTMLElement[]>([]);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const location = useLocation();

  useEffect(() => {
    fetch(url)
      .then(res => res.text())
      .then(setHtmlContent)
      .catch(err => console.error('Failed to fetch HTML:', err));
  }, [url]);

  useEffect(() => {
    const resize = () => {
      if (!containerRef.current || !contentRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      const contentWidth = contentRef.current.scrollWidth;
      const scale = containerWidth / contentWidth;
      setZoom(scale > 1 ? 1 : scale);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [htmlContent]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
        setIsPaused(false);
      }
    };
  }, [location]);

  useEffect(() => {
    const styleId = 'selection-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        ::selection { background: #f5f3c8; color: inherit; }
        .highlighted-line { background-color: #fcf8c2; transition: background-color 0.3s; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };




  const base64ToArrayBuffer = (base64: string) => {
    base64 = base64.replace(/_/g, "/").replace(/-/g, "+");
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  };


  const clearHighlights = () => {
    highlightedElements.forEach(el => el.classList.remove('highlighted-line'));
    setHighlightedElements([]);
  };

  const startSpeech = async (text: string, language: string = 'hi-IN') => {
    if (!text.trim()) {
      alert('Please enter text to generate audio.');
      return;
    }

    setLoadingAudio(true);

    try {

      const payload = {
        text, language
      };
      const response = await apiProxyRequest<AudioFFMPEGResponse, typeof payload>(
        "POST",
        "Audio/synthesizeaudio",
        payload
      );


      const blob = new Blob([new Uint8Array(base64ToArrayBuffer(response.audio))], {
        type: 'audio/mpeg',
      });

      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(blob);
        setIsPlaying(true);
        setIsPaused(false);
        audioRef.current.play();
      }
    } catch (err) {
      alert('Error generating speech.');
    } finally {
      setLoadingAudio(false);
    }
  };

  const toggleSpeech = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !isPaused) {
      audio.pause();
      setIsPaused(true);
    } else if (isPlaying && isPaused) {
      audio.play();
      setIsPaused(false);
    } else {
      const text = contentRef.current?.innerText || '';
      startSpeech(text);
    }
  };

  const stopSpeech = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      setIsPaused(false);
      clearHighlights();
    }
  };

  const seekAudio = (seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime += seconds;
    }
  };

  const setPlaybackSpeed = (rate: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = rate;
    }
  };

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.volume = parseFloat(e.target.value);
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const onProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat(e.target.value);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        hidden
        onEnded={() => setIsPlaying(false)}
        onTimeUpdate={onTimeUpdate}
      />



      <div className="flex justify-between items-center flex-wrap gap-2 mb-2 pt-2 px-2 sticky top-0 z-[1] bg-white">
        <div className="flex flex-wrap items-center gap-2 border p-2 rounded shadow-sm bg-[#e2e2e2] backdrop-blur-md border-[1px] border-[#e0e0f0]">
          <button
            className="text-sm text-white bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded border border-gray-300"
            onClick={() => seekAudio(-10)}
          >
            ⏪ 10s
          </button>
          <button
            className="text-sm text-white bg-blue-200 hover:bg-blue-300 px-2 py-1 rounded border border-gray-300"
            onClick={() => seekAudio(10)}
          >
            10s ⏩
          </button>
          <button
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 w-[60px] rounded"
            onClick={() => setPlaybackSpeed(0.75)}
          >
            0.75x
          </button>
          <button
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 w-[60px] rounded"
            onClick={() => setPlaybackSpeed(1)}
          >
            1x
          </button>
          <button
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 w-[60px] rounded"
            onClick={() => setPlaybackSpeed(1.5)}
          >
            1.5x
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={changeVolume}
            defaultValue="1"
            title="Volume"
            className="w-[80px]"
          />
          <div className="flex gap-2">
            <button
              className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
              onClick={toggleSpeech}
            >
              {isPlaying ? (isPaused ? '▶️ Resume' : '⏸ Pause') : '🔊 Generate Audio'}
            </button>
            {isPlaying && (
              <button
                className="text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded"
                onClick={stopSpeech}
              >
                ⏹ Stop
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="min-w-[40px] text-xs">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              step="0.01"
              value={currentTime}
              onChange={onProgressChange}
              className="w-[120px]"
              title="Progress"
            />
            <span className="min-w-[40px] text-xs">{formatTime(duration)}</span>
          </div>
        </div>

        {/* <div className="ml-auto flex gap-2">
          <button
            className="text-white bg-sky-500 hover:bg-sky-600 px-3 py-1 rounded"
            onClick={handleExplainClick}
          >
            📘 Explain Selected Text
          </button>
        </div> */}
      </div>


      <div className="prose" ref={containerRef} style={{ overflow: 'auto' }}>
        <div
          ref={contentRef}
          className="html-div origin-top-left user-select"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      {loadingAudio && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(255,255,255,0.95)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <img src="https://cdn.pixabay.com/animation/2022/07/31/06/27/06-27-17-124_512.gif" alt="Loading..." style={{ width: '100px', height: '100px', marginBottom: '20px' }} />
          <h5 style={{ color: '#444' }}>Preparing audio...</h5>
        </div>
      )}
    </>
  );
}
