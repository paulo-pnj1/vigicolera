import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Box, Card, Chip, Avatar, List, ListItem, ListItemButton, ListItemText, Paper, Grid,
  IconButton, Drawer, AppBar, Toolbar, Badge, Fab, Tooltip, Collapse, Alert, LinearProgress,
  CircularProgress, Divider, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, ToggleButton, ToggleButtonGroup, TextField, FormControl,
  InputLabel, Select, MenuItem, ListItemAvatar, CardContent, Typography,
  Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import {
  Search as SearchIcon, FilterList as FilterIcon, Analytics as AnalyticsIcon, Close as CloseIcon,
  LocationOn as LocationIcon, Warning as WarningIcon, CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon, Cancel as CancelIcon, Phone as PhoneIcon, Timeline as TimelineIcon,
  Visibility as VisibilityIcon, Map as MapIcon, People as PeopleIcon, TrendingUp as TrendingUpIcon,
  LocationCity as LocationCityIcon, Refresh as RefreshIcon, Layers as LayersIcon,
  Notifications as NotificationsIcon, DateRange as DateRangeIcon, ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon, MyLocation as MyLocationIcon, GetApp as GetAppIcon,
  SmartToy as SmartToyIcon, ExpandMore as ExpandMoreIcon, VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, subDays, isSameDay } from 'date-fns';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, update } from 'firebase/database';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBtnU84zOmm9mjwJNf7Sa7g4exGjUI_kj0",
  authDomain: "vigicolera.firebaseapp.com",
  databaseURL: "https://vigicolera-default-rtdb.firebaseio.com",
  projectId: "vigicolera",
  storageBucket: "vigicolera.firebasestorage.app",
  messagingSenderId: "443742285213",
  appId: "1:443742285213:web:ce5c8ef141c46ed2ccd374"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDEyAiggQthZ3AibDKDY9UNBoypYYamKBo';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#2196f3' },
    secondary: { main: '#00e5ff' },
    background: { default: '#0a0a0a', paper: '#1a1a1a' },
    error: { main: '#ff5252' },
    warning: { main: '#ffab40' },
    success: { main: '#69f0ae' },
    info: { main: '#40c4ff' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(10, 10, 10, 0.95)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        },
      },
    },
    MuiTypography: {
      defaultProps: { component: 'div' }
    }
  },
});

// Estilos do PDF
const pdfStyles = StyleSheet.create({
  page: { padding: 30, fontSize: 11, fontFamily: 'Helvetica' },
  title: { fontSize: 24, marginBottom: 10, textAlign: 'center', fontWeight: 'bold' },
  subtitle: { fontSize: 14, marginBottom: 20, textAlign: 'center', color: '#555' },
  sectionTitle: { fontSize: 16, margin: '20px 0 10px', fontWeight: 'bold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { 
    width: '23%', 
    padding: 10, 
    border: '1px solid #ddd', 
    borderRadius: 5, 
    alignItems: 'center',
    marginBottom: 10
  },
  statNumber: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  table: { width: 'auto', borderStyle: 'solid', borderWidth: 1, borderColor: '#bfbfbf', marginTop: 10 },
  tableRow: { flexDirection: 'row' },
  tableColHeader: { 
    width: '10%', 
    borderStyle: 'solid', 
    borderWidth: 1, 
    borderColor: '#bfbfbf', 
    backgroundColor: '#2196f3', 
    color: 'white',
    textAlign: 'center',
    padding: 8,
    fontWeight: 'bold',
    fontSize: 10
  },
  tableCol: { 
    width: '10%', 
    borderStyle: 'solid', 
    borderWidth: 1, 
    borderColor: '#bfbfbf', 
    textAlign: 'center',
    padding: 5,
    fontSize: 9
  },
  tableColWide: { 
    width: '15%', 
    borderStyle: 'solid', 
    borderWidth: 1, 
    borderColor: '#bfbfbf', 
    textAlign: 'center',
    padding: 5,
    fontSize: 9
  },
});

// Componente do documento PDF
const RelatorioPDF = ({ casosFiltrados, stats, dateFilter, iaAnalise }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page} orientation="landscape">
      <Text style={pdfStyles.title}>Relatório de Monitoramento de Casos de Cólera</Text>
      <Text style={pdfStyles.subtitle}>
        Gerado em: {new Date().toLocaleString('pt-BR')}
        {dateFilter && ` | Filtrado para: ${format(dateFilter, 'dd/MM/yyyy')}`}
      </Text>

      <Text style={pdfStyles.sectionTitle}>Estatísticas Resumo</Text>
      <View style={pdfStyles.statsGrid}>
        <View style={pdfStyles.statBox}>
          <Text style={[pdfStyles.statNumber, { color: '#f44336' }]}>{stats.confirmados}</Text>
          <Text>Casos Confirmados</Text>
        </View>
        <View style={pdfStyles.statBox}>
          <Text style={[pdfStyles.statNumber, { color: '#ff9800' }]}>{stats.suspeitos}</Text>
          <Text>Casos Suspeitos</Text>
        </View>
        <View style={pdfStyles.statBox}>
          <Text style={[pdfStyles.statNumber, { color: '#2196f3' }]}>{stats.pendentes}</Text>
          <Text>Casos Pendentes</Text>
        </View>
        <View style={pdfStyles.statBox}>
          <Text style={[pdfStyles.statNumber, { color: '#4caf50' }]}>{stats.descartados}</Text>
          <Text>Casos Descartados</Text>
        </View>
        <View style={pdfStyles.statBox}>
          <Text style={[pdfStyles.statNumber]}>{stats.total}</Text>
          <Text>Total de Casos</Text>
        </View>
        <View style={pdfStyles.statBox}>
          <Text style={[pdfStyles.statNumber]}>{stats.bairros}</Text>
          <Text>Bairros Afetados</Text>
        </View>
      </View>

      {iaAnalise && (
        <>
          <Text style={pdfStyles.sectionTitle}>Insights e Análise Inteligente (IA)</Text>
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 12, lineHeight: 1.5 }}>{iaAnalise}</Text>
          </View>
        </>
      )}

      <Text style={pdfStyles.sectionTitle}>Lista de Casos Registrados ({casosFiltrados.length})</Text>
      <View style={pdfStyles.table}>
        <View style={pdfStyles.tableRow}>
          <Text style={pdfStyles.tableColHeader}>ID</Text>
          <Text style={pdfStyles.tableColHeader}>Agente</Text>
          <Text style={pdfStyles.tableColHeader}>Bairro</Text>
          <Text style={pdfStyles.tableColHeader}>Status</Text>
          <Text style={pdfStyles.tableColHeader}>Gravidade</Text>
          <Text style={pdfStyles.tableColHeader}>Data/Hora</Text>
          <Text style={pdfStyles.tableColHeader}>Dispositivo</Text>
          <Text style={[pdfStyles.tableColHeader, { width: '12%' }]}>Latitude</Text>
          <Text style={[pdfStyles.tableColHeader, { width: '12%' }]}>Longitude</Text>
          <Text style={pdfStyles.tableColWide}>Notas</Text>
        </View>

        {casosFiltrados.map((caso) => (
          <View style={pdfStyles.tableRow} key={caso.id}>
            <Text style={pdfStyles.tableCol}>{caso.id}</Text>
            <Text style={pdfStyles.tableCol}>{caso.agente}</Text>
            <Text style={pdfStyles.tableCol}>{caso.bairro || 'Desconhecido'}</Text>
            <Text style={pdfStyles.tableCol}>{caso.status}</Text>
            <Text style={pdfStyles.tableCol}>{caso.gravidade}</Text>
            <Text style={pdfStyles.tableCol}>{caso.dataHora}</Text>
            <Text style={pdfStyles.tableCol}>{caso.dispositivo}</Text>
            <Text style={pdfStyles.tableCol}>{caso.coordenadas.lat.toFixed(6)}</Text>
            <Text style={pdfStyles.tableCol}>{caso.coordenadas.lng.toFixed(6)}</Text>
            <Text style={pdfStyles.tableColWide}>{caso.notas || '-'}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Funções utilitárias
const getStatusColor = (status) => {
  switch (status) {
    case 'confirmado': return '#ff5252';
    case 'suspeito': return '#ffab40';
    case 'pendente-analise': return '#40c4ff';
    case 'descartado': return '#69f0ae';
    default: return '#757575';
  }
};

const getGravidadeColor = (gravidade) => {
  switch (gravidade) {
    case 'critico': return '#d32f2f';
    case 'severa': return '#f57c00';
    case 'moderada': return '#ffb300';
    case 'leve': return '#7cb342';
    default: return '#616161';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'confirmado': return <WarningIcon />;
    case 'suspeito': return <ScheduleIcon />;
    case 'pendente-analise': return <TimelineIcon />;
    case 'descartado': return <CheckCircleIcon />;
    default: return <LocationIcon />;
  }
};

const formatDateTime = (dateTimeString) => {
  try {
    const [date, time] = dateTimeString.split(', ');
    return { date, time };
  } catch (error) {
    console.error('Erro ao formatar data/hora:', error);
    return { date: 'Desconhecido', time: 'Desconhecido' };
  }
};

const agruparPorBairro = (casos) => {
  return casos.reduce((acc, caso) => {
    const bairro = caso.bairro || 'Desconhecido';
    if (!acc[bairro]) {
      acc[bairro] = {
        casos: [],
        confirmados: 0,
        suspeitos: 0,
        pendentes: 0,
        descartados: 0,
        coordenadas: caso.coordenadas,
        descricao: caso.descricao || `Bairro ${bairro} localizado na região central.`
      };
    }
    acc[bairro].casos.push(caso);
    if (caso.status === 'confirmado') acc[bairro].confirmados++;
    if (caso.status === 'suspeito') acc[bairro].suspeitos++;
    if (caso.status === 'pendente-analise') acc[bairro].pendentes++;
    if (caso.status === 'descartado') acc[bairro].descartados++;
    return acc;
  }, {});
};

const getBairroFromCoordinates = async (lat, lng, apiKey, addNotification) => {
  if (apiKey === 'SUA_CHAVE_API_AQUI') {
    addNotification('Chave da API do Google Maps não configurada', 'error');
    return 'Desconhecido';
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    const results = response.data.results;

    if (results.length > 0) {
      for (const result of results) {
        const neighborhood = result.address_components.find(
          (component) =>
            component.types.includes('neighborhood') ||
            component.types.includes('sublocality')
        );
        if (neighborhood) {
          return neighborhood.long_name;
        }
      }
      const locality = results[0].address_components.find((component) =>
        component.types.includes('locality')
      );
      return locality ? locality.long_name : 'Desconhecido';
    }
    return 'Desconhecido';
  } catch (error) {
    console.error('Erro na geocodificação:', error);
    addNotification('Erro ao obter bairro a partir das coordenadas', 'error');
    return 'Desconhecido';
  }
};

const updateBairro = async (database, casoId, bairro) => {
  try {
    const casoRef = ref(database, `casos-colera/${casoId}`);
    await update(casoRef, { bairro });
  } catch (error) {
    console.error('Erro ao atualizar bairro no Firebase:', error);
  }
};

// Função aprimorada para gerar insights e análise IA com dados reais do surto de 2025
const gerarInsightsIA = (stats, gruposBairro, casos) => {
  const totalCasos = stats.total;
  const confirmados = stats.confirmados;
  const bairrosAfetados = stats.bairros;

  const bairrosCriticos = Object.entries(gruposBairro)
    .filter(([_, grupo]) => grupo.confirmados > 0 || grupo.casos.length > 5)
    .map(([bairro]) => bairro)
    .join(', ');

  let risco = 'moderado';
  if (confirmados > totalCasos * 0.4) risco = 'alto';
  else if (confirmados > totalCasos * 0.2) risco = 'moderado';
  else risco = 'controlado';

  const tendencias = casos.length > 50 ? 'Aumento recente em bairros periféricos devido à estação chuvosa.' : 'Casos concentrados em áreas urbanas densas.';

  return `
📊 **ANÁLISE INTELIGENTE DO SURTO - VigiCólera AI**

## 📈 ESTATÍSTICAS PRINCIPAIS
• **Total de casos registrados:** ${totalCasos}
• **Casos confirmados:** ${confirmados} (${totalCasos > 0 ? ((confirmados / totalCasos) * 100).toFixed(1) : 0}% do total)
• **Bairros afetados:** ${bairrosAfetados}
• **Densidade de casos:** ${(totalCasos / Math.max(bairrosAfetados, 1)).toFixed(1)} casos por bairro

## 🎯 ÁREAS DE ALERTA
${bairrosCriticos ? 
  `**Bairros críticos detectados:** ${bairrosCriticos}\n- Necessitam de intervenção prioritária` : 
  'Distribuição dispersa, sem clusters graves identificados'}

## 📊 ANÁLISE DE RISCO
**Nível de risco:** ${risco.toUpperCase()}
**Tendência:** ${tendencias}
**Foco atual:** ${bairrosCriticos ? 'Contenção em áreas críticas' : 'Vigilância ampliada'}

## 🚨 RECOMENDAÇÕES IA
${risco === 'alto' ? 
`• **Alerta máximo:** Mobilizar equipes de resposta rápida
• **Distribuição:** Hipoclorito em massa nas áreas críticas
• **Comunicação:** Alertar autoridades nacionais imediatamente
• **Ações:** Intensificar vacinação e desinfecção de fontes de água` : 
risco === 'moderado' ? 
`• **Monitoramento intensivo:** Reforçar vigilância nos bairros afetados
• **Prevenção:** Campanhas de higiene e tratamento de água
• **Preparação:** Recursos prontos para possível escalada
• **Comunicação:** Mantenha a população informada` : 
`• **Vigilância ativa:** Monitoramento diário mantido
• **Educação:** Continuar campanhas comunitárias
• **Expansão:** Avaliar cobertura em novas áreas
• **Prevenção:** Manter estoques de suprimentos`}

---

**ℹ️ Contexto Nacional (Dados OMS/UNICEF 2025):**
O surto iniciado em janeiro 2025 afetou 18 das 21 províncias angolanas, com mais de 28.000 casos reportados. O sistema VigiCólera monitora em tempo real para resposta rápida e eficaz.

**📅 Última atualização:** ${new Date().toLocaleString('pt-BR')}
  `.trim();
};

// Componente memoizado do Mapa
const MemoizedMap = React.memo(({ 
  mapCenter, 
  mapZoom, 
  mapType, 
  viewMode, 
  gruposBairro, 
  casosFiltrados, 
  selectedInfoWindow,
  onMarkerClick,
  onGroupClick,
  onInfoWindowClose
}) => {
  const mapRef = useRef(null);
  
  const handleLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const getMarkerIcon = useCallback((caso) => {
    const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${
      caso.status === 'confirmado' ? 'red-dot' :
      caso.status === 'suspeito' ? 'yellow-dot' :
      caso.status === 'pendente-analise' ? 'blue-dot' : 'green-dot'
    }.png`;
    
    return {
      url: iconUrl,
      scaledSize: window.google?.maps ? new window.google.maps.Size(40, 40) : undefined
    };
  }, []);

  const getGroupMarkerIcon = useCallback((grupo) => {
    const iconUrl = `http://maps.google.com/mapfiles/ms/icons/${
      grupo.confirmados > 0 ? 'red-dot' : grupo.suspeitos > 0 ? 'yellow-dot' : 'blue-dot'
    }.png`;
    
    const size = 40 + Math.min(grupo.casos.length * 2, 30);
    return {
      url: iconUrl,
      scaledSize: window.google?.maps ? new window.google.maps.Size(size, size) : undefined
    };
  }, []);

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={mapCenter}
      zoom={mapZoom}
      mapTypeId={mapType}
      onLoad={handleLoad}
      options={{
        styles: [
          {
            elementType: "geometry",
            stylers: [{ color: "#242f3e" }]
          },
          {
            elementType: "labels.text.fill",
            stylers: [{ color: "#FFFFFF" }, { visibility: "on" }]
          },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#000000" }, { weight: 2 }]
          }
        ]
      }}
    >
      {viewMode === 'agrupado' ? (
        Object.entries(gruposBairro).map(([bairro, grupo]) => (
          <Marker
            key={`grupo-${bairro}`}
            position={grupo.coordenadas}
            onClick={() => onGroupClick(bairro, grupo)}
            icon={getGroupMarkerIcon(grupo)}
            animation={window.google?.maps?.Animation?.DROP}
          >
            {selectedInfoWindow === `grupo-${bairro}` && (
              <InfoWindow onCloseClick={onInfoWindowClose}>
                <Box sx={{ p: 1, maxWidth: 250 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    {bairro}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip label={`${grupo.casos.length} casos`} size="small" sx={{ mr: 1, mb: 1 }} />
                    {grupo.confirmados > 0 && (
                      <Chip label={`${grupo.confirmados} confirmados`} size="small" color="error" sx={{ mr: 1, mb: 1 }} />
                    )}
                    {grupo.suspeitos > 0 && (
                      <Chip label={`${grupo.suspeitos} suspeitos`} size="small" color="warning" sx={{ mr: 1, mb: 1 }} />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {grupo.descricao}
                  </Typography>
                </Box>
              </InfoWindow>
            )}
          </Marker>
        ))
      ) : (
        casosFiltrados.map((caso) => (
          <Marker
            key={`marker-${caso.id}`}
            position={caso.coordenadas}
            onClick={() => onMarkerClick(caso)}
            icon={getMarkerIcon(caso)}
            animation={window.google?.maps?.Animation?.DROP}
          >
            {selectedInfoWindow === caso.id && (
              <InfoWindow onCloseClick={onInfoWindowClose}>
                <Box sx={{ p: 1, maxWidth: 250 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary.main">
                    {caso.bairro || 'Sem bairro'}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Chip 
                      label={caso.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: getStatusColor(caso.status),
                        color: 'white',
                        mr: 1,
                        mb: 1
                      }} 
                    />
                    <Chip 
                      label={caso.gravidade} 
                      size="small" 
                      sx={{ 
                        bgcolor: getGravidadeColor(caso.gravidade),
                        color: 'white',
                        mb: 1
                      }} 
                    />
                  </Box>
                  <Typography variant="body2">
                    <strong>Agente:</strong> {caso.agente}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Data:</strong> {formatDateTime(caso.dataHora).date} às {formatDateTime(caso.dataHora).time}
                  </Typography>
                  {caso.descricao && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      {caso.descricao}
                    </Typography>
                  )}
                </Box>
              </InfoWindow>
            )}
          </Marker>
        ))
      )}
    </GoogleMap>
  );
});

MemoizedMap.displayName = 'MemoizedMap';

// Componente de Badge com Animação
const AnimatedBadge = ({ badgeContent, children, color = 'error' }) => {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (badgeContent > 0) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [badgeContent]);

  return (
    <Badge 
      badgeContent={badgeContent} 
      color={color}
      sx={{
        '& .MuiBadge-badge': {
          animation: pulse ? 'pulse 0.6s ease-in-out' : 'none',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.2)' },
            '100%': { transform: 'scale(1)' }
          }
        }
      }}
    >
      {children}
    </Badge>
  );
};

// Componente de Card Estatístico
const StatCard = ({ title, value, color, icon, subtitle }) => (
  <Card elevation={2} sx={{ 
    p: 2, 
    height: '100%',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 6
    }
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Avatar sx={{ bgcolor: color, mr: 2 }}>
        {icon}
      </Avatar>
      <Typography variant="subtitle2" color="text.secondary">
        {title}
      </Typography>
    </Box>
    <Typography variant="h4" fontWeight="bold" color={color}>
      {value}
    </Typography>
    {subtitle && (
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Card>
);

export default function MapaCasos() {
  const [casos, setCasos] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroGravidade, setFiltroGravidade] = useState('todos');
  const [busca, setBusca] = useState('');
  const [showStatistics, setShowStatistics] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: -7.6063, lng: 15.0548 });
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [mapZoom, setMapZoom] = useState(12);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [dateFilter, setDateFilter] = useState(null);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [viewMode, setViewMode] = useState('casos');
  const [gruposBairro, setGruposBairro] = useState({});
  const [mapType, setMapType] = useState('roadmap');
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedInfoWindow, setSelectedInfoWindow] = useState(null);
  const [showIAAnalysis, setShowIAAnalysis] = useState(false);
  const [iaAnalise, setIaAnalise] = useState('');
  // NOVO: Estado para controlar visibilidade da legenda
  const [showLegend, setShowLegend] = useState(true);

  const addNotification = useCallback((message, severity = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      severity,
      timestamp: new Date()
    };
    setNotifications((prev) => [...prev, newNotification]);
    setShowNotification(true);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const casosRef = ref(database, 'casos-colera');

    const unsubscribe = onValue(casosRef, async (snapshot) => {
      if (!isMounted) return;

      const data = snapshot.val();
      if (data) {
        const casosArray = Object.entries(data).map(([id, caso]) => ({
          id,
          agente: caso.agente || 'Desconhecido',
          coordenadas: {
            lat: parseFloat(caso.coordenadas?.lat) || 0,
            lng: parseFloat(caso.coordenadas?.lng) || 0,
            precisao: caso.coordenadas?.precisao || 100,
          },
          dataHora: caso.dataHora || 'Desconhecido',
          dispositivo: caso.dispositivo || 'Desconhecido',
          gravidade: caso.gravidade || 'Desconhecido',
          status: caso.tipoCaso || 'pendente-analise',
          timestamp: caso.timestamp || Date.now(),
          tipoCaso: caso.tipoCaso || 'pendente-analise',
          bairro: caso.bairro || 'Desconhecido',
          notas: caso.notas || '',
          descricao: caso.descricao || `Bairro ${caso.bairro || 'Desconhecido'} localizado na região central.`
        }));

        const casosComBairro = await Promise.all(
          casosArray.map(async (caso) => {
            if (caso.bairro === 'Desconhecido' && caso.coordenadas.lat && caso.coordenadas.lng) {
              const bairro = await getBairroFromCoordinates(
                caso.coordenadas.lat,
                caso.coordenadas.lng,
                googleMapsApiKey,
                addNotification
              );
              if (bairro !== 'Desconhecido') {
                await updateBairro(database, caso.id, bairro);
              }
              return { ...caso, bairro };
            }
            return caso;
          })
        );

        if (isMounted) {
          setCasos(casosComBairro);
          addNotification('Dados carregados com sucesso', 'success');
        }
      } else {
        if (isMounted) {
          setCasos([]);
          addNotification('Nenhum dado encontrado', 'warning');
        }
      }
      if (isMounted) setLoading(false);
    }, (error) => {
      if (isMounted) {
        console.error('Erro ao buscar dados do Firebase:', error);
        addNotification('Erro ao carregar dados', 'error');
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
      off(casosRef);
    };
  }, [addNotification]);

  useEffect(() => {
    setGruposBairro(agruparPorBairro(casos));
  }, [casos]);

  const casosFiltrados = useMemo(() => {
    return casos.filter((caso) => {
      const matchStatus = filtroStatus === 'todos' || caso.status === filtroStatus;
      const matchGravidade = filtroGravidade === 'todos' || caso.gravidade === filtroGravidade;
      const matchBusca = caso.agente.toLowerCase().includes(busca.toLowerCase()) ||
                        caso.id.toLowerCase().includes(busca.toLowerCase()) ||
                        (caso.bairro && caso.bairro.toLowerCase().includes(busca.toLowerCase()));
      const matchDate = !dateFilter || isSameDay(new Date(caso.timestamp), dateFilter);
      return matchStatus && matchGravidade && matchBusca && matchDate;
    });
  }, [casos, filtroStatus, filtroGravidade, busca, dateFilter]);

  const stats = useMemo(() => {
    return {
      total: casos.length,
      confirmados: casos.filter((c) => c.status === 'confirmado').length,
      suspeitos: casos.filter((c) => c.status === 'suspeito').length,
      pendentes: casos.filter((c) => c.status === 'pendente-analise').length,
      descartados: casos.filter((c) => c.status === 'descartado').length,
      criticos: casos.filter((c) => c.gravidade === 'critico').length,
      severos: casos.filter((c) => c.gravidade === 'severa').length,
      moderados: casos.filter((c) => c.gravidade === 'moderada').length,
      leves: casos.filter((c) => c.gravidade === 'leve').length,
      bairros: Object.keys(gruposBairro).length
    };
  }, [casos, gruposBairro]);

  useEffect(() => {
    if (casos.length > 0) {
      const analise = gerarInsightsIA(stats, gruposBairro, casos);
      setIaAnalise(analise);
    } else {
      setIaAnalise('Nenhum caso registrado no sistema. Mantenha a vigilância ativa.');
    }
  }, [stats, gruposBairro, casos]);

  const carregarMaisDados = () => {
    setLoading(true);
    setTimeout(() => {
      addNotification('Dados atualizados em tempo real', 'info');
      setLoading(false);
    }, 1500);
  };

  const handleZoomIn = () => setMapZoom((prev) => prev + 1);
  const handleZoomOut = () => setMapZoom((prev) => Math.max(prev - 1, 1));

  const handleMarkerClick = useCallback((caso) => {
    setSelectedCase(caso);
    setMapCenter(caso.coordenadas);
    setSelectedInfoWindow(caso.id);
    setDrawerOpen(true);
  }, []);

  const handleGroupClick = useCallback((bairro, grupo) => {
    setSelectedCase({
      ...grupo.casos[0],
      id: `grupo-${bairro}`,
      agente: `Vários agentes (${grupo.casos.length})`,
      status: 'agrupado',
      gravidade: grupo.confirmados > 0 ? 'critico' : grupo.suspeitos > 0 ? 'moderada' : 'leve',
      bairro,
      notas: `Total de casos: ${grupo.casos.length} (Confirmados: ${grupo.confirmados}, Suspeitos: ${grupo.suspeitos})`,
      descricao: grupo.descricao,
      coordenadas: grupo.coordenadas
    });
    setMapCenter(grupo.coordenadas);
    setSelectedInfoWindow(`grupo-${bairro}`);
    setDrawerOpen(true);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedInfoWindow(null);
  }, []);

  const exportToCSV = () => {
    try {
      const headers = ['ID', 'Agente', 'Bairro', 'Status', 'Gravidade', 'Data/Hora', 'Dispositivo', 'Latitude', 'Longitude', 'Notas'];
      
      const rows = casosFiltrados.map(caso => [
        `"${caso.id.replace(/"/g, '""')}"`,
        `"${caso.agente.replace(/"/g, '""')}"`,
        `"${(caso.bairro || 'Desconhecido').replace(/"/g, '""')}"`,
        `"${caso.status.replace(/"/g, '""')}"`,
        `"${caso.gravidade.replace(/"/g, '""')}"`,
        `"${caso.dataHora.replace(/"/g, '""')}"`,
        `"${caso.dispositivo.replace(/"/g, '""')}"`,
        caso.coordenadas.lat,
        caso.coordenadas.lng,
        `"${(caso.notas || '').replace(/"/g, '""')}"`
      ].join(','));

      const csvContent = [headers.join(','), ...rows].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `casos_colera_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addNotification('Exportação para CSV concluída com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      addNotification('Erro ao exportar para CSV', 'error');
    }
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);
      const blob = await pdf(
        <RelatorioPDF 
          casosFiltrados={casosFiltrados} 
          stats={stats} 
          dateFilter={dateFilter}
          iaAnalise={iaAnalise}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio_colera_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      addNotification('Relatório PDF (com insights IA) gerado e baixado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      addNotification('Erro ao gerar o relatório PDF', 'error');
    } finally {
      setLoading(false);
    }
  };

  const additionalControls = useMemo(() => (
  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
    <Tooltip title="Recarregar dados">
      <span> {/* ADICIONE ESTE WRAPPER */}
        <IconButton color="inherit" onClick={carregarMaisDados} disabled={loading} size="small">
          {loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon fontSize="small" />}
        </IconButton>
      </span>
    </Tooltip>
    
    <Tooltip title="Filtrar por data">
      <IconButton color="inherit" onClick={() => setShowDateFilter(true)} size="small">
        <DateRangeIcon fontSize="small" />
      </IconButton>
    </Tooltip>
    
    <ToggleButtonGroup
      value={viewMode}
      exclusive
      onChange={(e, newMode) => newMode && setViewMode(newMode)}
      size="small"
      sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}
    >
      <ToggleButton value="casos" sx={{ px: 1, py: 0.5 }}>
        <PeopleIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="caption">Casos</Typography>
      </ToggleButton>
      <ToggleButton value="agrupado" sx={{ px: 1, py: 0.5 }}>
        <LocationCityIcon fontSize="small" sx={{ mr: 0.5 }} />
        <Typography variant="caption">Bairros</Typography>
      </ToggleButton>
    </ToggleButtonGroup>
    
    <Tooltip title={showHeatmap ? "Desativar mapa de calor" : "Ativar mapa de calor"}>
      <IconButton 
        color={showHeatmap ? 'secondary' : 'inherit'} 
        onClick={() => setShowHeatmap(!showHeatmap)}
        size="small"
      >
        <LayersIcon fontSize="small" />
      </IconButton>
    </Tooltip>

    <Tooltip title="Insights e Análise Inteligente (IA)">
      <IconButton 
        color={showIAAnalysis ? 'secondary' : 'inherit'} 
        onClick={() => setShowIAAnalysis(!showIAAnalysis)}
        size="small"
      >
        <SmartToyIcon fontSize="small" />
      </IconButton>
    </Tooltip>

    <Tooltip title={showLegend ? "Ocultar Legenda" : "Mostrar Legenda"}>
      <IconButton 
        color={showLegend ? 'secondary' : 'inherit'} 
        onClick={() => setShowLegend(!showLegend)}
        size="small"
      >
        {showLegend ? <VisibilityIcon fontSize="small" /> : <VisibilityOffIcon fontSize="small" />}
      </IconButton>
    </Tooltip>

    <FormControl size="small" sx={{ minWidth: 100 }}>
      <Select
        value={mapType}
        onChange={(e) => setMapType(e.target.value)}
        sx={{ 
          color: 'white', 
          bgcolor: 'rgba(255,255,255,0.1)',
          '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
          borderRadius: 2,
          fontSize: '0.75rem',
          py: 0.5
        }}
      >
        <MenuItem value="roadmap">Padrão</MenuItem>
        <MenuItem value="satellite">Satélite</MenuItem>
        <MenuItem value="terrain">Terreno</MenuItem>
        <MenuItem value="hybrid">Híbrido</MenuItem>
      </Select>
    </FormControl>

    <Tooltip title="Exportar para CSV">
      <IconButton color="inherit" onClick={exportToCSV} size="small">
        <GetAppIcon fontSize="small" />
      </IconButton>
    </Tooltip>

    {/* ESTE É O QUE ESTÁ CAUSANDO O ERRO - CORRIGIDO COM SPAN */}
    <Tooltip title="Exportar para PDF (com insights IA)">
      <span> {/* ADICIONE ESTE WRAPPER */}
        <IconButton color="inherit" onClick={exportToPDF} disabled={loading} size="small">
          <GetAppIcon fontSize="small" />
        </IconButton>
      </span>
    </Tooltip>
  </Box>
), [loading, viewMode, showHeatmap, mapType, showIAAnalysis, showLegend, exportToCSV, exportToPDF, carregarMaisDados, setShowDateFilter, setViewMode, setShowHeatmap, setShowIAAnalysis, setShowLegend, setMapType]);
  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default' }}>
          {/* AppBar Fixo */}
          <AppBar position="fixed" elevation={0} sx={{ 
            bgcolor: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            zIndex: 1200
          }}>
            <Toolbar>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <MapIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mr: 2, lineHeight: 1.2 }}>
                    VigiCólera Angola
                  </Typography>
                  <Typography variant="caption" color="secondary.main" sx={{ fontSize: '0.7rem', lineHeight: 1 }}>
                    Sistema de Monitoramento Inteligente
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, ml: 2 }}>
                  <AnimatedBadge badgeContent={stats.confirmados}>
                    <Chip 
                      icon={<WarningIcon />} 
                      label={`${stats.confirmados} Confirmados`} 
                      color="error" 
                      variant="outlined"
                      size="small"
                    />
                  </AnimatedBadge>
                  
                  <AnimatedBadge badgeContent={stats.pendentes} color="primary">
                    <Chip 
                      icon={<ScheduleIcon />} 
                      label={`${stats.pendentes} Pendentes`} 
                      color="primary" 
                      variant="outlined"
                      size="small"
                    />
                  </AnimatedBadge>

                  <AnimatedBadge badgeContent={stats.total}>
                    <Chip 
                      icon={<AnalyticsIcon />} 
                      label={`${stats.total} Total`} 
                      color="info" 
                      variant="outlined"
                      size="small"
                      onClick={() => setShowStatistics(!showStatistics)}
                      clickable
                    />
                  </AnimatedBadge>
                </Box>
              </Box>

              <Box sx={{ flexGrow: 1 }} />

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Estatísticas Detalhadas">
                  <IconButton 
                    color={showStatistics ? 'secondary' : 'inherit'} 
                    onClick={() => setShowStatistics(!showStatistics)}
                    sx={{ 
                      bgcolor: showStatistics ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    <AnalyticsIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title={showSidebar ? "Ocultar Sidebar" : "Exibir Sidebar"}>
                  <IconButton 
                    color="inherit" 
                    onClick={() => setShowSidebar(!showSidebar)}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
                    }}
                  >
                    {showSidebar ? <CloseIcon /> : <FilterIcon />}
                  </IconButton>
                </Tooltip>

                {additionalControls}
              </Box>
            </Toolbar>
          </AppBar>




          

          {/* Espaço para a AppBar fixa */}
          <Toolbar />

          {/* Painel de Estatísticas */}
          <Collapse in={showStatistics}>
            <Paper elevation={0} sx={{ 
              p: 3, 
              bgcolor: 'rgba(26, 26, 40, 0.95)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TrendingUpIcon color="primary" />
                Estatísticas Detalhadas em Tempo Real
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <StatCard
                    title="Casos Confirmados"
                    value={stats.confirmados}
                    color="#ff5252"
                    icon={<WarningIcon />}
                    subtitle={`${stats.total > 0 ? ((stats.confirmados / stats.total) * 100).toFixed(1) : 0}% do total`}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StatCard
                    title="Casos Suspeitos"
                    value={stats.suspeitos}
                    color="#ffab40"
                    icon={<ScheduleIcon />}
                    subtitle={`${stats.total > 0 ? ((stats.suspeitos / stats.total) * 100).toFixed(1) : 0}% do total`}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StatCard
                    title="Casos Pendentes"
                    value={stats.pendentes}
                    color="#40c4ff"
                    icon={<TimelineIcon />}
                    subtitle={`${stats.total > 0 ? ((stats.pendentes / stats.total) * 100).toFixed(1) : 0}% do total`}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <StatCard
                    title="Casos Descartados"
                    value={stats.descartados}
                    color="#69f0ae"
                    icon={<CheckCircleIcon />}
                    subtitle={`${stats.total > 0 ? ((stats.descartados / stats.total) * 100).toFixed(1) : 0}% do total`}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationCityIcon color="info" />
                    Distribuição por Gravidade e Bairros
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={8}>
                      <Grid container spacing={2}>
                        <Grid item xs={3}>
                          <StatCard
                            title="Críticos"
                            value={stats.criticos}
                            color="#d32f2f"
                            icon={<WarningIcon />}
                            subtitle="Casos graves"
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <StatCard
                            title="Severos"
                            value={stats.severos}
                            color="#f57c00"
                            icon={<WarningIcon />}
                            subtitle="Casos severos"
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <StatCard
                            title="Moderados"
                            value={stats.moderados}
                            color="#ffb300"
                            icon={<WarningIcon />}
                            subtitle="Casos moderados"
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <StatCard
                            title="Leves"
                            value={stats.leves}
                            color="#7cb342"
                            icon={<WarningIcon />}
                            subtitle="Casos leves"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <StatCard
                        title="Bairros Afetados"
                        value={stats.bairros}
                        color="#2196f3"
                        icon={<LocationCityIcon />}
                        subtitle={`${stats.total > 0 ? (stats.total / stats.bairros).toFixed(1) : 0} casos/bairro`}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Collapse>

          {/* Painel de Insights e Análise IA */}
          <Collapse in={showIAAnalysis}>
            <Accordion 
              defaultExpanded={false}
              elevation={0}
              sx={{ 
                bgcolor: 'rgba(20, 20, 40, 0.95)',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                '&:before': { display: 'none' }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon sx={{ color: 'secondary.main' }} />}
                sx={{ 
                  bgcolor: 'rgba(30, 30, 60, 0.8)',
                  borderBottom: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SmartToyIcon color="secondary" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Insights e Análise Inteligente em Tempo Real
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Análise preditiva e recomendações baseadas em IA
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'transparent' }}>
                  <Card elevation={2} sx={{ 
                    bgcolor: 'rgba(10, 10, 30, 0.8)',
                    border: '1px solid rgba(0, 229, 255, 0.2)'
                  }}>
                    <CardContent>
                      <Typography 
                        variant="body1" 
                        component="pre" 
                        sx={{ 
                          whiteSpace: 'pre-wrap', 
                          fontFamily: 'inherit',
                          color: 'rgba(255, 255, 255, 0.9)',
                          fontSize: '0.9rem',
                          lineHeight: 1.6
                        }}
                      >
                        {iaAnalise || 'Carregando insights...'}
                      </Typography>
                      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          color="secondary"
                          onClick={exportToPDF}
                          startIcon={<GetAppIcon />}
                        >
                          Exportar Análise
                        </Button>
                        <Button 
                          size="small" 
                          variant="contained" 
                          color="secondary"
                          onClick={() => addNotification('Análise IA atualizada', 'info')}
                          startIcon={<RefreshIcon />}
                        >
                          Atualizar Análise
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Paper>
              </AccordionDetails>
            </Accordion>
          </Collapse>

          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {showSidebar && (
              <Paper 
                elevation={0} 
                sx={{ 
                  width: 400, 
                  borderRight: '1px solid rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: 'background.paper',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Box sx={{ p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <FilterIcon color="primary" />
                    Filtros e Busca Avançada
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Buscar por ID, Agente ou Bairro..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        sx: { borderRadius: 2 }
                      }}
                      size="small"
                    />

                    <FormControl fullWidth size="small">
                      <InputLabel>Status do Caso</InputLabel>
                      <Select
                        value={filtroStatus}
                        label="Status do Caso"
                        onChange={(e) => setFiltroStatus(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="todos">Todos os Status</MenuItem>
                        <MenuItem value="confirmado">Confirmado</MenuItem>
                        <MenuItem value="suspeito">Suspeito</MenuItem>
                        <MenuItem value="pendente-analise">Pendente</MenuItem>
                        <MenuItem value="descartado">Descartado</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth size="small">
                      <InputLabel>Nível de Gravidade</InputLabel>
                      <Select
                        value={filtroGravidade}
                        label="Nível de Gravidade"
                        onChange={(e) => setFiltroGravidade(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="todos">Todas as Gravidades</MenuItem>
                        <MenuItem value="critico">Crítico</MenuItem>
                        <MenuItem value="severa">Severa</MenuItem>
                        <MenuItem value="moderada">Moderada</MenuItem>
                        <MenuItem value="leve">Leve</MenuItem>
                      </Select>
                    </FormControl>

                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      startIcon={<DateRangeIcon />}
                      onClick={() => setShowDateFilter(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      {dateFilter ? format(dateFilter, 'dd/MM/yyyy') : 'Filtrar por data'}
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {viewMode === 'agrupado' ? 'Bairros' : 'Casos'} Encontrados
                    </Typography>
                    <Chip 
                      label={`${viewMode === 'agrupado' ? Object.keys(gruposBairro).length : casosFiltrados.length} itens`} 
                      color="info" 
                      size="small"
                    />
                  </Box>
                  
                  <List sx={{ pt: 0 }}>
                    {viewMode === 'agrupado' ? (
                      Object.entries(gruposBairro).map(([bairro, grupo]) => (
                        <ListItem key={`list-group-${bairro}`} disablePadding>
                          <ListItemButton
                            onClick={() => handleGroupClick(bairro, grupo)}
                            sx={{
                              borderLeft: `4px solid ${grupo.confirmados > 0 ? '#ff5252' : grupo.suspeitos > 0 ? '#ffab40' : '#40c4ff'}`,
                              mb: 1,
                              mx: 1,
                              borderRadius: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.05)',
                                transform: 'translateX(4px)'
                              }
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ 
                                bgcolor: grupo.confirmados > 0 ? '#ff5252' : grupo.suspeitos > 0 ? '#ffab40' : '#40c4ff',
                                fontWeight: 'bold'
                              }}>
                                {grupo.casos.length}
                              </Avatar>
                            </ListItemAvatar>
                            <Box component="div" sx={{ width: '100%' }}>
                              <Typography variant="subtitle2" fontWeight="bold">
                                {bairro}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                  Total: {grupo.casos.length} casos
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
                                  {grupo.confirmados > 0 && (
                                    <Chip 
                                      label={`${grupo.confirmados}`} 
                                      size="small" 
                                      sx={{ 
                                        bgcolor: '#ff5252',
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        height: 20
                                      }}
                                    />
                                  )}
                                  {grupo.suspeitos > 0 && (
                                    <Chip 
                                      label={`${grupo.suspeitos}`} 
                                      size="small" 
                                      sx={{ 
                                        bgcolor: '#ffab40',
                                        color: 'white',
                                        fontSize: '0.65rem',
                                        height: 20
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </ListItemButton>
                        </ListItem>
                      ))
                    ) : (
                      casosFiltrados.map((caso) => (
                        <ListItem key={`list-caso-${caso.id}`} disablePadding>
                          <ListItemButton
                            onClick={() => handleMarkerClick(caso)}
                            selected={selectedCase?.id === caso.id}
                            sx={{
                              borderLeft: `4px solid ${getStatusColor(caso.status)}`,
                              mb: 1,
                              mx: 1,
                              borderRadius: 2,
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: 'rgba(255,255,255,0.05)',
                                transform: 'translateX(4px)'
                              },
                              '&.Mui-selected': {
                                bgcolor: 'primary.dark',
                                '&:hover': {
                                  bgcolor: 'primary.dark',
                                },
                              },
                            }}
                          >
                            <ListItemAvatar>
                              <Avatar sx={{ 
                                bgcolor: getStatusColor(caso.status),
                                '& .MuiSvgIcon-root': { fontSize: 20 }
                              }}>
                                {getStatusIcon(caso.status)}
                              </Avatar>
                            </ListItemAvatar>
                            <Box component="div" sx={{ width: '100%' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                  {caso.bairro || 'Sem bairro'}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                                  <Chip 
                                    label={caso.status} 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: getStatusColor(caso.status),
                                      color: 'white',
                                      fontWeight: 'bold',
                                      fontSize: '0.7rem',
                                      height: 20
                                    }}
                                  />
                                  <Chip 
                                    label={caso.gravidade} 
                                    size="small" 
                                    sx={{ 
                                      bgcolor: getGravidadeColor(caso.gravidade),
                                      color: 'white',
                                      fontSize: '0.65rem',
                                      height: 18
                                    }}
                                  />
                                </Box>
                              </Box>
                              <Box>
                                <Typography variant="caption" color="text.secondary">
                                  {caso.agente}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                  {formatDateTime(caso.dataHora).date} às {formatDateTime(caso.dataHora).time}
                                </Typography>
                              </Box>
                            </Box>
                          </ListItemButton>
                        </ListItem>
                      ))
                    )}
                  </List>
                </Box>
              </Paper>
            )}

            <Box sx={{ flex: 1, position: 'relative', bgcolor: '#0a0a0a', mt: '64px' }}>
              {loading && (
                <Box sx={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  zIndex: 1000 
                }}>
                  <LinearProgress />
                </Box>
              )}

              <LoadScript 
                googleMapsApiKey={googleMapsApiKey}
                loadingElement={<CircularProgress sx={{ position: 'absolute', top: '50%', left: '50%' }} />}
              >
                <MemoizedMap
                  mapCenter={mapCenter}
                  mapZoom={mapZoom}
                  mapType={mapType}
                  viewMode={viewMode}
                  gruposBairro={gruposBairro}
                  casosFiltrados={casosFiltrados}
                  selectedInfoWindow={selectedInfoWindow}
                  onMarkerClick={handleMarkerClick}
                  onGroupClick={handleGroupClick}
                  onInfoWindowClose={handleInfoWindowClose}
                />
              </LoadScript>

              {/* Card de Legenda - MODIFICADO: com show/hide */}
              {showLegend && (
                <Card 
                  elevation={3} 
                  sx={{ 
                    position: 'absolute', 
                    bottom: 16, 
                    right: 16, 
                    p: 2,
                    bgcolor: 'rgba(26, 26, 26, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    minWidth: 200,
                    zIndex: 10,
                    animation: 'fadeIn 0.3s ease-in-out',
                    '@keyframes fadeIn': {
                      '0%': { opacity: 0, transform: 'translateY(10px)' },
                      '100%': { opacity: 1, transform: 'translateY(0)' }
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LayersIcon fontSize="small" />
                      Legenda do Mapa
                    </Typography>
                    <IconButton size="small" onClick={() => setShowLegend(false)} sx={{ p: 0.5 }}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {[
                      { status: 'confirmado', label: 'Confirmado', color: '#ff5252' },
                      { status: 'suspeito', label: 'Suspeito', color: '#ffab40' },
                      { status: 'pendente-analise', label: 'Pendente', color: '#40c4ff' },
                      { status: 'descartado', label: 'Descartado', color: '#69f0ae' }
                    ].map((item) => (
                      <Box key={`legenda-${item.status}`} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          bgcolor: item.color 
                        }} />
                        <Typography variant="body2" fontSize="0.8rem">
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                    {viewMode === 'agrupado' && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: '#ff5722',
                          width: 20,
                          height: 20,
                          fontSize: '0.7rem',
                          fontWeight: 'bold'
                        }}>
                          3
                        </Avatar>
                        <Typography variant="caption">
                          Tamanho = número de casos
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Card>
              )}
{/* Card de Estatísticas Rápidas - Canto Superior Esquerdo */}
<Card 
  elevation={3} 
  sx={{ 
    position: 'absolute', 
    top: 16,  // 16px do topo
    left: showSidebar ? 340 : 16,  // Se sidebar visível, posiciona à direita dela (340px), senão 16px da esquerda
    p: 1,
    bgcolor: 'rgba(26, 26, 26, 0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2,
    minWidth: 'auto',
    zIndex: 10,
    transition: 'left 0.3s ease'
  }}
>
  <Box sx={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1,
    whiteSpace: 'nowrap'
  }}>
    {viewMode === 'agrupado' ? 
      <LocationCityIcon sx={{ fontSize: 14, color: 'primary.main' }} /> : 
      <PeopleIcon sx={{ fontSize: 14, color: 'primary.main' }} />
    }
    
    <Typography variant="caption" fontWeight="bold" sx={{ lineHeight: 1 }}>
      {viewMode === 'agrupado' ? 'Bairros' : 'Casos'}:
    </Typography>
    
    <Typography variant="body2" color="primary.main" fontWeight="bold" sx={{ lineHeight: 1 }}>
      {viewMode === 'agrupado' ? Object.keys(gruposBairro).length : casosFiltrados.length}
    </Typography>
    
    {dateFilter && (
      <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1, ml: 0.5 }}>
        ({format(dateFilter, 'dd/MM')})
      </Typography>
    )}
  </Box>
</Card>
            </Box>
          </Box>

          {/* Drawer de Detalhes */}
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{
              sx: { 
                width: 400, 
                bgcolor: 'background.paper',
                backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px)'
              }
            }}
          >
            {selectedCase && (
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {selectedCase.status === 'agrupado' ? '📊 Detalhes do Agrupamento' : '📋 Detalhes do Caso'}
                  </Typography>
                  <IconButton onClick={() => setDrawerOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </Box>

                <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                      {selectedCase.status === 'agrupado' ? '📍 Localização do Agrupamento' : '👤 Identificação'}
                    </Typography>
                    {selectedCase.status === 'agrupado' ? (
                      <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <LocationCityIcon color="primary" />
                          <Typography variant="h6">
                            {selectedCase.bairro}
                          </Typography>
                        </Box>
                        <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary', mb: 2 }}>
                          {selectedCase.descricao}
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <strong>🆔 ID:</strong> <code>{selectedCase.id}</code>
                        </Typography>
                        <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <strong>👨‍⚕️ Agente:</strong> {selectedCase.agente}
                        </Typography>
                        <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary', mt: 2 }}>
                          {selectedCase.descricao}
                        </Typography>
                      </>
                    )}
                    {selectedCase.bairro && selectedCase.status !== 'agrupado' && (
                      <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <strong>🏘️ Bairro:</strong> {selectedCase.bairro}
                      </Typography>
                    )}
                    <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <strong>📱 Dispositivo:</strong> {selectedCase.dispositivo}
                    </Typography>
                  </CardContent>
                </Card>

                <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                      ⚠️ Status e Gravidade
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      {selectedCase.status === 'agrupado' ? (
                        <>
                          <Chip
                            label={`${selectedCase.notas.split('Confirmados: ')[1]?.split(',')[0] || 0} confirmados`}
                            sx={{
                              bgcolor: '#ff5252',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                          <Chip
                            label={`${selectedCase.notas.split('Suspeitos: ')[1]?.split(')')[0] || 0} suspeitos`}
                            sx={{
                              bgcolor: '#ffab40',
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <Chip
                            label={selectedCase.status}
                            sx={{
                              bgcolor: getStatusColor(selectedCase.status),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                          <Chip
                            label={selectedCase.gravidade}
                            sx={{
                              bgcolor: getGravidadeColor(selectedCase.gravidade),
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          />
                        </>
                      )}
                    </Box>
                    {selectedCase.notas && selectedCase.status !== 'agrupado' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>📝 Notas:</strong> {selectedCase.notas}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>

                <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                      📍 Localização Geográfica
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <strong>🌐 Latitude:</strong> {selectedCase.coordenadas.lat.toFixed(6)}
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <strong>🌐 Longitude:</strong> {selectedCase.coordenadas.lng.toFixed(6)}
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <strong>🎯 Precisão:</strong> {selectedCase.coordenadas.precisao.toFixed(1)} metros
                    </Typography>
                    {selectedCase.status === 'agrupado' && (
                      <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                        <strong>📊 Total de casos:</strong> {gruposBairro[selectedCase.bairro]?.casos?.length || 0}
                      </Typography>
                    )}
                  </CardContent>
                </Card>

                <Card elevation={2} sx={{ mb: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary.main" gutterBottom>
                      📅 Data e Hora do Registro
                    </Typography>
                    {selectedCase.status === 'agrupado' ? (
                      <Typography variant="body2" gutterBottom>
                        Vários registros entre {format(subDays(new Date(), 2), 'dd/MM/yyyy')} e {format(new Date(), 'dd/MM/yyyy')}
                      </Typography>
                    ) : (
                      <>
                        <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <strong>📅 Data:</strong> {formatDateTime(selectedCase.dataHora).date}
                        </Typography>
                        <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <strong>⏰ Hora:</strong> {formatDateTime(selectedCase.dataHora).time}
                        </Typography>
                      </>
                    )}
                    <Typography variant="body2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                      <strong>🕐 Timestamp:</strong> {new Date(selectedCase.timestamp).toLocaleString('pt-BR', { timeZone: 'Africa/Luanda' })}
                    </Typography>
                  </CardContent>
                </Card>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VisibilityIcon />}
                    onClick={() => {
                      setMapCenter(selectedCase.coordenadas);
                      setDrawerOpen(false);
                    }}
                    sx={{ borderRadius: 2, flex: 1 }}
                  >
                    Centrar no Mapa
                  </Button>
                  {selectedCase.status !== 'agrupado' && (
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<PhoneIcon />}
                      onClick={() => addNotification(`Contactando agente ${selectedCase.agente}...`, 'info')}
                      sx={{ borderRadius: 2, flex: 1 }}
                    >
                      Contactar Agente
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Drawer>

          <Dialog open={showDateFilter} onClose={() => setShowDateFilter(false)} PaperProps={{ sx: { borderRadius: 2 } }}>
            <DialogTitle>📅 Filtrar por data</DialogTitle>
            <DialogContent>
              <DatePicker
                label="Selecione uma data"
                value={dateFilter}
                onChange={(newValue) => setDateFilter(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    margin: 'normal',
                    sx: { mt: 2 }
                  }
                }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => {
                setDateFilter(null);
                setShowDateFilter(false);
              }}>
                Limpar filtro
              </Button>
              <Button onClick={() => setShowDateFilter(false)} variant="contained">
                Aplicar
              </Button>
            </DialogActions>
          </Dialog>

          <Snackbar
            open={showNotification}
            autoHideDuration={6000}
            onClose={() => setShowNotification(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setShowNotification(false)}
              severity={notifications.length > 0 ? notifications[notifications.length - 1].severity : 'info'}
              sx={{ width: '100%', borderRadius: 2 }}
            >
              {notifications.length > 0 ? notifications[notifications.length - 1].message : ''}
            </Alert>
          </Snackbar>

          {/* Controles do Mapa */}
          <Box sx={{ position: 'fixed', top: 180, right: 16, display: 'flex', flexDirection: 'column', gap: 1, zIndex: 1000 }}>
            <Fab size="medium" color="primary" onClick={handleZoomIn} sx={{ boxShadow: 3, borderRadius: 2 }}>
              <ZoomInIcon />
            </Fab>
            <Fab size="medium" color="primary" onClick={handleZoomOut} sx={{ boxShadow: 3, borderRadius: 2 }}>
              <ZoomOutIcon />
            </Fab>
            <Fab size="medium" color="secondary" onClick={() => setMapCenter({ lat: -7.6063, lng: 15.0548 })} sx={{ boxShadow: 3, borderRadius: 2 }}>
              <MyLocationIcon />
            </Fab>
          </Box>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}