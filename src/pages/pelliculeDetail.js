import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function PelliculeDetail() {
  const { id } = useParams(); // Récupérer l'ID de la pellicule depuis l'URL
  const [pellicule, setPellicule] = useState(null); // State pour stocker les données de la pellicule

  useEffect(() => {
    // Fonction pour récupérer les détails de la pellicule en fonction de son ID
    const fetchPelliculeDetail = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/pellicule/664f866eba844a741facd4c6`);
        setPellicule(response.data); // Mettre à jour le state avec les données de la pellicule
      } catch (error) {
        console.error('Error fetching pellicule detail:', error);
      }
    };

    fetchPelliculeDetail();
  }, [id]); // Exécuter cette fonction à chaque changement de l'ID de la pellicule

  // Si la pellicule n'est pas encore chargée, afficher un message de chargement
  if (!pellicule) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{pellicule.nom}</h1> {/* Afficher le nom de la pellicule */}
      <p>{pellicule.description}</p> {/* Afficher la description de la pellicule */}
      <img src={pellicule.url} alt={pellicule.nom} /> {/* Afficher l'image associée à la pellicule */}
    </div>
  );
}

export default PelliculeDetail;
