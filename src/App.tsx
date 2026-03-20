import React, { useState, useEffect, useCallback, useRef } from 'react';
import { LivingNav } from './components/LivingNav';
import { ScrollSection, SectionEyebrow } from './components/ScrollSection';
import { FlipCard } from './components/FlipCard';
import { ChevronDown, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isIdle, setIsIdle] = useState(false);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isAtTop, setIsAtTop] = useState(true);
  const mainRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: "section-1", name: "About Me", pages: [{ id: "landing", label: "Landing" }, { id: "about", label: "About Me" }] },
    { id: "section-2", name: "Experience", pages: [{ id: "work", label: "Work Experience" }, { id: "learned", label: "What I Learned" }, { id: "learned-2", label: "What I Learned II" }] },
    { id: "section-3", name: "Credentials", pages: [{ id: "made", label: "What I Made" }, { id: "certifications", label: "Certifications" }, { id: "recommendations", label: "Recommendations" }] },
    { id: "section-4", name: "Contact Me", pages: [{ id: "contact", label: "Contact Me" }] }
  ];

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
      if (mainRef.current) mainRef.current.scrollTop = 0;
    }
  };

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const goToSection = (index: number) => {
    setCurrentSection(index);
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  useEffect(() => {
    let timeoutId: number;
    const resetTimer = () => {
      setIsIdle(false);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setIsIdle(true), 3000);
    };

    const handleScroll = () => {
      resetTimer();
      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 300);

      if (mainRef.current) {
        setShowScrollIndicator(mainRef.current.scrollTop > window.innerHeight * 0.8);
        setIsAtTop(mainRef.current.scrollTop < 100);
      }
    };

    const currentMain = mainRef.current;
    if (currentMain) {
      currentMain.addEventListener('scroll', handleScroll);
    }
    window.addEventListener('mousemove', resetTimer);
    resetTimer();

    return () => {
      if (currentMain) {
        currentMain.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('mousemove', resetTimer);
    };
  }, []);

  return (
    <main
      ref={mainRef}
      className={`relative h-screen overflow-y-scroll snap-y snap-mandatory selection:bg-black/20 selection:text-black scroll-smooth transition-opacity duration-700 ${isScrolling ? 'opacity-0' : 'opacity-100'}`}
    >
      <LivingNav
        currentSectionIndex={currentSection}
        onSectionChange={goToSection}
        pages={sections[currentSection].pages}
      />

      {/* Persistent Top Navigation Bar */}
      <header className={`fixed top-0 left-0 z-50 w-full px-8 md:px-16 py-6 flex flex-col pointer-events-none transition-all duration-700 ${isScrolling ? 'opacity-0' : 'opacity-100'} ${isAtTop && currentSection === 0 ? 'bg-transparent' : 'bg-base-bg/90 backdrop-blur-md border-b border-black/10'}`}>
        {/* Top Line — only on landing */}
        {isAtTop && currentSection === 0 && (
          <div className="w-full h-[1px] mb-6 bg-white/10" />
        )}

        <div className={`relative flex items-center w-full transition-all duration-700 ${isAtTop && currentSection === 0 ? 'justify-end mt-2' : 'justify-center'}`}>
          {/* Logo - only on landing page, positioned absolutely to not affect centering */}
          <div
            className={`absolute left-0 w-10 h-10 bg-black text-white flex items-center justify-center pointer-events-auto cursor-pointer transition-all duration-500 ${isAtTop && currentSection === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
            onClick={() => goToSection(0)}
          >
            <span className="font-display font-bold text-lg">SA</span>
          </div>

          {/* SA logo shown in non-landing pages, left aligned */}
          <div
            className={`absolute left-0 font-display font-bold text-lg pointer-events-auto cursor-pointer transition-all duration-500 ${!isAtTop || currentSection !== 0 ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => goToSection(0)}
          >
            SA
          </div>

          <div className="flex pointer-events-auto">
            <nav className="hidden md:flex items-center gap-4 lg:gap-6">
              {[
                { label: 'About Me', section: 0 },
                { label: 'Experience', section: 1 },
                { label: 'Credentials', section: 2 },
                { label: 'Contact Me', section: 3 }
              ].map(item => {
                const isActive = currentSection === item.section;
                const isLanding = isAtTop && currentSection === 0;

                return (
                  <button
                    key={item.label}
                    onClick={() => goToSection(item.section)}
                    className={`text-[10px] font-sans font-medium uppercase tracking-widest transition-all duration-500 px-4 py-2 rounded-full ${isActive
                        ? 'bg-black text-white shadow-sm'
                        : isLanding
                          ? 'text-white/60 hover:text-white'
                          : 'text-black/60 hover:text-black'
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Line — only on landing */}
        {isAtTop && currentSection === 0 && (
          <div className="w-full h-[1px] bg-black/10 mt-6" />
        )}
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="w-full"
        >
          {/* Section 1: About Me */}
          {currentSection === 0 && (
            <>
              {/* 00 — Landing */}
              <section id="landing" className="h-screen w-full relative snap-start snap-always overflow-hidden flex flex-col">
                {/* Background Split (50/50 Slanted) */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-[#DADADA]" />
                  <div
                    className="absolute inset-0 bg-[#000000]"
                    style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 45% 100%)' }}
                  />
                </div>

                {/* Main Content Split */}
                <div className="flex-1 relative flex items-center">
                  <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 md:grid-cols-2">
                    {/* Left Side Content */}
                    <div className="flex flex-col items-start">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                      >
                        <p className="text-xl font-sans font-bold text-body-text mb-4">Hi, I am</p>
                        <h1 className="text-5xl md:text-6xl font-display font-bold text-body-text leading-[1.1] mb-4">
                          Siddiq Azam
                        </h1>
                        <p className="text-lg font-sans text-body-text/80 tracking-wide">
                          I Provide Solutions
                        </p>
                      </motion.div>
                    </div>

                    {/* Right Side Visual - Centered in the right half */}
                    <div className="hidden md:flex flex-col items-center justify-center relative md:translate-x-20">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative z-10 w-full max-w-[280px] aspect-[3/4] overflow-hidden rounded-2xl shadow-2xl border border-white/10 bg-white/5"
                      >
                        <img
                          src="https://lh3.googleusercontent.com/d/1nwFYVjwbC2Sz5unJr3-Et80taWLTKhRk"
                          alt="Siddiq Azam"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            // Fallback if the Google Drive link fails
                            (e.target as HTMLImageElement).src = "/attachment/portrait.jpg";
                          }}
                        />
                      </motion.div>

                      {/* Decorative element behind image */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-white/5 rounded-full blur-3xl -z-10" />
                    </div>
                  </div>
                </div>

                {/* Social Links & Scroll Indicator */}
                <div className="absolute bottom-12 left-16 flex items-center gap-8 z-20">
                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.linkedin.com/in/siddiqazam/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-text hover:text-white transition-colors p-1"
                      aria-label="LinkedIn"
                    >
                      <Linkedin size={18} strokeWidth={1.5} />
                    </a>
                    <a
                      href="mailto:siddiqqazam@gmail.com"
                      className="text-body-text hover:text-white transition-colors p-1"
                      aria-label="Email"
                    >
                      <Mail size={18} strokeWidth={1.5} />
                    </a>
                  </div>

                  <button
                    onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-[10px] font-mono uppercase tracking-[0.3em] text-body-text hover:text-white transition-colors"
                  >
                    Read More
                  </button>
                </div>
              </section>

              {/* About Me */}
              <ScrollSection id="about">
                <SectionEyebrow title="About Me" />
                <button
                  onClick={nextSection}
                  className="absolute bottom-6 right-6 md:right-12 px-4 py-2 bg-white border border-border-divider text-body-text font-display text-[8px] uppercase tracking-[0.2em] rounded-full hover:bg-body-text hover:text-white transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-2 z-20"
                >
                  Experience <span className="text-sm">→</span>
                </button>
              </ScrollSection>
            </>
          )}

          {/* Section 2: Experience */}
          {currentSection === 1 && (
            <>
              {/* Work Experience */}
              <ScrollSection id="work">
                <SectionEyebrow title="Work Experience" />
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto px-4">
                  <FlipCard
                    frontTitle="Econova"
                    frontSubtitle="President"
                    backContent="Econova, The Economics & Finance Club. Started as Research Head, promoted to President in 7 months. Built from 0 to 100+ members. Managing 25+ people. Running events, workshops, newsletters and building a strong community."
                  />
                  <FlipCard
                    frontTitle="COVA Peace Network"
                    frontSubtitle="Activist"
                    backContent="Summer Activism Program, researched rising prices across social sections and rural development challenges. As part of the Compassionate Citizenship & Responsible Activism Program, reached out to the local government to enact change."
                  />
                  <FlipCard
                    frontTitle="Family Business"
                    frontSubtitle="Board Member"
                    backContent="Actively participating in high-level strategic decision-making at the board level. Involved in the oversight and directional planning of an upcoming project valued at ₹150Cr+ — contributing to decisions that shape the trajectory of the business."
                  />
                </div>
              </ScrollSection>

              {/* What I Learned - Page 1 */}
              <ScrollSection id="learned">
                <SectionEyebrow title="What I Learned" />
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-7xl mx-auto px-4">
                  <FlipCard
                    frontTitle="Financial Accounting"
                    backContent={`Grade: B+ \nInstructor: Prof. Vismaya G. \nThe language of business — understanding how money moves through an organisation and what the numbers actually mean.`}
                  />
                  <FlipCard
                    frontTitle="Ethics & CSR"
                    backContent={`Grade: A+ \nInstructor: Prof. Shivdasani Amin \nHow businesses build trust and operate responsibly — the intersection of profit and purpose.`}
                  />
                  <FlipCard
                    frontTitle="Entrepreneurship & New Venture Creation"
                    backContent={`Grade: A \nInstructor: Prof. Neil Tarallo \nFrom idea to execution — the frameworks behind building something from nothing.`}
                  />
                  <FlipCard
                    frontTitle="Financial Markets"
                    backContent={`Grade: A \nInstructor: Prof. Muneer Shaik \nHow capital moves, how markets behave, and how to read the forces that drive them.`}
                  />
                  <FlipCard
                    frontTitle="E-commerce & Marketplaces"
                    backContent={`Grade: A+ \nInstructor: Prof. Rajesh Gaurav \nThe architecture of digital commerce — platforms, pricing, and how online markets are structured.`}
                  />
                </div>
              </ScrollSection>

              {/* What I Learned - Page 2 */}
              <ScrollSection id="learned-2">
                <SectionEyebrow title="What I Learned" />
                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 w-full max-w-7xl mx-auto px-4">
                  <FlipCard
                    frontTitle="Management Information Systems"
                    backContent={`Grade: A+ \nInstructor: Prof. Praharshita Krishna \nHow organisations use data and systems to make better decisions faster.`}
                  />
                  <FlipCard
                    frontTitle="Management Consulting Methods"
                    backContent={`Grade: A \nInstructor: Prof. Debopam Chakrabarti \nThe structured approach to solving complex business problems — frameworks, client thinking, and recommendations that stick.`}
                  />
                  <FlipCard
                    frontTitle="Production & Operations Management"
                    backContent={`Grade: A \nInstructor: Prof. Kirit Ghosh \nHow businesses design, run, and optimise the systems that deliver their product or service.`}
                  />
                  <FlipCard
                    frontTitle="Branding & Brand Management"
                    backContent={`Grade: A+ \nInstructor: Prof. Ravikanth Vazrapu \nHow perception is built, managed, and leveraged — the strategy behind why people choose one thing over another.`}
                  />
                  <FlipCard
                    frontTitle="Enterprise Risk Management"
                    backContent={`Grade: A+ \nInstructor: Prof. Keerti Pendyal \nIdentifying, assessing, and managing the risks that sit between a business and its goals.`}
                  />
                </div>
                <button
                  onClick={nextSection}
                  className="absolute bottom-6 right-6 md:right-12 px-4 py-2 bg-white border border-border-divider text-body-text font-display text-[8px] uppercase tracking-[0.2em] rounded-full hover:bg-body-text hover:text-white transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-2 z-20"
                >
                  Credentials <span className="text-sm">→</span>
                </button>
              </ScrollSection>
            </>
          )}

          {/* Section 3: Credentials */}
          {currentSection === 2 && (
            <>
              {/* What I Made */}
              <ScrollSection id="made">
                <SectionEyebrow title="What I Made" />
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto px-4">
                  {/* Project 1 */}
                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-black/5 shadow-sm mb-6 group relative bg-stone-100 flex items-center justify-center">
                      <img
                        src="https://lh3.googleusercontent.com/d/1MZLPQFGnDypxd8C16aAR4VxptzFmD7AQ"
                        alt="Project 1"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-display text-[10px] uppercase tracking-widest text-black/20 -z-10">Project 1</span>
                    </div>
                    <a
                      href="https://drive.google.com/file/d/1xrLkIby3Ketz07l4nmFvSVs7-kxKd1Pf/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-black text-white font-display text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-black/80 transition-all duration-300 shadow-sm active:scale-95"
                    >
                      View Project
                    </a>
                  </div>

                  {/* Project 2 */}
                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-black/5 shadow-sm mb-6 group relative bg-stone-100 flex items-center justify-center">
                      <img
                        src="https://lh3.googleusercontent.com/d/1Cgv5fAhhnGK6dQvDj96VQ2F84F1P8D21"
                        alt="Project 2"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-display text-[10px] uppercase tracking-widest text-black/20 -z-10">Project 2</span>
                    </div>
                    <a
                      href="https://drive.google.com/file/d/1dH5BdfkFUUguCOKUT18Ltn9YF7AtnWih/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-black text-white font-display text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-black/80 transition-all duration-300 shadow-sm active:scale-95"
                    >
                      View Project
                    </a>
                  </div>

                  {/* Project 3 */}
                  <div className="flex flex-col items-center">
                    <div className="w-full aspect-video rounded-2xl overflow-hidden border border-black/5 shadow-sm mb-6 group relative bg-stone-100 flex items-center justify-center">
                      <img
                        src="https://lh3.googleusercontent.com/d/1pPrvsKQVPGJnMaN6gVZt-4B-4kJAYJL0"
                        alt="Project 3"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-display text-[10px] uppercase tracking-widest text-black/20 -z-10">Project 3</span>
                    </div>
                    <a
                      href="https://drive.google.com/file/d/15Wf5t1qCdXCMfX_6aeth_HSQjQzUpPev/view?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-black text-white font-display text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-black/80 transition-all duration-300 shadow-sm active:scale-95"
                    >
                      View Project
                    </a>
                  </div>
                </div>
              </ScrollSection>

              {/* Certifications */}
              <ScrollSection id="certifications">
                <SectionEyebrow title="Certifications" />
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl mx-auto px-4">
                  <FlipCard 
                    frontTitle="Financial Modeling & Valuation" 
                    frontSubtitle="Wall Street Prep" 
                    backContent="Advanced expertise in discounted cash flow (DCF), LBO modeling, and standard financial analysis."
                  />
                  <FlipCard 
                    frontTitle="Data Science for Business" 
                    frontSubtitle="Harvard Online" 
                    backContent="Application of machine learning and big data analytics to business decision making."
                  />
                  <FlipCard 
                    frontTitle="Ethical Leadership" 
                    frontSubtitle="SA Activism Program" 
                    backContent="Certified in compassionate citizenship and responsible leadership for community initiatives."
                  />
                  <FlipCard 
                    frontTitle="Equity Research" 
                    frontSubtitle="Corporate Finance Institute" 
                    backContent="Fundamental analysis, industrial trends identification, and professional financial reporting."
                  />
                </div>
              </ScrollSection>

              {/* Recommendations */}
              <ScrollSection id="recommendations">
                <SectionEyebrow title="Recommendations" />
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto px-4">
                  <div className="p-8 bg-white/50 border border-black/5 rounded-2xl relative">
                    <p className="font-sans text-sm italic text-body-text/80 leading-relaxed mb-6">
                      "Siddiq's leadership of Econova transformed the club into a leading platform for financial literacy. His strategic vision and ability to manage 100+ members are exceptional."
                    </p>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-xs uppercase tracking-widest">Professor Vismaya G.</span>
                      <span className="font-sans text-[10px] text-body-text/60">Financial Accounting, Econova Mentor</span>
                    </div>
                  </div>
                  
                  <div className="p-8 bg-white/50 border border-black/5 rounded-2xl relative">
                    <p className="font-sans text-sm italic text-body-text/80 leading-relaxed mb-6">
                      "During the activism program, Siddiq showed profound analytical skills in studying rural development challenges. His report provided actionable insights for local policymakers."
                    </p>
                    <div className="flex flex-col">
                      <span className="font-display font-bold text-xs uppercase tracking-widest">COVA Peace Network</span>
                      <span className="font-sans text-[10px] text-body-text/60">Community Activism Program Board</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={nextSection}
                  className="absolute bottom-6 right-6 md:right-12 px-4 py-2 bg-white border border-border-divider text-body-text font-display text-[8px] uppercase tracking-[0.2em] rounded-full hover:bg-body-text hover:text-white transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-2 z-20"
                >
                  Contact Me <span className="text-sm">→</span>
                </button>
              </ScrollSection>
            </>
          )}

          {/* Section 4: Contact Me */}
          {currentSection === 3 && (
            <>
              {/* Contact Me */}
              <ScrollSection id="contact">
                <div className="w-full max-w-lg mx-auto px-6 py-12 flex flex-col items-center">
                  <SectionEyebrow title="Think Siddiq can help?" />
                  
                  {/* Resume Download Button */}
                  <div className="mb-12">
                    <a 
                      href="/resume.pdf" 
                      download
                      className="px-6 py-2 border border-black text-black font-display text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-black hover:text-white transition-all duration-300"
                    >
                      Download Resume
                    </a>
                  </div>

                  <div className="w-full space-y-12 mt-12 flex flex-col items-center">
                    {/* Direct Contact Info */}
                    <div className="flex flex-col md:flex-row gap-8 w-full justify-center">
                      <a 
                        href="mailto:sm23ubbd125@mahindrauniversity.edu.in" 
                        className="flex flex-col items-center p-8 bg-stone-50/50 border border-black/5 rounded-3xl hover:bg-black hover:text-white transition-all duration-500 group flex-1 max-w-[280px]"
                      >
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                          <span className="text-xl">✉</span>
                        </div>
                        <span className="font-display text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Email Me</span>
                        <span className="font-sans text-xs opacity-60 break-all text-center">sm23ubbd125@mahindrauniversity.edu.in</span>
                      </a>

                      <a 
                        href="tel:+916305063114" 
                        className="flex flex-col items-center p-8 bg-stone-50/50 border border-black/5 rounded-3xl hover:bg-black hover:text-white transition-all duration-500 group flex-1 max-w-[280px]"
                      >
                        <div className="w-12 h-12 rounded-full bg-black/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
                          <span className="text-xl">📞</span>
                        </div>
                        <span className="font-display text-[10px] uppercase tracking-[0.3em] font-bold mb-2">Call Me</span>
                        <span className="font-sans text-xs opacity-60 text-center">+91 63050 63114</span>
                      </a>
                    </div>

                    <div className="text-center pt-8">
                      <p className="font-sans text-[10px] uppercase tracking-[0.1em] text-body-text/40">
                        Based in Mahindra University, Hyderabad.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => goToSection(0)}
                  className="absolute bottom-6 right-6 md:right-12 px-4 py-2 bg-white border border-border-divider text-body-text font-display text-[8px] uppercase tracking-[0.2em] rounded-full hover:bg-body-text hover:text-white transition-all duration-300 shadow-sm active:scale-95 flex items-center gap-2 z-20"
                >
                  <span className="text-sm">←</span> Back to Start
                </button>
              </ScrollSection>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Persistent Scroll Indicator */}
      <AnimatePresence>
        {isIdle && showScrollIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-stone-mid font-sans uppercase tracking-[0.1em] pointer-events-none z-40"
          >
            Scroll ↓
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes draw {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
    </main>
  );
}
