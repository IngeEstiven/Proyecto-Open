const COMPRA = {
  titulo: 'Finalizar Pedido',
  subtitulo: 'Completa los datos para registrar tu pedido (no se realiza ningún cobro).',
  cuenta: {
    titulo: 'Información de Cuenta',
    campos: [
      { etiqueta: 'Correo Electrónico', tipo: 'email', placeholder: 'tu@correo.com' },
      { etiqueta: 'Nombre Completo', tipo: 'text', placeholder: 'Tu nombre' },
      { etiqueta: 'Teléfono', tipo: 'tel', placeholder: '+1234567890' }
    ]
  },
  plataformas: {
    titulo: 'Plataforma',
    opciones: [
      { texto: 'PC', marcado: true },
      { texto: 'PlayStation', marcado: false },
      { texto: 'Nintendo Switch', marcado: false },
      { texto: 'Xbox', marcado: false }
    ]
  },
  envio: {
    titulo: 'Dirección de Envío',
    campos: [
      { etiqueta: 'Dirección', tipo: 'text', placeholder: 'Calle y número' },
      { etiqueta: 'Ciudad', tipo: 'text', placeholder: 'Tu ciudad' },
      { etiqueta: 'Código Postal', tipo: 'text', placeholder: '12345' }
    ]
  },
  botonConfirmar: 'CONFIRMAR PEDIDO'
};

const TIP_VIDEO = 'Tip: Si experimentas lag, reduce la calidad a 720p';
const AYUDA_GALERIA = 'Usa las flechas o las miniaturas para navegar.';

export const FICHAS = {
  awayout: {
    titulo: 'A Way Out',
    etiquetas: ['Cooperativo', 'Aventura', 'Indie'],
    sinopsis:
      'A Way Out es una aventura exclusivamente cooperativa en la que te metes en la piel de uno de los dos reclusos protagonistas en su intrépida fuga de la cárcel.',
    desarrollador: 'Hazelight Studios',
    lanzamiento: '23 MAR 2018',
    plataformas: 'PS5, PS4, Xbox, PC',
    puntuacion: '⭐ 8.7 / 10',
    precio: '$2.73',
    descuento: null,
    banner:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRxABfgW_hL09lb4B_Ot7eghdZzPzQvO6w5g&s',
    caratula: '/img/juegos/awayout.png',
    ctaTexto: 'COMPRAR AHORA ($2.73)',
    video: {
      youtubeId: '_ApSmPvxz1o',
      titulo: 'Trailer Oficial',
      descripcion: 'Vive la aventura cooperativa más emocionante con este adelanto oficial.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/awayout.png', caption: 'Leo y Vincent (1)' },
        { imagen: '/img/juegos/galeria/way_gal2.jpg', caption: 'Fuga de prisión (2)' },
        { imagen: '/img/juegos/galeria/way_gal3.jpg', caption: 'Cooperativo en pantalla dividida (3)' },
        { imagen: '/img/juegos/galeria/way_gal4.jpg', caption: 'La huida comienza (4)' }
      ]
    },
    compra: COMPRA
  },
  callofduty: {
    titulo: 'Call of Duty WWII',
    etiquetas: ['Acción', 'FPS', 'Multijugador'],
    sinopsis:
      'Desembarca en Normandía el Día D y combate por toda Europa en los lugares emblemáticos de la guerra más grande de la historia.',
    desarrollador: 'Sledgehammer Games',
    lanzamiento: '2 NOV 2017',
    plataformas: 'PS5, PS4, Xbox, PC',
    puntuacion: '⭐ 7.0 / 10',
    precio: '$23.81',
    descuento: null,
    banner:
      'https://www.activision.com/content/dam/atvi/activision/atvi-touchui/activision/games/game-details/call-of-duty/wwii/cod-wwii-logo.png',
    caratula: '/img/juegos/callofduty.jpg',
    ctaTexto: 'COMPRAR AHORA ($23.81)',
    video: {
      youtubeId: 'D4Q_XYVescc',
      titulo: 'Trailer Oficial',
      descripcion: 'Vive la experiencia épica de la Segunda Guerra Mundial.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/galeria/cod_gal1.jpeg', caption: 'Desembarco en Normandía (1)' },
        { imagen: '/img/juegos/galeria/cod_gal2.jpg', caption: 'Combate en Europa (2)' },
        { imagen: '/img/juegos/galeria/cod_gal3.jpg', caption: 'Multijugador (3)' },
        { imagen: '/img/juegos/galeria/cod_gal4.jpg', caption: 'Segunda Guerra Mundial (4)' }
      ]
    },
    compra: COMPRA
  },
  efootball: {
    titulo: 'eFootball',
    etiquetas: ['Deportes', 'Simuladores', 'Free to Play'],
    sinopsis:
      'PES ha evolucionado para convertirse en eFootball™. Disfruta ya de la nueva generación de juegos de fútbol.',
    desarrollador: 'KONAMI',
    lanzamiento: '29 SEP 2021',
    plataformas: 'PS5, PS4, Xbox, PC, iOS, Android',
    puntuacion: '⭐ 6.5 / 10',
    precio: '$0.00',
    descuento: null,
    banner:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Alternative_EFootball_2026_black_logo.svg/1280px-Alternative_EFootball_2026_black_logo.svg.png',
    caratula: '/img/juegos/efootball.jpg',
    ctaTexto: 'COMPRAR AHORA ($0.00)',
    video: {
      youtubeId: 'ysweRpG6XBA',
      titulo: 'Trailer Oficial',
      descripcion: 'Vive la experiencia del fútbol en la nueva generación.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/galeria/ef_gal1.png', caption: 'Nueva generación del fútbol (1)' },
        { imagen: '/img/juegos/galeria/ef_gal2.jpg', caption: 'Jugabilidad (2)' },
        { imagen: '/img/juegos/galeria/ef_gal3.jpg', caption: 'Modo Dream Team (3)' },
        { imagen: '/img/juegos/galeria/ef_gal4.jpeg', caption: 'Sucesor de PES (4)' }
      ]
    },
    compra: COMPRA
  },
  fc: {
    titulo: 'EA FC 26',
    etiquetas: ['Deportes', 'Simuladores', 'De pago'],
    sinopsis:
      'El Club es tuyo en EA SPORTS FC™ 26. Juega a tu manera con una experiencia de juego renovada impulsada por los comentarios de la comunidad.',
    desarrollador: 'EA Canada, EA Romania',
    lanzamiento: '25 SEP 2025',
    plataformas: 'PS5, PS4, Xbox, PC, Switch',
    puntuacion: '⭐ 9.5 / 10',
    precio: '$76.44',
    descuento: null,
    banner:
      'https://gaming-cdn.com/images/news/articles/13774/cover/1000x563/ea-sports-fc-26-releases-on-september-26-cover68778afd733aa.jpg',
    caratula: '/img/juegos/fc.jpg',
    ctaTexto: 'COMPRAR AHORA ($76.44)',
    video: {
      youtubeId: 'TSi0iJYSQ24',
      titulo: 'Trailer Oficial',
      descripcion: 'Vive la experiencia del fútbol con gráficos de nueva generación.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/fc.jpg', caption: 'Portada oficial (1)' },
        { imagen: '/img/juegos/galeria/fc_gal1.jpg', caption: 'Jugabilidad (2)' },
        { imagen: '/img/juegos/galeria/fc_gal2.jpg', caption: 'Modo Ultimate Team (3)' },
        { imagen: '/img/juegos/galeria/fc_gal3.jpg', caption: 'El club es tuyo (4)' }
      ]
    },
    compra: COMPRA
  },
  gow: {
    titulo: 'God of War Ragnarök',
    etiquetas: ['Acción', 'Aventura', 'Rol'],
    sinopsis:
      'Kratos y Atreus se embarcan en una mítica aventura en busca de respuestas y aliados antes de la llegada del Ragnarök.',
    desarrollador: 'Santa Monica Studio',
    lanzamiento: '19 SEP 2024',
    plataformas: 'PS5, PS4, PC',
    puntuacion: '⭐ 9.8 / 10',
    precio: '$39.88',
    descuento: null,
    banner: 'https://bearmccreary.com/wp-content/uploads/2024/03/GOWRV_Logo.png',
    caratula: '/img/juegos/gow.png',
    ctaTexto: 'COMPRAR AHORA ($39.88)',
    video: {
      youtubeId: 'EE-4GvjKcfs',
      titulo: 'Trailer Oficial',
      descripcion: 'La épica conclusión de la saga nórdica de Kratos.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/galeria/gow_gal1.jpg', caption: 'Kratos y Atreus (1)' },
        { imagen: '/img/juegos/galeria/gow_gal2.jpg', caption: 'Reinos nórdicos (2)' },
        { imagen: '/img/juegos/galeria/gow_gal3.jpeg', caption: 'Combate épico (3)' },
        { imagen: '/img/juegos/galeria/gow_gal4.jpg', caption: 'El Ragnarök se acerca (4)' }
      ]
    },
    compra: COMPRA
  },
  gridlegends: {
    titulo: 'GRID Legends',
    etiquetas: ['Carreras', 'Arcade', 'Multijugador'],
    sinopsis:
      'Compite en los eventos de carreras más espectaculares del mundo con una historia cinematográfica y modo multijugador online.',
    desarrollador: 'Codemasters',
    lanzamiento: '24 FEB 2022',
    plataformas: 'PS5, PS4, Xbox, PC, Switch',
    puntuacion: '⭐ 8.7 / 10',
    precio: '$19.75',
    descuento: null,
    banner: 'https://www.nme.com/wp-content/uploads/2022/02/Grid-Legends-London.jpg',
    caratula: '/img/juegos/gridlegends.jpg',
    ctaTexto: 'COMPRAR AHORA ($19.75)',
    video: {
      youtubeId: '1Vgj1I3YG8g',
      titulo: 'Trailer Oficial',
      descripcion: 'La competición automovilística más espectacular.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/galeria/grid_gal1.jpg', caption: 'Carreras extremas (1)' },
        { imagen: '/img/juegos/galeria/grid_gal2.jpg', caption: 'Jugabilidad (2)' },
        { imagen: '/img/juegos/galeria/grid_gal3.jpeg', caption: 'Historia de conducción (3)' },
        { imagen: '/img/juegos/galeria/grid_gal4.webp', caption: 'Eventos de ensueño (4)' }
      ]
    },
    compra: COMPRA
  },
  halo: {
    titulo: 'Halo Infinite',
    etiquetas: ['Acción', 'Free to Play', 'Disparos'],
    sinopsis:
      'Halo Infinite incluye una amplia campaña de mundo abierto y una dinámica experiencia multijugador gratuita.',
    desarrollador: '343 Industries',
    lanzamiento: '15 NOV 2021',
    plataformas: 'Xbox Series, Xbox One, PC',
    puntuacion: '⭐ 8.6 / 10',
    precio: '$0.00',
    descuento: null,
    banner:
      'https://blobs-infiniteugc.svc.halowaypoint.com/ugcstorage/ugcgamevariant/3f1892eb-8834-4baa-84ff-0b67fd8e074f/530b5640-d7f6-4f0c-ac0d-33fd09a005f5/images/thumbnail.png',
    caratula: '/img/juegos/halo.png',
    ctaTexto: 'COMPRAR AHORA ($0.00)',
    video: {
      youtubeId: 'PyMlV5_HRWk',
      titulo: 'Trailer Oficial',
      descripcion: 'Explora el combate y el vasto mundo de Zeta Halo.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/galeria/halo_gal1.webp', caption: 'Campaña principal (1)' },
        { imagen: '/img/juegos/galeria/halo_gal2.jpg', caption: 'Multijugador (2)' },
        { imagen: '/img/juegos/galeria/halo_gal3.webp', caption: 'Mundo de Zeta Halo (3)' },
        { imagen: '/img/juegos/galeria/halo_gal4.jpg', caption: 'Jefe Maestro (4)' }
      ]
    },
    compra: COMPRA
  },
  horizon: {
    titulo: 'Horizon Zero Dawn Remastered',
    etiquetas: ['Acción y Aventura', 'Mundo Abierto', 'Rol'],
    sinopsis:
      'Disfruta de Horizon Zero Dawn™ con un impresionante apartado gráfico renovado. Colosales máquinas dominan la Tierra mientras los humanos sobreviven entre ruinas.',
    desarrollador: 'Guerrilla Games, Nixxes',
    lanzamiento: '31 OCT 2024',
    plataformas: 'PC, PlayStation 5',
    puntuacion: '⭐ 9.8 / 10',
    precio: '$59.99',
    descuento: null,
    banner:
      'https://media.game.es///ScreenShootsV2//236//236321//Horizon_Zero_Dawn_Remastered_Playstation_5_236321_4_xxl.png',
    caratula: '/img/juegos/horizon.png',
    ctaTexto: 'COMPRAR AHORA ($59.99)',
    video: {
      youtubeId: '_BvZvkT5QHw',
      titulo: 'Trailer Oficial',
      descripcion: 'Una aventura épica en un mundo dominado por máquinas.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/galeria/horizon_gal1.webp', caption: 'Mundo abierto (1)' },
        { imagen: '/img/juegos/galeria/horizon_gal2.webp', caption: 'Combate contra máquinas (2)' },
        { imagen: '/img/juegos/galeria/horizon_gal3.jpg', caption: 'Exploración (3)' },
        { imagen: '/img/juegos/galeria/horizon_gal4.webp', caption: 'Aloy en acción (4)' }
      ]
    },
    compra: COMPRA
  },
  ittakestwo: {
    titulo: 'It Takes Two',
    etiquetas: ['Cooperativo', 'Multijugador', 'Acción'],
    sinopsis:
      'Cody y May, una conflictiva pareja convertida en muñecos, deben juntos salvar su relación rota en un mundo fantástico lleno de sorpresas.',
    desarrollador: 'Hazelight Studios',
    lanzamiento: '26 MAR 2021',
    plataformas: 'PS5, PS4, Xbox, PC, Switch',
    puntuacion: '⭐ 8.9 / 10',
    precio: '$43.68',
    descuento: null,
    banner:
      'https://assetsio.gnwcdn.com/it%20takes%20two%20preview%208.jpg?width=1600&height=900&fit=crop&quality=100&format=png&enable=upscale&auto=webp',
    caratula: '/img/juegos/ittakestwo.jpg',
    ctaTexto: 'COMPRAR AHORA ($43.68)',
    video: {
      youtubeId: 'ohClxMmNLQQ',
      titulo: 'Trailer Oficial',
      descripcion: 'Una aventura cooperativa que reta tu relación.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/galeria/it_gal1.avif', caption: 'Mundo fantástico (1)' },
        { imagen: '/img/juegos/galeria/it_gal2.jpg', caption: 'Jugabilidad cooperativa (2)' },
        { imagen: '/img/juegos/galeria/it_gal3.avif', caption: 'Aventura en pareja (3)' },
        { imagen: '/img/juegos/galeria/it_gal4.webp', caption: 'Momentos mágicos (4)' }
      ]
    },
    compra: COMPRA
  },
  nba2k26: {
    titulo: 'NBA 2K26',
    etiquetas: ['Deportes', 'Baloncesto', 'Simulación'],
    sinopsis:
      'El derecho a presumir está en juego en Mi CARRERA, MyTEAM y más. Exhibe tu colección de movimientos con hiperrealismo gracias a la tecnología ProPLAY™.',
    desarrollador: 'Visual Concepts',
    lanzamiento: '05 SEP 2025',
    plataformas: 'PS5, PS4, Xbox, PC, Switch',
    puntuacion: '⭐ 7.2 / 10',
    precio: '$24.30',
    descuento: null,
    banner: 'https://cdn.prgloo.com/media/87099ac6d4c5453ba44c6301a88abeae.jpg?width=968&height=1452',
    caratula: '/img/juegos/nba2k26.jpg',
    ctaTexto: 'COMPRAR AHORA ($24.30)',
    video: {
      youtubeId: 'Mh57YWNaQC4',
      titulo: 'Trailer Oficial',
      descripcion: 'La experiencia de baloncesto más realista.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/nba2k26.jpg', caption: 'Mi CARRERA (1)' },
        { imagen: '/img/juegos/nba2k26.jpg', caption: 'MyTEAM (2)' },
        { imagen: '/img/juegos/nba2k26.jpg', caption: 'Tecnología ProPLAY (3)' },
        { imagen: '/img/juegos/nba2k26.jpg', caption: 'Modo competitivo (4)' }
      ]
    },
    compra: COMPRA
  },
  residentevil: {
    titulo: 'Resident Evil Village',
    etiquetas: ['Terror', 'Supervivencia', 'Primera Persona'],
    sinopsis:
      'Vive el survival horror como nunca antes. Terror más realista e inescapable, con gráficos hiperdetallados y una trama magistral.',
    desarrollador: 'CAPCOM Co., Ltd.',
    lanzamiento: '07 MAY 2021',
    plataformas: 'PS5, PS4, Xbox, PC, Switch',
    puntuacion: '⭐ 8.3 / 10',
    precio: '$33.25',
    descuento: null,
    banner:
      'https://images.squarespace-cdn.com/content/v1/5ed1b3e73b87d766d1c49146/1627340302779-YNMZ1HLN0AXSMKGW9O69/RE-Village.png',
    caratula: '/img/juegos/residentevil.jpg',
    ctaTexto: 'COMPRAR AHORA ($33.25)',
    video: {
      youtubeId: 'ztj8fv6Ttp8',
      titulo: 'Trailer Oficial',
      descripcion: 'El survival horror definitivo.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/residentevil.jpg', caption: 'El pueblo (1)' },
        { imagen: '/img/juegos/galeria/re_gal1.webp', caption: 'Supervivencia (2)' },
        { imagen: '/img/juegos/galeria/re_gal2.webp', caption: 'Terror en 1.ª persona (3)' },
        { imagen: '/img/juegos/galeria/re_gal3.webp', caption: 'Trama magistral (4)' }
      ]
    },
    compra: COMPRA
  },
  uncharted4: {
    titulo: 'Uncharted: Legacy of Thieves',
    etiquetas: ['Acción', 'Aventura', 'Disparos'],
    sinopsis:
      'Nathan Drake y Chloe Frazer en sus aventuras independientes. Incluye Uncharted 4: El final de un ladrón y Uncharted: El legado perdido.',
    desarrollador: 'Naughty Dog, Iron Galaxy',
    lanzamiento: '19 OCT 2022',
    plataformas: 'PS5, PS4, PC',
    puntuacion: '⭐ 9.0 / 10',
    precio: '$16.58',
    descuento: null,
    banner: 'https://i.blogs.es/f8573e/uncharted-pc-collection-resena-resena/1366_2000.jpeg',
    caratula: '/img/juegos/uncharted4.jpg',
    ctaTexto: 'COMPRAR AHORA ($16.58)',
    video: {
      youtubeId: 'xeMA3O9pfiY',
      titulo: 'Trailer Oficial',
      descripcion: 'Aventura y acción sin límites.',
      tip: TIP_VIDEO
    },
    galeria: {
      titulo: 'Galería',
      ayuda: AYUDA_GALERIA,
      imagenes: [
        { imagen: '/img/juegos/galeria/unch_gal1.jpg', caption: 'Nathan Drake (1)' },
        { imagen: '/img/juegos/galeria/unch_gal2.webp', caption: 'Chloe Frazer (2)' },
        { imagen: '/img/juegos/galeria/unch_gal3.webp', caption: 'El legado perdido (3)' },
        { imagen: '/img/juegos/galeria/unch_gal4.avif', caption: 'El final de un ladrón (4)' }
      ]
    },
    compra: COMPRA
  }
};
