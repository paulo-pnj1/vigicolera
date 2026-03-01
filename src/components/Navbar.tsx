"use client";

import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack
} from '@mui/material';
import LocationOn from '@mui/icons-material/LocationOn';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    signOut(auth);
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(90deg, rgba(0,0,0,0.9) 0%, rgba(0,15,30,0.95) 50%, rgba(0,30,60,0.9) 100%)',
        boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        
      }}
    >
      <Toolbar
        sx={{
          width: '99%',
          maxWidth: 'none',
          px: { xs: 2, sm: 4, md:1 },
          py: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
          <IconButton
            component={Link}
            href="/"
            sx={{
              bgcolor: 'rgba(25, 118, 210, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 2,
              p: 1,
              '&:hover': {
                bgcolor: 'rgba(25, 118, 210, 0.3)',
              },
            }}
          >
            <MonitorHeartIcon sx={{ color: '#bbdefb', fontSize: 28 }} />
          </IconButton>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #ffffff, #bbdefb)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                lineHeight: 1.2,
              }}
            >
              VigiCólera
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#bbdefb',
                opacity: 0.9,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                display: 'block',
              }}
            >
              Sistema de Monitoramento Inteligente
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {isMobile ? (
          <>
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  bgcolor: 'rgba(0, 30, 60, 0.95)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  minWidth: 200,
                }
              }}
            >
              <MenuItem 
                component={Link} 
                href="/" 
                onClick={handleMenuClose}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.2)',
                  },
                }}
              >
                <ListItemIcon>
                  <LocationOn sx={{ color: '#bbdefb' }} />
                </ListItemIcon>
                <ListItemText>Mapa</ListItemText>
              </MenuItem>
              <MenuItem 
                component={Link} 
                href="/admin" 
                onClick={handleMenuClose}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(25, 118, 210, 0.2)',
                  },
                }}
              >
                <ListItemIcon>
                  <SettingsIcon sx={{ color: '#bbdefb' }} />
                </ListItemIcon>
                <ListItemText>Admin</ListItemText>
              </MenuItem>
              <Divider sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', my: 0.5 }} />
              <MenuItem 
                onClick={logout}
                sx={{
                  color: '#ff8a80',
                  '&:hover': {
                    bgcolor: 'rgba(239, 83, 80, 0.2)',
                  },
                }}
              >
                <ListItemIcon>
                  <LogoutIcon sx={{ color: '#ff8a80' }} />
                </ListItemIcon>
                <ListItemText>Sair</ListItemText>
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Stack 
            direction="row" 
            spacing={1.5} 
            alignItems="center"
            divider={
              <Divider 
                orientation="vertical" 
                flexItem 
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  height: 24,
                  my: 'auto'
                }} 
              />
            }
          >
            <Button
              component={Link}
              href="/"
              startIcon={<LocationOn />}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(25, 118, 210, 0.2)',
                border: '1px solid rgba(25, 118, 210, 0.3)',
                borderRadius: 2,
                px: 2.5,
                py: 1,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.3)',
                  borderColor: 'rgba(25, 118, 210, 0.5)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(25, 118, 210, 0.2)',
                },
              }}
            >
              Mapa
            </Button>

            <Button
              component={Link}
              href="/admin"
              startIcon={<SettingsIcon />}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 2,
                px: 2.5,
                py: 1,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.15)',
                  borderColor: 'rgba(255, 255, 255, 0.25)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              Administração
            </Button>

            <Button
              component={Link}
              href="/login"
              onClick={logout}
              startIcon={<LogoutIcon />}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(239, 83, 80, 0.2)',
                border: '1px solid rgba(239, 83, 80, 0.3)',
                borderRadius: 2,
                px: 2.5,
                py: 1,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  bgcolor: 'rgba(239, 83, 80, 0.3)',
                  borderColor: 'rgba(239, 83, 80, 0.5)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px rgba(239, 83, 80, 0.2)',
                },
              }}
            >
              Sair
            </Button>
          </Stack>
        )}
      </Toolbar>
    </AppBar>
  );
}