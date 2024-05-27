import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import NavBar from '../component/navbar';
import './avrile-sans-condensed.css';
import './bebas-neue.css';


const StyledRouterLink = styled(RouterLink)(({ theme }) => ({
  color: 'white',
  marginRight: '20px',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
  fontFamily: 'Bebas Neue',
}));

const GlitchText = styled(Typography)({
    fontFamily: 'Bebas Neue',
    color: '#42240F',
    fontSize: '5rem',
    marginTop: '100px',
    position: 'absolute',
    textAlign: 'center',
    transform: 'translateX(-50%)', // Centrer horizontalement
    left: '50%', // Positionner le titre au centre de la page
    whiteSpace: 'nowrap',
    fontWeight: 'bold',
    '&::before': {
      content: 'attr(data-text)',
      position: 'absolute',
      textAlign: 'center',
      left: '-2px',
      top: '0',
      color: '#ff0000',
      zIndex: '-2',
    },
    '&::after': {
      content: 'attr(data-text)',
      position: 'absolute',
      textAlign: 'center',
      left: '2px',
      top: '0',
      color: '#00ffff',
      zIndex: '-3',
    },
  });
  
const Accueil = () => {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <NavBar/>
      <GlitchText variant="h1" data-text="L’argentique, comment ça marche ?">
        L’argentique, comment ça marche ?
      </GlitchText>
      <Box sx={{ mt: 0, p: 31, maxWidth: '800px', margin: 'auto'}}>
        {/* PHOTO --- TEXTE */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 9}}>
            <img
                src="https://i.pinimg.com/564x/f7/12/e1/f712e1a35058d4ec2c28d0e8bc465907.jpg"
                alt="Photo"
                width={400}
                height={450}
            />
            <Typography variant="body1" sx={{ flex: 1, textAlign: 'justify', fontSize: '1rem', lineHeight: 1.5, fontFamily: 'Avrile Sans Condensed, sans-serif'}}>
            Dans le monde de la photographie, l'appareil photo argentique conserve une place spéciale, offrant une expérience unique et un charme vintage inimitable. Son fonctionnement repose sur des principes simples mais essentiels, qui capturent l'essence même de la photographie analogique. L'essentiel d'un appareil photo argentique réside dans son processus de capturer et d'immortaliser des moments sur un support physique, le film. Chaque composant de cet appareil, des objectifs à l'obturateur, travaille en harmonie pour créer des images qui sont gravées dans l'histoire photographique.
            </Typography>
        </Box>


        {/* TEXTE --- PHOTO */}
        <Box sx={{ mt: 6, display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, alignItems: 'center', gap: 9 }}>
            <Typography variant="body1" sx={{ flex: 1, textAlign: 'justify', fontSize: '1rem', lineHeight: 1.5, fontFamily: 'Avrile Sans Condensed, sans-serif' }}>
            L'objectif, tel l'œil de l'appareil, concentre la lumière provenant de la scène à photographier. Associé à un diaphragme et un obturateur, il ajuste la quantité de lumière et la durée d'exposition pour créer une image nette et bien exposée. Le viseur, fenêtre sur le monde, offre au photographe une perspective unique pour composer son image. Qu'il s'agisse d'un viseur optique ou électronique, il permet de visualiser la scène et de capturer l'instant avec précision.
            </Typography>
            <img
                src="https://i.pinimg.com/564x/de/1b/c9/de1bc91ca6a75fd539c83bb1c82b2fde.jpg"
                alt="Photo"
                width={400}
                height={550}
            />
        </Box>



        {/* PHOTO --- TEXTE */}
        <Box sx={{ mt: 6, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 9 }}>
            <img
                src="https://i.pinimg.com/564x/e9/b2/55/e9b255ab3d2f1897fdf127bc6f0c70cb.jpg"
                alt="Photo"
                width={300}
                height={550}
            />
            <Typography variant="body1" sx={{ flex: 1, textAlign: 'justify', fontSize: '1rem', lineHeight: 1.5, fontFamily: 'Avrile Sans Condensed, sans-serif' }}>
            Le film, élément crucial de la photographie argentique, est chargé dans l'appareil avec soin. Sensible à la lumière, il enregistre chaque photon qui le frappe, capturant ainsi l'essence même de la scène à photographier. Le déclencheur, lien entre le photographe et son sujet, déclenche l'obturateur pour capturer l'image. C'est à ce moment précis que la magie opère, figeant l'instant pour l'éternité. Après la prise de vue, le film est avancé pour exposer une nouvelle portion de pellicule, prêt à capturer de nouveaux souvenirs. Une fois toutes les images capturées, le film est soigneusement rembobiné, prêt à être développé et révélé.
            </Typography>
        </Box>


    {/* TEXTE --- PHOTO */}
    <Box sx={{ mt: 6, display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, alignItems: 'center', gap: 9 }}>
        <Typography variant="body1" sx={{ flex: 1, textAlign: 'justify', fontSize: '1rem', lineHeight: 1.5, fontFamily: 'Avrile Sans Condensed, sans-serif' }}>
        Le développement du film, étape cruciale du processus, révèle les images cachées sur le film. Par une série de bains chimiques, les images prennent vie, capturant les détails et les émotions avec une clarté saisissante. Ainsi, l'appareil photo argentique transcende le simple acte de prendre une photo pour devenir une véritable œuvre d'art. Son fonctionnement, empreint de tradition et de savoir-faire, continue de captiver les passionnés de photographie à travers le monde, préservant ainsi l'héritage de la photographie analogique.
        </Typography>
        <img
            src="https://i.imgur.com/1Qr9lZ0.jpeg"
            alt="Photo"
            width={400}
            height={450}
        />
    </Box>
        
    </Box>
    </Box>
  );
}

export default Accueil;
