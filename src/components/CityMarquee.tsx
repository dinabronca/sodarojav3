import React from 'react';
import { getContent } from '../data/content';
import { demoEpisodes } from '../data/episodes';

export const CityMarquee: React.FC = () => {
  const content = getContent();
  const episodes = content.episodios?.items?.length ? content.episodios.items : demoEpisodes;
  const cities = [...new Set(episodes.map((e: any) => e.city as string))];
  const text = cities.join('    \u00b7    ') + '    \u00b7    ';
  
  return (
    <div className="relative py-6 overflow-hidden select-none pointer-events-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-soda-night to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-soda-night to-transparent z-10" />
      <div style={{ display: 'flex', width: 'max-content', animation: 'marqueeScroll 810s linear infinite' }}>
        {[0,1,2,3].map(i => (
          <span key={i} className="font-display text-soda-mist/[0.08] whitespace-nowrap" style={{ fontSize: "clamp(2rem, 6vw, 4rem)", letterSpacing: "0.1em", fontWeight: 300, paddingRight: "2rem" }}>
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};
