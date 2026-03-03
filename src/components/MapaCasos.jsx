/**
 * VigiCólera Uige — MapaCasos
 * Layout 100% responsivo — Mobile + Tablet + Desktop
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box, Card, Chip, Avatar, List, ListItem, ListItemButton,
  ListItemAvatar, Paper, Grid, IconButton, Drawer, AppBar, Toolbar,
  Badge, Tooltip, Collapse, Alert, LinearProgress, CircularProgress,
  Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, ToggleButton, ToggleButtonGroup, TextField, FormControl,
  InputLabel, Select, MenuItem, Typography, Accordion, AccordionSummary,
  AccordionDetails, useMediaQuery, SwipeableDrawer, Menu, InputAdornment,
  Fab, Zoom, BottomNavigation, BottomNavigationAction,
} from '@mui/material';
import {
  Search as SearchIcon, FilterList as FilterIcon, Analytics as AnalyticsIcon,
  Close as CloseIcon, LocationOn as LocationIcon, Warning as WarningIcon,
  CheckCircle as CheckCircleIcon, Schedule as ScheduleIcon, Phone as PhoneIcon,
  Timeline as TimelineIcon, Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon,
  Map as MapIcon, People as PeopleIcon, TrendingUp as TrendingUpIcon,
  LocationCity as LocationCityIcon, Refresh as RefreshIcon, DateRange as DateRangeIcon,
  ZoomIn as ZoomInIcon, ZoomOut as ZoomOutIcon, MyLocation as MyLocationIcon,
  GetApp as GetAppIcon, SmartToy as SmartToyIcon, ExpandMore as ExpandMoreIcon,
  MoreVert as MoreVertIcon, ClearAll as ClearAllIcon, Layers as LayersIcon,
  Print as PrintIcon, Share as ShareIcon, NotificationsActive as AlertIcon,
  List as ListNavIcon, Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, isAfter, isBefore } from 'date-fns';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, update } from 'firebase/database';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow, HeatmapLayer } from '@react-google-maps/api';
import { pdf, Document, Page, Text, View, StyleSheet as PDFStyles } from '@react-pdf/renderer';

// ─── Firebase ─────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBtnU84zOmm9mjwJNf7Sa7g4exGjUI_kj0",
  authDomain: "vigicolera.firebaseapp.com",
  databaseURL: "https://vigicolera-default-rtdb.firebaseio.com",
  projectId: "vigicolera",
  storageBucket: "vigicolera.firebasestorage.app",
  messagingSenderId: "443742285213",
  appId: "1:443742285213:web:ce5c8ef141c46ed2ccd374",
};
const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDEyAiggQthZ3AibDKDY9UNBoypYYamKBo';
const MAPS_LIBS = ['visualization'];

// ─── Google Maps Light Style ──────────────────────────────────────────────────
const GM_LIGHT = [
  { elementType: 'geometry', stylers: [{ color: '#f5f5f5' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#f5f5f5' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e5f5e0' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#4a7c59' }] },
  { featureType: 'poi.medical', elementType: 'geometry', stylers: [{ color: '#fce8e8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#ffd54f' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#f9a825' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#aee0f4' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#2196f3' }] },
  { featureType: 'landscape.natural', elementType: 'geometry', stylers: [{ color: '#e8f5e9' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry', stylers: [{ color: '#eeeeee' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#e5e5e5' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#484848' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
];

// ─── Tema ─────────────────────────────────────────────────────────────────────
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#1a73e8' },
    secondary:  { main: '#00bcd4' },
    background: { default: '#0a0a0a', paper: '#141414' },
    error:      { main: '#ea4335' },
    warning:    { main: '#fbbc05' },
    success:    { main: '#34a853' },
    info:       { main: '#4285f4' },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,rgba(255,255,255,0.03) 100%)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          backgroundColor: 'rgba(8,8,8,0.97)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10,10,10,0.97)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.4)',
          '&.Mui-selected': { color: '#1a73e8' },
          minWidth: 0,
          padding: '6px 8px',
        },
      },
    },
    MuiTypography: { defaultProps: { component: 'div' } },
  },
});

// ─── PDF ──────────────────────────────────────────────────────────────────────
const PS = PDFStyles.create({
  page:  { padding: 28, fontSize: 10, fontFamily: 'Helvetica' },
  title: { fontSize: 20, marginBottom: 6, textAlign: 'center', fontWeight: 'bold' },
  sub:   { fontSize: 11, marginBottom: 16, textAlign: 'center', color: '#666' },
  h2:    { fontSize: 13, margin: '14px 0 8px', fontWeight: 'bold', color: '#1a73e8' },
  row:   { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 },
  box:   { width: '22%', padding: 8, border: '1px solid #ddd', borderRadius: 4, alignItems: 'center', marginBottom: 6, marginRight: '2%' },
  num:   { fontSize: 18, fontWeight: 'bold', marginBottom: 3 },
  tbl:   { borderStyle: 'solid', borderWidth: 1, borderColor: '#ccc', marginTop: 8 },
  th:    { flex: 1, padding: 6, backgroundColor: '#1a73e8', color: 'white', fontWeight: 'bold', fontSize: 8, borderRight: '1px solid #aaa' },
  td:    { flex: 1, padding: 4, fontSize: 7, borderRight: '1px solid #ccc', borderTop: '1px solid #ccc' },
  thW:   { flex: 2, padding: 6, backgroundColor: '#1a73e8', color: 'white', fontWeight: 'bold', fontSize: 8 },
  tdW:   { flex: 2, padding: 4, fontSize: 7, borderTop: '1px solid #ccc' },
  ai:    { padding: 10, border: '1px solid #00bcd4', borderRadius: 5, backgroundColor: '#f0feff', marginBottom: 10 },
  ait:   { fontSize: 9, lineHeight: 1.6, color: '#333' },
});

const RelatorioPDF = ({ casos, stats, filtros, ia }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={PS.page}>
      <Text style={PS.title}>Relatório VigiCólera Uige</Text>
      <Text style={PS.sub}>Gerado: {new Date().toLocaleString('pt-AO')}</Text>
      <Text style={PS.h2}>Resumo Estatístico</Text>
      <View style={PS.row}>
        {[['Confirmados',stats.confirmados,'#ea4335'],['Suspeitos',stats.suspeitos,'#fbbc05'],['Pendentes',stats.pendentes,'#1a73e8'],['Descartados',stats.descartados,'#34a853'],['Total',stats.total,'#212121'],['Bairros',stats.bairros,'#1a73e8'],['Críticos',stats.criticos,'#b71c1c']].map(([l,v,c])=>(
          <View key={l} style={PS.box}><Text style={[PS.num,{color:c}]}>{v}</Text><Text>{l}</Text></View>
        ))}
      </View>
      {ia && <><Text style={PS.h2}>Análise IA</Text><View style={PS.ai}><Text style={PS.ait}>{ia}</Text></View></>}
      <Text style={PS.h2}>Casos Registados ({casos.length})</Text>
      <View style={PS.tbl}>
        <View style={{flexDirection:'row'}}>
          {['ID','Agente','Bairro','Status','Gravidade','Data/Hora','Lat','Lng'].map(h=><Text key={h} style={PS.th}>{h}</Text>)}
          <Text style={PS.thW}>Notas</Text>
        </View>
        {casos.slice(0,200).map(c=>(
          <View key={c.id} style={{flexDirection:'row'}}>
            <Text style={PS.td}>{c.id}</Text>
            <Text style={PS.td}>{c.agente}</Text>
            <Text style={PS.td}>{c.bairro||'—'}</Text>
            <Text style={PS.td}>{c.status}</Text>
            <Text style={PS.td}>{c.gravidade}</Text>
            <Text style={PS.td}>{c.dataHora}</Text>
            <Text style={PS.td}>{c.coordenadas.lat.toFixed(5)}</Text>
            <Text style={PS.td}>{c.coordenadas.lng.toFixed(5)}</Text>
            <Text style={PS.tdW}>{c.notas||'—'}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// ─── Utilitários ──────────────────────────────────────────────────────────────
const SC = { confirmado:'#ea4335', suspeito:'#fbbc05', 'pendente-analise':'#4285f4', descartado:'#34a853' };
const GC = { critico:'#b71c1c', severa:'#e65100', moderada:'#f9a825', leve:'#2e7d32' };
const SI = { confirmado:<WarningIcon/>, suspeito:<ScheduleIcon/>, 'pendente-analise':<TimelineIcon/>, descartado:<CheckCircleIcon/> };
const SP = { confirmado:'!', suspeito:'?', 'pendente-analise':'·', descartado:'✓' };

const sc = s => SC[s]||'#9e9e9e';
const gc = g => GC[g]||'#616161';

const buildPin = (color, label, size=36) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size*1.4}" viewBox="0 0 36 50"><defs><filter id="f"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,.35)"/></filter></defs><path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 32 18 32S36 31.5 36 18C36 8.06 27.94 0 18 0z" fill="${color}" stroke="white" stroke-width="1.5" filter="url(#f)"/><circle cx="18" cy="18" r="10" fill="white" opacity=".9"/><text x="18" y="23" text-anchor="middle" font-size="11" font-weight="bold" font-family="Arial" fill="${color}">${label||''}</text></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
};
const buildCluster = (color, count, size=46) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><filter id="s"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,.3)"/></filter></defs><circle cx="${size/2}" cy="${size/2}" r="${size/2-2}" fill="${color}" opacity=".18" filter="url(#s)"/><circle cx="${size/2}" cy="${size/2}" r="${size/2-7}" fill="${color}"/><circle cx="${size/2}" cy="${size/2}" r="${size/2-11}" fill="white" opacity=".22"/><text x="${size/2}" y="${size/2+5}" text-anchor="middle" font-size="${count>99?9:12}" font-weight="bold" font-family="Arial" fill="white">${count>99?'99+':count}</text></svg>`;
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
};

const fdt = str => { try { const [d,t]=str.split(', '); return {date:d,time:t}; } catch { return {date:'—',time:'—'}; } };

const groupByBairro = casos => casos.reduce((acc,c)=>{
  const b = c.bairro||'Desconhecido';
  if(!acc[b]) acc[b]={casos:[],confirmados:0,suspeitos:0,pendentes:0,descartados:0,coordenadas:c.coordenadas};
  acc[b].casos.push(c);
  if(c.status==='confirmado') acc[b].confirmados++;
  else if(c.status==='suspeito') acc[b].suspeitos++;
  else if(c.status==='pendente-analise') acc[b].pendentes++;
  else acc[b].descartados++;
  return acc;
},{});

const getBairro = async (lat,lng,key) => {
  try {
    const r = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${key}`);
    for(const res of r.data.results||[]){
      const n=res.address_components.find(c=>c.types.includes('neighborhood')||c.types.includes('sublocality'));
      if(n) return n.long_name;
    }
    const l=r.data.results?.[0]?.address_components.find(c=>c.types.includes('locality'));
    return l?l.long_name:'Desconhecido';
  } catch { return 'Desconhecido'; }
};

const gerarIA = (stats,grupos,casos) => {
  const {total,confirmados,bairros} = stats;
  const taxa = total>0?((confirmados/total)*100).toFixed(1):0;
  const risco = confirmados>total*0.4?'ALTO':confirmados>total*0.2?'MODERADO':'CONTROLADO';
  const focos = Object.entries(grupos).filter(([,g])=>g.confirmados>0||g.casos.length>3).sort(([,a],[,b])=>b.confirmados-a.confirmados).slice(0,5).map(([b,g])=>`  • ${b}: ${g.casos.length} casos (${g.confirmados} conf.)`).join('\n');
  const media = casos.length>0?(casos.length/Math.max(1,Math.ceil((Date.now()-Math.min(...casos.map(c=>c.timestamp)))/86400000))).toFixed(1):0;
  const recs = {ALTO:'  1. Activar resposta de emergência\n  2. Distribuição de hipoclorito\n  3. Alertar MINSA\n  4. Intensificar vacinação oral\n  5. Isolar fontes contaminadas',MODERADO:'  1. Reforçar brigadas de vigilância\n  2. Campanhas de higiene e saneamento\n  3. Preparar stocks de medicamentos\n  4. Informar comunidades afetadas\n  5. Monitorar casos diariamente',CONTROLADO:'  1. Manter vigilância epidemiológica\n  2. Continuar campanhas preventivas\n  3. Avaliar áreas de risco potencial\n  4. Garantir stocks de materiais\n  5. Sensibilização contínua'}[risco];
  return `NÍVEL DE RISCO: ${risco}\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n ESTATÍSTICAS GERAIS\n  • Total de casos: ${total}\n  • Confirmados: ${confirmados} (${taxa}%)\n  • Bairros afetados: ${bairros}\n  • Média p/bairro: ${total>0?(total/Math.max(bairros,1)).toFixed(1):0} casos\n  • Média diária estimada: ${media} casos/dia\n\n FOCOS CRÍTICOS\n${focos||'  Sem focos críticos identificados'}\n\n ANÁLISE DE TENDÊNCIA\n  ${casos.length>50?'Surto em expansão — focos periféricos activos. Estação chuvosa potencia propagação.':casos.length>20?'Surto activo — controlo parcial. Vigilância intensificada necessária.':'Situação sob vigilância — casos isolados. Monitoramento preventivo recomendado.'}\n\n RECOMENDAÇÕES PRIORITÁRIAS\n${recs}\n\n Atualizado: ${new Date().toLocaleString('pt-AO')}`;
};

// ─── Mapa Memoizado ───────────────────────────────────────────────────────────
const MemoizedMap = React.memo(({center,zoom,mapType,viewMode,showHeatmap,grupos,casos,infoId,onCase,onGroup,onClose})=>{
  const [hoveredId, setHoveredId] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const pinFor = useCallback(caso=>({
    url: buildPin(sc(caso.status),SP[caso.status]||'?',36),
    scaledSize: window.google?.maps ? new window.google.maps.Size(36,50) : undefined,
    anchor: window.google?.maps ? new window.google.maps.Point(18,50) : undefined,
  }),[]);

  const clusterFor = useCallback(g=>{
    const color = g.confirmados>0?'#ea4335':g.suspeitos>0?'#fbbc05':'#4285f4';
    const sz = Math.min(46+g.casos.length*2,72);
    return {
      url: buildCluster(color,g.casos.length,sz),
      scaledSize: window.google?.maps ? new window.google.maps.Size(sz,sz) : undefined,
      anchor: window.google?.maps ? new window.google.maps.Point(sz/2,sz/2) : undefined,
    };
  },[]);

  const heatData = useMemo(()=>
    window.google?.maps ? casos.filter(c=>c.status==='confirmado').map(c=>new window.google.maps.LatLng(c.coordenadas.lat,c.coordenadas.lng)) : []
  ,[casos]);

  const handleMouseOver = useCallback((id) => {
    if(hoverTimeout) clearTimeout(hoverTimeout);
    const t = setTimeout(()=>setHoveredId(id), 300);
    setHoverTimeout(t);
  },[hoverTimeout]);

  const handleMouseOut = useCallback(() => {
    if(hoverTimeout){ clearTimeout(hoverTimeout); setHoverTimeout(null); }
    setHoveredId(null);
  },[hoverTimeout]);

  useEffect(()=>()=>{ if(hoverTimeout) clearTimeout(hoverTimeout); },[hoverTimeout]);

  return (
    <GoogleMap
      mapContainerStyle={{width:'100%',height:'100%'}}
      center={center} zoom={zoom} mapTypeId={mapType}
      options={{ styles:mapType==='roadmap'?GM_LIGHT:[], disableDefaultUI:true, clickableIcons:true, gestureHandling:'greedy' }}
    >
      {showHeatmap && heatData.length>0 && <HeatmapLayer data={heatData} options={{radius:30,opacity:.7}}/>}

      {viewMode==='agrupado'
        ? Object.entries(grupos).map(([b,g])=>(
            <Marker key={`g-${b}`} position={g.coordenadas} icon={clusterFor(g)} onClick={()=>onGroup(b,g)}
              onMouseOver={()=>handleMouseOver(`g-${b}`)} onMouseOut={handleMouseOut}>
              {(hoveredId===`g-${b}`||infoId===`g-${b}`)&&(
                <InfoWindow onCloseClick={onClose} position={g.coordenadas}
                  options={window.google?.maps?{pixelOffset:new window.google.maps.Size(0,-30)}:undefined}>
                  <Box sx={{p:1,maxWidth:200,color:'#212121'}}>
                    <Typography variant="subtitle2" sx={{color:'#1a73e8',fontWeight:700,mb:.5}}>📍 {b}</Typography>
                    <Box sx={{display:'flex',gap:.4,flexWrap:'wrap',mb:.5}}>
                      <Chip label={`${g.casos.length} total`} size="small" sx={{bgcolor:'#e8f0fe',color:'#1a73e8',fontSize:'0.62rem'}}/>
                      {g.confirmados>0&&<Chip label={`${g.confirmados}C`} size="small" sx={{bgcolor:'#fce8e6',color:'#ea4335',fontSize:'0.62rem'}}/>}
                      {g.suspeitos>0&&<Chip label={`${g.suspeitos}S`} size="small" sx={{bgcolor:'#fef7e0',color:'#f9ab00',fontSize:'0.62rem'}}/>}
                    </Box>
                    <Typography sx={{fontSize:'0.65rem',color:'#5f6368'}}>Clique para detalhes</Typography>
                  </Box>
                </InfoWindow>
              )}
            </Marker>
          ))
        : casos.map(caso=>(
            <Marker key={`c-${caso.id}`} position={caso.coordenadas} icon={pinFor(caso)}
              onClick={()=>onCase(caso)} onMouseOver={()=>handleMouseOver(caso.id)} onMouseOut={handleMouseOut}
              animation={window.google?.maps?.Animation?.DROP}>
              {(hoveredId===caso.id||infoId===caso.id)&&(
                <InfoWindow onCloseClick={onClose} position={caso.coordenadas}
                  options={window.google?.maps?{pixelOffset:new window.google.maps.Size(0,-30)}:undefined}>
                  <Box sx={{p:1,maxWidth:200,color:'#212121'}}>
                    <Typography variant="subtitle2" sx={{color:'#1a73e8',fontWeight:700,mb:.4}}>{caso.bairro||'Sem bairro'}</Typography>
                    <Box sx={{display:'flex',gap:.3,mb:.5,flexWrap:'wrap'}}>
                      <Chip label={caso.status} size="small" sx={{bgcolor:sc(caso.status),color:'white',fontSize:'0.6rem',textTransform:'capitalize'}}/>
                      <Chip label={caso.gravidade} size="small" sx={{bgcolor:gc(caso.gravidade),color:'white',fontSize:'0.6rem',textTransform:'capitalize'}}/>
                    </Box>
                    <Typography sx={{fontSize:'0.7rem',color:'#5f6368'}}><strong>👤</strong> {caso.agente}</Typography>
                    <Typography sx={{fontSize:'0.7rem',color:'#5f6368'}}><strong>📅</strong> {fdt(caso.dataHora).date}</Typography>
                    <Typography sx={{fontSize:'0.65rem',color:'#1a73e8',mt:.4,textAlign:'center'}}>Clique para mais</Typography>
                  </Box>
                </InfoWindow>
              )}
            </Marker>
          ))
      }
    </GoogleMap>
  );
});
MemoizedMap.displayName = 'MemoizedMap';

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function MapaCasos() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm','lg'));
  const isDesk   = useMediaQuery(theme.breakpoints.up('lg'));

  // Dados
  const [casos, setCasos]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [lastUpdate, setLast]   = useState(null);
  const [mapReady, setMapReady] = useState(false);

  // Mapa
  const [center, setCenter] = useState({lat:-8.8368,lng:13.2343});
  const [zoom, setZoom]     = useState(6);
  const [mapType, setMapType] = useState('roadmap');
  const [viewMode, setVM]   = useState('casos');
  const [heatmap, setHeatmap] = useState(false);
  const [infoId, setInfoId] = useState(null);

  // UI
  const [sel, setSel]               = useState(null);
  const [detailOpen, setDetail]     = useState(false);
  const [sidebar, setSidebar]       = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showStats, setStats]       = useState(false);
  const [showIA, setIA]             = useState(false);
  const [legend, setLegend]         = useState(true);
  const [moreAnchor, setMore]       = useState(null);
  const [dateDlg, setDateDlg]       = useState(null);
  const [notifs, setNotifs]         = useState([]);
  const [showNotif, setShowN]       = useState(false);

  // Navegação mobile — 0=mapa, 1=lista, 2=análise
  const [mobileTab, setMobileTab] = useState(0);

  // Filtros
  const [F, setFiltros] = useState({ busca:'', status:'todos', gravidade:'todos', bairro:'todos', dateFrom:null, dateTo:null });
  const setF = (k,v) => setFiltros(p=>({...p,[k]:v}));
  const clearF = () => setFiltros({ busca:'', status:'todos', gravidade:'todos', bairro:'todos', dateFrom:null, dateTo:null });
  const nActiveF = Object.entries(F).filter(([k,v])=>v&&v!=='todos'&&!(k==='busca'&&v==='')).length;

  useEffect(()=>{ setSidebar(isDesk); },[isDesk]);

  const addN = useCallback((msg,sev='info')=>{
    setNotifs(p=>[...p,{id:Date.now(),msg,sev}]);
    setShowN(true);
  },[]);

  const grupos     = useMemo(()=>groupByBairro(casos),[casos]);
  const bairroOpts = useMemo(()=>['todos',...Object.keys(grupos).sort()],[grupos]);

  const casosF = useMemo(()=>casos.filter(c=>{
    const q=F.busca.toLowerCase();
    if(q&&!c.agente.toLowerCase().includes(q)&&!c.id.toLowerCase().includes(q)&&!c.bairro?.toLowerCase().includes(q)&&!c.notas?.toLowerCase().includes(q)) return false;
    if(F.status!=='todos'&&c.status!==F.status) return false;
    if(F.gravidade!=='todos'&&c.gravidade!==F.gravidade) return false;
    if(F.bairro!=='todos'&&c.bairro!==F.bairro) return false;
    if(F.dateFrom&&isBefore(new Date(c.timestamp),F.dateFrom)) return false;
    if(F.dateTo&&isAfter(new Date(c.timestamp),F.dateTo)) return false;
    return true;
  }),[casos,F]);

  const gruposF = useMemo(()=>groupByBairro(casosF),[casosF]);

  const stats = useMemo(()=>({
    total:       casos.length,
    filtrados:   casosF.length,
    confirmados: casos.filter(c=>c.status==='confirmado').length,
    suspeitos:   casos.filter(c=>c.status==='suspeito').length,
    pendentes:   casos.filter(c=>c.status==='pendente-analise').length,
    descartados: casos.filter(c=>c.status==='descartado').length,
    criticos:    casos.filter(c=>c.gravidade==='critico').length,
    severos:     casos.filter(c=>c.gravidade==='severa').length,
    moderados:   casos.filter(c=>c.gravidade==='moderada').length,
    leves:       casos.filter(c=>c.gravidade==='leve').length,
    bairros:     Object.keys(grupos).length,
  }),[casos,casosF,grupos]);

  const ia = useMemo(()=>casos.length>0?gerarIA(stats,grupos,casos):'Sem dados. Aguardando registros…',[stats,grupos,casos]);

  const calculateBounds = useCallback((list)=>{
    if(!list||list.length===0) return {center:{lat:-8.8368,lng:13.2343},zoom:6};
    const valid=list.filter(c=>c.coordenadas&&!isNaN(c.coordenadas.lat)&&!isNaN(c.coordenadas.lng));
    if(valid.length===0) return {center:{lat:-8.8368,lng:13.2343},zoom:6};
    let minLat=Math.min(...valid.map(c=>c.coordenadas.lat));
    let maxLat=Math.max(...valid.map(c=>c.coordenadas.lat));
    let minLng=Math.min(...valid.map(c=>c.coordenadas.lng));
    let maxLng=Math.max(...valid.map(c=>c.coordenadas.lng));
    const lm=(maxLat-minLat)*0.1, lgm=(maxLng-minLng)*0.1;
    minLat=Math.max(-90,minLat-lm); maxLat=Math.min(90,maxLat+lm);
    minLng=Math.max(-180,minLng-lgm); maxLng=Math.min(180,maxLng+lgm);
    const center={lat:(minLat+maxLat)/2,lng:(minLng+maxLng)/2};
    const d=Math.max(maxLat-minLat,maxLng-minLng);
    const zoom=d<0.01?15:d<0.05?13:d<0.1?11:d<0.5?9:d<1?7:6;
    return {center,zoom};
  },[]);

  useEffect(()=>{
    let alive=true;
    setLoading(true);
    const r=ref(database,'casos-colera');
    const unsub=onValue(r,async snap=>{
      if(!alive) return;
      const data=snap.val();
      if(!data){ setCasos([]); setLoading(false); setMapReady(true); return; }
      const arr=Object.entries(data).map(([id,c])=>({
        id, agente:c.agente||'Desconhecido',
        coordenadas:{lat:parseFloat(c.coordenadas?.lat)||0,lng:parseFloat(c.coordenadas?.lng)||0,precisao:c.coordenadas?.precisao||100},
        dataHora:c.dataHora||'—', dispositivo:c.dispositivo||'—', gravidade:c.gravidade||'leve',
        status:c.tipoCaso||'pendente-analise', timestamp:c.timestamp||Date.now(),
        bairro:c.bairro||'Desconhecido', notas:c.notas||'',
      }));
      const enriched=await Promise.all(arr.map(async c=>{
        if(c.bairro==='Desconhecido'&&c.coordenadas.lat&&c.coordenadas.lng){
          const b=await getBairro(c.coordenadas.lat,c.coordenadas.lng,MAPS_KEY);
          if(b!=='Desconhecido'){ try{ await update(ref(database,`casos-colera/${c.id}`),{bairro:b}); }catch{} }
          return {...c,bairro:b};
        }
        return c;
      }));
      if(alive){
        setCasos(enriched); setLast(new Date());
        const {center:nc,zoom:nz}=calculateBounds(enriched);
        setCenter(nc); setZoom(nz);
        setLoading(false); setMapReady(true);
        addN(`${enriched.length} casos carregados`,'success');
      }
    },err=>{ if(alive){ addN('Erro: '+err.message,'error'); setLoading(false); setMapReady(true); }});
    return ()=>{ alive=false; unsub(); off(r); };
  },[addN,calculateBounds]);

  useEffect(()=>{
    if(casosF.length>0&&mapReady){
      const {center:nc,zoom:nz}=calculateBounds(casosF);
      setCenter(nc); setZoom(nz);
    }
  },[casosF,mapReady]);

  const goToCase = useCallback(caso=>{
    setSel(caso); setCenter(caso.coordenadas); setZoom(17);
    setInfoId(caso.id); setDetail(true);
    if(isMobile){ setMobileTab(0); }
    else if(!isDesk) setSidebar(false);
  },[isDesk,isMobile]);

  const goToGroup = useCallback((b,g)=>{
    setCenter(g.coordenadas); setZoom(15); setInfoId(`g-${b}`);
    setSel({ id:`g-${b}`, bairro:b, agente:`${g.casos.length} casos`, status:'agrupado', gravidade:'—',
      coordenadas:g.coordenadas, dataHora:'—', dispositivo:'—',
      notas:`Conf: ${g.confirmados} | Susp: ${g.suspeitos} | Pend: ${g.pendentes}`, _g:g });
    setDetail(true);
    if(isMobile){ setMobileTab(0); }
    else if(!isDesk) setSidebar(false);
  },[isDesk,isMobile]);

  const reload = ()=>{ setLoading(true); setTimeout(()=>{ setLoading(false); addN('Dados actualizados','success'); },1500); };

  const exportCSV = useCallback(()=>{
    try{
      const h=['ID','Agente','Bairro','Status','Gravidade','Data/Hora','Lat','Lng','Notas'];
      const rows=casosF.map(c=>[c.id,c.agente,c.bairro,c.status,c.gravidade,c.dataHora,c.coordenadas.lat,c.coordenadas.lng,c.notas].map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(','));
      const blob=new Blob([[h.join(','),...rows].join('\n')],{type:'text/csv;charset=utf-8;'});
      const a=Object.assign(document.createElement('a'),{href:URL.createObjectURL(blob),download:`vigicolera_${format(new Date(),'yyyyMMdd_HHmm')}.csv`});
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      addN(`CSV exportado — ${casosF.length} casos`,'success');
    }catch(e){ addN('Erro CSV: '+e.message,'error'); }
  },[casosF,addN]);

  const exportPDF = useCallback(async()=>{
    setLoading(true);
    try{
      const blob=await pdf(<RelatorioPDF casos={casosF} stats={stats} filtros={F} ia={ia}/>).toBlob();
      const url=URL.createObjectURL(blob);
      const a=Object.assign(document.createElement('a'),{href:url,download:`vigicolera_${format(new Date(),'yyyyMMdd_HHmm')}.pdf`});
      document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
      addN('PDF gerado!','success');
    }catch(e){ addN('Erro PDF: '+e.message,'error'); }
    finally{ setLoading(false); }
  },[casosF,stats,F,ia,addN]);

  const share = useCallback(async()=>{
    const text=`VigiCólera Uige\n${stats.total} casos | ${stats.confirmados} confirmados | ${stats.bairros} bairros\n${new Date().toLocaleDateString('pt-AO')}`;
    if(navigator.share){ await navigator.share({title:'VigiCólera Uige',text}).catch(()=>{}); }
    else{ await navigator.clipboard.writeText(text).catch(()=>{}); addN('Resumo copiado!','info'); }
  },[stats,addN]);

  // ─── Gaveta de Filtros (mobile bottom sheet + desktop inline) ─────────────
  const FilterPanel = () => (
    <Box sx={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <Box sx={{px:2,py:1.5,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.08)',flexShrink:0}}>
        <Typography variant="subtitle2" fontWeight={700} sx={{fontSize:'0.88rem',display:'flex',alignItems:'center',gap:.8}}>
          <FilterIcon sx={{fontSize:16,color:'primary.main'}}/>
          Filtros
          {nActiveF>0&&<Chip label={nActiveF} color="primary" size="small" sx={{height:18,fontSize:'0.62rem',ml:.5}}/>}
        </Typography>
        <Box sx={{display:'flex',gap:.5}}>
          {nActiveF>0&&<Tooltip title="Limpar"><IconButton size="small" onClick={clearF} color="warning"><ClearAllIcon sx={{fontSize:16}}/></IconButton></Tooltip>}
          <IconButton size="small" onClick={()=>setFilterOpen(false)}><CloseIcon sx={{fontSize:16}}/></IconButton>
        </Box>
      </Box>
      <Box sx={{p:2,overflow:'auto',flex:1}}>
        <TextField fullWidth size="small" placeholder="Buscar ID, agente, bairro…"
          value={F.busca} onChange={e=>setF('busca',e.target.value)}
          InputProps={{
            startAdornment:<InputAdornment position="start"><SearchIcon sx={{fontSize:17,color:'text.secondary'}}/></InputAdornment>,
            endAdornment:F.busca?<InputAdornment position="end"><IconButton size="small" onClick={()=>setF('busca','')}><CloseIcon sx={{fontSize:13}}/></IconButton></InputAdornment>:null,
            sx:{borderRadius:2,fontSize:'0.83rem'},
          }}
          sx={{mb:2}}
        />
        <FormControl fullWidth size="small" sx={{mb:1.5}}>
          <InputLabel sx={{fontSize:'0.78rem'}}>Status</InputLabel>
          <Select value={F.status} label="Status" onChange={e=>setF('status',e.target.value)} sx={{borderRadius:2,fontSize:'0.78rem'}}>
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="confirmado">✗ Confirmado</MenuItem>
            <MenuItem value="suspeito">? Suspeito</MenuItem>
            <MenuItem value="pendente-analise">· Pendente</MenuItem>
            <MenuItem value="descartado">✓ Descartado</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" sx={{mb:1.5}}>
          <InputLabel sx={{fontSize:'0.78rem'}}>Gravidade</InputLabel>
          <Select value={F.gravidade} label="Gravidade" onChange={e=>setF('gravidade',e.target.value)} sx={{borderRadius:2,fontSize:'0.78rem'}}>
            <MenuItem value="todos">Todas</MenuItem>
            <MenuItem value="critico">🔴 Crítico</MenuItem>
            <MenuItem value="severa">🟠 Severa</MenuItem>
            <MenuItem value="moderada">🟡 Moderada</MenuItem>
            <MenuItem value="leve">🟢 Leve</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth size="small" sx={{mb:1.5}}>
          <InputLabel sx={{fontSize:'0.78rem'}}>Bairro</InputLabel>
          <Select value={F.bairro} label="Bairro" onChange={e=>setF('bairro',e.target.value)} sx={{borderRadius:2,fontSize:'0.78rem'}}>
            {bairroOpts.map(b=>(
              <MenuItem key={b} value={b} sx={{fontSize:'0.8rem'}}>
                <Box sx={{display:'flex',justifyContent:'space-between',width:'100%',alignItems:'center'}}>
                  <span>{b==='todos'?'Todos os bairros':b}</span>
                  {b!=='todos'&&grupos[b]&&<Chip label={grupos[b].casos.length} size="small" sx={{ml:1,height:15,fontSize:'0.58rem',bgcolor:'rgba(255,255,255,0.1)'}}/>}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid container spacing={1} sx={{mb:1.5}}>
          <Grid item xs={6}>
            <Button fullWidth variant={F.dateFrom?'contained':'outlined'} color="primary" size="small"
              startIcon={<DateRangeIcon sx={{fontSize:14}}/>} onClick={()=>setDateDlg('from')}
              sx={{borderRadius:2,fontSize:'0.7rem',justifyContent:'flex-start',textTransform:'none'}}>
              {F.dateFrom?format(F.dateFrom,'dd/MM/yy'):'De…'}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button fullWidth variant={F.dateTo?'contained':'outlined'} color="primary" size="small"
              startIcon={<DateRangeIcon sx={{fontSize:14}}/>} onClick={()=>setDateDlg('to')}
              sx={{borderRadius:2,fontSize:'0.7rem',justifyContent:'flex-start',textTransform:'none'}}>
              {F.dateTo?format(F.dateTo,'dd/MM/yy'):'Até…'}
            </Button>
          </Grid>
        </Grid>
        {nActiveF>0&&(
          <Box sx={{display:'flex',flexWrap:'wrap',gap:.5}}>
            {F.status!=='todos'&&<Chip label={F.status} size="small" onDelete={()=>setF('status','todos')} sx={{bgcolor:sc(F.status),color:'white',fontSize:'0.62rem',height:19}}/>}
            {F.gravidade!=='todos'&&<Chip label={F.gravidade} size="small" onDelete={()=>setF('gravidade','todos')} sx={{bgcolor:gc(F.gravidade),color:'white',fontSize:'0.62rem',height:19}}/>}
            {F.bairro!=='todos'&&<Chip label={F.bairro} size="small" onDelete={()=>setF('bairro','todos')} color="primary" sx={{fontSize:'0.62rem',height:19}}/>}
            {F.dateFrom&&<Chip label={`De: ${format(F.dateFrom,'dd/MM')}`} size="small" onDelete={()=>setF('dateFrom',null)} color="secondary" sx={{fontSize:'0.62rem',height:19}}/>}
            {F.dateTo&&<Chip label={`Até: ${format(F.dateTo,'dd/MM')}`} size="small" onDelete={()=>setF('dateTo',null)} color="secondary" sx={{fontSize:'0.62rem',height:19}}/>}
            {F.busca&&<Chip label={`"${F.busca}"`} size="small" onDelete={()=>setF('busca','')} sx={{bgcolor:'rgba(255,255,255,0.12)',fontSize:'0.62rem',height:19}}/>}
          </Box>
        )}
      </Box>
      <Box sx={{p:2,borderTop:'1px solid rgba(255,255,255,0.07)',flexShrink:0}}>
        <Button fullWidth variant="contained" color="primary" onClick={()=>setFilterOpen(false)} sx={{borderRadius:2,py:1.2}}>
          Ver resultados ({casosF.length} casos)
        </Button>
      </Box>
    </Box>
  );

  // ─── Lista de Casos (tab mobile) ──────────────────────────────────────────
  const CaseList = () => (
    <Box sx={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <Box sx={{px:2,pt:1.5,pb:1,flexShrink:0,borderBottom:'1px solid rgba(255,255,255,0.06)'}}>
        <TextField fullWidth size="small" placeholder="Buscar casos…"
          value={F.busca} onChange={e=>setF('busca',e.target.value)}
          InputProps={{
            startAdornment:<InputAdornment position="start"><SearchIcon sx={{fontSize:17,color:'text.secondary'}}/></InputAdornment>,
            endAdornment:F.busca?<InputAdornment position="end"><IconButton size="small" onClick={()=>setF('busca','')}><CloseIcon sx={{fontSize:13}}/></IconButton></InputAdornment>:null,
            sx:{borderRadius:2,fontSize:'0.83rem'},
          }}
        />
        <Box sx={{display:'flex',gap:.5,mt:1,justifyContent:'space-between',alignItems:'center'}}>
          <Box sx={{display:'flex',gap:.4}}>
            <Chip label={`${casosF.length} casos`} color="primary" size="small" sx={{height:20,fontSize:'0.65rem'}}/>
            {nActiveF>0&&<Chip label={`${nActiveF} filtro${nActiveF>1?'s':''}`} color="warning" size="small" sx={{height:20,fontSize:'0.65rem'}} onDelete={clearF}/>}
          </Box>
          <Box sx={{display:'flex',gap:.3}}>
            <IconButton size="small" onClick={()=>setFilterOpen(true)}
              sx={{bgcolor:nActiveF>0?'rgba(26,115,232,0.2)':'rgba(255,255,255,0.07)',color:nActiveF>0?'primary.main':'inherit',borderRadius:1.5,width:32,height:32}}>
              <Badge badgeContent={nActiveF||undefined} color="warning" variant="dot"><FilterIcon sx={{fontSize:16}}/></Badge>
            </IconButton>
            <IconButton size="small" onClick={()=>setVM(v=>v==='casos'?'agrupado':'casos')}
              sx={{bgcolor:'rgba(255,255,255,0.07)',borderRadius:1.5,width:32,height:32,color:viewMode==='agrupado'?'primary.main':'inherit'}}>
              {viewMode==='casos'?<LocationCityIcon sx={{fontSize:16}}/>:<PeopleIcon sx={{fontSize:16}}/>}
            </IconButton>
          </Box>
        </Box>
      </Box>
      <List dense sx={{flex:1,overflow:'auto',pt:0,pb:1}}>
        {viewMode==='agrupado'
          ? Object.keys(gruposF).length===0
            ? <Box sx={{p:4,textAlign:'center'}}><LocationCityIcon sx={{fontSize:40,color:'text.disabled',mb:1}}/><Typography color="text.disabled">Nenhum bairro</Typography></Box>
            : Object.entries(gruposF).sort(([,a],[,b])=>b.casos.length-a.casos.length).map(([b,g])=>{
                const cor=g.confirmados>0?'#ea4335':g.suspeitos>0?'#fbbc05':'#4285f4';
                return(
                  <ListItem key={b} disablePadding>
                    <ListItemButton onClick={()=>goToGroup(b,g)}
                      sx={{borderLeft:`3px solid ${cor}`,mx:1,my:.3,borderRadius:1.5,'&:hover':{bgcolor:'rgba(26,115,232,0.09)'},py:1.2}}>
                      <ListItemAvatar><Avatar sx={{bgcolor:cor,width:38,height:38,fontSize:'0.78rem',fontWeight:700}}>{g.casos.length}</Avatar></ListItemAvatar>
                      <Box sx={{minWidth:0,flex:1}}>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{fontSize:'0.85rem'}}>{b}</Typography>
                        <Box sx={{display:'flex',gap:.35,mt:.3,flexWrap:'wrap'}}>
                          {g.confirmados>0&&<Chip label={`${g.confirmados}C`} size="small" sx={{bgcolor:'#fce8e6',color:'#c5221f',height:17,fontSize:'0.6rem'}}/>}
                          {g.suspeitos>0&&<Chip label={`${g.suspeitos}S`} size="small" sx={{bgcolor:'#fef7e0',color:'#e37400',height:17,fontSize:'0.6rem'}}/>}
                          {g.pendentes>0&&<Chip label={`${g.pendentes}P`} size="small" sx={{bgcolor:'#e8f0fe',color:'#1a73e8',height:17,fontSize:'0.6rem'}}/>}
                          {g.descartados>0&&<Chip label={`${g.descartados}D`} size="small" sx={{bgcolor:'#e6f4ea',color:'#188038',height:17,fontSize:'0.6rem'}}/>}
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                );
              })
          : casosF.length===0
            ? <Box sx={{p:4,textAlign:'center'}}><SearchIcon sx={{fontSize:40,color:'text.disabled',mb:1}}/><Typography color="text.disabled">Nenhum caso</Typography>{nActiveF>0&&<Button size="small" onClick={clearF} sx={{mt:1}}>Limpar filtros</Button>}</Box>
            : casosF.sort((a,b)=>b.timestamp-a.timestamp).map(caso=>(
                <ListItem key={caso.id} disablePadding>
                  <ListItemButton selected={sel?.id===caso.id} onClick={()=>goToCase(caso)}
                    sx={{borderLeft:`3px solid ${sc(caso.status)}`,mx:1,my:.3,borderRadius:1.5,'&:hover':{bgcolor:'rgba(26,115,232,0.09)'},'&.Mui-selected':{bgcolor:'rgba(26,115,232,0.13)'},py:1.2}}>
                    <ListItemAvatar><Avatar sx={{bgcolor:sc(caso.status),width:38,height:38,'& svg':{fontSize:17}}}>{SI[caso.status]||<LocationIcon/>}</Avatar></ListItemAvatar>
                    <Box sx={{minWidth:0,width:'100%'}}>
                      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{fontSize:'0.85rem',flex:1,mr:.5}}>{caso.bairro||'Sem bairro'}</Typography>
                        <Chip label={caso.gravidade} size="small" sx={{bgcolor:gc(caso.gravidade),color:'white',height:17,fontSize:'0.6rem',flexShrink:0}}/>
                      </Box>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{fontSize:'0.72rem'}}>{caso.agente}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{display:'block',fontSize:'0.68rem'}}>{fdt(caso.dataHora).date}</Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))
        }
      </List>
    </Box>
  );

  // ─── Painel de Análise (tab mobile) ──────────────────────────────────────
  const AnalysePanel = () => (
    <Box sx={{overflow:'auto',height:'100%',p:2}}>
      <Typography variant="caption" sx={{textTransform:'uppercase',letterSpacing:1,color:'text.secondary',fontSize:'0.67rem',display:'flex',alignItems:'center',gap:.7,mb:1.5}}>
        <TrendingUpIcon sx={{fontSize:14}}/> Resumo Epidemiológico
      </Typography>
      <Grid container spacing={1.2} sx={{mb:2}}>
        {[{t:'Confirmados',v:stats.confirmados,c:'#ea4335',i:<WarningIcon/>},{t:'Suspeitos',v:stats.suspeitos,c:'#fbbc05',i:<ScheduleIcon/>},{t:'Pendentes',v:stats.pendentes,c:'#4285f4',i:<TimelineIcon/>},{t:'Descartados',v:stats.descartados,c:'#34a853',i:<CheckCircleIcon/>}].map(({t,v,c,i})=>(
          <Grid item xs={6} key={t}>
            <Card elevation={0} sx={{p:1.5,'&:hover':{transform:'translateY(-2px)'},transition:'all .2s'}}>
              <Box sx={{display:'flex',alignItems:'center',gap:1,mb:.6}}><Avatar sx={{bgcolor:c,width:28,height:28,'& svg':{fontSize:14}}}>{i}</Avatar><Typography variant="caption" color="text.secondary" sx={{fontSize:'0.68rem'}}>{t}</Typography></Box>
              <Typography fontWeight={800} color={c} sx={{fontSize:'1.5rem'}}>{v}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{fontSize:'0.62rem'}}>{stats.total>0?((v/stats.total)*100).toFixed(1):0}%</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="caption" sx={{textTransform:'uppercase',letterSpacing:1,color:'text.secondary',fontSize:'0.67rem',mb:1,display:'block'}}>Gravidade</Typography>
      <Grid container spacing={1} sx={{mb:2}}>
        {[{t:'Críticos',v:stats.criticos,c:'#b71c1c'},{t:'Severos',v:stats.severos,c:'#e65100'},{t:'Moderados',v:stats.moderados,c:'#f9a825'},{t:'Leves',v:stats.leves,c:'#2e7d32'}].map(({t,v,c})=>(
          <Grid item xs={6} key={t}><Card elevation={0} sx={{p:1.2}}><Typography variant="caption" color="text.secondary" sx={{fontSize:'0.68rem'}}>{t}</Typography><Typography fontWeight={700} color={c} sx={{fontSize:'1.2rem'}}>{v}</Typography></Card></Grid>
        ))}
      </Grid>
      <Card elevation={0} sx={{p:1.8,mb:2}}>
        <Box sx={{display:'flex',alignItems:'center',gap:1.5,mb:.6}}><Avatar sx={{bgcolor:'#1a73e8',width:28,height:28}}><LocationCityIcon sx={{fontSize:14}}/></Avatar><Typography variant="caption" color="text.secondary" sx={{fontSize:'0.7rem'}}>Bairros Afetados</Typography></Box>
        <Typography fontWeight={800} color="#1a73e8" sx={{fontSize:'1.5rem'}}>{stats.bairros}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{fontSize:'0.62rem'}}>~{stats.total>0?(stats.total/Math.max(stats.bairros,1)).toFixed(1):0} casos/bairro</Typography>
      </Card>
      <Card elevation={0} sx={{p:1.8,border:'1px solid rgba(0,188,212,0.2)',mb:2}}>
        <Box sx={{display:'flex',alignItems:'center',gap:1,mb:1}}><SmartToyIcon color="secondary" sx={{fontSize:16}}/><Typography variant="caption" sx={{color:'secondary.main',fontWeight:700,fontSize:'0.75rem',textTransform:'uppercase',letterSpacing:.5}}>Análise IA</Typography></Box>
        <Typography component="pre" sx={{whiteSpace:'pre-wrap',fontFamily:'monospace',fontSize:'0.68rem',lineHeight:1.7,color:'rgba(255,255,255,0.8)'}}>{ia}</Typography>
      </Card>
      <Box sx={{display:'flex',gap:1,flexWrap:'wrap'}}>
        <Button size="small" variant="outlined" color="primary" startIcon={<GetAppIcon/>} onClick={exportCSV} sx={{flex:1,borderRadius:2}}>CSV</Button>
        <Button size="small" variant="outlined" color="primary" startIcon={<PrintIcon/>} onClick={exportPDF} disabled={loading} sx={{flex:1,borderRadius:2}}>PDF</Button>
        <Button size="small" variant="outlined" color="secondary" startIcon={<ShareIcon/>} onClick={share} sx={{flex:1,borderRadius:2}}>Partilhar</Button>
      </Box>
    </Box>
  );

  // ─── Sidebar Desktop ──────────────────────────────────────────────────────
  const SidePanel = () => (
    <Box sx={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden'}}>
      <Box sx={{px:2,py:1.5,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.08)',flexShrink:0}}>
        <Typography variant="subtitle2" fontWeight={700} sx={{fontSize:'0.85rem',display:'flex',alignItems:'center',gap:.8}}>
          <FilterIcon sx={{fontSize:16,color:'primary.main'}}/>
          Filtros &amp; Lista
          {nActiveF>0&&<Chip label={nActiveF} color="primary" size="small" sx={{height:18,fontSize:'0.62rem',ml:.5}}/>}
        </Typography>
        <Box sx={{display:'flex',gap:.5}}>
          {nActiveF>0&&<Tooltip title="Limpar filtros"><IconButton size="small" onClick={clearF} color="warning"><ClearAllIcon sx={{fontSize:16}}/></IconButton></Tooltip>}
          {!isDesk&&<IconButton size="small" onClick={()=>setSidebar(false)}><CloseIcon sx={{fontSize:16}}/></IconButton>}
        </Box>
      </Box>
      <Box sx={{px:2,pt:1.5,pb:1,borderBottom:'1px solid rgba(255,255,255,0.06)',flexShrink:0}}>
        <TextField fullWidth size="small" placeholder="Buscar…"
          value={F.busca} onChange={e=>setF('busca',e.target.value)}
          InputProps={{
            startAdornment:<InputAdornment position="start"><SearchIcon sx={{fontSize:17,color:'text.secondary'}}/></InputAdornment>,
            endAdornment:F.busca?<InputAdornment position="end"><IconButton size="small" onClick={()=>setF('busca','')}><CloseIcon sx={{fontSize:13}}/></IconButton></InputAdornment>:null,
            sx:{borderRadius:2,fontSize:'0.83rem'},
          }}
          sx={{mb:1.5}}
        />
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{fontSize:'0.78rem'}}>Status</InputLabel>
              <Select value={F.status} label="Status" onChange={e=>setF('status',e.target.value)} sx={{borderRadius:2,fontSize:'0.78rem'}}>
                <MenuItem value="todos">Todos</MenuItem>
                <MenuItem value="confirmado">✗ Confirmado</MenuItem>
                <MenuItem value="suspeito">? Suspeito</MenuItem>
                <MenuItem value="pendente-analise">· Pendente</MenuItem>
                <MenuItem value="descartado">✓ Descartado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{fontSize:'0.78rem'}}>Gravidade</InputLabel>
              <Select value={F.gravidade} label="Gravidade" onChange={e=>setF('gravidade',e.target.value)} sx={{borderRadius:2,fontSize:'0.78rem'}}>
                <MenuItem value="todos">Todas</MenuItem>
                <MenuItem value="critico">🔴 Crítico</MenuItem>
                <MenuItem value="severa">🟠 Severa</MenuItem>
                <MenuItem value="moderada">🟡 Moderada</MenuItem>
                <MenuItem value="leve">🟢 Leve</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{fontSize:'0.78rem'}}>Bairro</InputLabel>
              <Select value={F.bairro} label="Bairro" onChange={e=>setF('bairro',e.target.value)} sx={{borderRadius:2,fontSize:'0.78rem'}}>
                {bairroOpts.map(b=>(
                  <MenuItem key={b} value={b} sx={{fontSize:'0.8rem'}}>
                    <Box sx={{display:'flex',justifyContent:'space-between',width:'100%',alignItems:'center'}}>
                      <span>{b==='todos'?'Todos os bairros':b}</span>
                      {b!=='todos'&&grupos[b]&&<Chip label={grupos[b].casos.length} size="small" sx={{ml:1,height:15,fontSize:'0.58rem',bgcolor:'rgba(255,255,255,0.1)'}}/>}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {nActiveF>0&&(
          <Box sx={{display:'flex',flexWrap:'wrap',gap:.5,mt:1}}>
            {F.status!=='todos'&&<Chip label={F.status} size="small" onDelete={()=>setF('status','todos')} sx={{bgcolor:sc(F.status),color:'white',fontSize:'0.62rem',height:19}}/>}
            {F.gravidade!=='todos'&&<Chip label={F.gravidade} size="small" onDelete={()=>setF('gravidade','todos')} sx={{bgcolor:gc(F.gravidade),color:'white',fontSize:'0.62rem',height:19}}/>}
            {F.bairro!=='todos'&&<Chip label={F.bairro} size="small" onDelete={()=>setF('bairro','todos')} color="primary" sx={{fontSize:'0.62rem',height:19}}/>}
          </Box>
        )}
      </Box>
      <Box sx={{px:2,py:.8,display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:'1px solid rgba(255,255,255,0.05)',flexShrink:0}}>
        <Typography variant="caption" sx={{textTransform:'uppercase',letterSpacing:.8,color:'text.secondary',fontSize:'0.66rem'}}>
          {viewMode==='agrupado'?'Bairros':'Casos'}
        </Typography>
        <Box sx={{display:'flex',alignItems:'center',gap:.5}}>
          <Chip label={viewMode==='agrupado'?Object.keys(gruposF).length:casosF.length} color="primary" size="small" sx={{height:17,fontSize:'0.62rem'}}/>
          {casosF.length!==casos.length&&<Typography variant="caption" color="text.disabled" sx={{fontSize:'0.62rem'}}>/ {casos.length}</Typography>}
        </Box>
      </Box>
      <List dense sx={{flex:1,overflow:'auto',pt:0,pb:1}}>
        {viewMode==='agrupado'
          ? Object.keys(gruposF).length===0
            ? <Box sx={{p:3,textAlign:'center'}}><LocationCityIcon sx={{fontSize:34,color:'text.disabled',mb:1}}/><Typography variant="body2" color="text.disabled">Nenhum bairro</Typography></Box>
            : Object.entries(gruposF).sort(([,a],[,b])=>b.casos.length-a.casos.length).map(([b,g])=>{
                const cor=g.confirmados>0?'#ea4335':g.suspeitos>0?'#fbbc05':'#4285f4';
                return(
                  <ListItem key={b} disablePadding>
                    <ListItemButton onClick={()=>goToGroup(b,g)} sx={{borderLeft:`3px solid ${cor}`,mx:1,my:.25,borderRadius:1.5,'&:hover':{bgcolor:'rgba(26,115,232,0.09)'},transition:'all .15s'}}>
                      <ListItemAvatar><Avatar sx={{bgcolor:cor,width:32,height:32,fontSize:'0.75rem',fontWeight:700}}>{g.casos.length}</Avatar></ListItemAvatar>
                      <Box sx={{minWidth:0}}>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{fontSize:'0.8rem'}}>{b}</Typography>
                        <Box sx={{display:'flex',gap:.35,mt:.2,flexWrap:'wrap'}}>
                          {g.confirmados>0&&<Chip label={`${g.confirmados}C`} size="small" sx={{bgcolor:'#fce8e6',color:'#c5221f',height:15,fontSize:'0.56rem'}}/>}
                          {g.suspeitos>0&&<Chip label={`${g.suspeitos}S`} size="small" sx={{bgcolor:'#fef7e0',color:'#e37400',height:15,fontSize:'0.56rem'}}/>}
                          {g.pendentes>0&&<Chip label={`${g.pendentes}P`} size="small" sx={{bgcolor:'#e8f0fe',color:'#1a73e8',height:15,fontSize:'0.56rem'}}/>}
                          {g.descartados>0&&<Chip label={`${g.descartados}D`} size="small" sx={{bgcolor:'#e6f4ea',color:'#188038',height:15,fontSize:'0.56rem'}}/>}
                        </Box>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                );
              })
          : casosF.length===0
            ? <Box sx={{p:3,textAlign:'center'}}><SearchIcon sx={{fontSize:34,color:'text.disabled',mb:1}}/><Typography variant="body2" color="text.disabled">Nenhum caso</Typography>{nActiveF>0&&<Button size="small" onClick={clearF} sx={{mt:1,fontSize:'0.72rem'}}>Limpar filtros</Button>}</Box>
            : casosF.sort((a,b)=>b.timestamp-a.timestamp).map(caso=>(
                <ListItem key={caso.id} disablePadding>
                  <ListItemButton selected={sel?.id===caso.id} onClick={()=>goToCase(caso)}
                    sx={{borderLeft:`3px solid ${sc(caso.status)}`,mx:1,my:.25,borderRadius:1.5,'&:hover':{bgcolor:'rgba(26,115,232,0.09)'},'&.Mui-selected':{bgcolor:'rgba(26,115,232,0.13)'},transition:'all .15s'}}>
                    <ListItemAvatar><Avatar sx={{bgcolor:sc(caso.status),width:32,height:32,'& svg':{fontSize:15}}}>{SI[caso.status]||<LocationIcon/>}</Avatar></ListItemAvatar>
                    <Box sx={{minWidth:0,width:'100%'}}>
                      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                        <Typography variant="body2" fontWeight={600} noWrap sx={{fontSize:'0.8rem',flex:1,mr:.5}}>{caso.bairro||'Sem bairro'}</Typography>
                        <Chip label={caso.gravidade} size="small" sx={{bgcolor:gc(caso.gravidade),color:'white',height:15,fontSize:'0.56rem',flexShrink:0}}/>
                      </Box>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{fontSize:'0.68rem'}}>{caso.agente}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{display:'block',fontSize:'0.65rem'}}>{fdt(caso.dataHora).date}</Typography>
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))
        }
      </List>
    </Box>
  );

  // ─── Menu Mais ─────────────────────────────────────────────────────────────
  const MoreMenu = () => (
    <Menu anchorEl={moreAnchor} open={Boolean(moreAnchor)} onClose={()=>setMore(null)}
      PaperProps={{sx:{bgcolor:'#1c1c1c',border:'1px solid rgba(255,255,255,0.1)',minWidth:220}}}>
      <MenuItem onClick={()=>{setVM(v=>v==='casos'?'agrupado':'casos');setMore(null);}}>
        {viewMode==='casos'?<LocationCityIcon sx={{mr:1.5,fontSize:18}}/>:<PeopleIcon sx={{mr:1.5,fontSize:18}}/>}
        <Typography variant="body2">{viewMode==='casos'?'Vista por Bairros':'Vista por Casos'}</Typography>
      </MenuItem>
      <MenuItem onClick={()=>{setHeatmap(h=>!h);setMore(null);}}>
        <LayersIcon sx={{mr:1.5,fontSize:18,color:heatmap?'secondary.main':'inherit'}}/>
        <Typography variant="body2">{heatmap?'Ocultar Heatmap':'Mapa de Calor'}</Typography>
      </MenuItem>
      <MenuItem onClick={()=>{setLegend(v=>!v);setMore(null);}}>
        {legend?<VisibilityOffIcon sx={{mr:1.5,fontSize:18}}/>:<VisibilityIcon sx={{mr:1.5,fontSize:18}}/>}
        <Typography variant="body2">{legend?'Ocultar Legenda':'Mostrar Legenda'}</Typography>
      </MenuItem>
      <Divider sx={{borderColor:'rgba(255,255,255,0.07)'}}/>
      <MenuItem dense>
        <FormControl size="small" fullWidth>
          <Select value={mapType} onChange={e=>{setMapType(e.target.value);setMore(null);}} sx={{'& .MuiOutlinedInput-notchedOutline':{border:'none'},fontSize:'0.82rem'}}>
            <MenuItem value="roadmap">🗺 Mapa Padrão</MenuItem>
            <MenuItem value="satellite">🛰 Satélite</MenuItem>
            <MenuItem value="terrain">⛰ Terreno</MenuItem>
            <MenuItem value="hybrid">🌐 Híbrido</MenuItem>
          </Select>
        </FormControl>
      </MenuItem>
      <Divider sx={{borderColor:'rgba(255,255,255,0.07)'}}/>
      <MenuItem onClick={()=>{exportCSV();setMore(null);}}>
        <GetAppIcon sx={{mr:1.5,fontSize:18}}/><Typography variant="body2">Exportar CSV</Typography>
      </MenuItem>
      <MenuItem onClick={()=>{exportPDF();setMore(null);}} disabled={loading}>
        <PrintIcon sx={{mr:1.5,fontSize:18}}/><Typography variant="body2">Exportar PDF</Typography>
      </MenuItem>
      <MenuItem onClick={()=>{share();setMore(null);}}>
        <ShareIcon sx={{mr:1.5,fontSize:18}}/><Typography variant="body2">Partilhar</Typography>
      </MenuItem>
    </Menu>
  );

  const appH = isMobile ? 56 : 64;
  const bottomNavH = isMobile ? 60 : 0;

  return (
    <ThemeProvider theme={darkTheme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{display:'flex',flexDirection:'column',height:'100vh',bgcolor:'background.default',overflow:'hidden'}}>

          {/* ── AppBar ──────────────────────────────────────────────────────── */}
          <AppBar position="fixed" elevation={0} sx={{zIndex:1300}}>
            <Toolbar sx={{minHeight:{xs:56,sm:64},px:{xs:1,sm:2},gap:.5}}>
              <Box sx={{display:'flex',alignItems:'center',gap:{xs:.6,sm:1},mr:{xs:.5,sm:1},flexShrink:0}}>
                <MapIcon sx={{color:'#1a73e8',fontSize:{xs:20,sm:26}}}/>
                <Box>
                  <Typography fontWeight={800} sx={{fontSize:{xs:'0.82rem',sm:'1rem'},lineHeight:1.1}}>VigiCólera</Typography>
                </Box>
              </Box>

              {/* Chips de resumo */}
              {isDesk&&(
                <Box sx={{display:'flex',gap:.8}}>
                  <Chip icon={<WarningIcon sx={{fontSize:'13px !important'}}/>} label={`${stats.confirmados} Conf.`} color="error" variant="outlined" size="small" sx={{fontSize:'0.68rem',height:24}}/>
                  <Chip icon={<ScheduleIcon sx={{fontSize:'13px !important'}}/>} label={`${stats.pendentes} Pend.`} color="primary" variant="outlined" size="small" sx={{fontSize:'0.68rem',height:24}}/>
                  <Chip icon={<AnalyticsIcon sx={{fontSize:'13px !important'}}/>} label={`${stats.total} Total`} color="info" variant="outlined" size="small" sx={{fontSize:'0.68rem',height:24,cursor:'pointer'}} onClick={()=>setStats(v=>!v)}/>
                </Box>
              )}
              {isTablet&&(
                <Box sx={{display:'flex',gap:.4}}>
                  <Chip label={`${stats.confirmados}C`} color="error" size="small" sx={{fontSize:'0.62rem'}}/>
                  <Chip label={`${stats.total}T`} color="info" size="small" sx={{fontSize:'0.62rem'}}/>
                </Box>
              )}
              {isMobile&&(
                <Box sx={{display:'flex',gap:.3}}>
                  <Chip label={`${stats.confirmados}C`} size="small" sx={{bgcolor:'rgba(234,67,53,0.2)',color:'#ea4335',fontSize:'0.6rem',height:20,border:'1px solid rgba(234,67,53,0.3)'}}/>
                  <Chip label={`${stats.total}T`} size="small" sx={{bgcolor:'rgba(26,115,232,0.2)',color:'#1a73e8',fontSize:'0.6rem',height:20,border:'1px solid rgba(26,115,232,0.3)'}}/>
                </Box>
              )}

              <Box sx={{flexGrow:1}}/>

              {isDesk&&lastUpdate&&<Typography variant="caption" color="text.disabled" sx={{fontSize:'0.62rem',mr:.5}}>{format(lastUpdate,'HH:mm:ss')}</Typography>}

              <Box sx={{display:'flex',gap:.3,alignItems:'center'}}>
                <Tooltip title="Actualizar"><span>
                  <IconButton size="small" color="inherit" onClick={reload} disabled={loading} sx={{width:{xs:36,sm:40},height:{xs:36,sm:40}}}>
                    {loading?<CircularProgress size={16} color="inherit"/>:<RefreshIcon sx={{fontSize:{xs:18,sm:19}}}/>}
                  </IconButton>
                </span></Tooltip>

                {!isMobile&&(
                  <Tooltip title="Filtros e Lista">
                    <IconButton size="small" onClick={()=>setSidebar(v=>!v)}
                      sx={{bgcolor:sidebar?'rgba(26,115,232,0.2)':'rgba(255,255,255,0.07)',color:sidebar?'primary.main':'inherit',borderRadius:1.5}}>
                      <Badge badgeContent={nActiveF||undefined} color="warning" variant="dot"><FilterIcon sx={{fontSize:18}}/></Badge>
                    </IconButton>
                  </Tooltip>
                )}

                {isDesk&&(
                  <>
                    <ToggleButtonGroup value={viewMode} exclusive size="small" onChange={(_,v)=>v&&setVM(v)}
                      sx={{bgcolor:'rgba(255,255,255,0.07)',borderRadius:2,mx:.5}}>
                      <ToggleButton value="casos" sx={{px:1,py:.3,fontSize:'0.68rem',gap:.4}}><PeopleIcon sx={{fontSize:14}}/>Casos</ToggleButton>
                      <ToggleButton value="agrupado" sx={{px:1,py:.3,fontSize:'0.68rem',gap:.4}}><LocationCityIcon sx={{fontSize:14}}/>Bairros</ToggleButton>
                    </ToggleButtonGroup>
                    <Tooltip title={heatmap?'Ocultar Heatmap':'Mapa de Calor'}>
                      <IconButton size="small" color={heatmap?'secondary':'inherit'} onClick={()=>setHeatmap(v=>!v)}><LayersIcon sx={{fontSize:18}}/></IconButton>
                    </Tooltip>
                    <FormControl size="small" sx={{minWidth:92}}>
                      <Select value={mapType} onChange={e=>setMapType(e.target.value)}
                        sx={{color:'white',bgcolor:'rgba(255,255,255,0.07)','& .MuiOutlinedInput-notchedOutline':{border:'none'},borderRadius:2,fontSize:'0.68rem'}}>
                        <MenuItem value="roadmap">Padrão</MenuItem>
                        <MenuItem value="satellite">Satélite</MenuItem>
                        <MenuItem value="terrain">Terreno</MenuItem>
                        <MenuItem value="hybrid">Híbrido</MenuItem>
                      </Select>
                    </FormControl>
                    <Tooltip title="Exportar CSV"><IconButton size="small" color="inherit" onClick={exportCSV}><GetAppIcon sx={{fontSize:18}}/></IconButton></Tooltip>
                    <Tooltip title="Exportar PDF"><span><IconButton size="small" color="inherit" onClick={exportPDF} disabled={loading}><PrintIcon sx={{fontSize:18}}/></IconButton></span></Tooltip>
                    <Tooltip title="Partilhar"><IconButton size="small" color="inherit" onClick={share}><ShareIcon sx={{fontSize:18}}/></IconButton></Tooltip>
                  </>
                )}

                <IconButton size="small" color="inherit" onClick={e=>setMore(e.currentTarget)} sx={{width:{xs:36,sm:40},height:{xs:36,sm:40}}}>
                  <MoreVertIcon sx={{fontSize:{xs:19,sm:21}}}/>
                </IconButton>
                <MoreMenu/>
              </Box>
            </Toolbar>
          </AppBar>
          <Box sx={{height:appH}}/>

          {/* ── Stats collapse (desktop/tablet apenas) ───────────────────── */}
          {!isMobile&&(
            <Collapse in={showStats}>
              <Paper elevation={0} sx={{px:{xs:2,sm:3},py:2,bgcolor:'rgba(12,12,18,0.98)',borderBottom:'1px solid rgba(255,255,255,0.07)'}}>
                <Typography variant="caption" sx={{textTransform:'uppercase',letterSpacing:1,color:'text.secondary',fontSize:'0.67rem',display:'flex',alignItems:'center',gap:.7,mb:1.5}}>
                  <TrendingUpIcon sx={{fontSize:14}}/> Estatísticas
                </Typography>
                <Grid container spacing={1.5}>
                  {[{t:'Confirmados',v:stats.confirmados,c:'#ea4335',i:<WarningIcon/>},{t:'Suspeitos',v:stats.suspeitos,c:'#fbbc05',i:<ScheduleIcon/>},{t:'Pendentes',v:stats.pendentes,c:'#4285f4',i:<TimelineIcon/>},{t:'Descartados',v:stats.descartados,c:'#34a853',i:<CheckCircleIcon/>}].map(({t,v,c,i})=>(
                    <Grid item xs={6} md={3} key={t}>
                      <Card elevation={0} sx={{p:1.8,'&:hover':{transform:'translateY(-2px)',boxShadow:4},transition:'all .2s'}}>
                        <Box sx={{display:'flex',alignItems:'center',gap:1.5,mb:.8}}><Avatar sx={{bgcolor:c,width:32,height:32}}>{i}</Avatar><Typography variant="caption" color="text.secondary" sx={{fontSize:'0.7rem'}}>{t}</Typography></Box>
                        <Typography fontWeight={800} color={c} sx={{fontSize:'1.6rem'}}>{v}</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{fontSize:'0.62rem'}}>{stats.total>0?((v/stats.total)*100).toFixed(1):0}%</Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Collapse>
          )}

          {/* ── Corpo principal ──────────────────────────────────────────────── */}
          <Box sx={{display:'flex',flex:1,overflow:'hidden',position:'relative'}}>

            {/* Sidebar desktop */}
            {isDesk&&sidebar&&(
              <Paper elevation={0} sx={{width:{lg:340,xl:380},flexShrink:0,borderRight:'1px solid rgba(255,255,255,0.07)',bgcolor:'background.paper',display:'flex',flexDirection:'column'}}>
                <SidePanel/>
              </Paper>
            )}

            {/* Drawer tablet */}
            {isTablet&&(
              <SwipeableDrawer anchor="left" open={sidebar} onOpen={()=>setSidebar(true)} onClose={()=>setSidebar(false)}
                PaperProps={{sx:{width:340,bgcolor:'#111'}}}>
                <SidePanel/>
              </SwipeableDrawer>
            )}

            {/* ── MOBILE: tabs ──────────────────────────────────────────────── */}
            {isMobile ? (
              <Box sx={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>

                {/* Tab 0 — Mapa */}
                <Box sx={{flex:1,display:mobileTab===0?'block':'none',position:'relative',overflow:'hidden'}}>
                  {loading&&<LinearProgress sx={{position:'absolute',top:0,left:0,right:0,zIndex:20}}/>}
                  <LoadScript googleMapsApiKey={MAPS_KEY} libraries={MAPS_LIBS}
                    loadingElement={<Box sx={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',bgcolor:'#e8eaed',flexDirection:'column',gap:2}}><CircularProgress color="primary"/><Typography variant="caption">A carregar mapa…</Typography></Box>}>
                    <MemoizedMap center={center} zoom={zoom} mapType={mapType} viewMode={viewMode}
                      showHeatmap={heatmap} grupos={gruposF} casos={casosF} infoId={infoId}
                      onCase={goToCase} onGroup={goToGroup} onClose={()=>setInfoId(null)}/>
                  </LoadScript>

                  {/* Pill contagem */}
                  <Box sx={{position:'absolute',top:10,left:10,bgcolor:'rgba(255,255,255,0.96)',borderRadius:20,px:1.5,py:.5,zIndex:10,boxShadow:'0 1px 6px rgba(0,0,0,0.2)',display:'flex',alignItems:'center',gap:.7}}>
                    <PeopleIcon sx={{fontSize:13,color:'#1a73e8'}}/>
                    <Typography sx={{fontSize:'0.7rem',fontWeight:700,color:'#3c4043'}}>
                      {casosF.length} casos{nActiveF>0&&` · ${nActiveF} filtro${nActiveF>1?'s':''}`}
                    </Typography>
                  </Box>

                  {/* Botões sobre mapa */}
                  <Box sx={{position:'absolute',top:8,right:10,zIndex:10,display:'flex',flexDirection:'column',gap:.8}}>
                    <IconButton onClick={()=>setFilterOpen(true)} size="small"
                      sx={{bgcolor:'white',color:'#5f6368',width:40,height:40,boxShadow:'0 2px 8px rgba(0,0,0,0.22)',borderRadius:2,'&:hover':{bgcolor:'#f5f5f5'}}}>
                      <Badge badgeContent={nActiveF||undefined} color="error" variant="dot"><FilterIcon sx={{fontSize:18}}/></Badge>
                    </IconButton>
                    <IconButton onClick={()=>setHeatmap(v=>!v)} size="small"
                      sx={{bgcolor:heatmap?'#1a73e8':'white',color:heatmap?'white':'#5f6368',width:40,height:40,boxShadow:'0 2px 8px rgba(0,0,0,0.22)',borderRadius:2}}>
                      <LayersIcon sx={{fontSize:18}}/>
                    </IconButton>
                  </Box>

                  {/* Zoom */}
                  <Box sx={{position:'absolute',bottom:16,right:10,display:'flex',flexDirection:'column',zIndex:10,boxShadow:'0 2px 8px rgba(0,0,0,0.22)',borderRadius:1.5,overflow:'hidden'}}>
                    <IconButton onClick={()=>setZoom(p=>Math.min(p+1,21))} size="small" sx={{bgcolor:'white',color:'#5f6368',borderRadius:0,width:42,height:42,borderBottom:'1px solid #e0e0e0','&:hover':{bgcolor:'#f5f5f5'}}}><ZoomInIcon sx={{fontSize:21}}/></IconButton>
                    <IconButton onClick={()=>setZoom(p=>Math.max(p-1,1))} size="small" sx={{bgcolor:'white',color:'#5f6368',borderRadius:0,width:42,height:42,'&:hover':{bgcolor:'#f5f5f5'}}}><ZoomOutIcon sx={{fontSize:21}}/></IconButton>
                  </Box>

                  {/* Centrar */}
                  <IconButton onClick={()=>{setCenter({lat:-8.8368,lng:13.2343});setZoom(12);}}
                    sx={{position:'absolute',bottom:76,right:10,zIndex:10,bgcolor:'white',color:'#5f6368',width:42,height:42,boxShadow:'0 2px 8px rgba(0,0,0,0.22)',borderRadius:1.5,'&:hover':{bgcolor:'#f5f5f5'}}}>
                    <MyLocationIcon sx={{fontSize:20}}/>
                  </IconButton>

                  {/* Legenda compacta */}
                  {legend&&(
                    <Card elevation={2} sx={{position:'absolute',bottom:16,left:10,bgcolor:'rgba(255,255,255,0.96)',borderRadius:2,p:1,minWidth:105,zIndex:10}}>
                      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:.4}}>
                        <Typography sx={{fontWeight:700,color:'#3c4043',fontSize:'0.58rem',textTransform:'uppercase',letterSpacing:.3}}>Legenda</Typography>
                        <IconButton size="small" onClick={()=>setLegend(false)} sx={{p:.1,color:'#5f6368'}}><CloseIcon sx={{fontSize:10}}/></IconButton>
                      </Box>
                      {[{l:'Confirmado',c:'#ea4335',i:'!'},{l:'Suspeito',c:'#fbbc05',i:'?'},{l:'Pendente',c:'#4285f4',i:'·'},{l:'Descartado',c:'#34a853',i:'✓'}].map(({l,c,i})=>(
                        <Box key={l} sx={{display:'flex',alignItems:'center',gap:.5,mb:.3}}>
                          <Box component="img" src={buildPin(c,i,14)} sx={{width:12,height:17,flexShrink:0}} alt=""/>
                          <Typography sx={{fontSize:'0.62rem',color:'#3c4043'}}>{l}</Typography>
                        </Box>
                      ))}
                    </Card>
                  )}
                </Box>

                {/* Tab 1 — Lista */}
                <Box sx={{flex:1,display:mobileTab===1?'flex':'none',flexDirection:'column',overflow:'hidden',bgcolor:'background.paper'}}>
                  <CaseList/>
                </Box>

                {/* Tab 2 — Análise */}
                <Box sx={{flex:1,display:mobileTab===2?'block':'none',overflow:'hidden',bgcolor:'background.paper'}}>
                  <AnalysePanel/>
                </Box>
              </Box>
            ) : (
              /* ── DESKTOP/TABLET: mapa ─────────────────────────────────── */
              <Box sx={{flex:1,position:'relative',overflow:'hidden'}}>
                {loading&&<LinearProgress sx={{position:'absolute',top:0,left:0,right:0,zIndex:20}}/>}
                <LoadScript googleMapsApiKey={MAPS_KEY} libraries={MAPS_LIBS}
                  loadingElement={<Box sx={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',bgcolor:'#e8eaed',flexDirection:'column',gap:2}}><CircularProgress color="primary"/><Typography variant="caption" color="text.secondary">A carregar mapa…</Typography></Box>}>
                  <MemoizedMap center={center} zoom={zoom} mapType={mapType} viewMode={viewMode}
                    showHeatmap={heatmap} grupos={gruposF} casos={casosF} infoId={infoId}
                    onCase={goToCase} onGroup={goToGroup} onClose={()=>setInfoId(null)}/>
                </LoadScript>

                <Box sx={{position:'absolute',top:10,left:isDesk&&sidebar?{lg:348,xl:388}:10,transition:'left .25s',bgcolor:'rgba(255,255,255,0.96)',borderRadius:20,px:1.5,py:.5,zIndex:10,boxShadow:'0 1px 6px rgba(0,0,0,0.2)',display:'flex',alignItems:'center',gap:.7}}>
                  {viewMode==='agrupado'?<LocationCityIcon sx={{fontSize:13,color:'#1a73e8'}}/>:<PeopleIcon sx={{fontSize:13,color:'#1a73e8'}}/>}
                  <Typography sx={{fontSize:'0.7rem',fontWeight:700,color:'#3c4043'}}>
                    {viewMode==='agrupado'?`${Object.keys(gruposF).length} bairros`:`${casosF.length} casos`}
                    {nActiveF>0&&` · ${nActiveF} filtro${nActiveF>1?'s':''}`}
                  </Typography>
                </Box>

                {legend&&(
                  <Card elevation={3} sx={{position:'absolute',bottom:24,right:14,bgcolor:'rgba(255,255,255,0.97)',borderRadius:2,p:1.5,minWidth:140,zIndex:10,boxShadow:'0 2px 8px rgba(0,0,0,0.18)',border:'1px solid rgba(0,0,0,0.07)'}}>
                    <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center',mb:.7}}>
                      <Typography sx={{fontWeight:700,color:'#3c4043',fontSize:'0.66rem',textTransform:'uppercase',letterSpacing:.4}}>Legenda</Typography>
                      <IconButton size="small" onClick={()=>setLegend(false)} sx={{p:.2,color:'#5f6368'}}><CloseIcon sx={{fontSize:12}}/></IconButton>
                    </Box>
                    {[{l:'Confirmado',c:'#ea4335',i:'!'},{l:'Suspeito',c:'#fbbc05',i:'?'},{l:'Pendente',c:'#4285f4',i:'·'},{l:'Descartado',c:'#34a853',i:'✓'}].map(({l,c,i})=>(
                      <Box key={l} sx={{display:'flex',alignItems:'center',gap:.7,mb:.45}}>
                        <Box component="img" src={buildPin(c,i,18)} sx={{width:15,height:21,flexShrink:0}} alt=""/>
                        <Typography sx={{fontSize:'0.71rem',color:'#3c4043',fontWeight:500}}>{l}</Typography>
                      </Box>
                    ))}
                  </Card>
                )}

                <Box sx={{position:'absolute',bottom:24,right:legend?170:14,transition:'right .25s',display:'flex',flexDirection:'column',zIndex:10,boxShadow:'0 2px 8px rgba(0,0,0,0.22)',borderRadius:1.5,overflow:'hidden'}}>
                  <IconButton onClick={()=>setZoom(p=>Math.min(p+1,21))} size="small" sx={{bgcolor:'white',color:'#5f6368',borderRadius:0,width:36,height:36,borderBottom:'1px solid #e0e0e0','&:hover':{bgcolor:'#f5f5f5'}}}><ZoomInIcon sx={{fontSize:19}}/></IconButton>
                  <IconButton onClick={()=>setZoom(p=>Math.max(p-1,1))} size="small" sx={{bgcolor:'white',color:'#5f6368',borderRadius:0,width:36,height:36,'&:hover':{bgcolor:'#f5f5f5'}}}><ZoomOutIcon sx={{fontSize:19}}/></IconButton>
                </Box>

                <Tooltip title="Centrar">
                  <IconButton onClick={()=>{setCenter({lat:-8.8368,lng:13.2343});setZoom(12);}}
                    sx={{position:'absolute',bottom:68,right:legend?170:14,transition:'right .25s',zIndex:10,bgcolor:'white',color:'#5f6368',width:36,height:36,boxShadow:'0 2px 8px rgba(0,0,0,0.22)',borderRadius:1.5,'&:hover':{bgcolor:'#f5f5f5'}}}>
                    <MyLocationIcon sx={{fontSize:18}}/>
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {/* ── Bottom Navigation (apenas mobile) ───────────────────────────── */}
          {isMobile&&(
            <BottomNavigation value={mobileTab} onChange={(_,v)=>setMobileTab(v)} showLabels
              sx={{height:bottomNavH,flexShrink:0,zIndex:1200}}>
              <BottomNavigationAction label="Mapa"
                icon={<Badge badgeContent={nActiveF||undefined} color="warning" variant="dot"><MapIcon/></Badge>}/>
              <BottomNavigationAction label="Lista"
                icon={<Badge badgeContent={casosF.length||undefined} color="primary" max={999}
                  sx={{'& .MuiBadge-badge':{fontSize:'0.5rem',height:14,minWidth:14,top:2,right:-2}}}><ListNavIcon/></Badge>}/>
              <BottomNavigationAction label="Análise" icon={<DashboardIcon/>}/>
            </BottomNavigation>
          )}

          {/* ── Gaveta de Filtros (mobile bottom sheet) ───────────────────── */}
          <SwipeableDrawer anchor="bottom" open={filterOpen} onOpen={()=>setFilterOpen(true)} onClose={()=>setFilterOpen(false)}
            PaperProps={{sx:{borderTopLeftRadius:20,borderTopRightRadius:20,bgcolor:'#111',maxHeight:'88vh'}}}>
            <Box sx={{display:'flex',justifyContent:'center',pt:1.2,pb:.5}}>
              <Box sx={{width:40,height:4,borderRadius:2,bgcolor:'rgba(255,255,255,0.2)'}}/>
            </Box>
            <Box sx={{height:'calc(88vh - 24px)'}}>
              <FilterPanel/>
            </Box>
          </SwipeableDrawer>

          {/* ── Drawer Detalhes (bottom no mobile, lateral no desktop) ──────── */}
          <Drawer anchor={isMobile?'bottom':'right'} open={detailOpen} onClose={()=>setDetail(false)}
            PaperProps={{sx:{
              width:isMobile?'100%':{xs:'100vw',sm:380,md:420},
              height:isMobile?'88vh':'100%',
              borderTopLeftRadius:isMobile?20:0,
              borderTopRightRadius:isMobile?20:0,
              bgcolor:'#0e0e0e',
            }}}>
            {isMobile&&<Box sx={{display:'flex',justifyContent:'center',pt:1.2,pb:.5}}><Box sx={{width:40,height:4,borderRadius:2,bgcolor:'rgba(255,255,255,0.2)'}}/></Box>}
            {sel&&(
              <Box sx={{display:'flex',flexDirection:'column',height:isMobile?'calc(100% - 24px)':'100%'}}>
                {/* Header */}
                <Box sx={{
                  px:2.5,py:2,flexShrink:0,
                  background:sel.status==='agrupado'
                    ?'linear-gradient(135deg,rgba(26,115,232,0.22) 0%,rgba(26,115,232,0.05) 100%)'
                    :`linear-gradient(135deg,${sc(sel.status)}33 0%,${sc(sel.status)}08 100%)`,
                  borderBottom:`1px solid ${sel.status==='agrupado'?'#1a73e8':sc(sel.status)}35`,
                }}>
                  <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <Box>
                      <Typography variant="h6" fontWeight={800} sx={{fontSize:'0.98rem',lineHeight:1.2}}>
                        {sel.status==='agrupado'?'📊 ':'📋 '}{sel.bairro||'Caso sem bairro'}
                      </Typography>
                      {sel.status!=='agrupado'&&(
                        <Box sx={{display:'flex',gap:.6,mt:.8,flexWrap:'wrap'}}>
                          <Chip label={sel.status} size="small" sx={{bgcolor:sc(sel.status),color:'white',fontWeight:700,fontSize:'0.68rem'}}/>
                          <Chip label={sel.gravidade} size="small" sx={{bgcolor:gc(sel.gravidade),color:'white',fontWeight:700,fontSize:'0.68rem'}}/>
                        </Box>
                      )}
                    </Box>
                    <IconButton size="small" onClick={()=>setDetail(false)}><CloseIcon sx={{fontSize:18}}/></IconButton>
                  </Box>
                </Box>

                {/* Corpo */}
                <Box sx={{flex:1,overflow:'auto',px:2.5,py:2}}>
                  {sel.status==='agrupado'?(
                    <>
                      <Grid container spacing={1} sx={{mb:2}}>
                        {[{l:'Total',v:sel._g?.casos.length,c:'#1a73e8'},{l:'Confirmados',v:sel._g?.confirmados,c:'#ea4335'},{l:'Suspeitos',v:sel._g?.suspeitos,c:'#fbbc05'},{l:'Pendentes',v:sel._g?.pendentes,c:'#4285f4'}].map(({l,v,c})=>(
                          <Grid item xs={6} key={l}>
                            <Card elevation={0} sx={{p:1.5,textAlign:'center'}}>
                              <Typography fontWeight={800} color={c} sx={{fontSize:'1.2rem'}}>{v||0}</Typography>
                              <Typography variant="caption" color="text.secondary" sx={{fontSize:'0.65rem'}}>{l}</Typography>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                      <Typography variant="subtitle2" sx={{color:'primary.main',mb:1,fontWeight:700,fontSize:'0.8rem'}}>Casos neste Bairro</Typography>
                      <List dense sx={{p:0}}>
                        {sel._g?.casos.slice(0,10).map(c=>(
                          <ListItemButton key={c.id} onClick={()=>{ goToCase(c); if(isMobile) setMobileTab(0); }}
                            sx={{borderLeft:`3px solid ${sc(c.status)}`,mb:.3,borderRadius:1.5,px:1.5}}>
                            <Box sx={{width:'100%'}}>
                              <Box sx={{display:'flex',justifyContent:'space-between'}}>
                                <Typography variant="caption" fontWeight={600} sx={{fontSize:'0.73rem'}}>{c.agente}</Typography>
                                <Chip label={c.gravidade} size="small" sx={{bgcolor:gc(c.gravidade),color:'white',height:14,fontSize:'0.52rem'}}/>
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{fontSize:'0.66rem'}}>{fdt(c.dataHora).date} · {c.status}</Typography>
                            </Box>
                          </ListItemButton>
                        ))}
                        {sel._g?.casos.length>10&&<Typography variant="caption" color="text.disabled" sx={{pl:1.5,fontSize:'0.67rem'}}>+ {sel._g.casos.length-10} mais…</Typography>}
                      </List>
                    </>
                  ):(
                    <Grid container spacing={1.5}>
                      {[
                        {title:'Identificação',fields:[{l:'ID',v:<code style={{fontSize:'0.7rem',background:'rgba(255,255,255,0.07)',padding:'2px 5px',borderRadius:3}}>{sel.id}</code>},{l:'Agente',v:sel.agente},{l:'Dispositivo',v:sel.dispositivo}]},
                        {title:'Localização',fields:[{l:'Bairro',v:sel.bairro},{l:'Latitude',v:sel.coordenadas.lat.toFixed(7)},{l:'Longitude',v:sel.coordenadas.lng.toFixed(7)},{l:'Precisão GPS',v:`${sel.coordenadas.precisao?.toFixed(0)||'—'} m`}]},
                        {title:'Registo Temporal',fields:[{l:'Data',v:fdt(sel.dataHora).date},{l:'Hora',v:fdt(sel.dataHora).time},{l:'Timestamp',v:new Date(sel.timestamp).toLocaleString('pt-AO',{timeZone:'Africa/Luanda'})}]},
                      ].map(({title,fields})=>(
                        <Grid item xs={12} key={title}>
                          <Card elevation={0} sx={{p:1.8}}>
                            <Typography variant="caption" sx={{color:'primary.main',textTransform:'uppercase',letterSpacing:.8,fontSize:'0.6rem',fontWeight:700}}>{title}</Typography>
                            <Box sx={{mt:.8,display:'flex',flexDirection:'column',gap:.6}}>
                              {fields.map(({l,v})=>(
                                <Box key={l}>
                                  <Typography variant="caption" sx={{color:'text.disabled',fontSize:'0.62rem'}}>{l}</Typography>
                                  <Typography variant="body2" sx={{fontSize:'0.8rem'}}>{v||'—'}</Typography>
                                </Box>
                              ))}
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                      {sel.notas&&(
                        <Grid item xs={12}>
                          <Card elevation={0} sx={{p:1.8,borderLeft:'3px solid rgba(255,255,255,0.12)'}}>
                            <Typography variant="caption" sx={{color:'primary.main',textTransform:'uppercase',letterSpacing:.8,fontSize:'0.6rem',fontWeight:700}}>Notas</Typography>
                            <Typography variant="body2" sx={{mt:.7,fontSize:'0.8rem',lineHeight:1.6,color:'rgba(255,255,255,0.75)'}}>{sel.notas}</Typography>
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                  )}
                </Box>

                {/* Acções */}
                <Box sx={{px:2.5,py:2,borderTop:'1px solid rgba(255,255,255,0.07)',display:'flex',gap:1,flexWrap:'wrap',flexShrink:0}}>
                  <Button variant="contained" color="primary" startIcon={<VisibilityIcon/>}
                    onClick={()=>{setCenter(sel.coordenadas);setZoom(17);setDetail(false);if(isMobile)setMobileTab(0);}}
                    sx={{flex:1,minWidth:95,borderRadius:2,fontSize:'0.76rem',py:1.1}}>
                    Ver no Mapa
                  </Button>
                  {sel.status!=='agrupado'&&(
                    <>
                      <Button variant="outlined" color="secondary" startIcon={<PhoneIcon/>}
                        onClick={()=>addN(`Contactando ${sel.agente}…`,'info')}
                        sx={{flex:1,minWidth:95,borderRadius:2,fontSize:'0.76rem',py:1.1}}>
                        Contactar
                      </Button>
                      <Button variant="outlined" color="warning" startIcon={<AlertIcon/>}
                        onClick={()=>addN(`Alerta criado — caso ${sel.id}`,'warning')}
                        sx={{flex:1,minWidth:95,borderRadius:2,fontSize:'0.76rem',py:1.1}}>
                        Alerta
                      </Button>
                    </>
                  )}
                </Box>
              </Box>
            )}
          </Drawer>

          {/* ── Dialog datas ─────────────────────────────────────────────────── */}
          <Dialog open={Boolean(dateDlg)} onClose={()=>setDateDlg(null)}
            PaperProps={{sx:{borderRadius:3,bgcolor:'#1a1a1a',minWidth:{xs:290,sm:340}}}}>
            <DialogTitle sx={{fontSize:'0.95rem',fontWeight:700}}>{dateDlg==='from'?'📅 Data de início':'📅 Data de fim'}</DialogTitle>
            <DialogContent>
              <DatePicker
                label={dateDlg==='from'?'De':'Até'}
                value={dateDlg==='from'?F.dateFrom:F.dateTo}
                onChange={v=>setF(dateDlg==='from'?'dateFrom':'dateTo',v)}
                slotProps={{textField:{fullWidth:true,sx:{mt:1}}}}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>{setF(dateDlg==='from'?'dateFrom':'dateTo',null);setDateDlg(null);}} color="warning">Limpar</Button>
              <Button onClick={()=>setDateDlg(null)} variant="contained">Aplicar</Button>
            </DialogActions>
          </Dialog>

          {/* ── Snackbar ─────────────────────────────────────────────────────── */}
          <Snackbar open={showNotif} autoHideDuration={4000} onClose={()=>setShowN(false)}
            anchorOrigin={{vertical:'bottom',horizontal:isMobile?'center':'right'}}
            sx={{mb:{xs:`${bottomNavH+8}px`,sm:2}}}>
            <Alert severity={notifs.at(-1)?.sev||'info'} onClose={()=>setShowN(false)}
              sx={{borderRadius:2,minWidth:220}} variant="filled">
              {notifs.at(-1)?.msg||''}
            </Alert>
          </Snackbar>

        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
