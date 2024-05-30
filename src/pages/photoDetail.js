import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import NavBar from '../component/navbar';
import { useAuthContext } from '../hooks/useAuthContext';
import { io } from 'socket.io-client';
import './photoDetail.css';

function PhotoDetail() {
  const { id } = useParams();
  const [photo, setPhoto] = useState(null);
  const [likes, setLikes] = useState([]);
  const [commentaires, setCommentaires] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthContext();
  const socket = io(process.env.REACT_APP_BACKEND_URL);
  const [liked, setLiked] = useState(false);

  const fetchPhoto = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/photo/details/${id}`);
      setPhoto(response.data);
    } catch (error) {
      console.error('Error fetching photo details:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/photo/${id}/likes`);
      setLikes(response.data);
      if (user) {
        const userLike = response.data.find(like => like.userId === user._id);
        setLiked(!!userLike);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const fetchCommentaires = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/commentaire/${id}/comments`);
      setCommentaires(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchPhoto();
    fetchLikes();
    fetchCommentaires();
  }, [id, user]);

  const handleLikePhoto = async () => {
    if (!user || !user._id) {
      console.error('User not logged in');
      return;
    }
    try {
      if (liked) {
        // Déliker la photo
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/like`, {
          data: { userId: user._id, photoId: id }
        });
        setLikes(likes.filter(like => like.userId !== user._id));
        setLiked(false);
        socket.emit('likeRemoved', { photoId: id, userId: user._id });
      } else {
        // Liker la photo
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/like/create`, {
          userId: user._id,
          photoId: id,
        });
        setLikes([...likes, { photoId: id, userId: user._id }]);
        setLiked(true);
        socket.emit('likeAdded', { photoId: id, userId: user._id });
      }

      fetchPhoto(); // Update the likes count
    } catch (error) {
      console.error('Error liking or unliking photo:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user || !user._id || !newComment.trim()) {
      console.error('User not logged in or comment is empty');
      return;
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/commentaire/create`, {
        photoId: id,
        userId: user._id,
        contenu: newComment,
      });
      const comment = response.data;
      setCommentaires([comment, ...commentaires]); // Ajouter le nouveau commentaire en haut
      setNewComment('');
      socket.emit('commentAdded', comment);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/commentaire/${commentId}`);
      setCommentaires(commentaires.filter(comment => comment._id !== commentId));
      socket.emit('commentDeleted', { _id: commentId });
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  useEffect(() => {
    socket.on('likeAdded', ({ photoId, userId }) => {
      if (photoId === id) {
        setPhoto(photo => ({
          ...photo,
          likesCount: photo.likesCount + 1
        }));
        setLikes(likes => [...likes, { photoId, userId }]);
      }
    });

    socket.on('likeRemoved', ({ photoId, userId }) => {
      if (photoId === id) {
        setPhoto(photo => ({
          ...photo,
          likesCount: photo.likesCount - 1
        }));
        setLikes(likes => likes.filter(like => like.userId !== userId));
      }
    });

    socket.on('commentAdded', (comment) => {
      if (comment.photoId === id) {
        setCommentaires(comments => [comment, ...comments]);
      }
    });

    socket.on('commentDeleted', ({ _id }) => {
      setCommentaires(comments => comments.filter(comment => comment._id !== _id));
    });

    return () => {
      socket.off('likeAdded');
      socket.off('likeRemoved');
      socket.off('commentAdded');
      socket.off('commentDeleted');
    };
  }, [id, socket, user]);

  return (
    <div>
      <NavBar />
      {photo ? (
        <div className="photo-container">
          <img src={photo.photoURL} alt={photo.legende} className="photo-detail" />
          <div className="info-container">
            <div className="details-box">
              {photo.userId && <p>Postée par @{photo.userId.pseudo}</p>}
              {photo.pelliculeId && <p>Pellicule utilisée : {photo.pelliculeId.nom}</p>}
            </div>
            <div className="likes-comments-box">
              <div className="likes-box">
                <img
                  src={liked ? "https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/veille%20soutenance/coeur.png" : "https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/white-heart_1f90d.png"}
                  alt="Likes"
                  className="heart-icon"
                  onClick={handleLikePhoto}
                />
                <p>{photo.likesCount} likes</p>
              </div>
              <h3>Commentaires :</h3>
              <ul>
                {commentaires.map((comment) => (
                  <li key={comment._id} className="comment-item">
                    <p className="comment-content">
                      <strong>@{comment.userId.pseudo} :</strong> {comment.contenu}
                    </p>
                    {user && comment.userId._id === user._id && (
                      <img
                        src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/veille%20soutenance/poubelle-de-recyclage.png"
                        alt="Delete"
                        className="delete-icon"
                        onClick={() => handleDeleteComment(comment._id)}
                      />
                    )}
                  </li>
                ))}
              </ul>
              {user && (
                <form onSubmit={handleAddComment} className="comment-form">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="comment-input"
                  />
                  <button type="submit" className="comment-button">Poster</button>
                </form>
              )}
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
