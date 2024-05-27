import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useSignup } from '../hooks/useSignup';

function Inscription({ socket }) {
  const [formData, setFormData] = useState({
    email: '',
    pseudo: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: ''
  });

  const { signup, error, isLoading, success } = useSignup();
  const navigate = useNavigate();
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const pseudo = data.get('pseudo');
    const email = data.get('email');
    const password = data.get('password');
    const confirmPassword = data.get('confirmPassword');
    const nom = data.get('lastName');
    const prenom = data.get('firstName');

    if (password !== confirmPassword) {
      setConfirmPasswordError('Les mots de passe ne correspondent pas');
      return;
    }

    setConfirmPasswordError('');

    const success = await signup(pseudo, email, password, nom, prenom);
    if (success) {
      navigate('/accueil');
    }
  };


  return (
    <ThemeProvider theme={createTheme()}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#ffffff',
          }}
        >
          <Box
            sx={{
              my: 1,
              mx: 15,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ mt: 1, bgcolor: '#1e2c28'}}>
              <AccountBoxRoundedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ color: '#1e2c28', mt: 2, fontWeight: 'bold' }}>
              INSCRIPTION
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="prenom"
              label="Prénom"
              name="prenom"
              autoFocus
              value={formData.prenom}
              onChange={handleChange}
              sx={{
                '& label.Mui-focused': {
                  color: '#1e2c28',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e2c28',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="nom"
              label="Nom"
              name="nom"
              autoComplete="family-name"
              value={formData.nom}
              onChange={handleChange}
              sx={{
                '& label.Mui-focused': {
                  color: '#1e2c28',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e2c28',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="pseudo"
              label="Pseudo"
              name="pseudo"
              autoComplete="username"
              value={formData.pseudo}
              onChange={handleChange}
              sx={{
                '& label.Mui-focused': {
                  color: '#1e2c28',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e2c28',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              sx={{
                '& label.Mui-focused': {
                  color: '#1e2c28',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e2c28',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                '& label.Mui-focused': {
                  color: '#1e2c28',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e2c28',
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              id="confirmPassword"
              autoComplete="current-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              sx={{
                '& label.Mui-focused': {
                  color: '#1e2c28',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&:hover fieldset': {
                    borderColor: '#1e2c28',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1e2c28',
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2, mb: 2, bgcolor: '#283b39', '&:hover': { bgcolor: '#1e2c28' } }}
              disabled={isLoading}
            >
              S'inscrire
            </Button>
            {error && <div className="error" style={{ color: 'red' }}>{error}</div>}
            {confirmPasswordError && <div className="error" style={{ color: 'red' }}>{confirmPasswordError}</div>}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/connexion" variant="body2" sx={{ color: '#1e2c28' }}>
                  Déjà un compte ? Connectez-vous
                </Link>
              </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/accueil" variant="body2" sx={{ color: '#1e2c28' }}>
                  Continuer sans connexion ?
                </Link>
              </Grid>
            </Grid>
          </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://i.imgur.com/3gig540.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Grid>
    </ThemeProvider>
  );
}

export default Inscription;
