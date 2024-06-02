import React, { useState, useEffect } from 'react';
import NavBar from '../component/navbar';
import { Checkbox, FormControlLabel } from '@mui/material';
import './profil.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProfile } from '../hooks/useProfile';
import { Link, useParams } from 'react-router-dom';
import Masonry from '@mui/lab/Masonry';
import axios from 'axios';
import { io } from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profil = () => {
  const [selectedPellicules, setSelectedPellicules] = useState([]);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [likes, setLikes] = useState([]);
  const [photoURL, setPhotoURL] = useState('');
  const [legende, setLegende] = useState('');
  const [pellicules, setPellicules] = useState([]);
  const { pelliculeId } = useParams();
  const [pellicule, setPellicule] = useState(null);
  const { profile } = useProfile();
  const { user } = useAuthContext();
  const socket = io(process.env.REACT_APP_BACKEND_URL);

  const handlePelliculeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedPellicules([value]);
    } else {
      setSelectedPellicules([]);
    }
  };

  const toggleAddPhotoForm = () => {
    setIsAddingPhoto(!isAddingPhoto);
  };

  const fetchUserPhotos = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/photo/user/${userId}`);
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching user photos:', error);
    }
  };

  const fetchUserLikes = async (userId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/photo/likes/user/${userId}`);
      setLikes(response.data);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  const fetchPellicules = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pellicule`);
      setPellicules(response.data);
    } catch (error) {
      console.error('Error fetching pellicules:', error);
    }
  };

  useEffect(() => {
    fetchPellicules();
  }, []);

  useEffect(() => {
    if (user && user._id) {
      fetchUserPhotos(user._id);
      fetchUserLikes(user._id);
    }
  }, [user]);

  useEffect(() => {
    const fetchPhotos = async () => {
      if (pelliculeId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/photo/pellicule/${pelliculeId}`);
          setPhotos(response.data);
        } catch (error) {
          console.error('Error fetching photos:', error);
        }
      }
    };

    const fetchPellicule = async () => {
      if (pelliculeId) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pellicule/${pelliculeId}`);
          setPellicule(response.data);
        } catch (error) {
          console.error('Error fetching pellicule details:', error);
        }
      }
    };

    fetchPhotos();
    fetchPellicule();
  }, [pelliculeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photoURL || selectedPellicules.length === 0) {
      alert("L'URL de la photo et la sélection d'une pellicule sont obligatoires.");
      return;
    }

    const selectedPellicule = pellicules.find(p => p.nom === selectedPellicules[0]);

    if (!selectedPellicule) {
      alert("Pellicule non trouvée");
      return;
    }

    const newPhoto = {
      userId: user._id,
      pelliculeId: selectedPellicule._id,
      photoURL,
      legende,
    };

    console.log('New photo data:', newPhoto);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/photo/create`, newPhoto);
      console.log('Response from server:', response.data);
      setPhotos([...photos, response.data]);
      socket.emit('createPhoto', response.data);
      setPhotoURL('');
      setLegende('');
      setSelectedPellicules([]);
      setIsAddingPhoto(false);
      toast.success('Photo postée avec succès !'); // Afficher une notification de succès
    } catch (error) {
      console.error('Error posting photo:', error);
      toast.error('Erreur lors de la publication de la photo.'); // Afficher une notification d'erreur
    }
  };

  const handleDeletePhoto = async (photoId, e) => {
    e.stopPropagation(); // Empêche la navigation vers la page de détail de la photo
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/photo/${photoId}`);
      setPhotos(photos.filter(photo => photo._id !== photoId));
      toast.success('Photo supprimée avec succès !'); // Afficher une notification de succès
      socket.emit('deletePhoto', photoId);
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('Erreur lors de la suppression de la photo.'); // Afficher une notification d'erreur
    }
  };

  const handleLikePhoto = async (photoId, liked) => {
    try {
      if (liked) {
        // Déliker la photo
        const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/like`, {
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
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/like/create`, {
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

  if (profile) {
    // Vérifiez les likes de l'utilisateur pour chaque photo
    const photosWithLikes = photos.map(photo => {
      const liked = likes.some(like => like.photoId === photo._id);
      return { ...photo, liked };
    });

    return (
      <div className="page-container">
        <NavBar />
        <ToastContainer />
        <h1 className="center-title">PROFIL</h1>
        <div className="profile-wrapper">
          <div className="profile-container">
            <div className="profile-picture">
              <img src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/depositphotos_526270308-stock-illustration-smile-emotion-vector-icon-illustration.jpg" alt="Profil" />
            </div>
            <div className="user-info">
              <h2>VOS INFOS</h2>
              {profile.role === 'admin' ? (
              <h3>({profile.role})</h3>):
              (<h2>Bienvenue !</h2>)
              }
              <p>Nom : {profile.nom}</p>
              <p>Prénom : {profile.prenom}</p>
              <p>Pseudo : {profile.pseudo}</p>
              <p>Adresse email : {profile.email}</p>
            </div>
            <div className="add-photo">
              <button onClick={toggleAddPhotoForm}>POSTER UNE PHOTO</button>
              {isAddingPhoto && (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="URL"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Légende (facultatif)"
                      value={legende}
                      onChange={(e) => setLegende(e.target.value)}
                    />
                  </div>
                  <h3 className="film-label">Pellicule utilisée :</h3>
                  {pellicules.map(pellicule => (
                    <div key={pellicule._id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedPellicules.includes(pellicule.nom)}
                            onChange={handlePelliculeChange}
                            value={pellicule.nom}
                            color="primary"
                          />
                        }
                        label={pellicule.nom}
                      />
                    </div>
                  ))}
                  <button type="submit">POSTER</button>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="user-photos">
          <h2>Toutes vos photos :</h2>
          {photosWithLikes.length > 0 ? (
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
                          onClick={(e) => handleLikePhoto(photo._id, photo.liked)}
                          className="like-icon"
                        />
                        <span>{photo.likesCount}</span>
                        <img src="https://static.vecteezy.com/system/resources/previews/018/887/859/non_2x/speech-bubble-icon-png.png" alt="Comments" style={{ marginLeft: '10px' }} />
                        <span>{photo.commentsCount}</span>
                      </div>
                      <img
                        src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/veille%20soutenance/poubelle%20(1).png"
                        alt="Delete"
                        className="delete-icon"
                        onClick={(e) => handleDeletePhoto(photo._id, e)}
                      />
                    </div>
                    {photo.legende && <p className="photo-legende">{photo.legende}</p>}
                  </div>
                </div>
              ))}
            </Masonry>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <h4>DEDICACE A WAYNE...</h4>
      </div>
    );
  } else {
    return (
      <div>
        <h1>pas de user</h1>
      </div>
    );
  }
};

export default Profil;