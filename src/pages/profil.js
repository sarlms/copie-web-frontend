import React, { useState, useEffect } from 'react';
import NavBar from '../component/navbar';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import './profil.css';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProfile } from '../hooks/useProfile';
import Masonry from '@mui/lab/Masonry';
import axios from 'axios';

const Profil = () => {
  const [selectedPellicules, setSelectedPellicules] = useState([]);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photos, setPhotos] = useState([]);
  
  const { profile } = useProfile(); // Corrected variable name
  const { user } = useAuthContext();

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
      const response = await axios.get(`http://localhost:3000/api/photo/user/${userId}`);
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching user photos:', error);
    }
  };

  useEffect(() => {
    if (user && user._id) {
      fetchUserPhotos(user._id);
    }
  }, [user]);

  const pellicules = [
    "FUJICOLOR - C200",
    "FUJIFILM - XTRA",
    "KODAK - 400 TMAX",
    "KODAK - COLORPLUS",
    "KODAK - EKTRA",
    "KODAK - GOLD",
    "KODAK - PORTRA",
    "KODAK - PRO IMAGE",
    "KODAK - ULTRAMAX",
    "WASHI - A",
    "WASHI - X"
  ];

  if (profile) {
    return (
      <div className="page-container">
        <NavBar />
        <h1 className="center-title">PROFIL</h1>
        <div className="profile-wrapper">
          <div className="profile-container">
            <div className="profile-picture">
              <img src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/depositphotos_526270308-stock-illustration-smile-emotion-vector-icon-illustration.jpg" alt="Profil" />
            </div>
            <div className="user-info">
              <h2>VOS INFOS</h2>
              <p>Nom : {profile.nom}</p>
              <p>Prénom : {profile.prenom}</p>
              <p>Pseudo : {profile.pseudo}</p>
              <p>Adresse email : {profile.email}</p>
            </div>
            <div className="add-photo">
              <button onClick={toggleAddPhotoForm}>POSTER UNE PHOTO</button>
              {isAddingPhoto && (
                <form>
                  <div className="form-group">
                    <input type="text" placeholder="URL" />
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Légende (facultatif)" />
                  </div>
                  <h3 className="film-label">Pellicule utilisée :</h3>
                  {pellicules.map(pellicule => (
                    <div key={pellicule}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedPellicules.includes(pellicule)}
                            onChange={handlePelliculeChange}
                            value={pellicule}
                            color="#DD4C2E"
                          />
                        }
                        label={pellicule}
                      />
                    </div>
                  ))}
                  <button type="submit">POSTER</button>
                </form>
              )}
            </div>
          </div>
          <div className="user-photos">
            <h2>Toutes vos photos :</h2>
            {photos.length > 0 ? (
              <Masonry columns={{ xs: 1, sm: 2, md: 2, lg: 3 }} spacing={3}>
                {photos.map((photo) => (
                  <div key={photo._id} className="photo-container">
                    <img src={photo.photoURL} alt={photo.legende} className="photo" />
                    {photo.legende && <p className="photo-legende">{photo.legende}</p>}
                  </div>
                ))}
              </Masonry>
            ) : (
              <p>AUCUNE PHOTO POUR L'INSTANT</p>
            )}
          </div>
        </div>
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
