// Episodios de demo con embeds reales de podcasts famosos para testing
// Ordenados por fecha descendente (más reciente primero)

interface DemoEpisode {
  id: string;
  city: string;
  country?: string;
  durationMin?: number;
  title: string;
  description: string;
  imageUrl: string;
  isPremium: boolean;
  lat: number;
  lng: number;
  publishDate: string;
  links: Record<string, string>;
  embeds: Record<string, string>;
  gallery?: string[];
}

export const slugify = (city: string) =>
  city.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .trim();

export const episodeSlug = (num: number, city: string) =>
  `${String(num).padStart(3,'0')}-${slugify(city)}`;

export const demoEpisodes: DemoEpisode[] = [
  {
    id: '10',
    city: 'BANGKOK',
    country: 'Tailandia',
    durationMin: 58,
    title: 'El Monje que Boxeaba y la Sombra del Rascacielos',
    description: 'En un templo escondido entre callejones, un monje entrena Muay Thai antes del amanecer. Del otro lado de la ciudad, un ingeniero cuenta como el edificio mas alto de Bangkok casi no se construye por una maldicion.',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80',
    isPremium: false,
    lat: 13.7563,
    lng: 100.5018,
    publishDate: '2026-02-28',
    links: {
      spotify: 'https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk',
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      applePodcasts: 'https://podcasts.apple.com/podcast/id1200361736',
      ivoox: 'https://www.ivoox.com/podcast-sodaroja_sq_f1234567_1.html',
      soundcloud: 'https://soundcloud.com/sodaroja',
    },
    embeds: {
      youtube: 'https://www.youtube.com/embed/jfKfPfyJRdk',
      spotify: 'https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk?utm_source=generator&theme=0',
      applePodcasts: 'https://embed.podcasts.apple.com/us/podcast/the-daily/id1200361736?i=1000640000000&theme=dark',
      ivoox: 'https://www.ivoox.com/player_ej_1234567_2_1.html',
      soundcloud: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/291&color=%23c45555&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
    },
    gallery: [
      'https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=400&q=80',
      'https://images.unsplash.com/photo-1528181304800-259b08848526?w=400&q=80',
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&q=80',
    ],
  },
  {
    id: '9',
    city: 'SYDNEY',
    country: 'Australia',
    durationMin: 50,
    title: 'La Surfista Ciega y el Secreto Bajo la Opera',
    description: 'En Bondi Beach una mujer que perdio la vista a los 20 compite contra olas de tres metros. Bajo la Opera House, un tunelero revela pasadizos que nunca aparecieron en ningun plano.',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80',
    isPremium: false,
    lat: -33.8688,
    lng: 151.2093,
    publishDate: '2026-02-15',
    links: {
      spotify: 'https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk',
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      applePodcasts: 'https://podcasts.apple.com/podcast/id1200361736',
      soundcloud: 'https://soundcloud.com/sodaroja',
    },
    embeds: {
      spotify: 'https://open.spotify.com/embed/episode/0Sfs7QGMRO2VWMpeFGWCHY?utm_source=generator&theme=0',
      soundcloud: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/291&color=%23c45555&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
    },
    gallery: [
      'https://images.unsplash.com/photo-1524293581917-878a6d017c71?w=400&q=80',
      'https://images.unsplash.com/photo-1530276371031-2fbb14469e68?w=400&q=80',
    ],
  },
  {
    id: '8',
    city: 'COPENHAGUE',
    country: 'Dinamarca',
    durationMin: 47,
    title: 'La Bicicleta del Rey y el Cocinero sin Restaurante',
    description: 'El rey de Dinamarca pedalea solo entre la gente comun todas las mananas. En Norrebro, un chef con dos estrellas Michelin cocina en la calle porque dice que los restaurantes arruinan la comida.',
    imageUrl: 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=800&q=80',
    isPremium: true,
    lat: 55.6761,
    lng: 12.5683,
    publishDate: '2026-01-30',
    links: {
      spotify: 'https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk',
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ivoox: 'https://www.ivoox.com/podcast-sodaroja_sq_f1234567_1.html',
    },
    embeds: {
      youtube: 'https://www.youtube.com/embed/jfKfPfyJRdk',
      spotify: 'https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk?utm_source=generator&theme=0',
    },
    gallery: [
      'https://images.unsplash.com/photo-1552560555-7b5e20b22fa7?w=400&q=80',
      'https://images.unsplash.com/photo-1577965216283-9fd27b12948e?w=400&q=80',
      'https://images.unsplash.com/photo-1579532649340-04ef07b0c977?w=400&q=80',
    ],
  },
  {
    id: '7',
    city: 'OTTAWA',
    country: 'Canada',
    durationMin: 44,
    title: 'La Patinadora del Canal y el Guardian del Parlamento',
    description: 'Cada invierno, una mujer de 82 anos patina 7 kilometros por el canal Rideau para ir a trabajar. En Parliament Hill, un guardia veterano cuenta la noche en que alguien entro armado y el no se movio.',
    imageUrl: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=80',
    isPremium: false,
    lat: 45.4215,
    lng: -75.6972,
    publishDate: '2026-01-10',
    links: {
      spotify: 'https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk',
      applePodcasts: 'https://podcasts.apple.com/podcast/id1200361736',
      youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      soundcloud: 'https://soundcloud.com/sodaroja',
    },
    embeds: {
      spotify: 'https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk?utm_source=generator&theme=0',
      applePodcasts: 'https://embed.podcasts.apple.com/us/podcast/the-daily/id1200361736?i=1000640000000&theme=dark',
    },
    gallery: [
      'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=400&q=80',
      'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400&q=80',
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=400&q=80',
      'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=400&q=80',
    ],
  },
  {
    id: '6',
    city: 'NUEVA YORK',
    country: 'Estados Unidos',
    durationMin: 52,
    title: 'El Pianista del Subte y la Grieta en Wall Street',
    description: 'Línea 6, estación City Hall. Clausurada en 1945. Pero algunos conductores juran que alguien sigue esperando allí.',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    isPremium: false,
    lat: 40.7128,
    lng: -74.0060,
    publishDate: '2026-02-05',
    links: { youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', spotify: 'https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk' },
    embeds: {
      spotify: 'https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk?utm_source=generator&theme=0',
    },
  },
  {
    id: '5',
    city: 'PRAGA',
    country: 'República Checa',
    durationMin: 48,
    title: 'El Relojero Ciego y la Cantante del Puente de Carlos',
    description: 'En la plaza más antigua de Europa, un reloj astronómico medieval guarda una profecía que nadie quiso escuchar.',
    imageUrl: 'https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80',
    isPremium: true,
    lat: 50.0875,
    lng: 14.4214,
    publishDate: '2026-01-25',
    links: {},
    embeds: {},
  },
  {
    id: '4',
    city: 'ESTAMBUL',
    country: 'Turquía',
    durationMin: 55,
    title: 'El Vendedor de Te Eterno y el Grafitero de las Mezquitas',
    description: 'Tres imperios. Mil naufragios. Un buzo que encontró algo que no debía encontrar.',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
    isPremium: false,
    lat: 41.0082,
    lng: 28.9784,
    publishDate: '2026-01-10',
    links: { youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', spotify: 'https://open.spotify.com/episode/3Qm86XLflmIXVm1wd7iAGE' },
    embeds: {
      spotify: 'https://open.spotify.com/embed/episode/3Qm86XLflmIXVm1wd7iAGE?utm_source=generator&theme=0',
      soundcloud: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/291&color=%23c45555&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
    },
  },
  {
    id: '3',
    city: 'BUENOS AIRES',
    country: 'Argentina',
    durationMin: 42,
    title: 'La Dama de Blanco y el Bandoneonista del Subte A',
    description: 'Cada noche de tormenta, una figura cruza el Cementerio de la Recoleta. Los que la siguieron... nunca contaron la historia completa.',
    imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&q=80',
    isPremium: false,
    lat: -34.6037,
    lng: -58.3816,
    publishDate: '2025-12-20',
    links: { youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    embeds: {
      spotify: 'https://open.spotify.com/embed/episode/5VKBVQoB2sBkE43qRx3Svb?utm_source=generator&theme=0',
    },
  },
  {
    id: '2',
    city: 'TOKIO',
    country: 'Japón',
    durationMin: 58,
    title: 'El Monje Gamer y la Florista de Shibuya',
    description: 'En los callejones de Akihabara, un hombre programa códigos que nadie puede descifrar. Su identidad: un misterio de 20 años.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    isPremium: true,
    lat: 35.6762,
    lng: 139.6503,
    publishDate: '2025-12-01',
    links: {},
    embeds: {},
  },
  {
    id: '1',
    city: 'PARÍS',
    country: 'Francia',
    durationMin: 45,
    title: 'El Fantasma de las Catacumbas y la Pintora del Sena',
    description: 'Bajo las calles mas elegantes del mundo, un explorador ilegal filma lo que encuentra en tuneles que no aparecen en ningun mapa. En la orilla del Sena, una pintora de 88 anos retrata a desconocidos gratis y les cuenta un secreto sobre ellos mismos.',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    isPremium: false,
    lat: 48.8566,
    lng: 2.3522,
    publishDate: '2025-11-15',
    links: { youtube: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', spotify: 'https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk' },
    embeds: {
      spotify: 'https://open.spotify.com/embed/episode/4rOoJ6Egrf8K2IrywzwOMk?utm_source=generator&theme=0',
      soundcloud: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/291&color=%23c45555&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false',
    },
  },
];
