import React, { useEffect } from 'react';
import { getContent } from '../data/content';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps & { episodeData?: { title: string; description: string; duration?: number; date?: string; image?: string } }> = ({ title, description, image, url, episodeData }) => {
  const content = getContent();
  const siteTitle = content.meta?.pageTitle || 'sodaroja';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const desc = description || content.meta?.description || 'Un podcast que viaja por el mundo contando historias.';

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
          el.setAttribute('property', property);
        } else {
          el.setAttribute('name', property);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', desc);
    setMeta('og:title', fullTitle);
    setMeta('og:description', desc);
    setMeta('og:type', 'website');
    if (image) setMeta('og:image', image);
    if (url) setMeta('og:url', url);
    setMeta('og:site_name', siteTitle);
    setMeta('og:locale', 'es_AR');
    setMeta('twitter:card', image ? 'summary_large_image' : 'summary');
    setMeta('twitter:site', '@sodaroja');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', desc);
    if (image) setMeta('twitter:image', image);

    // Schema markup
    const existingSchema = document.getElementById('schema-json-ld');
    if (existingSchema) existingSchema.remove();
    const schema = document.createElement('script');
    schema.id = 'schema-json-ld';
    schema.type = 'application/ld+json';
    if (episodeData) {
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'PodcastEpisode',
        name: episodeData.title,
        description: episodeData.description,
        datePublished: episodeData.date,
        timeRequired: episodeData.duration ? `PT${episodeData.duration}M` : undefined,
        image: episodeData.image,
        partOfSeries: { '@type': 'PodcastSeries', name: siteTitle, url: window.location.origin },
      });
    } else {
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'PodcastSeries',
        name: siteTitle,
        description: desc,
        url: window.location.origin,
        inLanguage: 'es',
      });
    }
    document.head.appendChild(schema);
  }, [fullTitle, desc, image, url, episodeData]);

  return null;
};
