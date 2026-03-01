"use client";
import React from 'react';
import { Marker, InfoWindow } from '@react-google-maps/api';
import { Chip, Box, Typography } from '@mui/material';
import { Warning, Schedule, CheckCircle, Timeline } from '@mui/icons-material';

export function MarkerWithInfo({ caso, clusterer, onClick }) {
  const [infoOpen, setInfoOpen] = React.useState(false);

  const icon = {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="18" fill="${getColor(caso.status)}" stroke="#000" stroke-width="2"/>
        <circle cx="20" cy="20" r="10" fill="white"/>
      </svg>
    `)}`,
    scaledSize: new window.google.maps.Size(40, 40),
  };

  return (
    <Marker
      position={caso.coordenadas}
      clusterer={clusterer}
      icon={icon}
      onClick={() => {
        setInfoOpen(true);
        onClick();
      }}
    >
      {infoOpen && (
        <InfoWindow onCloseClick={() => setInfoOpen(false)}>
          <Box p={1}>
            <Typography variant="subtitle2">{caso.bairro || 'Bairro desconhecido'}</Typography>
            <Chip
              size="small"
              label={caso.status}
              icon={getIcon(caso.status)}
              color={caso.status === 'confirmado' ? 'error' : 'warning'}
              sx={{ mt: 1 }}
            />
          </Box>
        </InfoWindow>
      )}
    </Marker>
  );
}

function getColor(status) {
  switch (status) {
    case 'confirmado': return '#f44336';
    case 'suspeito': return '#ff9800';
    case 'pendente-analise': return '#2196f3';
    default: return '#4caf50';
  }
}

function getIcon(status) {
  switch (status) {
    case 'confirmado': return <Warning />;
    case 'suspeito': return <Schedule />;
    case 'pendente-analise': return <Timeline />;
    default: return <CheckCircle />;
  }
}