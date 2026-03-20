import React from 'react';
import { motion } from 'motion/react';

interface HeaderProps {
  onNavigate: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const navItems = [
    { label: 'About me', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Portfolio', id: 'projects' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-[100] bg-black text-white h-16 flex items-center px-8 md:px-24">
      <div className="flex-1" />
      <nav className="flex items-center gap-8">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="text-xs uppercase tracking-[0.2em] hover:text-gray-400 transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
        <button 
          onClick={() => onNavigate('contact')}
          className="bg-white text-black px-6 py-2 rounded-full text-xs uppercase tracking-[0.2em] font-bold hover:bg-gray-200 transition-colors cursor-pointer"
        >
          Contact Me
        </button>
      </nav>
    </header>
  );
};
