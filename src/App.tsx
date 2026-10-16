import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Check, Copy } from 'lucide-react';
import { useMotionPreference } from './motion-preference';
import { AnimatedText, ContactButton, FadeIn, Image, Magnet, Modal } from './components';
import { aboutText, assets, heroCharacter, heroHand, profile, projects, reelVideos, services, type Project } from './data';

function HeroSection({ contact }: { contact: () => void }) {
  const heroTitle = 'AI VISUALS';
  return <section className="hero" aria-label="Introduction" id="top">
    <FadeIn y={-20} className="relative z-20"><nav className="hero-nav" aria-label="Main navigation">
      <a href="#about">ABOUT</a><a href="#projects">WORKS</a><a href="#work-reel">VIDEO REELS</a><button onClick={contact}>CONTACT</button>
    </nav></FadeIn>
    <div className="heading-clip"><FadeIn delay={.15} y={40}><h1 className="hero-heading hero-title" aria-label={heroTitle}>{[...heroTitle].map((character, index) => <span key={`${character}-${index}`} aria-hidden="true" className={character === ' ' ? 'hero-title-space' : 'hero-title-letter'}>{character === ' ' ? '\u00A0' : character}</span>)}</h1></FadeIn></div>
    <FadeIn className="hero-hand" delay={.5} x={60} y={20} duration={1}><Image src={heroHand} alt="" eager /></FadeIn>
    <div className="hero-portrait"><FadeIn delay={.6} y={30}><Magnet maxYUp={130} maxYDown={0}><Image src={heroCharacter} alt="AI visual character" className="character-image" eager /></Magnet></FadeIn></div>
    <div className="hero-bottom"><FadeIn delay={.35} y={20}><p className="hero-tagline"><span>AN AI VIDEO CREATOR DRIVEN BY</span><span>CRAFTING VIBRANT AND</span><span>IMPRESSIVE MOTION VISUALS</span></p></FadeIn><FadeIn delay={.5} y={20}><ContactButton onClick={contact} /></FadeIn></div>
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
  const row = (items: string[], rowIndex: number) => Array.from({ length: 3 }, (_, copy) => items.map((src, index) => <div className="marquee-tile" key={`${copy}-${index}`} aria-hidden={copy > 0 || undefined}><ReelVideo src={src} label={`AI motion video ${rowIndex * 3 + index + 1}`} hidden={copy > 0} /></div>));
  return <section ref={ref} id="work-reel" className="marquee-section" aria-label="AI motion video reel"><div ref={first} className="marquee-row">{row(reelVideos.slice(0, 3), 0)}</div><div ref={second} className="marquee-row">{row(reelVideos.slice(3), 1)}</div></section>;
}

function ReelVideo({ src, label, hidden }: { src: string; label: string; hidden: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void video.play().catch(() => undefined);
      else video.pause();
    }, { rootMargin: '160px' });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <video ref={ref} src={src} muted loop playsInline preload="metadata" controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture onContextMenu={event => event.preventDefault()} tabIndex={-1} aria-label={hidden ? undefined : label} aria-hidden={hidden || undefined} />;
}

function AboutSection({ contact }: { contact: () => void }) {
  return <section id="about" className="about-section">
    {assets.decorations.map((src, i) => <FadeIn key={src} className={`decoration decoration-${i}`} delay={[.1, .25, .15, .3][i]} x={i < 2 ? -80 : 80} y={0} duration={.9}><Image src={src} alt="" /></FadeIn>)}
    <div className="about-content"><FadeIn y={40}><h2 className="hero-heading section-heading">About me</h2></FadeIn><AnimatedText text={aboutText} /><FadeIn><ContactButton onClick={contact} /></FadeIn></div>
  </section>;
}

function ServicesSection() {
  return <section id="services" className="services-section"><FadeIn><h2 className="section-heading">AI影像作品</h2></FadeIn><div className="services-list">{services.map((service, i) => <FadeIn key={service.name} delay={i * .1}><article className="service-row"><span className="service-number">0{i + 1}</span><div><h3>{service.name}</h3><p>{service.description}</p></div></article></FadeIn>)}</div><p className="pricing-note">所有作品皆为原创、独一无二，期待与您沟通。 <ArrowUpRight size={16} aria-hidden="true" /></p></section>;
}

function ProjectCard({ project, index, progress, onOpen }: { project: Project; index: number; progress: MotionValue<number>; onOpen: (project: Project) => void }) {
  const { reduced } = useMotionPreference();
  const scale = useTransform(progress, [index / projects.length, 1], [1, 1 - (projects.length - 1 - index) * .03]);
  const artwork = (src: string, label: string, className = '') => src ? <Image src={src} alt={`${project.name} — ${label}`} className={className} /> : <div role="img" aria-label={`${project.name} — ${label} placeholder`} className={`project-placeholder ${className}`} />;
  return <div className="project-slot" style={{ top: `calc(var(--stack-top) + ${index * 28}px)` }}><motion.article className="project-card" style={{ scale: reduced ? 1 : scale }}>
    <div className="project-card-header"><span className="project-number">0{index + 1}</span><div className="project-title"><p>{project.category}</p><h3>{project.name}</h3></div>{project.url ? <a className="live-button" href={project.url} target="_blank" rel="noopener noreferrer">查看作品 <ArrowUpRight size={18} aria-hidden="true" /></a> : <button className="live-button" onClick={() => onOpen(project)} aria-label={`查看作品：${project.name}`}>查看作品 <ArrowUpRight size={18} aria-hidden="true" /></button>}</div>
    {project.video ? <div className={`project-gallery project-gallery-media-pair project-gallery-${index + 1}`}><div className="project-gallery-left"><div className="project-media-frame project-media-poster"><Image src={project.images[0]} alt={`${project.name} — poster`} /></div>{project.audio ? <div className="vinyl-panel" role="img" aria-label={`${project.name} — rotating vinyl record`}><div className="vinyl-record"><span>MV</span></div></div> : <div className="project-media-frame project-media-product"><Image src={project.images[1]} alt={`${project.name} — product`} /></div>}</div><SilentPreview src={project.previewVideo ?? project.video} poster={project.videoPoster} pauseMs={project.previewPause} label={`${project.name} — ten-second silent preview`} /></div> : <div className="project-gallery"><div className="project-gallery-left">{artwork(project.images[0], 'detail view')}{artwork(project.images[1], 'visual study')}</div>{artwork(project.images[2], 'main artwork', 'project-main-image')}</div>}
  </motion.article></div>;
}

function SilentPreview({ src, poster, pauseMs = 0, label }: { src: string; poster?: string; pauseMs?: number; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const restartTimer = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  const playIfVisible = () => {
    const video = videoRef.current;
    if (!video || !visibleRef.current || document.visibilityState !== 'visible') return;
    void video.play().catch(() => setReady(false));
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const recover = () => {
      if (!visibleRef.current || document.visibilityState !== 'visible') {
        video.pause();
        return;
      }
      if (video.ended) video.currentTime = 0;
      if (video.readyState === 0) video.load();
      void video.play().catch(() => {
        setReady(false);
        video.load();
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      recover();
    }, { threshold: .08, rootMargin: '120px' });
    const handlePageShow = () => recover();
    observer.observe(video);
    document.addEventListener('visibilitychange', recover);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', recover);
      window.removeEventListener('pageshow', handlePageShow);
      if (restartTimer.current !== null) window.clearTimeout(restartTimer.current);
    };
  }, [src]);

  const restart = () => {
    if (!pauseMs) return;
    if (restartTimer.current !== null) window.clearTimeout(restartTimer.current);
    restartTimer.current = window.setTimeout(() => {
      const video = videoRef.current;
      if (!video?.isConnected) return;
      video.currentTime = 0;
      playIfVisible();
    }, pauseMs);
  };

  const recoverFromPause = () => {
    const video = videoRef.current;
    if (!video || video.ended || !visibleRef.current || document.visibilityState !== 'visible') return;
    window.setTimeout(playIfVisible, 120);
  };

  return <div className="project-main-media">
    {poster && <img className="project-video-poster" src={poster} alt="" aria-hidden="true" />}
    <video ref={videoRef} className={`project-main-video${ready ? ' is-ready' : ''}`} src={src} poster={poster} muted loop={!pauseMs} playsInline preload="metadata" controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture onContextMenu={event => event.preventDefault()} onLoadedData={() => setReady(true)} onPlaying={() => setReady(true)} onWaiting={() => setReady(false)} onStalled={() => setReady(false)} onEmptied={() => setReady(false)} onError={() => setReady(false)} onPause={recoverFromPause} onEnded={restart} aria-label={label} />
  </div>;
}
function ProjectsSection({ onOpen }: { onOpen: (project: Project) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  return <section id="projects" className="projects-section"><FadeIn><h2 className="hero-heading section-heading">WORKS</h2></FadeIn><div className="project-stack" ref={ref}>{projects.map((project, index) => <ProjectCard key={project.name} project={project} index={index} progress={scrollYProgress} onOpen={onOpen} />)}</div></section>;
}

function AboutProfile() {
  const [copied, setCopied] = useState(false);
  const experience = `面试官您好，我是知圆子，本科主修视觉传达艺术设计。
个人优势是掌握AIGC视频创作能力，不只追求视觉美观，更会结合业务，优先考虑信息表达与用户视觉体验。
之前在电商公司的实习中，我接触过商品详情页、直播活动以及店铺视觉相关的工作，需要根据不同商品的卖点去整理信息、制作素材，同时配合运营完成日常活动。在校参与过品牌视觉、文创 IP、包装和动态视觉等不同类型的项目，比如湖北省戏曲艺术剧院品牌视觉项目、新加坡限定春节礼盒包装设计以及武汉红色文化绘本 IP 项目。不同项目做下来，我比较习惯先梳理需求和视觉方向，再一步步完成后面的设计落地。
同时我也主动学习AIGC工具并应用到视频与动态视觉设计中，借助新技术拓展创作形式，提升内容产出效率。
希望能加入拥有完整项目流程的团队，在实战中积累商业设计经验，发挥自身设计能力。`;
  const bio = `Name：${profile.name}\nContact：${profile.email}\nEducation & Major：视觉传达设计本科\n\n${experience}`;
  const copyBio = async () => {
    try {
      await navigator.clipboard.writeText(bio);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };
  return <section className="contact-form" aria-label="Personal information"><p>I craft AI motion videos, bringing visuals to life.</p><div className="form-grid"><label>Name<input value={profile.name} readOnly /></label><label>Contact<a className="profile-field" href={`mailto:${profile.email}`}>{profile.email}</a></label></div><label>Education &amp; Major<input value="视觉传达设计本科" readOnly /></label><div className="bio-group"><span id="bio-label">My experience, works &amp; creative philosophy…</span><div className="profile-field bio-text" role="textbox" aria-readonly="true" aria-labelledby="bio-label">{experience}</div></div><button type="button" className="contact-button" onClick={copyBio}>{copied ? <>已复制 <Check size={18} /></> : <>复制简介 <Copy size={18} /></>}</button><p className="form-hint" role="status">{copied ? 'Bio copied to your clipboard.' : 'Generate a bio you can copy and share.'}</p></section>;
}

function ProjectPreview({ project }: { project: Project }) {
  const artwork = (src: string, index: number) => src ? <Image key={`${src}-${index}`} src={src} alt={`${project.name} — artwork ${index + 1}`} eager /> : <div key={index} role="img" aria-label={`${project.name} — artwork ${index + 1} placeholder`} className="project-placeholder" />;
  return <><p className="preview-caption">Project preview · {project.discipline}</p><div className="preview-gallery">{project.video ? <>{artwork(project.images[0], 0)}<video className="preview-video" src={project.video} poster={project.videoPoster} controls playsInline preload="metadata" controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture onContextMenu={event => event.preventDefault()} aria-label={`${project.name} — video preview`} />{project.images.slice(1).map((src, index) => artwork(src, index + 1))}{project.audio && <div className="preview-audio"><span>《逆光上场》完整音频</span><audio src={project.audio} controls preload="metadata" controlsList="nodownload noplaybackrate noremoteplayback" onContextMenu={event => event.preventDefault()} aria-label={`${project.name} — full audio`} /></div>}</> : project.images.map(artwork)}</div></>;
}

export default function App() {
  const { reduced, toggle } = useMotionPreference();
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const contact = () => setContactOpen(true);
  useEffect(() => {
    const stopMediaSaveMenu = (event: MouseEvent) => {
      if ((event.target as HTMLElement | null)?.closest('img, video, audio')) event.preventDefault();
    };
    const stopMediaDrag = (event: DragEvent) => {
      if ((event.target as HTMLElement | null)?.closest('img, video')) event.preventDefault();
    };
    document.addEventListener('contextmenu', stopMediaSaveMenu);
    document.addEventListener('dragstart', stopMediaDrag);
    return () => {
      document.removeEventListener('contextmenu', stopMediaSaveMenu);
      document.removeEventListener('dragstart', stopMediaDrag);
    };
  }, []);
  return <><a href="#about" className="skip-link">Skip to content</a><main className="site-wrapper"><HeroSection contact={contact} /><MarqueeSection /><AboutSection contact={contact} /><ServicesSection /><ProjectsSection onOpen={setSelectedProject} /><footer id="contact" className="site-footer"><div><span className="eyebrow">期待获得面试机会</span><button className="footer-cta" onClick={contact}>欢迎与我交流 <ArrowUpRight aria-hidden="true" /></button></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {profile.name}.ai视频作品板块</span><button type="button" className="motion-toggle" onClick={toggle} aria-pressed={!reduced} aria-label="Enable animations">Motion {reduced ? 'off' : 'on'}</button><a href="#top">Back to top ↑</a></div></footer></main><AnimatePresence>{contactOpen && <Modal key="contact" title="About Me" onClose={() => setContactOpen(false)}><AboutProfile /></Modal>}{selectedProject && <Modal key="project" title={selectedProject.name} onClose={() => setSelectedProject(null)}><ProjectPreview project={selectedProject} /></Modal>}</AnimatePresence></>;
}

