import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { ref, get, set } from 'firebase/database';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Fade
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Save as SaveIcon,
  NotificationsActive as NotificationsIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';

// Tema escuro personalizado com glassmorphism
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(26, 26, 26, 0.95)',
    },
    success: {
      main: '#4caf50',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)',
          },
        },
      },
    },
  },
});

export default function PainelAdmin() {
  const [limite, setLimite] = useState(10);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Buscar limite do Firebase
  useEffect(() => {
    const limiteRef = ref(db, 'configuracoes/limite_alerta');
    get(limiteRef).then(snapshot => {
      if (snapshot.exists()) {
        setLimite(snapshot.val());
      }
      setLoading(false);
    }).catch(error => {
      console.error('Erro ao buscar limite:', error);
      setMsg('❌ Erro ao carregar limite.');
      setSnackbarOpen(true);
      setLoading(false);
    });
  }, []);

  // Atualizar limite no Firebase
  const atualizarLimite = async () => {
    if (limite < 1) {
      setMsg('⚠️ O limite deve ser maior que 0.');
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);
    const limiteRef = ref(db, 'configuracoes/limite_alerta');
    try {
      await set(limiteRef, parseInt(limite));
      setMsg('✅ Limite atualizado com sucesso.');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erro ao atualizar limite:', error);
      setMsg('❌ Erro ao atualizar limite.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Fechar Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setMsg('');
  };

  if (loading && !msg) {
    return (
      <ThemeProvider theme={darkTheme}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: 'background.default' }}>
          <CircularProgress color="primary" />
          <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
            Carregando configurações...
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: { xs: 2, md: 4 } }}>
        <Fade in={true} timeout={1000}>
          <Paper elevation={3} sx={{ maxWidth: 600, mx: 'auto', p: { xs: 2, md: 4 }, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <SettingsIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Painel de Administração
              </Typography>
            </Box>

            <Card elevation={2} sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <NotificationsIcon color="secondary" />
                  Configuração de Alertas
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <TextField
                    label="Limite de Casos para Alerta"
                    type="number"
                    value={limite}
                    onChange={e => setLimite(e.target.value)}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <NotificationsIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                      inputProps: { min: 1 },
                    }}
                    sx={{ width: { xs: '100%', sm: 200 } }}
                    helperText="Número mínimo de casos para enviar alerta"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={atualizarLimite}
                    disabled={loading}
                    sx={{ height: 40 }}
                  >
                    Atualizar
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Gerencie o limite de casos para disparar alertas automáticos do sistema de monitoramento de cólera.
            </Typography>
          </Paper>
        </Fade>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            severity={msg.includes('Erro') ? 'error' : 'success'}
            sx={{ width: '100%' }}
            icon={msg.includes('Erro') ? <NotificationsIcon /> : <CheckCircleIcon />}
            onClose={handleCloseSnackbar}
          >
            {msg}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}