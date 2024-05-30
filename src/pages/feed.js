import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Masonry from '@mui/lab/Masonry';
import { styled } from '@mui/material/styles';
import NavBar from '../component/navbar';
import './feed.css';
import { io } from 'socket.io-client';
import { useAuthContext } from '../hooks/useAuthContext';

const PhotoContainer = styled('div')({
  padding: '20px',
});

const Feed = () => {
  const [photos, setPhotos] = useState([]);
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = io(process.env.REACT_APP_BACKEND_URL);
  const { user } = useAuthContext();

  const fetchRandomPhotos = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/photo`);
      const randomPhotos = response.data.sort(() => 0.5 - Math.random()).slice(0, 20);
      const photosWithExpiry = { data: randomPhotos, expiry: Date.now() + 3600000 }; // 1 hour expiry
      localStorage.setItem('photos', JSON.stringify(photosWithExpiry));
      setPhotos(randomPhotos);
      setError(null);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError('Erreur lors du chargement des photos.');
    }
    setLoading(false);
  };

  const fetchUserLikes = async () => {
    if (user && user._id) {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/photo/likes/user/${user._id}`);
        setLikes(response.data);
      } catch (error) {
        console.error('Error fetching user likes:', error);
      }
    }
  };

  useEffect(() => {
    const cachedPhotos = localStorage.getItem('photos');
    if (cachedPhotos) {
      const photosObject = JSON.parse(cachedPhotos);
      if (photosObject.expiry > Date.now()) {
        setPhotos(photosObject.data);
        setLoading(false);
      } else {
        fetchRandomPhotos();
      }
    } else {
      fetchRandomPhotos();
    }

    fetchUserLikes();

    const handlePopState = () => {
      fetchRandomPhotos();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user]);

  const handleLikePhoto = async (photoId, liked, e) => {
    e.stopPropagation(); // Arrête la propagation de l'événement de clic
    if (!user || !user._id) {
      console.error('User not logged in');
      return;
    }
    try {
      if (liked) {
        // Déliker la photo
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/like`, {
          data: { userId: user._id, photoId }
        });
        setPhotos(photos.map(photo => {
          if (photo._id === photoId) {
            return {
              ...photo,
              likesCount: photo.likesCount - 1,
              liked: false, // Mettre à jour l'état de like
            };
          }
          return photo;
        }));
        setLikes(likes.filter(like => like.photoId !== photoId));
        socket.emit('likeRemoved', { photoId, userId: user._id });
      } else {
        // Liker la photo
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/like/create`, {
          userId: user._id,
          photoId,
        });
        setPhotos(photos.map(photo => {
          if (photo._id === photoId) {
            return {
              ...photo,
              likesCount: photo.likesCount + 1,
              liked: true, // Mettre à jour l'état de like
            };
          }
          return photo;
        }));
        setLikes([...likes, { photoId, userId: user._id }]);
        socket.emit('likeAdded', { photoId, userId: user._id });
      }
    } catch (error) {
      console.error('Error liking or unliking photo:', error);
    }
  };

  useEffect(() => {
    socket.on('likeAdded', ({ photoId }) => {
      setPhotos(photos => photos.map(photo => {
        if (photo._id === photoId) {
          return {
            ...photo,
            likesCount: photo.likesCount + 1,
            liked: true,
          };
        }
        return photo;
      }));
    });

    socket.on('likeRemoved', ({ photoId }) => {
      setPhotos(photos => photos.map(photo => {
        if (photo._id === photoId) {
          return {
            ...photo,
            likesCount: photo.likesCount - 1,
            liked: false,
          };
        }
        return photo;
      }));
    });

    return () => {
      socket.off('likeAdded');
      socket.off('likeRemoved');
    };
  }, [socket]);

  const photosWithLikes = photos.map(photo => {
    const liked = likes.some(like => like.photoId === photo._id);
    return { ...photo, liked, likesCount: liked ? photo.likesCount : photo.likesCount };
  });

  return (
    <div>
      <NavBar />
      <h1 className="center-title">FEED</h1>
      <h2 className="sub-title">Découvrez de nouvelles pellicules !</h2>
      <h2 className="description">Vos 20 photos aléatoires</h2>
      {loading ? (
        <p>Chargement des photos...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <PhotoContainer>
          <Masonry columns={3} spacing={3}>
            {photosWithLikes.map((photo) => (
              <div key={photo._id} className="photo-container">
                <div className="photo-inner-container">
                  <Link to={`/photoDetail/${photo._id}`} className="photo-link">
                    <img src={photo.photoURL} alt={photo.legende} className="photo" />
                  </Link>
                  <div className="photo-overlay">
                    <div className="overlay-content">
                      <img
                        src={photo.liked ? "https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/veille%20soutenance/coeur.png" : "https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/white-heart_1f90d.png"}
                        alt="Likes"
                        onClick={(e) => handleLikePhoto(photo._id, photo.liked, e)}
                        className="like-icon"
                      />
                      <span>{photo.likesCount}</span>
                      <img src="https://static.vecteezy.com/system/resources/previews/018/887/859/non_2x/speech-bubble-icon-png.png" alt="Comments" style={{ marginLeft: '10px' }} />
                      <span>{photo.commentsCount}</span>
                    </div>
                  </div>
                  {photo.legende && <p className="photo-legende">{photo.legende}</p>}
                </div>
              </div>
            ))}
          </Masonry>
        </PhotoContainer>
      )}
    </div>
  );
};

export default Feed;
