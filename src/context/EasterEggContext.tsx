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

const TOAST_DURATION_MS = 3500;

type ToastMessage = { id: number; text: string } | null;

interface EasterEggContextValue {
  arisMode: boolean;
  handleLogoClick: (event: React.MouseEvent) => void;
}

const EasterEggContext = createContext<EasterEggContextValue | null>(null);

export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  const [arisMode, setArisMode] = useState(false);
  const [toast, setToast] = useState<ToastMessage>(null);

  const konamiIndexRef = useRef(0);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((text: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const id = Date.now();
    setToast({ id, text });
    toastTimerRef.current = setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  // 로고 5연타 → 위치 관제 페이지 이스터에그는 위치 수집 기능과 함께 제거됨.
  // Header 의 onClick 연결은 유지하되 아무 동작도 하지 않는다.
  const handleLogoClick = useCallback((_event: React.MouseEvent) => {}, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const expected = KONAMI_SEQUENCE[konamiIndexRef.current];

      if (key === expected) {
        konamiIndexRef.current += 1;
        if (konamiIndexRef.current === KONAMI_SEQUENCE.length) {
          konamiIndexRef.current = 0;
          setArisMode(true);
          showToast('안녕, 주인님 🎵');
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
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <EasterEggContext.Provider value={{ arisMode, handleLogoClick }}>
      {children}
      {toast && (
        <div key={toast.id} className="easter-egg-toast easter-egg-toast--aris" role="status">
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
