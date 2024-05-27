import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from '../component/navbar';
import './photoDetail.css';

function PhotoDetail() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [likes, setLikes] = useState([]);
  const [commentaires, setCommentaires] = useState([]);

  useEffect(() => {
    const fetchPhoto = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/photo/details/${id}`);
        setPhoto(response.data);
      } catch (error) {
        console.error('Error fetching photo details:', error);
      }
    };

    const fetchLikes = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/photo/${id}/likes`);
        setLikes(response.data);
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    const fetchCommentaires = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/photo/${id}/comments`);
        setCommentaires(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPhoto();
    fetchLikes();
    fetchCommentaires();
  }, [id]);

  return (
    <div>
      <NavBar />
      {photo ? (
        <div className="photo-container">
          <img src={photo.photoURL} alt={photo.legende} className="photo-detail" />
          <div className="info-container">
            <div className="details-box">
              {photo.userId && <p>Postée par @{photo.userId}</p>}
              {photo.pelliculeId && <p>Pellicule utilisée : {photo.pelliculeId}</p>}
            </div>
            <div className="likes-comments-box">
              <div className="likes-box">
                <img src="https://www.pngmart.com/files/15/Black-Heart-Vector-PNG-Transparent-Image.png" alt="Likes" className="heart-icon" />
                <p>{likes.length} likes</p>
              </div>
              <h3>Commentaires :</h3>
              <ul>
                {commentaires.map((comment) => (
                  <li key={comment._id}>
                    <p><strong>{comment.userId}:</strong> {comment.content}</p>
                    <p>{new Date(comment.date).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default PhotoDetail;
