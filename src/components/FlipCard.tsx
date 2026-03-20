import React, { useState } from 'react';
import { motion } from 'motion/react';

interface FlipCardProps {
  frontTitle: string;
  frontSubtitle?: string;
  backContent: string;
}

export const FlipCard: React.FC<FlipCardProps> = ({ frontTitle, frontSubtitle, backContent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full h-[280px] cursor-pointer perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        {/* Front Side */}
        <div className="absolute inset-0 backface-hidden bg-white border border-black/5 rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-sm">
          <h3 className="font-display text-lg font-bold text-body-text mb-2 tracking-tight">{frontTitle}</h3>
          {frontSubtitle && <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-body-text/60">{frontSubtitle}</p>}
        </div>

        {/* Back Side */}
        <div 
          className="absolute inset-0 backface-hidden bg-black rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-2xl"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="font-sans text-xs leading-relaxed text-white/90 font-light whitespace-pre-line">
            {backContent}
          </p>
        </div>
      </motion.div>
    </div>
  );
};
