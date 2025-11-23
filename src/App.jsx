import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import ModeSelector from './components/ModeSelector.jsx';
import Timer from './components/Timer.jsx';
import Controls from './components/Controls.jsx';
import SessionStats from './components/SessionStats.jsx';
import LogBook from './components/LogBook.jsx';
import ThemeSwitcher from './components/ThemeSwitcher.jsx';

const MODES = {
  pomodoro: { label: 'Pomodoro', duration: 25 * 60 },
  shortBreak: { label: 'Kısa Mola', duration: 5 * 60 },
  longBreak: { label: 'Uzun Mola', duration: 15 * 60 },
};

const STORAGE_KEY = 'modern-pomodoro-state';
const DEFAULT_STATS = {
  focusMinutes: 0,
  breakMinutes: 0,
  breaksTaken: 0,
};
const MAX_LOG_ENTRIES = 25;
const THEMES = {
  calm: {
    label: 'Calm',
    preview: '#111827',
    properties: {
      '--bg-gradient': 'radial-gradient(circle at top, #f9fafc 0%, #eceef3 70%, #e4e7ee 100%)',
      '--card': 'rgba(255, 255, 255, 0.8)',
      '--card-border': 'rgba(255, 255, 255, 0.6)',
      '--text': '#111118',
      '--subtle': '#5a5a65',
      '--accent': '#111827',
      '--primary': '#111827',
      '--primary-hover': '#0f172a',
      '--ghost-hover': 'rgba(15, 23, 42, 0.08)',
      '--shadow-soft': '0 25px 65px rgba(22, 33, 72, 0.18)',
    },
  },
  sunset: {
    label: 'Sunset',
    preview: '#f97316',
    properties: {
      '--bg-gradient': 'radial-gradient(circle at top, #fff3e6 0%, #ffd7c0 70%, #f0c5b6 100%)',
      '--card': 'rgba(255, 255, 255, 0.9)',
      '--card-border': 'rgba(255, 148, 114, 0.4)',
      '--text': '#3b1612',
      '--subtle': '#a6633a',
      '--accent': '#b54133',
      '--primary': '#b54133',
      '--primary-hover': '#983322',
      '--ghost-hover': 'rgba(181, 65, 51, 0.12)',
      '--shadow-soft': '0 25px 65px rgba(181, 65, 51, 0.25)',
    },
  },
  forest: {
    label: 'Forest',
    preview: '#0f766e',
    properties: {
      '--bg-gradient': 'radial-gradient(circle at top, #e6fbf5 0%, #c9efe3 65%, #a8d7c7 100%)',
      '--card': 'rgba(255, 255, 255, 0.85)',
      '--card-border': 'rgba(15, 118, 110, 0.25)',
      '--text': '#06241f',
      '--subtle': '#1b5b4f',
      '--accent': '#0f766e',
      '--primary': '#0f766e',
      '--primary-hover': '#0b5f58',
      '--ghost-hover': 'rgba(15, 118, 110, 0.12)',
      '--shadow-soft': '0 25px 65px rgba(15, 118, 110, 0.22)',
    },
  },
};

function App() {
  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [targetTime, setTargetTime] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [logEntries, setLogEntries] = useState([]);
  const [theme, setTheme] = useState('calm');

  const audioCtxRef = useRef(null);
  const hydratedRef = useRef(false);

  const activeDuration = MODES[mode].duration;

  const formattedTime = useMemo(() => {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [timeLeft]);

  const progress = useMemo(() => {
    if (activeDuration === 0) return 0;
    return (activeDuration - timeLeft) / activeDuration;
  }, [activeDuration, timeLeft]);

  const playChime = useCallback(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(660, ctx.currentTime);

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.4, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 1.2);
  }, []);

  const triggerNotification = useCallback(() => {
    const message = `${MODES[mode].label} tamamlandı!`;
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(message, {
          body: 'Kısa bir nefes alın ve modu değiştirin.',
          silent: false,
        });
      } else if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
  }, [mode]);

  const handleCompletion = useCallback(() => {
    setIsRunning(false);
    setTargetTime(null);
    setTimeLeft(0);
    setAlertMessage(`${MODES[mode].label} tamamlandı!`);
    setStats((prev) => {
      const minutes = MODES[mode].duration / 60;
      if (mode === 'pomodoro') {
        return {
          ...prev,
          focusMinutes: Math.round((prev.focusMinutes + minutes) * 10) / 10,
        };
      }
      return {
        ...prev,
        breakMinutes: Math.round((prev.breakMinutes + minutes) * 10) / 10,
        breaksTaken: prev.breaksTaken + 1,
      };
    });
    playChime();
    triggerNotification();
  }, [mode, playChime, triggerNotification]);

  useEffect(() => {
    if (alertMessage === '') return undefined;
    const timeout = setTimeout(() => setAlertMessage(''), 4000);
    return () => clearTimeout(timeout);
  }, [alertMessage]);

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    try {
      const storedRaw = localStorage.getItem(STORAGE_KEY);
      if (!storedRaw) return;

      const stored = JSON.parse(storedRaw);
      const storedMode = MODES[stored?.mode] ? stored.mode : 'pomodoro';
      const duration = MODES[storedMode].duration;

      let nextTimeLeft = typeof stored?.timeLeft === 'number'
        ? Math.min(Math.max(stored.timeLeft, 0), duration)
        : duration;
      let nextTarget = null;
      let nextRunning = Boolean(stored?.isRunning && stored?.targetTime);

      if (nextRunning) {
        const remaining = Math.round((stored.targetTime - Date.now()) / 1000);
        if (remaining > 0) {
          nextTimeLeft = Math.min(remaining, duration);
          nextTarget = stored.targetTime;
        } else {
          nextTimeLeft = 0;
          nextRunning = false;
        }
      }

      const storedStats = {
        focusMinutes: Number(stored?.stats?.focusMinutes) || 0,
        breakMinutes: Number(stored?.stats?.breakMinutes) || 0,
        breaksTaken: Number(stored?.stats?.breaksTaken) || 0,
      };
      const storedEntries = Array.isArray(stored?.logEntries) ? stored.logEntries : [];
      const storedTheme = THEMES[stored?.theme] ? stored.theme : 'calm';

      setMode(storedMode);
      setTimeLeft(nextTimeLeft);
      setIsRunning(nextRunning);
      setTargetTime(nextTarget);
      setStats(storedStats);
      setLogEntries(storedEntries);
      setTheme(storedTheme);
    } catch (error) {
      console.error('State hydration failed:', error);
    }
  }, []);

  useEffect(() => {
    const themeConfig = THEMES[theme] || THEMES.calm;
    Object.entries(themeConfig.properties).forEach(([token, value]) => {
      document.documentElement.style.setProperty(token, value);
    });
  }, [theme]);

  useEffect(() => {
    if (!isRunning || !targetTime) return undefined;

    const tick = () => {
      const remaining = Math.max(0, Math.round((targetTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        handleCompletion();
      }
    };

    const interval = setInterval(tick, 500);
    return () => clearInterval(interval);
  }, [isRunning, targetTime, handleCompletion]);

  useEffect(() => {
    const stateToPersist = {
      mode,
      timeLeft,
      isRunning,
      targetTime,
      stats,
      logEntries,
      theme,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  }, [mode, timeLeft, isRunning, targetTime, stats, logEntries, theme]);

  const generateEntryId = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const handleAddEntry = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    const entry = {
      id: generateEntryId(),
      text: trimmed,
      mode,
      minutes: MODES[mode].duration / 60,
      timestamp: new Date().toISOString(),
    };
    setLogEntries((prev) => [entry, ...prev].slice(0, MAX_LOG_ENTRIES));
    return true;
  };

  const ensureNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const handleToggle = () => {
    if (isRunning) {
      const remaining = Math.max(0, Math.round((targetTime - Date.now()) / 1000));
      setTimeLeft(remaining);
      setIsRunning(false);
      setTargetTime(null);
      return;
    }

    const nextTime = timeLeft === 0 ? activeDuration : timeLeft;
    const newTarget = Date.now() + nextTime * 1000;

    setTimeLeft(nextTime);
    setTargetTime(newTarget);
    setIsRunning(true);
    ensureNotificationPermission();
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTargetTime(null);
    setTimeLeft(activeDuration);
    setAlertMessage('');
  };

  const handleModeChange = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    setIsRunning(false);
    setTargetTime(null);
    setTimeLeft(MODES[nextMode].duration);
    setAlertMessage('');
  };

  const handleThemeChange = (nextTheme) => {
    if (!THEMES[nextTheme]) return;
    setTheme(nextTheme);
  };

  return (
    <div className="app-shell">
      <Header />
      <main className="workspace">
        <ThemeSwitcher
          themes={THEMES}
          currentTheme={theme}
          onSelect={handleThemeChange}
        />
        <ModeSelector
          modes={MODES}
          currentMode={mode}
          onSelect={handleModeChange}
        />
        <section className="focus-card">
          <Timer
            label={MODES[mode].label}
            formattedTime={formattedTime}
            progress={progress}
            isRunning={isRunning}
          />
          <Controls
            isRunning={isRunning}
            onToggle={handleToggle}
            onReset={handleReset}
          />
          {alertMessage && <p className="alert-banner">{alertMessage}</p>}
        </section>
        <section className="insights-grid">
          <SessionStats stats={stats} />
          <LogBook
            entries={logEntries}
            onAddEntry={handleAddEntry}
            currentMode={mode}
            modes={MODES}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
