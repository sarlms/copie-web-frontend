import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../component/navbar';
import Masonry from '@mui/lab/Masonry';
import './pelliculePhotos.css';
import { io } from 'socket.io-client';
import { useAuthContext } from '../hooks/useAuthContext';

function PelliculePhotos() {
  const { pelliculeId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [pellicule, setPellicule] = useState(null);
  const [likes, setLikes] = useState([]);
  const socket = io(process.env.REACT_APP_BACKEND_URL);
  const { user } = useAuthContext();

  const fetchPhotos = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/photo/pellicule/${pelliculeId}`);
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const fetchPellicule = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/pellicule/${pelliculeId}`);
      setPellicule(response.data);
    } catch (error) {
      console.error('Error fetching pellicule details:', error);
    }
  };

  const fetchUserLikes = async () => {
    if (user && user._id) {
      try {
        const response = await axios.get(`http://localhost:3000/api/photo/likes/user/${user._id}`);
        setLikes(response.data);
      } catch (error) {
        console.error('Error fetching user likes:', error);
      }
    }
  };

  useEffect(() => {
    fetchPhotos();
    fetchPellicule();
    fetchUserLikes();

    const handlePopState = () => {
      fetchPhotos();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user, pelliculeId]);

  const handleLikePhoto = async (photoId, liked, e) => {
    e.stopPropagation();
    if (!user || !user._id) {
      console.error('User not logged in');
      return;
    }
    try {
      if (liked) {
        await axios.delete(`http://localhost:3000/api/like`, {
          data: { userId: user._id, photoId }
        });
        setPhotos(photos.map(photo => {
          if (photo._id === photoId) {
            return {
              ...photo,
              likesCount: photo.likesCount - 1,
              liked: false,
            };
          }
          return photo;
        }));
        setLikes(likes.filter(like => like.photoId !== photoId));
        socket.emit('likeRemoved', { photoId, userId: user._id });
      } else {
        await axios.post(`http://localhost:3000/api/like/create`, {
          userId: user._id,
          photoId,
        });
        setPhotos(photos.map(photo => {
          if (photo._id === photoId) {
            return {
              ...photo,
              likesCount: photo.likesCount + 1,
              liked: true,
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
    return { ...photo, liked };
  });

  return (
    <div>
      <NavBar />
      <h1 className="center-title">
        {pellicule ? `${pellicule.nom}` : 'Loading...'}
      </h1>
      <div className="photos-container">
        {photosWithLikes.length === 0 ? (
          <p>Loading...</p>
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default PelliculePhotos;
