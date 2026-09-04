import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Check, Copy } from 'lucide-react';
import { useMotionPreference } from './motion-preference';
import { AnimatedText, ContactButton, FadeIn, Image, Magnet, Modal } from './components';
import { aboutText, assets, profile, projects, services, type Project } from './data';

function HeroSection({ contact }: { contact: () => void }) {
  return <section className="hero" aria-label="Introduction" id="top">
    <FadeIn y={-20} className="relative z-20"><nav className="hero-nav" aria-label="Main navigation">
      <a href="#about">About</a><a href="#services">Price</a><a href="#projects">Projects</a><button onClick={contact}>Contact</button>
    </nav></FadeIn>
    <div className="heading-clip"><FadeIn delay={.15} y={40}><h1 className="hero-heading hero-title">Hi, i&apos;m {profile.name}</h1></FadeIn></div>
    <div className="hero-portrait"><FadeIn delay={.6} y={30}><Magnet><Image src={assets.portrait} alt="Jack, 3D creator" className="portrait-image" eager /></Magnet></FadeIn></div>
    <div className="hero-bottom"><FadeIn delay={.35} y={20}><p>a 3d creator driven by crafting striking and unforgettable projects</p></FadeIn><FadeIn delay={.5} y={20}><ContactButton onClick={contact} /></FadeIn></div>
    <a href="#work-reel" className="scroll-cue" aria-label="Scroll to work reel"><ArrowDown size={16} /></a>
  </section>;
}

function MarqueeSection() {
  const ref = useRef<HTMLElement>(null);
  const first = useRef<HTMLDivElement>(null);
  const second = useRef<HTMLDivElement>(null);
  const { reduced } = useMotionPreference();
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!ref.current || !first.current || !second.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (window.innerHeight - rect.top) * .3;
      const loopWidth = first.current.scrollWidth / 3;
      first.current.style.transform = `translateX(${-loopWidth + offset - 200}px)`;
      second.current.style.transform = `translateX(${-(offset - 200) - second.current.scrollWidth / 3}px)`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
    return () => { window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule); cancelAnimationFrame(frame); };
  }, [reduced]);
  const row = (items: string[], rowIndex: number) => Array.from({ length: 3 }, (_, copy) => items.map((src, index) => <div className="marquee-tile" key={`${copy}-${index}`} aria-hidden={copy > 0 || undefined}><Image src={src} alt={copy > 0 ? '' : `Motion design inspiration ${rowIndex * 11 + index + 1}`} /></div>));
  return <section ref={ref} id="work-reel" className="marquee-section" aria-label="Motion design inspiration reel"><div ref={first} className="marquee-row">{row(assets.marquee.slice(0, 11), 0)}</div><div ref={second} className="marquee-row">{row(assets.marquee.slice(11), 1)}</div></section>;
}

function AboutSection({ contact }: { contact: () => void }) {
  return <section id="about" className="about-section">
    {assets.decorations.map((src, i) => <FadeIn key={src} className={`decoration decoration-${i}`} delay={[.1, .25, .15, .3][i]} x={i < 2 ? -80 : 80} y={0} duration={.9}><Image src={src} alt="" /></FadeIn>)}
    <div className="about-content"><FadeIn y={40}><h2 className="hero-heading section-heading">About me</h2></FadeIn><AnimatedText text={aboutText} /><FadeIn><ContactButton onClick={contact} /></FadeIn></div>
  </section>;
}

function ServicesSection() {
  return <section id="services" className="services-section"><FadeIn><h2 className="section-heading">Services</h2></FadeIn><div className="services-list">{services.map((service, i) => <FadeIn key={service.name} delay={i * .1}><article className="service-row"><span className="service-number">0{i + 1}</span><div><h3>{service.name}</h3><p>{service.description}</p></div></article></FadeIn>)}</div><p className="pricing-note">Every project is unique. Get in touch for a tailored quote. <ArrowUpRight size={16} aria-hidden="true" /></p></section>;
}

function ProjectCard({ project, index, progress, onOpen }: { project: Project; index: number; progress: MotionValue<number>; onOpen: (project: Project) => void }) {
  const { reduced } = useMotionPreference();
  const scale = useTransform(progress, [index / projects.length, 1], [1, 1 - (projects.length - 1 - index) * .03]);
  return <div className="project-slot" style={{ top: `calc(var(--stack-top) + ${index * 28}px)` }}><motion.article className="project-card" style={{ scale: reduced ? 1 : scale }}>
    <div className="project-card-header"><span className="project-number">0{index + 1}</span><div className="project-title"><p>{project.category}</p><h3>{project.name}</h3></div>{project.url ? <a className="live-button" href={project.url} target="_blank" rel="noopener noreferrer">Live Project <ArrowUpRight size={18} aria-hidden="true" /></a> : <button className="live-button" onClick={() => onOpen(project)} aria-label={`Live Project: preview ${project.name}`}>Live Project <ArrowUpRight size={18} aria-hidden="true" /></button>}</div>
    <div className="project-gallery"><div className="project-gallery-left"><Image src={project.images[0]} alt={`${project.name} — detail view`} /><Image src={project.images[1]} alt={`${project.name} — visual study`} /></div><Image src={project.images[2]} alt={`${project.name} — main artwork`} className="project-main-image" /></div>
  </motion.article></div>;
}
function ProjectsSection({ onOpen }: { onOpen: (project: Project) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return <section id="projects" className="projects-section"><FadeIn><h2 className="hero-heading section-heading">Project</h2></FadeIn><div className="project-stack" ref={ref}>{projects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} progress={scrollYProgress} onOpen={onOpen} />)}</div></section>;
}

function ContactForm() {
  const [copied, setCopied] = useState(false);
  const [brief, setBrief] = useState('');
  const [error, setError] = useState('');
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCopied(false); setError('');
    const data = new FormData(event.currentTarget);
    const message = `Hi ${profile.name},\n\nI'm ${data.get('name')} (${data.get('email')}).\nI'm interested in ${data.get('service')}.\n\n${data.get('message')}`;
    if (profile.email) { window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('New creative project')}&body=${encodeURIComponent(message)}`; return; }
    setBrief(message);
    try { await navigator.clipboard.writeText(message); setCopied(true); } catch { setError('Your brief is ready below. Select the text to copy it.'); }
  };
  return <form onSubmit={submit} className="contact-form" onChange={() => { setCopied(false); setBrief(''); }}><p>Have something in mind? Let’s give it a new dimension.</p><div className="form-grid"><label>Your name<input name="name" autoComplete="name" placeholder="Alex" required maxLength={100} /></label><label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@company.com" required /></label></div><label>What do you need?<select name="service">{services.map(service => <option key={service.name}>{service.name}</option>)}<option>A little of everything</option></select></label><label>Tell me about your project<textarea name="message" rows={4} placeholder="The idea, the ambition, the timeline…" required maxLength={5000} /></label><button type="submit" className="contact-button">{profile.email ? <>Open email <ArrowUpRight size={18} /></> : copied ? <>Brief copied <Check size={18} /></> : <>Copy project brief <Copy size={18} /></>}</button><p className="form-hint" role="status">{error || (copied ? 'Copied to your clipboard. Your brief is ready to share.' : profile.email ? 'Your email app will open with your project details.' : 'Create a project brief you can copy and share. This form does not send a message.')}</p>{brief && <label>Your project brief<textarea readOnly value={brief} rows={5} onFocus={event => event.currentTarget.select()} /></label>}</form>;
}

export default function App() {
  const { reduced, toggle } = useMotionPreference();
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const contact = () => setContactOpen(true);
  return <><a href="#about" className="skip-link">Skip to content</a><main className="site-wrapper"><HeroSection contact={contact} /><MarqueeSection /><AboutSection contact={contact} /><ServicesSection /><ProjectsSection onOpen={setSelectedProject} /><footer id="contact" className="site-footer"><div><span className="eyebrow">Have a project in mind?</span><button className="footer-cta" onClick={contact}>Let’s talk <ArrowUpRight aria-hidden="true" /></button></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {profile.name}. 3D Creator.</span><button type="button" className="motion-toggle" onClick={toggle} aria-pressed={!reduced} aria-label="Enable animations">Motion {reduced ? 'off' : 'on'}</button><a href="#top">Back to top ↑</a></div></footer></main><AnimatePresence>{contactOpen && <Modal key="contact" title="Let's create together." onClose={() => setContactOpen(false)}><ContactForm /></Modal>}{selectedProject && <Modal key="project" title={selectedProject.name} onClose={() => setSelectedProject(null)}><p className="preview-caption">Project preview · {selectedProject.discipline}</p><div className="preview-gallery">{selectedProject.images.map((src, i) => <Image key={src} src={src} alt={`${selectedProject.name} — artwork ${i + 1}`} eager />)}</div></Modal>}</AnimatePresence></>;
}

