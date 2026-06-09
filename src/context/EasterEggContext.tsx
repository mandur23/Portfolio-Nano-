import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

const LOGO_CLICK_TARGET = 5;
const LOGO_CLICK_WINDOW_MS = 2000;
const TOAST_DURATION_MS = 3500;

type ToastMessage = { id: number; text: string; variant: 'aris' | 'wip' } | null;

interface EasterEggContextValue {
  arisMode: boolean;
  wipUnlocked: boolean;
  handleLogoClick: () => void;
}

const EasterEggContext = createContext<EasterEggContextValue | null>(null);

function logConsoleHints() {
  console.log(
    '%c🔍 BeaconGuardian',
    'color: #3b82f6; font-weight: bold; font-size: 14px;',
    '개발자 도구를 연 당신, 환영합니다. (실제 모니터링은 아닙니다)'
  );
  console.log(
    '%c힌트 1',
    'color: #a855f7; font-weight: bold;',
    '↑ ↑ ↓ ↓ ← → ← → B A — 무언가 바뀔지도?'
  );
  console.log(
    '%c힌트 2',
    'color: #f59e0b; font-weight: bold;',
    '왼쪽 위 "portfolio" 로고를 5번 연속 클릭해 보세요'
  );
}

export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  const [arisMode, setArisMode] = useState(false);
  const [wipUnlocked, setWipUnlocked] = useState(false);
  const [toast, setToast] = useState<ToastMessage>(null);

  const konamiIndexRef = useRef(0);
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string, variant: 'aris' | 'wip') => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const id = Date.now();
    setToast({ id, text, variant });
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  const handleLogoClick = useCallback(() => {
    if (logoClickTimerRef.current) {
      clearTimeout(logoClickTimerRef.current);
    }

    logoClickCountRef.current += 1;

    if (logoClickCountRef.current >= LOGO_CLICK_TARGET) {
      logoClickCountRef.current = 0;
      if (!wipUnlocked) {
        setWipUnlocked(true);
        showToast('비밀 프로젝트가 공개되었습니다 🚧', 'wip');
        window.setTimeout(() => {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
      return;
    }

    logoClickTimerRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, LOGO_CLICK_WINDOW_MS);
  }, [showToast, wipUnlocked]);

  useEffect(() => {
    logConsoleHints();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = KONAMI_SEQUENCE[konamiIndexRef.current];

      if (key === expected) {
        konamiIndexRef.current += 1;
        if (konamiIndexRef.current === KONAMI_SEQUENCE.length) {
          konamiIndexRef.current = 0;
          setArisMode(true);
          showToast('안녕, 주인님 🎵', 'aris');
        }
        return;
      }

      konamiIndexRef.current = key === KONAMI_SEQUENCE[0] ? 1 : 0;
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showToast]);

  useEffect(() => {
    return () => {
      if (logoClickTimerRef.current) clearTimeout(logoClickTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <EasterEggContext.Provider value={{ arisMode, wipUnlocked, handleLogoClick }}>
      {children}
      {toast && (
        <div
          key={toast.id}
          className={`easter-egg-toast easter-egg-toast--${toast.variant}`}
          role="status"
          aria-live="polite"
        >
          {toast.text}
        </div>
      )}
    </EasterEggContext.Provider>
  );
}

export function useEasterEggs() {
  const context = useContext(EasterEggContext);
  if (!context) {
    throw new Error('useEasterEggs must be used within EasterEggProvider');
  }
  return context;
}
