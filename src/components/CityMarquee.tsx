import React from 'react';
import { getContent } from '../data/content';
import { demoEpisodes } from '../data/episodes';

export const CityMarquee: React.FC = () => {
  const content = getContent();
  const episodes = content.episodios?.items?.length ? content.episodios.items : demoEpisodes;
  const cities = [...new Set(episodes.map((e: any) => e.city as string))];
  // Duplicate for seamless loop
  const text = cities.join('  ·  ') + '  ·  ';
  
  return (
    <div className="relative py-8 overflow-hidden select-none pointer-events-none">
      {/* Top and bottom fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-soda-night to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-soda-night to-transparent z-10" />
      
      <div className="marquee-track">
        <span className="marquee-content font-serif text-[2.5rem] sm:text-[3.5rem] md:text-[4.5rem] text-soda-mist/[0.04] tracking-[0.08em] whitespace-nowrap italic">
          {text}{text}
        </span>
      </div>
    </div>
  );
};
