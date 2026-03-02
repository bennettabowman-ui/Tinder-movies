import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CONFETTI_COLORS = ['#f5c518', '#e74c3c', '#2ecc71', '#3498db', '#9b59b6', '#e67e22', '#1abc9c'];

function Confetti() {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    const newPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
      size: 6 + Math.random() * 8,
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[200]">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function MatchScreen({ movie, onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Confetti />

      {/* Dark backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.9)' }} onClick={onClose} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-sm">
        {/* Match text */}
        <h1
          className="match-text-reveal text-4xl font-black mb-8 uppercase"
          style={{
            fontFamily: 'Playfair Display, serif',
            color: 'var(--accent-gold)',
            textShadow: '0 0 40px rgba(245,197,24,0.5)',
          }}
        >
          It's a Match!
        </h1>

        {/* Movie poster */}
        <motion.div
          className="match-entrance mx-auto mb-6 rounded-2xl overflow-hidden"
          style={{
            width: '200px',
            aspectRatio: '2/3',
            boxShadow: '0 20px 60px rgba(245,197,24,0.3), 0 0 100px rgba(245,197,24,0.1)',
          }}
        >
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Movie info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {movie.title}
          </h2>
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>
            {movie.year} · {'★'} {movie.rating}
          </p>
          <p className="text-sm mb-6" style={{ color: 'var(--accent-gold)' }}>
            You both want to watch this!
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {movie.trailerUrl && (
            <a
              href={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl text-sm font-semibold text-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))',
                color: 'var(--bg-primary)',
                textDecoration: 'none',
                display: 'block',
              }}
            >
              Watch Trailer
            </a>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold"
            style={{
              background: 'var(--bg-surface)',
              color: 'var(--text-secondary)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            Keep Swiping
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
