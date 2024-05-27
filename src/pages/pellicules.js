import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../component/navbar';
import './pellicules.css'; // Importer le fichier CSS

function Pellicule() {
  const [pellicules, setPellicules] = useState([]); // State pour stocker les pellicules
  const navigate = useNavigate();

  useEffect(() => {
    // Fonction pour récupérer toutes les pellicules
    const fetchPellicules = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/pellicule');
        setPellicules(response.data); // Mettre à jour le state avec les données des pellicules
      } catch (error) {
        console.error('Error fetching pellicules:', error);
      }
    };

    fetchPellicules();
  }, []);

  const handlePhotosClick = (pelliculeId) => {
    navigate(`/pelliculePhotos/${pelliculeId}`);
  };

  return (
    <div>
      <NavBar/>
      <h1 className="center-title" data-content="LES PELLICULES">LES PELLICULES</h1>
      <div className="card-container">
        {pellicules.map((pellicule) => (
          <div key={pellicule._id} className="pellicule-box">
            <div className="card">
              <h2 className="card-title">{pellicule.nom}</h2>
              <p><strong>ISO :</strong> {pellicule.iso}</p>
              <p><strong>Description :</strong> {pellicule.description}</p>
              <p><strong>Couleur :</strong> {pellicule.couleur}</p>
              <img src={pellicule.url} alt={pellicule.nom} />
            </div>
            <div className="button-container">
              <button className="photos-button" onClick={() => handlePhotosClick(pellicule._id)}>PHOTOS</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pellicule;
