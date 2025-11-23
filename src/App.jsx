import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import ModeSelector from './components/ModeSelector.jsx';
import Timer from './components/Timer.jsx';
import Controls from './components/Controls.jsx';

const MODES = {
  pomodoro: { label: 'Pomodoro', duration: 25 * 60 },
  shortBreak: { label: 'Kısa Mola', duration: 5 * 60 },
  longBreak: { label: 'Uzun Mola', duration: 15 * 60 },
};

const STORAGE_KEY = 'modern-pomodoro-state';

function App() {
  const [mode, setMode] = useState('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES.pomodoro.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [targetTime, setTargetTime] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');

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

      setMode(storedMode);
      setTimeLeft(nextTimeLeft);
      setIsRunning(nextRunning);
      setTargetTime(nextTarget);
    } catch (error) {
      console.error('State hydration failed:', error);
    }
  }, []);

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
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  }, [mode, timeLeft, isRunning, targetTime]);

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

  return (
    <div className="app-shell">
      <Header />
      <main className="workspace">
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
      </main>
    </div>
  );
}

export default App;
