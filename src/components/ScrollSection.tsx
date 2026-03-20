import React, { useEffect, useRef, useState } from 'react';

interface ScrollSectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  bgColor?: string;
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({ id, children, className = "", bgColor = "bg-base-bg" }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we don't un-set it as per requirements
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`h-screen w-full relative flex flex-col items-center justify-center px-4 md:px-12 pt-28 pb-4 snap-start snap-always overflow-hidden ${bgColor} ${className}`}
    >
      <div className={`content-frame reveal-on-scroll w-full max-w-7xl ${isVisible ? 'visible' : ''}`}>
        <div className="flex flex-col h-full">
          {children}
        </div>
      </div>
    </section>
  );
};

export const SectionEyebrow: React.FC<{ title: string }> = ({ title }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center w-full mb-4 mt-4">
      <h2 className="text-2xl md:text-3xl text-body-text leading-none uppercase tracking-[0.4em] font-medium text-center">
        {title}
      </h2>
    </div>
  );
};
