// ============================================================
// STORE CENTRAL DE CONTENIDO — sodaroja
// Todo el contenido editable del sitio vive acá.
// El Admin Panel lee y modifica estos datos.
// En producción, conectar con Supabase/Firebase.
// ============================================================

export interface SiteContent {
  // Meta / SEO / Analytics
  meta: {
    pageTitle: string;
    faviconUrl: string;
    description: string;
    analyticsId: string;
    emailjsServiceId: string;
    emailjsTemplateId: string;
    emailjsPublicKey: string;
  };

  // Brand / Logos
  brand: {
    isotipoUrl: string;   // Isotipo (solo el ícono de la botella)
    logotipoUrl: string;  // Logotipo (nombre + ícono)
    navbarLogoUrl: string; // Logo que aparece en el navbar (isotipo o logotipo)
    heroLogoUrl: string;   // Logo que aparece en el hero (logotipo)
  };

  // Nombres de las secciones (aparecen en el header/navbar)
  sectionNames: {
    inicio: string;
    queEsEsto: string;
    equipo: string;
    episodios: string;
    frecuenciaInterna: string;
    shop: string;
    contacto: string;
  };

  // INICIO / HERO
  hero: {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
    videoUrl?: string; // MP4 video URL for hero (replaces image/logo)
  };

  // QUÉ ES ESTO
  queEsEsto: {
    title: string;
    description: string;
    structureTitle: string;
    structureSubtitle: string;
    estructura: {
      numero: string;
      emoji: string;
      titulo: string;
      subtitulo?: string;
      descripcion: string;
      detalles: string;
      destacado: boolean;
      color: 'red' | 'accent' | 'lamp' | 'glow'; // Color del número y borde
    }[];
    temas: string[];
  };

  // EL EQUIPO
  equipo: {
    title: string;
    subtitle: string;
    favoriteFields: { key: string; label: string }[];
    cityFields: { key: string; label: string }[];
    members: {
      name: string;
      role: string;
      birthYear: number;
      cityBorn: string;
      cityCurrent: string;
      zodiac: string;
      photoUrl: string;
      socials: { platform: string; url: string; abbr: string }[];
      favorites: Record<string, string | number>;
      cities: Record<string, string>;
    }[];
  };

  // EPISODIOS
  episodios: {
    title: string;
    subtitle: string;
    items: {
      id: string;
      city: string;
      country?: string;
      durationMin?: number;
      title: string;
      description: string;
      imageUrl: string;
      publishDate: string; // YYYY-MM-DD
      isPremium: boolean;
      lat?: number;
      lng?: number;
      links: {
        youtube?: string;
        spotify?: string;
        soundcloud?: string;
        ivoox?: string;
        applePodcasts?: string;
      };
      embeds: {
        youtube?: string;
        spotify?: string;
        soundcloud?: string;
        ivoox?: string;
        applePodcasts?: string;
      };
      gallery?: string[];
    }[];
  };

  // FRECUENCIA INTERNA
  frecuenciaInterna: {
    title: string;
    subtitle: string;
    introText: string;
    benefitsTitle: string;
    benefits: string[];
    cancelNote: string;
    plans: {
      id: string;
      name: string;
      priceARS: number;
      priceUSD: number;
      description: string;
      featured: boolean;
    }[];
    paymentUrls: {
      mercadoPago: string;
      international: string;
      internationalProvider: 'paypal' | 'stripe' | 'lemon-squeezy';
    };
  };

  // SHOP
  shop: {
    title: string;
    subtitle: string;
    products: {
      id: string;
      name: string;
      description: string;
      imageUrl: string;
      price?: number;
      purchaseUrl: string;
      isComingSoon: boolean;
    }[];
  };

  // CONTACTO
  contacto: {
    title: string;
    subtitle: string;
    email: string;
    instagram: string;
  };

  // FOOTER — Redes sociales
  socialLinks: {
    id: string;
    platform: string;
    abbr: string;
    url: string;
    iconUrl?: string;
    visible: boolean;
  }[];

  // AVATARES
  avatars?: {
    id: string;
    name: string;
    imageUrl: string;
  }[];

  // PLATAFORMAS
  platforms?: {
    id: string;
    name: string;
    url: string;
    visible: boolean;
  }[];

  // FOOTER — Sponsors
  sponsors: {
    id: string;
    name: string;
    logoUrl: string;
    url: string;
    visible: boolean;
  }[];

  // FOOTER — Logo
  footerLogoUrl: string;

  // GAMIFICACIÓN — Soditas config
  soditasConfig: {
    name: string;
    emoji: string;
  };

  // MI CUENTA — Campos del perfil de usuario
  userProfileFields: {
    id: string;
    label: string;
    type: 'text' | 'select' | 'month-year';
    required: boolean;
    visible: boolean;
    options?: string[]; // Para tipo 'select'
    placeholder?: string;
  }[];
}

// ============================================================
// DATOS POR DEFECTO
// ============================================================
export const defaultContent: SiteContent = {
  meta: {
    pageTitle: 'sodaroja',
    faviconUrl: '/isotipo.png',
    description: 'sodaroja - un podcast que viaja por el mundo contando historias que nadie mas cuenta.',
    analyticsId: '',
    emailjsServiceId: '',
    emailjsTemplateId: '',
    emailjsPublicKey: '',
  },

  brand: {
    isotipoUrl: '/isotipo.png',
    logotipoUrl: '/logotipo.png',
    navbarLogoUrl: '/isotipo.png',
    heroLogoUrl: '/logotipo.png',
  },

  sectionNames: {
    inicio: 'Inicio',
    queEsEsto: '¿Qué es esto?',
    equipo: 'El Equipo',
    episodios: 'Episodios',
    frecuenciaInterna: 'Frecuencia Interna',
    shop: 'Shop',
    contacto: 'Contacto',
  },

  hero: {
    title: 'sodaroja',
    subtitle: 'un podcast narrativo',
    description: 'Historias reales de ciudades lejanas.\nCada episodio es un viaje nocturno que no olvidarás.',
    imageUrl: '',
  },

  queEsEsto: {
    title: '¿Qué es sodaroja?',
    description: 'Podcast de investigación narrativa que explora ciudades del mundo a través de historias reales. Cada episodio de 60-80 minutos combina investigación profunda con narrativa cinematográfica y producción sonora envolvente. No es un noticiero ni un documental tradicional: es una experiencia auditiva que te transporta a las calles, los rincones ocultos y los eventos que definieron la identidad de cada lugar.',
    structureTitle: 'Estructura de cada episodio',
    structureSubtitle: '9 momentos que construyen el viaje',
    estructura: [
      { numero: '0', emoji: '🎙️', titulo: 'Apertura Ritual', descripcion: 'No es locución radial ni algo impostado. Es una entrada suave, íntima, como si la charla ya hubiera empezado.', detalles: 'Generamos clima, hacemos sentir al oyente que entra a un espacio seguro y marcamos que comienza el viaje.', destacado: false, color: 'accent' },
      { numero: '1', emoji: '🪟', titulo: 'Ventana Roja', subtitulo: '(Bloque de actualidad)', descripcion: 'Este bloque aparece cuando hay algo que el mundo está atravesando y no se puede ignorar.', detalles: 'Eventos culturales grandes, fenómenos globales, muertes relevantes, hechos históricos. No es noticiero. Es charla con mirada humana.', destacado: true, color: 'red' },
      { numero: '2', emoji: '🌍', titulo: 'Introducción a la Ciudad', descripcion: 'Transición hacia la ciudad elegida. Atmósfera, contexto cultural, sensaciones del lugar.', detalles: 'Es abrir la puerta del viaje. Cómo se siente esa ciudad.', destacado: false, color: 'accent' },
      { numero: '3-5', emoji: '🔺', titulo: 'Prismas', subtitulo: '(Historias de la ciudad)', descripcion: 'Dos o tres historias reales de esa ciudad. Crímenes, personajes ocultos, hechos históricos, mitos urbanos.', detalles: 'Narración con clima, sin morbo. Deben contrastar o complementarse: otra época, otra energía, otra mirada del lugar.', destacado: false, color: 'accent' },
      { numero: '6', emoji: '🕯️', titulo: 'Susurros del Culto', descripcion: 'Recomendaciones: película, serie, libro, disco, lugar, artista.', detalles: 'Siempre algo que encaje con la energía del episodio. Tono íntimo, como pasar un secreto.', destacado: false, color: 'accent' },
      { numero: '7', emoji: '📍', titulo: 'Rastros del Culto', descripcion: 'Fotos que mandó la gente, dónde apareció un sticker, cómo llegó ahí.', detalles: 'Construye el mapa físico del culto.', destacado: false, color: 'accent' },
      { numero: '8', emoji: '📜', titulo: 'Bitácora de Frecuencia Interna', descripcion: 'Lectura de mails y mensajes. La parte más humana.', detalles: 'Qué sintieron, dónde escucharon, qué les pasó, si viajaron. Acá se fortalece la comunidad.', destacado: true, color: 'red' },
      { numero: '9', emoji: '🌙', titulo: 'Cierre Suave', descripcion: 'No es despedida radial. Es sensación de: seguimos acá, esto no termina, el viaje continúa.', detalles: 'Deja al oyente acompañado, no "cerrado".', destacado: false, color: 'accent' },
    ],
    temas: ['Crímenes reales', 'Historia urbana', 'Mitos y leyendas', 'Personajes olvidados', 'Arquitectura secreta', 'Gastronomía local', 'Música y cultura', 'Sucesos inexplicables', 'Arte underground', 'Fenómenos paranormales', 'Subculturas urbanas', 'Tradiciones perdidas'],
  },

  equipo: {
    title: 'El Equipo',
    subtitle: 'Las personas detrás de cada historia',
    favoriteFields: [
      { key: 'iceCream', label: 'Helado favorito' },
      { key: 'drink', label: 'Bebida favorita' },
      { key: 'book', label: 'Libro favorito' },
      { key: 'movie', label: 'Película favorita' },
      { key: 'series', label: 'Serie favorita' },
      { key: 'character', label: 'Personaje favorito' },
      { key: 'celebrity', label: 'Famoso favorito' },
      { key: 'album', label: 'Álbum musical favorito' },
      { key: 'podcast', label: 'Podcast que escucha' },
      { key: 'sport', label: 'Deporte favorito' },
      { key: 'food', label: 'Comida favorita' },
      { key: 'smell', label: 'Olor favorito' },
      { key: 'sound', label: 'Sonido que le relaja' },
      { key: 'timeOfDay', label: 'Hora favorita del día' },
      { key: 'weather', label: 'Clima favorito' },
      { key: 'tattoos', label: 'Cantidad de tatuajes' },
    ],
    cityFields: [
      { key: 'dreamVisit', label: 'Ciudad que sueña con visitar' },
      { key: 'wouldntVisit', label: 'Ciudad que no visitaría' },
      { key: 'wouldLive', label: 'Ciudad donde viviría' },
      { key: 'bestFood', label: 'Ciudad donde se come mejor' },
      { key: 'wouldPropose', label: 'Ciudad donde propondría casamiento' },
      { key: 'wouldIsolate', label: 'Ciudad donde se aislaría' },
      { key: 'meetPeople', label: 'Ciudad donde iría a conocer gente' },
      { key: 'vacation', label: 'Ciudad para vacacionar siempre' },
      { key: 'allExpensesPaid', label: 'Ciudad que soñaría conocer todo pago' },
      { key: 'writeBook', label: 'Ciudad donde escribiría un libro' },
      { key: 'recordEpisode', label: 'Ciudad donde grabaría un episodio ideal' },
      { key: 'nostalgia', label: 'Ciudad que le genera nostalgia sin haber ido' },
    ],
    members: [
      {
        name: 'Mikasa', role: 'Narradora Principal', birthYear: 1995, cityBorn: 'Buenos Aires', cityCurrent: 'Buenos Aires', zodiac: 'Escorpio',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80',
        socials: [{ platform: 'Instagram', url: '#', abbr: 'IG' }, { platform: 'Twitter', url: '#', abbr: 'X' }, { platform: 'YouTube', url: '#', abbr: 'YT' }, { platform: 'TikTok', url: '#', abbr: 'TT' }],
        favorites: { iceCream: 'Chocolate amargo', drink: 'Café negro', book: 'Cien años de soledad', movie: 'Blade Runner', series: 'Dark', character: 'Don Draper', celebrity: 'David Bowie', album: 'OK Computer', podcast: 'Serial', sport: 'Natación', food: 'Pizza napolitana', smell: 'Café recién hecho', sound: 'Lluvia', timeOfDay: '3:00 AM', weather: 'Lluvia nocturna', tattoos: 3 },
        cities: { dreamVisit: 'Tokio', wouldntVisit: 'Dubai', wouldLive: 'Berlín', bestFood: 'Roma', wouldPropose: 'París', wouldIsolate: 'Islandia', meetPeople: 'Barcelona', vacation: 'Kioto', allExpensesPaid: 'Nueva York', writeBook: 'Praga', recordEpisode: 'Estambul', nostalgia: 'Lisboa' },
      },
      {
        name: 'Violet', role: 'Co-Narradora', birthYear: 1992, cityBorn: 'Rosario', cityCurrent: 'Barcelona', zodiac: 'Piscis',
        photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
        socials: [{ platform: 'Instagram', url: '#', abbr: 'IG' }, { platform: 'Twitter', url: '#', abbr: 'X' }, { platform: 'YouTube', url: '#', abbr: 'YT' }, { platform: 'TikTok', url: '#', abbr: 'TT' }],
        favorites: { iceCream: 'Limón', drink: 'Té verde', book: 'El principito', movie: 'Your Name', series: 'Stranger Things', character: 'Hermione Granger', celebrity: 'Björk', album: 'The Dark Side of the Moon', podcast: 'Radiolab', sport: 'Yoga', food: 'Sushi', smell: 'Jazmín', sound: 'Viento', timeOfDay: '6:00 AM', weather: 'Niebla matinal', tattoos: 5 },
        cities: { dreamVisit: 'Kioto', wouldntVisit: 'Las Vegas', wouldLive: 'Ámsterdam', bestFood: 'Bangkok', wouldPropose: 'Santorini', wouldIsolate: 'Noruega', meetPeople: 'Lisboa', vacation: 'Bali', allExpensesPaid: 'Tokio', writeBook: 'Edimburgo', recordEpisode: 'Praga', nostalgia: 'París' },
      },
      {
        name: 'Levi', role: 'Editor y Productor', birthYear: 1988, cityBorn: 'Córdoba', cityCurrent: 'Buenos Aires', zodiac: 'Capricornio',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
        socials: [{ platform: 'Instagram', url: '#', abbr: 'IG' }, { platform: 'Twitter', url: '#', abbr: 'X' }, { platform: 'YouTube', url: '#', abbr: 'YT' }, { platform: 'TikTok', url: '#', abbr: 'TT' }],
        favorites: { iceCream: 'Dulce de leche', drink: 'Fernet con coca', book: 'Rayuela', movie: 'Inception', series: 'Breaking Bad', character: 'Tyler Durden', celebrity: 'Thom Yorke', album: 'In Rainbows', podcast: '99% Invisible', sport: 'Escalada', food: 'Asado', smell: 'Tierra mojada', sound: 'Tormenta', timeOfDay: '11:00 PM', weather: 'Tormenta eléctrica', tattoos: 0 },
        cities: { dreamVisit: 'Reikiavik', wouldntVisit: 'Mumbai', wouldLive: 'Copenhague', bestFood: 'Ciudad de México', wouldPropose: 'Venecia', wouldIsolate: 'Patagonia', meetPeople: 'Berlín', vacation: 'Noruega', allExpensesPaid: 'Islandia', writeBook: 'San Sebastián', recordEpisode: 'Berlín', nostalgia: 'Montevideo' },
      },
    ],
  },

  episodios: {
    title: 'Episodios',
    subtitle: 'Cada ciudad tiene una historia que merece ser contada',
    items: [],
  },

  frecuenciaInterna: {
    title: 'Frecuencia Interna',
    subtitle: 'Las historias que se cuentan cuando la noche ya está avanzada',
    introText: 'Sodaroja es un proyecto independiente que hacemos con amor, pero también con tiempo, energía y recursos. Si te gusta lo que hacemos y querés que sigamos explorando ciudades, contando historias y mejorando la producción, tu apoyo marca una diferencia enorme. No es una transacción, es ser parte de algo.',
    benefitsTitle: 'Qué recibís al unirte',
    benefits: [
      '2 episodios extras por mes',
      'Sorteos exclusivos',
      'Historias más profundas y sin editar',
      'Acceso anticipado a cada episodio',
      'Participación en futuros episodios',
      'Número de Socio Efervescente',
      'Comunidad privada',
      'Sin publicidad',
      'RSS privado',
      'Descuentos en la tienda',
      'Nos ayudás a mejorar el equipo',
      'Ser parte real del proyecto',
    ],
    cancelNote: 'Podés cancelar cuando quieras. Sin compromisos, sin letra chica.',
    plans: [
      { id: 'mate', name: 'Mate', priceARS: 2500, priceUSD: 4, description: 'Un empujoncito que suma mucho', featured: false },
      { id: 'soda', name: 'Soda', priceARS: 5000, priceUSD: 8, description: 'El que más eligen', featured: true },
      { id: 'sifon', name: 'Sifón', priceARS: 12500, priceUSD: 20, description: 'Para los que quieren que esto crezca en serio', featured: false },
    ],
    paymentUrls: {
      mercadoPago: '#',
      international: '#',
      internationalProvider: 'paypal',
    },
  },

  shop: {
    title: 'Archivo Interno',
    subtitle: 'Objetos seleccionados del archivo sodaroja',
    products: [
      { id: 'sticker-pack', name: 'Pack de Stickers', description: 'Colección de stickers del culto', imageUrl: '', price: undefined, purchaseUrl: '#', isComingSoon: true },
    ],
  },

  contacto: {
    title: 'Contacto',
    subtitle: '¿Querés proponernos una ciudad, una historia, o simplemente saludar?',
    email: 'hola@sodaroja.com',
    instagram: '@sodaroja',
  },

  socialLinks: [
    { id: 'ig', platform: 'Instagram', abbr: 'IG', url: '#', visible: true },
    { id: 'x', platform: 'Twitter/X', abbr: 'X', url: '#', visible: true },
    { id: 'yt', platform: 'YouTube', abbr: 'YT', url: '#', visible: true },
    { id: 'sp', platform: 'Spotify', abbr: 'SP', url: '#', visible: true },
    { id: 'sc', platform: 'SoundCloud', abbr: 'SC', url: '#', visible: true },
    { id: 'tt', platform: 'TikTok', abbr: 'TT', url: '#', visible: true },
    { id: 'ap', platform: 'Apple Podcasts', abbr: 'AP', url: '#', visible: true },
  ],

  avatars: [
    { id: 'av1', name: 'Viajero', imageUrl: '' },
    { id: 'av2', name: 'Explorador', imageUrl: '' },
    { id: 'av3', name: 'Nomade', imageUrl: '' },
    { id: 'av4', name: 'Astronauta', imageUrl: '' },
    { id: 'av5', name: 'Pirata', imageUrl: '' },
    { id: 'av6', name: 'Detective', imageUrl: '' },
    { id: 'av7', name: 'Brujita', imageUrl: '' },
    { id: 'av8', name: 'Robot', imageUrl: '' },
    { id: 'av9', name: 'Fantasma', imageUrl: '' },
    { id: 'av10', name: 'Gato', imageUrl: '' },
    { id: 'av11', name: 'Alien', imageUrl: '' },
    { id: 'av12', name: 'Calavera', imageUrl: '' },
  ],

  platforms: [
    { id: 'plt-spotify', name: 'Spotify', url: 'https://open.spotify.com', visible: true },
    { id: 'plt-apple', name: 'Apple Podcasts', url: 'https://podcasts.apple.com', visible: true },
    { id: 'plt-youtube', name: 'YouTube', url: 'https://youtube.com', visible: true },
    { id: 'plt-ivoox', name: 'iVoox', url: 'https://www.ivoox.com', visible: false },
    { id: 'plt-soundcloud', name: 'SoundCloud', url: 'https://soundcloud.com', visible: false },
  ],

  sponsors: [
    { id: 'sp1', name: 'Noblex', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Noblex_logo.svg/200px-Noblex_logo.svg.png', url: 'https://www.noblex.com.ar', visible: true },
    { id: 'sp2', name: 'Personal', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Personal_Argentina_Logo.svg/200px-Personal_Argentina_Logo.svg.png', url: 'https://www.personal.com.ar', visible: true },
    { id: 'sp3', name: 'Universal Assistance', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Universal_Assistance_logo.svg/200px-Universal_Assistance_logo.svg.png', url: 'https://www.universal-assistance.com', visible: true },
    { id: 'sp4', name: 'YPF', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/YPF_logo.svg/200px-YPF_logo.svg.png', url: 'https://www.ypf.com', visible: true },
    { id: 'sp5', name: 'Globant', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Globant_Logo.svg/200px-Globant_Logo.svg.png', url: 'https://www.globant.com', visible: true },
    { id: 'sp6', name: 'Santander', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Banco_Santander_Logotipo.svg/200px-Banco_Santander_Logotipo.svg.png', url: 'https://www.santander.com.ar', visible: true },
  ],

  footerLogoUrl: '',

  soditasConfig: {
    name: 'soditas',
    emoji: '🥤',
  },

  userProfileFields: [
    { id: 'name', label: 'Nombre', type: 'text', required: true, visible: true, placeholder: 'Tu nombre' },
    { id: 'nickname', label: 'Apodo / Cómo te decimos', type: 'text', required: false, visible: true, placeholder: '¿Cómo te gusta que te llamen?' },
    { id: 'email', label: 'Email', type: 'text', required: true, visible: true, placeholder: 'tu@email.com' },
    { id: 'birth', label: 'Mes y año de nacimiento', type: 'month-year', required: false, visible: true },
    { id: 'pronouns', label: 'Pronombres', type: 'select', required: false, visible: true, options: ['Él', 'Ella', 'Elle', 'Prefiero no decir'] },
    { id: 'city', label: 'Ciudad', type: 'text', required: false, visible: true, placeholder: '¿Desde dónde nos escuchás?' },
    { id: 'country', label: 'País', type: 'select', required: false, visible: true, options: [
      '🇦🇫 Afganistán','🇦🇱 Albania','🇩🇿 Argelia','🇦🇩 Andorra','🇦🇴 Angola','🇦🇬 Antigua y Barbuda',
      '🇦🇷 Argentina','🇦🇲 Armenia','🇦🇺 Australia','🇦🇹 Austria','🇦🇿 Azerbaiyán','🇧🇸 Bahamas',
      '🇧🇭 Baréin','🇧🇩 Bangladés','🇧🇧 Barbados','🇧🇾 Bielorrusia','🇧🇪 Bélgica','🇧🇿 Belice',
      '🇧🇯 Benín','🇧🇹 Bután','🇧🇴 Bolivia','🇧🇦 Bosnia y Herzegovina','🇧🇼 Botsuana','🇧🇷 Brasil',
      '🇧🇳 Brunéi','🇧🇬 Bulgaria','🇧🇫 Burkina Faso','🇧🇮 Burundi','🇨🇻 Cabo Verde','🇰🇭 Camboya',
      '🇨🇲 Camerún','🇨🇦 Canadá','🇹🇩 Chad','🇨🇱 Chile','🇨🇳 China','🇨🇴 Colombia',
      '🇰🇲 Comoras','🇨🇬 Congo','🇨🇷 Costa Rica','🇭🇷 Croacia','🇨🇺 Cuba','🇨🇾 Chipre',
      '🇨🇿 Chequia','🇩🇰 Dinamarca','🇩🇯 Yibuti','🇩🇲 Dominica','🇩🇴 Rep. Dominicana',
      '🇪🇨 Ecuador','🇪🇬 Egipto','🇸🇻 El Salvador','🇬🇶 Guinea Ecuatorial','🇪🇷 Eritrea','🇪🇪 Estonia',
      '🇸🇿 Esuatini','🇪🇹 Etiopía','🇫🇯 Fiyi','🇫🇮 Finlandia','🇫🇷 Francia','🇬🇦 Gabón',
      '🇬🇲 Gambia','🇬🇪 Georgia','🇩🇪 Alemania','🇬🇭 Ghana','🇬🇷 Grecia','🇬🇩 Granada',
      '🇬🇹 Guatemala','🇬🇳 Guinea','🇬🇼 Guinea-Bisáu','🇬🇾 Guyana','🇭🇹 Haití','🇭🇳 Honduras',
      '🇭🇺 Hungría','🇮🇸 Islandia','🇮🇳 India','🇮🇩 Indonesia','🇮🇷 Irán','🇮🇶 Irak',
      '🇮🇪 Irlanda','🇮🇱 Israel','🇮🇹 Italia','🇨🇮 Costa de Marfil','🇯🇲 Jamaica','🇯🇵 Japón',
      '🇯🇴 Jordania','🇰🇿 Kazajistán','🇰🇪 Kenia','🇰🇮 Kiribati','🇰🇼 Kuwait','🇰🇬 Kirguistán',
      '🇱🇦 Laos','🇱🇻 Letonia','🇱🇧 Líbano','🇱🇸 Lesoto','🇱🇷 Liberia','🇱🇾 Libia',
      '🇱🇮 Liechtenstein','🇱🇹 Lituania','🇱🇺 Luxemburgo','🇲🇬 Madagascar','🇲🇼 Malaui','🇲🇾 Malasia',
      '🇲🇻 Maldivas','🇲🇱 Malí','🇲🇹 Malta','🇲🇭 Islas Marshall','🇲🇷 Mauritania','🇲🇺 Mauricio',
      '🇲🇽 México','🇫🇲 Micronesia','🇲🇩 Moldavia','🇲🇨 Mónaco','🇲🇳 Mongolia','🇲🇪 Montenegro',
      '🇲🇦 Marruecos','🇲🇿 Mozambique','🇲🇲 Myanmar','🇳🇦 Namibia','🇳🇷 Nauru','🇳🇵 Nepal',
      '🇳🇱 Países Bajos','🇳🇿 Nueva Zelanda','🇳🇮 Nicaragua','🇳🇪 Níger','🇳🇬 Nigeria',
      '🇰🇵 Corea del Norte','🇲🇰 Macedonia del Norte','🇳🇴 Noruega','🇴🇲 Omán','🇵🇰 Pakistán',
      '🇵🇼 Palaos','🇵🇸 Palestina','🇵🇦 Panamá','🇵🇬 Papúa Nueva Guinea','🇵🇾 Paraguay','🇵🇪 Perú',
      '🇵🇭 Filipinas','🇵🇱 Polonia','🇵🇹 Portugal','🇵🇷 Puerto Rico','🇶🇦 Catar','🇷🇴 Rumanía',
      '🇷🇺 Rusia','🇷🇼 Ruanda','🇰🇳 San Cristóbal y Nieves','🇱🇨 Santa Lucía',
      '🇻🇨 San Vicente y las Granadinas','🇼🇸 Samoa','🇸🇲 San Marino','🇸🇹 Santo Tomé y Príncipe',
      '🇸🇦 Arabia Saudita','🇸🇳 Senegal','🇷🇸 Serbia','🇸🇨 Seychelles','🇸🇱 Sierra Leona',
      '🇸🇬 Singapur','🇸🇰 Eslovaquia','🇸🇮 Eslovenia','🇸🇧 Islas Salomón','🇸🇴 Somalia',
      '🇿🇦 Sudáfrica','🇰🇷 Corea del Sur','🇸🇸 Sudán del Sur','🇪🇸 España','🇱🇰 Sri Lanka',
      '🇸🇩 Sudán','🇸🇷 Surinam','🇸🇪 Suecia','🇨🇭 Suiza','🇸🇾 Siria','🇹🇼 Taiwán',
      '🇹🇯 Tayikistán','🇹🇿 Tanzania','🇹🇭 Tailandia','🇹🇱 Timor Oriental','🇹🇬 Togo',
      '🇹🇴 Tonga','🇹🇹 Trinidad y Tobago','🇹🇳 Túnez','🇹🇷 Turquía','🇹🇲 Turkmenistán',
      '🇹🇻 Tuvalu','🇺🇬 Uganda','🇺🇦 Ucrania','🇦🇪 Emiratos Árabes','🇬🇧 Reino Unido',
      '🇺🇸 Estados Unidos','🇺🇾 Uruguay','🇺🇿 Uzbekistán','🇻🇺 Vanuatu','🇻🇦 Vaticano',
      '🇻🇪 Venezuela','🇻🇳 Vietnam','🇾🇪 Yemen','🇿🇲 Zambia','🇿🇼 Zimbabue',
      '🌍 Otro'
    ] },
    { id: 'howFoundUs', label: '¿Cómo nos encontraste?', type: 'select', required: false, visible: true, options: ['Instagram', 'YouTube', 'Un amigo/a', 'Spotify', 'Google', 'TikTok', 'Otro'] },
  ],
};

// ============================================================
// FUNCIONES HELPER — Supabase + localStorage fallback
// ============================================================

// Lectura sincrónica desde localStorage (para primer render)
export const getContent = (): SiteContent => {
  try {
    const stored = localStorage.getItem('sodaroja-content');
    if (stored) {
      return { ...defaultContent, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn('Error loading content from localStorage');
  }
  return defaultContent;
};

// Escritura: guarda en localStorage Y en Supabase
export const saveContent = (content: SiteContent): void => {
  // 1. Guardar en localStorage inmediatamente (para que la UI responda rápido)
  try {
    localStorage.setItem('sodaroja-content', JSON.stringify(content));
  } catch (e) {
    console.warn('Error saving content to localStorage');
  }

  // 2. Persistir en Supabase en background
  import('./supabase').then(({ saveContentToDB }) => {
    saveContentToDB(content).then(({ error }) => {
      if (error) {
        console.warn('Error saving to Supabase, content is safe in localStorage:', error);
      }
    });
  });
};

// Carga asíncrona desde Supabase (llamar al iniciar la app)
// Retorna el contenido más actualizado y sincroniza localStorage
export const loadContentFromDB = async (): Promise<SiteContent> => {
  try {
    const { getContentFromDB } = await import('./supabase');
    const dbContent = await getContentFromDB();
    if (dbContent) {
      // Sincronizar localStorage con la versión de Supabase
      localStorage.setItem('sodaroja-content', JSON.stringify(dbContent));
      return { ...defaultContent, ...dbContent };
    }
  } catch (e) {
    console.warn('Could not load from Supabase, using localStorage:', e);
  }
  return getContent();
};
