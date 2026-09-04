import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { MotionConfig } from 'framer-motion';

const MotionPreference = createContext({ reduced: false, toggle: () => {} });

export function MotionProvider({ children }: { children: ReactNode }) {
  // This portfolio showcases motion by default; visitors can explicitly turn it off.
  const [reduced, setReduced] = useState(() => {
    try { return localStorage.getItem('jack-motion') === 'reduced'; } catch { return false; }
  });
  useEffect(() => {
    document.documentElement.dataset.motion = reduced ? 'reduced' : 'full';
    try { localStorage.setItem('jack-motion', reduced ? 'reduced' : 'full'); } catch { /* Storage is optional. */ }
  }, [reduced]);
  return <MotionPreference.Provider value={{ reduced, toggle: () => setReduced(value => !value) }}><MotionConfig reducedMotion={reduced ? 'always' : 'never'}>{children}</MotionConfig></MotionPreference.Provider>;
}

export const useMotionPreference = () => useContext(MotionPreference);
