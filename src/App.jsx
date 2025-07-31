import { useState, useEffect, useRef } from 'react';
import './App.css'; // This import is kept for any base styles you have
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareGithub, faSquareLinkedin } from '@fortawesome/free-brands-svg-icons';

// --- SVG Icon Components ---
const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
);
const DatabaseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
);
const CogsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1">
        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
);
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

// --- Helper Hooks & Components ---
const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, [ref, options]);
  return [ref, isVisible];
};

const AnimatedSection = ({ children, className, ...props }) => {
    const [ref, isVisible] = useOnScreen({ threshold: 0.05 });
    return (
        <section ref={ref} className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${className}`} {...props}>
            {children}
        </section>
    );
};

const SectionHeader = ({ title, description }) => (
    <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] tracking-tight">{title}</h2>
        <p className="mt-2 text-md md:text-lg text-[var(--color-text-secondary)]">{description}</p>
    </div>
);

// --- Premium Project Card Component ---
const ProjectCard = ({ title, description, tags, link }) => {
    const cardRef = useRef(null);
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left - width / 2;
        const y = e.clientY - top - height / 2;
        const rotateY = (x / width) * 15;
        const rotateX = -(y / height) * 15;
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };
    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        cardRef.current.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };
    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 transition-transform duration-300 ease-out will-change-transform relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-emerald-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <a href={link} target="_blank" rel="noopener noreferrer" className="relative z-10">
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] group-hover:text-blue-500 transition-colors duration-300">{title}</h3>
                <p className="mt-3 text-[var(--color-text-secondary)] leading-relaxed">{description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag, i) => (<span key={i} className="text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-tertiary)] px-3 py-1 rounded-full">{tag}</span>))}
                </div>
                <div className="mt-6">
                    <span className="inline-flex items-center gap-2 font-semibold text-blue-600 dark:text-blue-500">
                        View Project <ArrowRightIcon />
                    </span>
                </div>
            </a>
        </div>
    );
};


// --- Main App Component ---
function App() {
  const [showNav, setShowNav] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  
  const projects = [
    { title: 'IoT-Based Smart Home Automation', description: 'A system using microcontrollers and sensors to control home appliances remotely via a web dashboard.', tags: ['C++', 'IoT', 'React', 'Firebase'], link: 'https://github.com/Shriramtantry' },
    { title: 'Real-Time Audio Visualizer', description: 'A web application that captures microphone input and generates dynamic, real-time visual patterns.', tags: ['JavaScript', 'HTML5 Canvas', 'Web Audio API'], link: 'https://github.com/Shriramtantry' },
    { title: 'Personal Portfolio Website', description: 'The very site you are on now. A clean, single-file React application focusing on elegant design and animations.', tags: ['React', 'Tailwind CSS', 'UI/UX'], link: '#' }
  ];
  const skills = {
    "Languages": [{ name: 'C/C++', icon: <CodeIcon /> }, { name: 'Python', icon: <CodeIcon /> }, { name: 'JavaScript', icon: <CodeIcon /> }],
    "Web & Databases": [{ name: 'React', icon: <CogsIcon /> }, { name: 'Node.js', icon: <CogsIcon /> }, { name: 'HTML/CSS', icon: <CogsIcon /> }, { name: 'PostgreSQL', icon: <DatabaseIcon /> }],
    "Electronics & Tools": [{ name: 'IoT', icon: <CogsIcon /> }, { name: 'Embedded Systems', icon: <CogsIcon /> }, { name: 'Git & GitHub', icon: <CogsIcon /> }, { name: 'Docker', icon: <CogsIcon /> }]
  };
  const experience = [
      { role: 'B.E, Electronics & Communication', company: 'Your University Name', period: '2021 - Present', description: 'Building a strong foundation in electronics, signal processing, and communication systems, while also pursuing a passion for software development and web technologies.' },
      { role: 'Embedded Systems Intern', company: 'Hypothetical Tech Inc.', period: 'Summer 2024', description: 'Developed firmware for a sensor data acquisition module, improving data accuracy by 15%. Worked with a team to integrate hardware components with a cloud backend.' }
  ];

  const toggleTheme = () => {
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleScroll = () => setShowNav(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [theme]);
  
  useEffect(() => {
    const handleMouseMove = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navLinks = ['About', 'Experience', 'Skills', 'Projects', 'Contact'];
  const premiumCSS = `
    :root {
        --color-bg-primary: #f8fafc;
        --color-bg-secondary: #ffffff;
        --color-bg-tertiary: #f1f5f9;
        --color-text-primary: #1e293b;
        --color-text-secondary: #475569;
        --color-border: #e2e8f0;
        --color-nav-bg: rgba(255, 255, 255, 0.9);
        --color-brand: #2563eb;
        --color-brand-hover: #1d4ed8;
    }
    [data-theme='dark'] {
        --color-bg-primary: #0f172a;
        --color-bg-secondary: #1e293b;
        --color-bg-tertiary: #334155;
        --color-text-primary: #f1f5f9;
        --color-text-secondary: #94a3b8;
        --color-border: #334155;
        --color-nav-bg: rgba(15, 23, 42, 0.9);
        --color-brand: #3b82f6;
        --color-brand-hover: #60a5fa;
    }
    body {
        background-color: var(--color-bg-primary);
        color: var(--color-text-primary);
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    .mouse-cursor {
        position: fixed;
        left: 0;
        top: 0;
        pointer-events: none;
        border-radius: 50%;
        background-color: var(--color-brand);
        opacity: 0.5;
        transition: transform 0.15s ease-out, width 0.3s ease, height 0.3s ease;
        will-change: transform, width, height;
        z-index: 10000;
        mix-blend-mode: exclusion;
    }
    @keyframes slide-in-reveal {
      0% { transform: translateY(110%); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    .hero-text-animation {
        display: block;
        animation: slide-in-reveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .skill-item {
        position: relative;
    }
    .skill-item:hover::before {
        opacity: 1;
    }
    .skill-item::before {
        content: '';
        position: absolute;
        inset: -1px;
        border-radius: 0.75rem; /* 12px */
        background: conic-gradient(from 90deg at 50% 50%, #3b82f6, #10b981, #ef4444, #3b82f6);
        animation: rotation 3s linear infinite;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: -1;
    }
    @keyframes rotation {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
  `;

  return (
    <div data-theme={theme}>
      <style>{premiumCSS}</style>
      <div 
        className="mouse-cursor"
        style={{
          transform: `translate3d(calc(${mousePosition.x}px - 50%), calc(${mousePosition.y}px - 50%), 0)`,
          width: '24px',
          height: '24px'
        }}
      />

      <nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${showNav ? 'py-3 shadow-lg backdrop-blur-xl' : 'py-6'}`}
        style={{ backgroundColor: showNav ? 'var(--color-nav-bg)' : 'transparent' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
                <a href="#" className="text-2xl font-bold text-[var(--color-text-primary)]">Shriram Tantry.</a>
                <div className="hidden md:flex items-center gap-x-1">
                    {navLinks.map(item => (
                        <a key={item} href={`#${item.toLowerCase()}`} className="px-4 py-2 rounded-md text-[var(--color-text-secondary)] font-medium hover:bg-[var(--color-bg-tertiary)] hover:text-blue-500 transition-all duration-200">
                            {item}
                        </a>
                    ))}
                </div>
                <div className="flex items-center">
                    <button onClick={toggleTheme} className="p-2 mr-2 rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-blue-500 transition-colors" aria-label="Toggle Theme">
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                    <div className="hidden md:flex items-center gap-x-4 text-2xl text-[var(--color-text-secondary)]">
                        <a href="https://github.com/Shriramtantry" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors" aria-label="GitHub"><FontAwesomeIcon icon={faSquareGithub} /></a>
                        <a href="https://www.linkedin.com/in/shriram-tantry-8402a424a/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors" aria-label="LinkedIn"><FontAwesomeIcon icon={faSquareLinkedin} /></a>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(true)} className="p-2 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </nav>
      
      <div className={`fixed inset-0 z-50 p-4 transition-transform duration-300 md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{backgroundColor: 'var(--color-bg-secondary)'}}>
          <div className="flex justify-end">
              <button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-md text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
          </div>
          <div className="flex flex-col items-center justify-center h-full -mt-12">
              {navLinks.map(item => (
                  <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="py-4 text-2xl font-semibold text-[var(--color-text-primary)] hover:text-blue-500">
                      {item}
                  </a>
              ))}
          </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="min-h-screen flex flex-col items-start justify-center relative overflow-hidden">
            <div className="animated-gradient-bg"></div>
            <div className="relative z-10">
                <p className="hero-text-animation text-[var(--color-text-secondary)]" style={{ animationDelay: '100ms' }}>Hello, my name is</p>
                <h1 className="hero-text-animation text-5xl md:text-7xl font-extrabold text-[var(--color-text-primary)] tracking-tight" style={{ animationDelay: '200ms' }}>
                    Shriram Tantry.
                </h1>
                <h2 className="hero-text-animation mt-4 text-3xl md:text-5xl font-bold text-[var(--color-text-secondary)] tracking-tight" style={{ animationDelay: '300ms' }}>
                    I build bridges between hardware and software.
                </h2>
                <p className="hero-text-animation max-w-2xl mt-6 text-lg text-[var(--color-text-secondary)] leading-relaxed" style={{ animationDelay: '400ms' }}>
                    I'm an Electronics and Communication Engineering student passionate about crafting efficient, user-friendly applications and embedded systems.
                </p>
                <div className="hero-text-animation" style={{ animationDelay: '500ms' }}>
                    <a href="#contact" className="inline-block mt-12 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300">
                        Get In Touch
                    </a>
                </div>
            </div>
        </header>

        <main className="space-y-24 md:space-y-32 py-20">
          <AnimatedSection id="about">
            <SectionHeader title="About Me" description="A brief introduction to my background and passion." />
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 items-center">
              <div className="lg:col-span-3 space-y-4 text-[var(--color-text-secondary)] text-lg leading-relaxed">
                <p>Hello! I'm Shriram, an engineering student with a deep interest in the synergy between electronics and computer science. My journey started with a curiosity for how circuits work, which naturally expanded into programming the logic that controls them.</p>
                <p>I enjoy building things that have a tangible impact, whether it's developing firmware for a microcontroller or creating a responsive front-end for a web application. I am committed to writing clean, maintainable code and am always eager to learn new technologies and solve challenging problems.</p>
              </div>
              <div className="lg:col-span-2">
                <div className="p-8 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] shadow-xl">
                  <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Core Mission</h3>
                  <p className="mt-2 text-[var(--color-text-secondary)]">To create practical, technology-driven solutions by combining the principles of hardware engineering and modern software development.</p>
                  <a href="/Akshara_resume.pdf" download className="inline-block w-full text-center mt-6 px-6 py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors">Download Resume</a>
                </div>
              </div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection id="experience">
            <SectionHeader title="My Experience" description="A timeline of my professional and academic journey." />
            <div className="relative border-l-2 border-[var(--color-border)] pl-8 md:pl-10">
                {experience.map((item, index) => (
                    <div key={index} className="mb-10 ml-4">
                        <div className="absolute w-5 h-5 bg-blue-600 dark:bg-blue-500 rounded-full -left-2.5 border-4 border-[var(--color-bg-secondary)]"></div>
                        <time className="mb-1 text-sm font-normal leading-none text-[var(--color-text-secondary)]">{item.period}</time>
                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mt-1">{item.role}</h3>
                        <p className="text-md font-medium text-[var(--color-text-secondary)]">{item.company}</p>
                        <p className="mt-2 text-base font-normal text-[var(--color-text-secondary)]">{item.description}</p>
                    </div>
                ))}
            </div>
          </AnimatedSection>

          <AnimatedSection id="skills">
            <SectionHeader title="My Toolkit" description="The technologies I use to bring ideas to life." />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(skills).map(([category, skillList]) => (
                    <div key={category} className="bg-[var(--color-bg-secondary)] p-6 rounded-xl border border-[var(--color-border)]">
                        <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{category}</h3>
                        <div className="space-y-3">
                        {skillList.map((skill, i) => (
                            <div key={i} className="skill-item group flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-[var(--color-bg-tertiary)]">
                                {skill.icon}
                                <span className="font-medium text-[var(--color-text-secondary)] group-hover:text-blue-500">{skill.name}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
          </AnimatedSection>
          
          <AnimatedSection id="projects">
            <SectionHeader title="Selected Projects" description="A few things I'm proud to have built." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, i) => (<ProjectCard key={i} {...project} />))}
            </div>
          </AnimatedSection>

          <AnimatedSection id="contact">
            <div className="text-center bg-[var(--color-bg-secondary)] py-16 md:py-20 px-8 rounded-2xl border border-[var(--color-border)] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-24 -left-24 w-72 h-72 bg-[var(--color-bg-tertiary)] rounded-full"></div>
                    <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[var(--color-bg-tertiary)] rounded-full"></div>
                </div>
                <div className="relative z-10">
                    <p className="text-blue-600 dark:text-blue-500 font-semibold">What's Next?</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mt-2">Let's Build Something Amazing</h2>
                    <p className="max-w-2xl mx-auto mt-4 text-[var(--color-text-secondary)]">
                        I'm currently available for freelance work and open to new opportunities. If you have a project in mind or just want to connect, my inbox is always open.
                    </p>
                    <a href="mailto:shreeramtanty4@gmail.com" className="inline-block mt-8 px-10 py-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300">
                        Say Hello
                    </a>
                </div>
            </div>
          </AnimatedSection>
        </main>

        <footer className="text-center py-12 mt-12 md:mt-20 border-t border-[var(--color-border)] text-[var(--color-text-secondary)]">
          <p>Designed & Built by Shriram</p>
          <p className="text-sm mt-1">© 2025. All Rights Reserved.</p>
        </footer>
      </div>
      
      <button 
        onClick={() => window.scrollTo(0, 0)}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full bg-blue-600 dark:bg-blue-500 text-white shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 ${showNav ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        aria-label="Scroll to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
}

export default App;