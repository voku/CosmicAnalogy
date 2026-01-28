import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CELESTIAL_DATA, CELESTIAL_ANGLES } from '../constants';
import { CelestialId, CelestialData } from '../types';
import { Plus, Minus, Maximize, Wifi, CheckCircle2 } from 'lucide-react';

interface GalaxyMapProps {
  activeZone: CelestialId;
  onZoneSelect: (zone: CelestialId) => void;
  setCameraControl: (fn: (zone: CelestialId) => void) => void;
  pingData: { zone: CelestialId, timestamp: number } | null;
}

const GalaxyMap: React.FC<GalaxyMapProps> = ({ activeZone, onZoneSelect, setCameraControl, pingData }) => {
  const PARALLAX_DECAY = 0.92;
  const PARALLAX_CLAMP = 120;
  const PARALLAX_LAYER_SCALE = 0.08;
  const SCROLL_DELTA_CAP = 120;
  const SCROLL_VY_SCALE = 80;
  const SCROLL_VX_SCALE = 0.35;
  const STAR_LAYER_SIZE_MIN = 0.6;
  const STAR_LAYER_SIZE_MAX = 1.2;
  const STAR_SIZE_MAX = 12;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Viewport State
  const [view, setView] = useState({ x: 0, y: 0, zoom: 0.8 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const startClickRef = useRef<{x: number, y: number} | null>(null);
  
  const touchRef = useRef<{ dist: number } | null>(null);
  const targetViewRef = useRef<{ x: number; y: number; zoom: number } | null>(null);
  const animationFrameRef = useRef<number>(0);
  const starsRef = useRef<{ x: number; y: number; size: number; alpha: number; layer: number }[]>([]);
  const parallaxRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const lastWheelTimeRef = useRef(0);

  // Ping State Management
  const pingState = useRef<{ 
      status: 'idle' | 'active' | 'complete', 
      start: number, 
      target: CelestialId | null, 
      duration: number,
      completeTime: number
  }>({ status: 'idle', start: 0, target: null, duration: 0, completeTime: 0 });

  // DOM Refs for High-Performance UI Updates
  const pingMonitorRef = useRef<HTMLDivElement>(null);
  const pingProgressRef = useRef<HTMLDivElement>(null);
  const pingLabelRef = useRef<HTMLSpanElement>(null);
  const pingValueRef = useRef<HTMLSpanElement>(null);
  const pingIconRef = useRef<HTMLDivElement>(null);

  // Reset ping when navigating to a different zone
  useEffect(() => {
    pingState.current = { status: 'idle', start: 0, target: null, duration: 0, completeTime: 0 };
    // Force hide monitor if active
    if (pingMonitorRef.current) {
        pingMonitorRef.current.style.opacity = '0';
        pingMonitorRef.current.style.pointerEvents = 'none';
    }
  }, [activeZone]);

  const getPingDuration = (zone: CelestialId) => {
    switch(zone) {
        case CelestialId.MOON: return 2000;
        case CelestialId.MARS: return 6000;
        case CelestialId.SUN: return 8000;
        case CelestialId.HELIOPAUSE: return 12000;
        case CelestialId.ALPHA_CENTAURI: return 20000;
        default: return 3000;
    }
  };

  useEffect(() => {
    if (pingData) {
      pingState.current = {
        status: 'active',
        start: Date.now(),
        target: pingData.zone,
        duration: getPingDuration(pingData.zone),
        completeTime: 0
      };
    }
  }, [pingData]);

  useEffect(() => {
    const stars = [];
    const FIELD_SIZE = 200000;
    for (let i = 0; i < 6000; i++) {
      stars.push({
        x: (Math.random() - 0.5) * FIELD_SIZE, 
        y: (Math.random() - 0.5) * FIELD_SIZE,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.8 + 0.1, // Bright stars
        layer: Math.random() * 0.9 + 0.1,
      });
    }
    starsRef.current = stars;
  }, []);

  const KM_SCALE = 0.0005; 

  const calculateRadius = useCallback((zoneId: CelestialId) => {
    const dist = CELESTIAL_DATA[zoneId].distance_km;
    return dist * KM_SCALE;
  }, []);

  const getLogPosition = useCallback((data: CelestialData) => {
      const r = calculateRadius(data.id);
      const angle = CELESTIAL_ANGLES[data.id] || 0;
      
      return {
          x: r * Math.cos(angle),
          y: r * Math.sin(angle),
          r: r
      };
  }, [calculateRadius]);

  const w2s = useCallback((wx: number, wy: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    return {
      x: cx + (wx - view.x) * view.zoom,
      y: cy + (wy - view.y) * view.zoom,
    };
  }, [view]);

  const s2w = (sx: number, sy: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const cx = canvasRef.current.width / 2;
    const cy = canvasRef.current.height / 2;
    return {
      x: view.x + (sx - cx) / view.zoom,
      y: view.y + (sy - cy) / view.zoom,
    };
  };

  const getRenderPosition = useCallback((data: CelestialData, width: number, height: number) => {
      const pos = getLogPosition(data);
      const cx = width / 2;
      const cy = height / 2;
      
      const screenX = cx + (pos.x - view.x) * view.zoom;
      const screenY = cy + (pos.y - view.y) * view.zoom;
      
      const padding = 40;
      const minX = padding;
      const maxX = width - padding;
      const minY = padding;
      const maxY = height - padding;

      const isOffScreen = screenX < minX || screenX > maxX || screenY < minY || screenY > maxY;

      if (isOffScreen) {
          const dx = screenX - cx;
          const dy = screenY - cy;
          let t = Infinity;
          
          if (dx > 0) t = Math.min(t, (maxX - cx) / dx);
          else if (dx < 0) t = Math.min(t, (minX - cx) / dx);
          
          if (dy > 0) t = Math.min(t, (maxY - cy) / dy);
          else if (dy < 0) t = Math.min(t, (minY - cy) / dy);
          
          const clampX = cx + dx * t;
          const clampY = cy + dy * t;
          const angle = Math.atan2(dy, dx);

          return {
              x: clampX,
              y: clampY,
              isOffScreen: true,
              angle: angle 
          };
      }

      return { x: screenX, y: screenY, isOffScreen: false, angle: 0 };
  }, [getLogPosition, view]);

  const flyTo = useCallback((zoneId: CelestialId) => {
    const data = CELESTIAL_DATA[zoneId];
    const pos = getLogPosition(data);
    
    let targetZoom = 1.0;
    if (zoneId === CelestialId.EARTH) targetZoom = 1.0;
    if (zoneId === CelestialId.MOON) targetZoom = 0.8;
    if (zoneId === CelestialId.MARS) targetZoom = 0.005; 
    if (zoneId === CelestialId.SUN) targetZoom = 0.001;
    if (zoneId === CelestialId.HELIOPAUSE) targetZoom = 0.00005;
    if (zoneId === CelestialId.ALPHA_CENTAURI) targetZoom = 0.00000005;

    targetViewRef.current = { x: pos.x, y: pos.y, zoom: targetZoom };
  }, [getLogPosition]);

  useEffect(() => {
    setCameraControl(() => flyTo);
  }, [flyTo, setCameraControl]);

  useEffect(() => {
      targetViewRef.current = { x: 0, y: 0, zoom: 0.8 };
  }, []);

  useEffect(() => {
    lastWheelTimeRef.current = performance.now();
  }, []);

  // --- RENDER LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // SMOOTH ANIMATION LOGIC
      if (targetViewRef.current) {
        const t = targetViewRef.current;
        const ease = 0.1; // Snappier response

        // Linear Pan Interpolation
        const newX = view.x + (t.x - view.x) * ease;
        const newY = view.y + (t.y - view.y) * ease;
        
        // Logarithmic Zoom Interpolation for consistent speed across scales
        const newZoom = view.zoom * Math.pow(t.zoom / view.zoom, ease);

        setView({ x: newX, y: newY, zoom: newZoom });
        
        // Stop condition: Check relative zoom difference (log diff) and pixel position diff
        const zoomDiff = Math.abs(Math.log(newZoom) - Math.log(t.zoom));
        const posDiff = Math.abs(newX - t.x) + Math.abs(newY - t.y);

        if (posDiff < 0.5 && zoomDiff < 0.001) {
             targetViewRef.current = null;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const parallax = parallaxRef.current;
      parallax.vx *= PARALLAX_DECAY;
      parallax.vy *= PARALLAX_DECAY;
      parallax.x = Math.max(-PARALLAX_CLAMP, Math.min(PARALLAX_CLAMP, parallax.x + parallax.vx));
      parallax.y = Math.max(-PARALLAX_CLAMP, Math.min(PARALLAX_CLAMP, parallax.y + parallax.vy));

      // Stars - White for visibility on dark
      starsRef.current.forEach(star => {
        const parallaxX = parallax.x * star.layer * PARALLAX_LAYER_SCALE;
        const parallaxY = parallax.y * star.layer * PARALLAX_LAYER_SCALE;
        const px = (star.x - view.x * star.layer * 0.05 - parallaxX) * view.zoom + canvas.width/2;
        const py = (star.y - view.y * star.layer * 0.05 - parallaxY) * view.zoom + canvas.height/2;
        
        const size = 200000; 
        const wx = (px % size + size) % size - size/2 + canvas.width/2;
        const wy = (py % size + size) % size - size/2 + canvas.height/2;

        if (wx > -5 && wx < canvas.width + 5 && wy > -5 && wy < canvas.height + 5) {
            ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            ctx.beginPath();
            const layerSize = STAR_LAYER_SIZE_MIN + star.layer * (STAR_LAYER_SIZE_MAX - STAR_LAYER_SIZE_MIN);
            const starSize = star.size * layerSize * Math.max(0.5, view.zoom * 100);
            ctx.arc(wx, wy, Math.min(starSize, STAR_SIZE_MAX), 0, Math.PI * 2);
            ctx.fill();
        }
      });

      const earthPosScreen = w2s(0, 0);

      // Orbit Rings - White low opacity
      const rings = [
          { id: CelestialId.MOON, angle: CELESTIAL_ANGLES[CelestialId.MOON] },
          { id: CelestialId.MARS, angle: CELESTIAL_ANGLES[CelestialId.MARS] },
          { id: CelestialId.SUN, angle: CELESTIAL_ANGLES[CelestialId.SUN] },
          { id: CelestialId.HELIOPAUSE, angle: CELESTIAL_ANGLES[CelestialId.HELIOPAUSE] },
          { id: CelestialId.ALPHA_CENTAURI, angle: CELESTIAL_ANGLES[CelestialId.ALPHA_CENTAURI] },
      ];

      rings.forEach(ring => {
          const r = calculateRadius(ring.id);
          const rScreen = r * view.zoom;
          
          if (rScreen > canvas.width * 10 && view.zoom > 0.0001) return; 

          ctx.beginPath();
          ctx.arc(earthPosScreen.x, earthPosScreen.y, rScreen, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'; 
          ctx.lineWidth = 1;
          ctx.stroke();
      });

      const sortedObjects = Object.values(CELESTIAL_DATA).sort((a, b) => 0);

      const viewportScale = Math.min(canvas.width, canvas.height) / 800;
      const baseLabelSize = Math.max(10, 14 * viewportScale);

      sortedObjects.forEach((data) => {
          const renderPos = getRenderPosition(data, canvas.width, canvas.height);
          const isActive = activeZone === data.id;
          const labelText = data.component ? `${data.name}` : data.name;

          if (renderPos.isOffScreen) {
              ctx.save();
              ctx.translate(renderPos.x, renderPos.y);
              ctx.rotate(renderPos.angle);
              
              ctx.beginPath();
              ctx.moveTo(8, 0);
              ctx.lineTo(-6, 5);
              ctx.lineTo(-6, -5);
              ctx.closePath();
              // Use distinct color for arrows
              ctx.fillStyle = data.color;
              ctx.globalAlpha = isActive ? 1 : 0.6;
              ctx.fill();
              ctx.globalAlpha = 1;
              ctx.restore();
          } else {
              let radius = 6;
              if (data.type === 'star') radius = 24;
              if (data.type === 'planet') radius = 8;
              if (data.type === 'moon') radius = 4;
              if (data.id === CelestialId.EARTH) radius = 12;
              if (activeZone === data.id) radius *= 1.2;

              const visualRadius = Math.max(2, radius * Math.min(view.zoom, 1.5));

              // Shadows - Strong glow for dark map
              if (data.id === CelestialId.SUN) {
                 ctx.shadowBlur = 40 * view.zoom;
                 ctx.shadowColor = '#fbbf24'; // Bright Amber
              } else if (data.id === CelestialId.EARTH) {
                 ctx.shadowBlur = 20 * view.zoom;
                 ctx.shadowColor = '#60a5fa'; // Bright Blue
              } else {
                 ctx.shadowBlur = isActive ? 15 : 0;
                 ctx.shadowColor = data.color;
              }

              ctx.beginPath();
              ctx.arc(renderPos.x, renderPos.y, visualRadius, 0, Math.PI * 2);
              ctx.fillStyle = data.color;
              ctx.fill();
              ctx.shadowBlur = 0;

              if (isActive) {
                 const reticleR = visualRadius + 8;
                 ctx.strokeStyle = data.color;
                 ctx.lineWidth = 2;
                 ctx.beginPath();
                 ctx.arc(renderPos.x, renderPos.y, reticleR, 0, Math.PI*2);
                 ctx.stroke();
              }

              if (view.zoom > 0.005 || isActive) {
                  // Text - White for dark map
                  ctx.fillStyle = '#ffffff';
                  // Increased font size for better readability
                  ctx.font = isActive
                    ? `bold ${Math.min(18, baseLabelSize + 2)}px Rajdhani`
                    : `${Math.min(16, baseLabelSize)}px Rajdhani`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'top';
                  const labelY = renderPos.y + visualRadius + 8;
                  // Add a subtle text shadow for better contrast against stars
                  ctx.shadowColor = 'rgba(0,0,0,0.8)';
                  ctx.shadowBlur = 4;
                  ctx.fillText(labelText, renderPos.x, labelY);
                  ctx.shadowBlur = 0; // Reset
              }
          }
      });

      // --- PING VISUALIZATION LOGIC ---
      if (pingState.current.status !== 'idle' && pingState.current.target) {
          const targetData = CELESTIAL_DATA[pingState.current.target];
          const color = targetData.color;
          const r = calculateRadius(targetData.id);
          const angle = CELESTIAL_ANGLES[targetData.id] || 0;
          const targetX = r * Math.cos(angle);
          const targetY = r * Math.sin(angle);
          const targetScreen = w2s(targetX, targetY);

          const elapsed = Date.now() - pingState.current.start;
          let progress = Math.min(1, elapsed / pingState.current.duration);

          // Handle Completion
          if (progress >= 1 && pingState.current.status === 'active') {
              pingState.current.status = 'complete';
              pingState.current.completeTime = Date.now();
          }

          if (pingState.current.status === 'complete') {
             progress = 1;
             // Timeout to hide after 2.5 seconds
             if (Date.now() - pingState.current.completeTime > 2500) {
                 pingState.current.status = 'idle';
             }
             
             // Draw success pulse at target
             const pulse = (Date.now() - pingState.current.completeTime) / 1000;
             const alpha = Math.max(0, 1 - pulse * 0.5);
             const radius = 20 + pulse * 40;
             
             ctx.beginPath();
             ctx.arc(targetScreen.x, targetScreen.y, radius, 0, Math.PI*2);
             ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`; // Green success
             ctx.lineWidth = 2;
             ctx.stroke();
          }

          // Update DOM Monitor via refs
          if (pingMonitorRef.current) {
               pingMonitorRef.current.style.opacity = '1';
               pingMonitorRef.current.style.pointerEvents = 'auto';
               pingMonitorRef.current.style.borderColor = `${color}40`;
               
               if (pingState.current.status === 'complete') {
                   // Success State
                   if (pingIconRef.current) pingIconRef.current.style.display = 'none';
                   if (pingLabelRef.current) {
                       pingLabelRef.current.textContent = `CONNECTION ESTABLISHED`;
                       pingLabelRef.current.className = "text-xs font-mono font-bold text-emerald-400 tracking-widest uppercase";
                       pingLabelRef.current.style.color = '#34d399';
                   }
                   if (pingValueRef.current) {
                       pingValueRef.current.textContent = "100%";
                       pingValueRef.current.className = "text-emerald-400 font-bold";
                   }
                   if (pingProgressRef.current) {
                       pingProgressRef.current.style.width = '100%';
                       pingProgressRef.current.className = 'h-full bg-emerald-500 shadow-[0_0_15px_#22c55e] transition-all duration-100 ease-linear';
                       pingProgressRef.current.style.backgroundColor = '#10b981';
                       pingProgressRef.current.style.boxShadow = `0 0 15px #10b981`;
                   }
               } else {
                   // Active State
                   if (pingIconRef.current) {
                       pingIconRef.current.style.display = 'block';
                       pingIconRef.current.style.color = color;
                   }
                   if (pingLabelRef.current) {
                       pingLabelRef.current.textContent = `TRANSMITTING TO ${targetData.name.toUpperCase()}...`;
                       pingLabelRef.current.className = "text-xs font-mono font-bold tracking-widest uppercase";
                       pingLabelRef.current.style.color = color;
                   }
                   if (pingValueRef.current) {
                       pingValueRef.current.textContent = `${Math.floor(progress * 100)}%`;
                       pingValueRef.current.className = "text-white";
                   }
                   if (pingProgressRef.current) {
                       pingProgressRef.current.style.width = `${progress * 100}%`;
                       pingProgressRef.current.className = 'h-full transition-all duration-100 ease-linear';
                       pingProgressRef.current.style.backgroundColor = color;
                       pingProgressRef.current.style.boxShadow = `0 0 10px ${color}`;
                   }
               }
          }
          
          if (pingState.current.status === 'active') {
             const currX = targetX * progress;
             const currY = targetY * progress;
             const sPos = w2s(currX, currY);
             
             // Guide Line
             ctx.beginPath();
             ctx.moveTo(earthPosScreen.x, earthPosScreen.y);
             ctx.lineTo(targetScreen.x, targetScreen.y);
             ctx.strokeStyle = `rgba(255, 255, 255, 0.1)`; 
             ctx.lineWidth = 1;
             ctx.setLineDash([4, 8]);
             ctx.stroke();
             ctx.setLineDash([]);
             
             // Packet Trail
             const trailLen = 30 * (0.5 + progress); 
             const angleToOrigin = Math.atan2(currY, currX);
             const sTailX = sPos.x - Math.cos(angleToOrigin) * trailLen;
             const sTailY = sPos.y - Math.sin(angleToOrigin) * trailLen;

             const grad = ctx.createLinearGradient(sTailX, sTailY, sPos.x, sPos.y);
             grad.addColorStop(0, `rgba(0,0,0,0)`);
             grad.addColorStop(1, color);

             ctx.beginPath();
             ctx.moveTo(sTailX, sTailY);
             ctx.lineTo(sPos.x, sPos.y);
             ctx.strokeStyle = grad;
             ctx.lineWidth = 4;
             ctx.lineCap = 'round';
             ctx.stroke();

             // Packet Head
             ctx.beginPath();
             ctx.arc(sPos.x, sPos.y, 5, 0, Math.PI*2);
             ctx.fillStyle = '#ffffff';
             ctx.shadowColor = color;
             ctx.shadowBlur = 15;
             ctx.fill();
             ctx.shadowBlur = 0;
          }
      } else {
          // Hide Monitor
          if (pingMonitorRef.current) {
               pingMonitorRef.current.style.opacity = '0';
               pingMonitorRef.current.style.pointerEvents = 'none';
          }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [view, activeZone, calculateRadius, getLogPosition, getRenderPosition, w2s]);

  // CONTROLS - Smooth Zooming
  const zoomIn = () => {
     const t = targetViewRef.current || view;
     targetViewRef.current = { ...t, zoom: Math.min(t.zoom * 1.5, 50) };
  };
  const zoomOut = () => {
     const t = targetViewRef.current || view;
     targetViewRef.current = { ...t, zoom: Math.max(t.zoom / 2, 0.000000005) };
  };
  const fitAll = () => {
     targetViewRef.current = { x: 0, y: 0, zoom: 0.001 }; 
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (isDragging) return;

    const now = performance.now();
    const dt = lastWheelTimeRef.current === 0 ? 16 : Math.max(16, now - lastWheelTimeRef.current);
    lastWheelTimeRef.current = now;
    const scrollBoost = Math.min(SCROLL_DELTA_CAP, Math.abs(e.deltaY)) / dt;
    parallaxRef.current.vy += Math.sign(e.deltaY) * scrollBoost * SCROLL_VY_SCALE;
    if (Math.abs(e.deltaX) > 0.5) {
      parallaxRef.current.vx += Math.sign(e.deltaX) * Math.min(SCROLL_DELTA_CAP, Math.abs(e.deltaX)) * SCROLL_VX_SCALE;
    }

    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const t = targetViewRef.current || view;

    const zoomFactor = e.deltaY > 0 ? 0.85 : 1.15;
    let newZoom = t.zoom * zoomFactor;
    
    // Limits: Max zoom in to 50, Min zoom out to allow seeing Alpha Centauri
    newZoom = Math.max(0.000000005, Math.min(newZoom, 50));

    // Calculate mouse position in World space relative to the Current View
    // This ensures we zoom into what is currently under the cursor
    const wx = view.x + (mx - cx) / view.zoom;
    const wy = view.y + (my - cy) / view.zoom;
    
    // Adjust target position so that wx,wy remains at mx,my at the new zoom level
    // mx = (wx - newX) * newZoom + cx  =>  newX = wx - (mx - cx) / newZoom
    const newX = wx - (mx - cx) / newZoom;
    const newY = wy - (my - cy) / newZoom;

    targetViewRef.current = { x: newX, y: newY, zoom: newZoom };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
    startClickRef.current = { x: e.clientX, y: e.clientY };
    targetViewRef.current = null; // Stop any auto-pilot
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    if (startClickRef.current) {
        const dragDist = Math.hypot(e.clientX - startClickRef.current.x, e.clientY - startClickRef.current.y);
        if (dragDist < 5) {
            const rect = canvasRef.current!.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const clickY = e.clientY - rect.top;
            let closestDist = Infinity;
            let closestId: CelestialId | null = null;
            Object.values(CELESTIAL_DATA).forEach(data => {
                const renderPos = getRenderPosition(data, canvasRef.current!.width, canvasRef.current!.height);
                const dist = Math.hypot(renderPos.x - clickX, renderPos.y - clickY);
                if (dist < 40 && dist < closestDist) {
                    closestDist = dist;
                    closestId = data.id;
                }
            });
            if (closestId) onZoneSelect(closestId);
        }
    }
    startClickRef.current = null;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    if (!isDragging && canvasRef.current) {
         let hit = false;
         Object.values(CELESTIAL_DATA).forEach(data => {
            const pos = getRenderPosition(data, canvasRef.current!.width, canvasRef.current!.height);
            if (!pos.isOffScreen && Math.hypot(pos.x - mx, pos.y - my) < 30) hit = true;
         });
         canvasRef.current.style.cursor = hit ? 'pointer' : '';
    }
    if (!isDragging) return;
    
    // Direct Pan for Responsiveness
    const dx = e.clientX - lastMouse.x;
    const dy = e.clientY - lastMouse.y;
    
    targetViewRef.current = null; // Ensure inertia doesn't fight pan
    setView(prev => ({ ...prev, x: prev.x - dx / prev.zoom, y: prev.y - dy / prev.zoom }));
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const d = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchRef.current = { dist: d };
      targetViewRef.current = null;
    } else if (e.touches.length === 1) {
        setIsDragging(true);
        setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY });
        startClickRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        targetViewRef.current = null;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); 
    if (e.touches.length === 2 && touchRef.current) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const zoomFactor = newDist / touchRef.current.dist;
      touchRef.current.dist = newDist;
      
      const newZoom = Math.max(0.000000005, Math.min(view.zoom * zoomFactor, 50));
      setView(prev => ({ ...prev, zoom: newZoom }));
    } 
    else if (e.touches.length === 1 && isDragging) {
         const dx = e.touches[0].clientX - lastMouse.x;
         const dy = e.touches[0].clientY - lastMouse.y;
         setView(prev => ({ ...prev, x: prev.x - dx / prev.zoom, y: prev.y - dy / prev.zoom }));
         setLastMouse({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    touchRef.current = null;
    startClickRef.current = null;
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-move overflow-hidden" style={{ touchAction: 'none' }}>
      <canvas
        ref={canvasRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setIsDragging(false); startClickRef.current = null; }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="block w-full h-full"
      />
      
      {/* PING TRANSMISSION MONITOR - BOTTOM CENTER */}
      <div 
        ref={pingMonitorRef} 
        className="opacity-0 transition-opacity duration-300 absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none z-50 w-[90%] md:w-auto"
      >
        <div className="bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-lg p-4 shadow-2xl min-w-[300px] text-center relative overflow-hidden group">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 animate-float opacity-50"></div>

            <div className="flex items-center justify-center gap-2 mb-3 relative z-10">
                <div ref={pingIconRef} className="block">
                     <Wifi className="w-4 h-4 animate-pulse" />
                </div>
                <div className="hidden" ref={el => { if(el && pingState.current.status === 'complete') el.style.display = 'block'; }}>
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <span ref={pingLabelRef} className="text-xs font-mono font-bold tracking-widest uppercase">
                    INITIALIZING LINK...
                </span>
            </div>
            
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2 border border-slate-700 relative z-10">
                <div ref={pingProgressRef} className="h-full w-0"></div>
            </div>
            
            <div className="flex justify-between text-[10px] font-mono text-slate-400 relative z-10">
                <span className="text-white/70">ORIGIN: EARTH</span>
                <span ref={pingValueRef} className="text-white">0%</span>
            </div>
        </div>
      </div>

      {/* Existing Controls - DARK THEME */}
      <div className="absolute top-24 right-4 md:top-auto md:bottom-8 md:right-8 flex flex-col gap-1 pointer-events-auto z-40 bg-slate-900/90 backdrop-blur-md rounded-lg border border-slate-700 p-1 shadow-2xl">
        <button onClick={zoomIn} className="p-2 text-slate-300 hover:bg-slate-800 hover:text-brand-cyan transition-colors rounded-sm" title="Zoom In"><Plus className="w-5 h-5" /></button>
        <div className="h-px w-full bg-slate-700"></div>
        <button onClick={zoomOut} className="p-2 text-slate-300 hover:bg-slate-800 hover:text-brand-cyan transition-colors rounded-sm" title="Zoom Out"><Minus className="w-5 h-5" /></button>
        <div className="h-px w-full bg-slate-700"></div>
        <button onClick={fitAll} className="p-2 text-slate-300 hover:bg-slate-800 hover:text-brand-cyan transition-colors rounded-sm" title="Fit All"><Maximize className="w-5 h-5" /></button>
      </div>

      <div className="absolute bottom-20 md:bottom-8 left-4 md:left-8 pointer-events-none z-10 opacity-95">
          <div className="flex flex-col gap-2 bg-white/95 p-3 rounded border border-slate-200 backdrop-blur-md shadow-lg text-slate-900">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Relative Distance Scale</div>
              <div className="flex items-end gap-1 h-8 border-b border-slate-400 pb-1">
                   <div className="w-px h-full bg-slate-500"></div>
                   <div className="w-12 h-px bg-slate-400/50 mb-0"></div>
                   <div className="w-px h-1/2 bg-slate-500"></div>
                   <div className="w-12 h-px bg-slate-400/50 mb-0"></div>
                   <div className="w-px h-full bg-slate-500"></div>
                   <span className="text-xs text-sky-700 ml-2 font-mono whitespace-nowrap self-end font-bold">Physical Linear Scale (1:1)</span>
              </div>
          </div>
      </div>
    </div>
  );
};

export default GalaxyMap;
