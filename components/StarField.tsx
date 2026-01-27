import React, { useEffect, useRef } from 'react';

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    // Create stars with depth (z)
    const stars: { x: number; y: number; z: number; size: number; brightness: number }[] = [];
    const numStars = 400;

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5, // Depth factor
        size: Math.random() * 1.5,
        brightness: Math.random(),
      });
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#0b0d17'; // Deep space black
      ctx.fillRect(0, 0, width, height);

      const scrollY = scrollRef.current;

      stars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.beginPath();
        
        // Parallax y calculation: move stars upwards as we scroll down
        // Deeper stars (lower z) move slower
        let displayY = (star.y - scrollY * (0.2 * star.z)) % height;
        if (displayY < 0) displayY += height;

        ctx.arc(star.x, displayY, star.size * star.z, 0, Math.PI * 2);
        ctx.fill();

        // Twinkle
        if (Math.random() > 0.95) {
            star.brightness += (Math.random() - 0.5) * 0.1;
        }
        if (star.brightness < 0.2) star.brightness = 0.2;
        if (star.brightness > 0.8) star.brightness = 0.8;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="stars-container fixed top-0 left-0 w-full h-full pointer-events-none z-0" />;
};

export default StarField;