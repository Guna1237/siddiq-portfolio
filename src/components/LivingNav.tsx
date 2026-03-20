import React, { useEffect, useState, useRef } from 'react';

interface DotPosition {
  x: number; // percentage of width
  y: number; // percentage of height
  label: string;
}

const SECTIONS: { id: string; label: string }[] = [
  { id: "landing", label: "Landing" },
  { id: "about", label: "About Me" },
  { id: "work", label: "Work Experience" },
  { id: "learned", label: "What I Learned" },
  { id: "made", label: "What I Made" },
  { id: "certifications", label: "Certifications" },
  { id: "recommendations", label: "Recommendations" },
  { id: "contact", label: "Contact Me" },
];

interface LivingNavProps {
  currentSectionIndex: number;
  onSectionChange: (index: number) => void;
  pages: { id: string; label: string }[];
}

export const LivingNav: React.FC<LivingNavProps> = ({ currentSectionIndex, onSectionChange, pages }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState("");
  const [visitedSections, setVisitedSections] = useState<Set<string>>(new Set());
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMouseNearLeft, setIsMouseNearLeft] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (pages.length > 0) {
      setActiveSection(pages[0].id);
      setVisitedSections(new Set([pages[0].id]));
    }
  }, [pages]);

  useEffect(() => {
    const scrollContainer = document.querySelector('main');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const totalHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const internalProgress = totalHeight > 0 ? scrollContainer.scrollTop / totalHeight : 0;
      
      setScrollProgress(internalProgress);

      setIsScrolling(true);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = setTimeout(() => setIsScrolling(false), 2000);

      // Detect active section
      let current = "";
      for (const page of pages) {
        const element = document.getElementById(page.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top >= -windowSize.height / 2 && rect.top <= windowSize.height / 2) {
            current = page.id;
            break;
          }
        }
      }
      
      if (current && current !== activeSection) {
        setActiveSection(current);
        setVisitedSections(prev => new Set([...prev, current]));
      }
    };

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const handleMouseMove = (e: MouseEvent) => {
      setIsMouseNearLeft(e.clientX < 100);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleScroll(); 
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [activeSection, currentSectionIndex]);

  const isVisible = isScrolling || isMouseNearLeft || hoveredIndex !== null;

  const getPoint = (index: number) => {
    const x = 40; // Fixed left position
    const startY = windowSize.height * 0.3;
    const endY = windowSize.height * 0.7;
    const y = pages.length > 1 
      ? startY + (index / (pages.length - 1)) * (endY - startY)
      : windowSize.height / 2;
    return { x, y };
  };

  const generatePath = () => {
    if (pages.length < 2) return "";
    const p0 = getPoint(0);
    let path = `M ${p0.x} ${p0.y}`;
    for (let i = 1; i < pages.length; i++) {
      const p = getPoint(i);
      path += ` L ${p.x} ${p.y}`;
    }
    return path;
  };

  const pathData = generatePath();
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(isNaN(length) ? 0 : length);
    }
  }, [windowSize, pathData]);

  const handleDotClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 pointer-events-none transition-all duration-700 ease-in-out ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-10 -translate-x-6 scale-y-90'
      }`}
    >
      <svg className="w-full h-full">
        {/* Ghost Path */}
        {pages.length > 1 && (
          <path
            d={pathData}
            fill="none"
            stroke="var(--color-border-divider)"
            strokeWidth="1"
            className="opacity-50"
          />
        )}
        {/* Active Path */}
        {pages.length > 1 && (
          <path
            ref={pathRef}
            d={pathData}
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeDasharray={pathLength || 0}
            strokeDashoffset={(pathLength || 0) * (1 - (scrollProgress || 0))}
            style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
          />
        )}

        {/* Dots */}
        {pages.map((page, index) => {
          const point = getPoint(index);
          const isVisited = visitedSections.has(page.id);
          const isActive = activeSection === page.id;
          
          return (
            <g key={index} className="pointer-events-auto cursor-pointer"
               onMouseEnter={() => setHoveredIndex(index)}
               onMouseLeave={() => setHoveredIndex(null)}
               onClick={() => handleDotClick(page.id)}
            >
              {/* Pulse Halo for active dot */}
              {isActive && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="14"
                  fill="#000000"
                  fillOpacity="0.15"
                  className="animate-pulse"
                  style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                />
              )}
              
              {/* The Dot */}
              <circle
                cx={point.x}
                cy={point.y}
                r={isActive ? 6 : 4}
                fill="#000000"
                className="transition-all duration-300"
                style={{
                  opacity: isVisited ? 1 : 0.3,
                  transform: hoveredIndex === index ? 'scale(1.4)' : 'scale(1)',
                  transformOrigin: `${point.x}px ${point.y}px`
                }}
              />

              {/* Tooltip */}
              {hoveredIndex === index && (
                <foreignObject
                  x={point.x + 20}
                  y={point.y - 12}
                  width="200"
                  height="40"
                  className="overflow-visible"
                >
                  <div className="bg-body-text text-base-bg font-mono text-[10px] px-[12px] py-[6px] rounded-sm whitespace-nowrap uppercase tracking-widest animate-in fade-in slide-in-from-left-4 duration-300 shadow-sm border border-border-divider">
                    {page.label}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
