import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useMotionPreference } from './motion-preference';
import { ArrowUpRight, X } from 'lucide-react';

export function FadeIn({ children, delay = 0, duration = .7, x = 0, y = 30, className = '', as = 'div' }: { children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; className?: string; as?: ElementType }) {
  const { reduced } = useMotionPreference();
  // Cache the generated motion component: its identity must stay stable across renders.
  const [Component] = useState(() => motion.create(as));
  return <Component className={className} initial={reduced ? false : { opacity: 0, x, y }} whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: false, margin: '0px', amount: .1 }} transition={{ duration, delay, ease: [.25, .1, .25, 1] }}>{children}</Component>;
}

export function ContactButton({ onClick }: { onClick: () => void }) {
  return <button type="button" onClick={onClick} className="contact-button">欢迎沟通 <ArrowUpRight size={18} aria-hidden="true" /></button>;
}

export function Magnet({ children, padding = 150, strength = 3, maxX = Infinity, maxYUp = Infinity, maxYDown = Infinity, activeTransition = 'transform 0.3s ease-out', inactiveTransition = 'transform 0.6s ease-in-out' }: { children: ReactNode; padding?: number; strength?: number; maxX?: number; maxYUp?: number; maxYDown?: number; activeTransition?: string; inactiveTransition?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const child = element.firstElementChild as HTMLElement;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    const reset = () => {
      cancelAnimationFrame(frame); frame = 0;
      child.style.transition = inactiveTransition;
      child.style.transform = 'translate3d(0,0,0)';
    };
    if (reduced) { reset(); return; }
    const update = () => {
      frame = 0;
      // Measure the stationary outer box, never the moving image.
      const rect = element.getBoundingClientRect();
      const x = pointerX - rect.left - rect.width / 2;
      const y = pointerY - rect.top - rect.height / 2;
      if (rect.width && rect.height && Math.abs(x) < rect.width / 2 + padding && Math.abs(y) < rect.height / 2 + padding) {
        child.style.transition = activeTransition;
        const translateX = Math.max(-maxX, Math.min(maxX, x / strength));
        const translateY = Math.max(-maxYUp, Math.min(maxYDown, y / strength));
        child.style.transform = `translate3d(${translateX}px,${translateY}px,0)`;
      } else reset();
    };
    const move = (event: MouseEvent) => {
      if ('pointerType' in event && event.pointerType === 'touch') return;
      pointerX = event.clientX; pointerY = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };
    // Some embedded browsers forward mouse events without pointer events.
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('mouseleave', reset);
    window.addEventListener('blur', reset);
    window.addEventListener('scroll', reset, { passive: true });
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('pointermove', move); document.removeEventListener('mouseleave', reset); window.removeEventListener('blur', reset); window.removeEventListener('scroll', reset); reset(); };
  }, [reduced, padding, strength, maxX, maxYUp, maxYDown, activeTransition, inactiveTransition]);
  return <div ref={ref} className="magnet"><div style={{ willChange: 'transform' }}>{children}</div></div>;
}
function Character({ children, progress, start, end }: { children: string; progress: MotionValue<number>; start: number; end: number }) {
  const opacity = useTransform(progress, [start, end], [.2, 1]);
  return <span className="relative"><span className="invisible">{children}</span><motion.span className="character-reveal absolute left-0 top-0" style={{ opacity }}>{children}</motion.span></span>;
}
export function AnimatedText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { reduced } = useMotionPreference();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.8', 'end 0.2'] });
  const revealProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: .001 });
  let position = 0;
  return <p ref={ref} className="about-copy"><span className="sr-only">{text}</span><span aria-hidden="true">{text.split('\n').map((line, lineIndex) => {
    if (lineIndex > 0) position += 1;
    if (reduced) return <span className="about-line" key={lineIndex}>{line}</span>;
    return <span className="about-line" key={lineIndex}>{line.split(' ').map((word, wordIndex) => {
      const start = position; position += word.length + 1;
      return <span key={wordIndex}><span className="inline-block">{[...word].map((char, i) => <Character key={i} progress={revealProgress} start={(start + i) / text.length} end={(start + i + 1) / text.length}>{char}</Character>)}</span>{' '}</span>;
    })}</span>;
  })}</span></p>;
}


export function Image({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  // Keep the image visible independently of load events, React effects and HMR.
  // Entry animations belong to the surrounding FadeIn, not the image resource.
  return !src || failedSrc === src ? <div role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={!alt || undefined} className={`image-fallback ${className}`}><div className="fallback-sculpture" />{alt && <span>{alt}</span>}</div> : <img src={src} alt={alt} className={className} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailedSrc(src)} />;
}
export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotionPreference();
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const focused = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = ref.current!;
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea, [tabindex="0"]')).filter(element => !element.hasAttribute('disabled') && element.getClientRects().length > 0);
    (focusable()[0] || dialog).focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); }
      if (event.key === 'Tab') {
        const items = focusable();
        const first = items[0]; const last = items[items.length - 1];
        if (!first) { event.preventDefault(); dialog.focus(); return; }
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) { event.preventDefault(); first.focus(); }
      }
    };
    const trapFocus = (event: FocusEvent) => { if (!dialog.contains(event.target as Node)) (focusable()[0] || dialog).focus({ preventScroll: true }); };
    document.addEventListener('keydown', keydown);
    document.addEventListener('focusin', trapFocus);
    return () => { document.removeEventListener('keydown', keydown); document.removeEventListener('focusin', trapFocus); document.body.style.overflow = oldOverflow; focused?.focus({ preventScroll: true }); };
  }, []);
  return createPortal(<motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .22 }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <motion.section ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" tabIndex={-1} className="modal" initial={{ opacity: 0, y: reduced ? 0 : 32, scale: reduced ? 1 : .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : .98 }} transition={{ duration: reduced ? 0 : .3, ease: [.22, 1, .36, 1] }}>
      <div className="modal-heading"><h2 id="modal-title">{title}</h2><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X /></button></div>{children}
    </motion.section>
  </motion.div>, document.body);
}



