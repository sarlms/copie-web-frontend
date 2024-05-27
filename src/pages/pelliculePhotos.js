import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import NavBar from '../component/navbar';
import Masonry from '@mui/lab/Masonry';
import './pelliculePhotos.css';

function PelliculePhotos() {
  const { pelliculeId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [pellicule, setPellicule] = useState(null);

  useEffect(() => {
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

    fetchPhotos();
    fetchPellicule();
  }, [pelliculeId]);

  return (
    <div>
      <NavBar />
      <h1 className="center-title">
        {pellicule ? `${pellicule.nom}` : 'Loading...'}
      </h1>
      <div className="photos-container">
        {photos.length === 0 ? (
          <p>No photos available for this pellicule.</p>
        ) : (
          <Masonry columns={3} spacing={3}>
            {photos.map((photo) => (
              <div key={photo._id} className="photo-container">
                <Link to={`/photoDetail/${photo._id}`}>
                  <img src={photo.photoURL} alt={photo.legende} className="photo" />
                  <div className="photo-overlay">
                    <div className="overlay-content">
                      <img src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/white-heart_1f90d.png" alt="Likes" />
                      <span>{photo.likesCount}</span>
                      <img src="https://static.vecteezy.com/system/resources/previews/018/887/859/non_2x/speech-bubble-icon-png.png" alt="Comments" style={{ marginLeft: '10px' }} />
                      <span>{photo.commentsCount}</span>
                    </div>
                  </div>
                  {photo.legende && <p className="photo-legende">{photo.legende}</p>}
                </Link>
              </div>
            ))}
          </Masonry>
        )}
      </div>
    </div>
  );
}

export default PelliculePhotos;
