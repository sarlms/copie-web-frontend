import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProfile } from '../hooks/useProfile';

const NavBar = () => {
  const { user } = useAuthContext();
  const { profile } = useProfile();
  return (
    <AppBar position="static" sx={{ bgcolor: "#42240F" }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <RouterLink to="/accueil">
          <img src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/logo.png" alt="Logo" style={{ width: '300px', marginRight: '20px' }} />
        </RouterLink>
        <div>
          <RouterLink to="/pellicule">
            <img src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/pellicules.png" alt="Pellicules" style={{ width: '120px', marginRight: '25px' }} />
          </RouterLink>
          <RouterLink to="/feed">
            <img src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/feed.png" alt="Feed" style={{ width: '55px', marginRight: '25px' }} />
          </RouterLink>
          {user && profile ? (
            <RouterLink to={`/profil/${profile.id}`}>
              <img src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/profil.png" alt="Profil" style={{ width: '75px', marginRight: '10px' }} />
            </RouterLink>
            ) : (
              <RouterLink to="/connexion">
              <img src="https://raw.githubusercontent.com/sarlms/sarargentique-pellicules-photos/main/connecter.png" alt="Se Connecter" style={{ width: '150px', marginRight: '10px' }} />
              </RouterLink>
            )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;