import { useState, useRef, useEffect, useCallback } from "react";
import { planets, PlanetData } from "./data/planets";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const anglesRef = useRef<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const drawSun = useCallback((ctx: CanvasRenderingContext2D, cx: number, cy: number) => {
    // Glow effect
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
    gradient.addColorStop(0, "#fff7a0");
    gradient.addColorStop(0.3, "#ffdd44");
    gradient.addColorStop(0.6, "#ff9900");
    gradient.addColorStop(1, "rgba(255, 100, 0, 0)");
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Sun core
    const coreGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
    coreGradient.addColorStop(0, "#ffffff");
    coreGradient.addColorStop(0.5, "#ffee55");
    coreGradient.addColorStop(1, "#ffaa00");
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle = coreGradient;
    ctx.fill();
  }, []);

  const drawOrbit = useCallback((ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const drawPlanet = useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number, planet: PlanetData, isHovered: boolean, isSelected: boolean) => {
      // Glow for hovered/selected
      if (isHovered || isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, planet.radius + 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.15)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, planet.radius + 3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Planet body
      const gradient = ctx.createRadialGradient(x - planet.radius * 0.3, y - planet.radius * 0.3, 0, x, y, planet.radius);
      gradient.addColorStop(0, lightenColor(planet.color, 40));
      gradient.addColorStop(0.7, planet.color);
      gradient.addColorStop(1, darkenColor(planet.color, 30));
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Saturn's rings
      if (planet.name === "Saturn") {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius + 10, 4, -0.3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(232, 213, 144, 0.6)";
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Label
      if (showLabels) {
        ctx.font = "11px 'Inter', sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
        ctx.textAlign = "center";
        ctx.fillText(planet.nameRu, x, y + planet.radius + 16);
      }
    },
    [showLabels]
  );

  const getPlanetPosition = useCallback(
    (index: number, cx: number, cy: number) => {
      const planet = planets[index];
      const angle = anglesRef.current[index];
      return {
        x: cx + Math.cos(angle) * planet.orbitRadius,
        y: cy + Math.sin(angle) * planet.orbitRadius,
      };
    },
    []
  );

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const cx = width / 2;
    const cy = height / 2;

    // Clear
    ctx.fillStyle = "#0a0a1a";
    ctx.fillRect(0, 0, width, height);

    // Stars background
    drawStars(ctx, width, height);

    // Draw orbits
    if (showOrbits) {
      planets.forEach((planet) => {
        drawOrbit(ctx, cx, cy, planet.orbitRadius);
      });
    }

    // Draw sun
    drawSun(ctx, cx, cy);

    // Draw planets
    planets.forEach((planet, index) => {
      const pos = getPlanetPosition(index, cx, cy);
      const isHovered = hoveredPlanet === planet.name;
      const isSelected = selectedPlanet?.name === planet.name;
      drawPlanet(ctx, pos.x, pos.y, planet, isHovered, isSelected);
    });
  }, [drawSun, drawOrbit, drawPlanet, getPlanetPosition, hoveredPlanet, selectedPlanet, showOrbits]);

  const animate = useCallback(() => {
    if (isPlayingRef.current) {
      anglesRef.current = anglesRef.current.map((angle, i) => {
        return angle + planets[i].speed * speedRef.current;
      });
    }
    render();
    animationRef.current = requestAnimationFrame(animate);
  }, [render]);

  // Stars cache
  const starsRef = useRef<{ x: number; y: number; r: number; brightness: number }[]>([]);

  const drawStars = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (starsRef.current.length === 0) {
      for (let i = 0; i < 200; i++) {
        starsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5 + 0.3,
          brightness: Math.random() * 0.6 + 0.4,
        });
      }
    }
    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fill();
    });
  }, []);

  // Handle canvas resize
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        starsRef.current = []; // Regenerate stars
      }
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  // Click handler
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      for (let i = 0; i < planets.length; i++) {
        const pos = getPlanetPosition(i, cx, cy);
        const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (dist <= planets[i].radius + 8) {
          setSelectedPlanet(planets[i]);
          return;
        }
      }
      setSelectedPlanet(null);
    },
    [getPlanetPosition]
  );

  // Mouse move handler
  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      let found = false;
      for (let i = 0; i < planets.length; i++) {
        const pos = getPlanetPosition(i, cx, cy);
        const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (dist <= planets[i].radius + 8) {
          setHoveredPlanet(planets[i].name);
          canvas.style.cursor = "pointer";
          found = true;
          break;
        }
      }
      if (!found) {
        setHoveredPlanet(null);
        canvas.style.cursor = "default";
      }
    },
    [getPlanetPosition]
  );

  return (
    <div className="w-full h-screen bg-[#0a0a1a] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 px-4 py-3 bg-gradient-to-r from-[#0d0d2b] to-[#1a1a3e] border-b border-white/10 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌌</span>
          <h1 className="text-white text-lg font-bold tracking-wide">Солнечная Система</h1>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-white/70 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={showOrbits}
              onChange={(e) => setShowOrbits(e.target.checked)}
              className="accent-blue-500"
            />
            Орбиты
          </label>
          <label className="flex items-center gap-1.5 text-white/70 text-sm cursor-pointer ml-3">
            <input
              type="checkbox"
              checked={showLabels}
              onChange={(e) => setShowLabels(e.target.checked)}
              className="accent-blue-500"
            />
            Названия
          </label>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 relative flex">
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-full block"
          />

          {/* Planet info panel */}
          {selectedPlanet && (
            <div className="absolute top-4 left-4 bg-[#12122e]/95 backdrop-blur-md border border-white/15 rounded-xl p-5 max-w-xs shadow-2xl animate-fadeIn">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded-full shadow-lg"
                    style={{ backgroundColor: selectedPlanet.color }}
                  />
                  <h2 className="text-white text-xl font-bold">{selectedPlanet.nameRu}</h2>
                </div>
                <button
                  onClick={() => setSelectedPlanet(null)}
                  className="text-white/50 hover:text-white transition-colors text-lg"
                >
                  ✕
                </button>
              </div>
              <p className="text-white/60 text-sm mb-4 italic">{selectedPlanet.description}</p>
              <div className="space-y-2.5">
                <InfoRow label="Диаметр" value={selectedPlanet.diameter} icon="📏" />
                <InfoRow label="Расстояние от Солнца" value={selectedPlanet.distanceFromSun} icon="☀️" />
                <InfoRow label="Орбитальный период" value={selectedPlanet.orbitalPeriod} icon="🔄" />
              </div>
            </div>
          )}

          {/* Hover tooltip */}
          {hoveredPlanet && !selectedPlanet && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-[#12122e]/90 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white text-sm pointer-events-none">
              Нажмите для подробной информации
            </div>
          )}
        </div>

        {/* Controls panel */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#12122e]/90 backdrop-blur-md border border-white/15 rounded-full px-5 py-3 shadow-xl">
          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-90"
            title={isPlaying ? "Пауза" : "Воспроизвести"}
          >
            {isPlaying ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="3" y="2" width="4" height="12" rx="1" />
                <rect x="9" y="2" width="4" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 2l10 6-10 6V2z" />
              </svg>
            )}
          </button>

          {/* Speed control */}
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs">Скорость:</span>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-24 accent-blue-500"
            />
            <span className="text-white text-xs font-mono w-8">{speed.toFixed(1)}x</span>
          </div>

          {/* Speed presets */}
          <div className="flex gap-1">
            {[0.5, 1, 2, 5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded text-xs transition-all ${
                  speed === s
                    ? "bg-blue-500 text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Planet legend (right side) */}
        <div className="absolute top-4 right-4 bg-[#12122e]/90 backdrop-blur-md border border-white/15 rounded-xl p-4 hidden lg:block">
          <h3 className="text-white/80 text-xs font-semibold mb-3 uppercase tracking-wider">Планеты</h3>
          <div className="space-y-2">
            {planets.map((planet) => (
              <button
                key={planet.name}
                onClick={() => setSelectedPlanet(planet)}
                className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded-lg transition-all ${
                  selectedPlanet?.name === planet.name
                    ? "bg-white/15"
                    : "hover:bg-white/5"
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: planet.color }}
                />
                <span className="text-white/80 text-sm">{planet.nameRu}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{icon}</span>
      <div>
        <div className="text-white/50 text-xs">{label}</div>
        <div className="text-white text-sm font-medium">{value}</div>
      </div>
    </div>
  );
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00ff) + percent);
  const b = Math.min(255, (num & 0x0000ff) + percent);
  return `rgb(${r}, ${g}, ${b})`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - percent);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - percent);
  const b = Math.max(0, (num & 0x0000ff) - percent);
  return `rgb(${r}, ${g}, ${b})`;
}

export default App;
