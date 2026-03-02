import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SwipeCard from '../components/SwipeCard';

export default function SwipeScreen({ movies, allMovies, onSwipe, onUndo, onShowDetail, onResetFilters, swipeHistory, canUndo }) {
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const hasSeenTooltip = localStorage.getItem('cineswipe-tooltip-seen');
    if (!hasSeenTooltip) {
      setShowTooltip(true);
      localStorage.setItem('cineswipe-tooltip-seen', 'true');
    }
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (movies.length === 0) return;
    const currentMovie = movies[0];
    if (e.key === 'ArrowRight') onSwipe(currentMovie.id, 'right');
    else if (e.key === 'ArrowLeft') onSwipe(currentMovie.id, 'left');
    else if (e.key === 'ArrowUp') onSwipe(currentMovie.id, 'up');
    else if (e.key === 'z' && (e.ctrlKey || e.metaKey)) onUndo();
  }, [movies, onSwipe, onUndo]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleButtonSwipe = (direction) => {
    if (movies.length === 0) return;
    onSwipe(movies[0].id, direction);
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm aspect-[2/3] skeleton rounded-2xl mb-4" />
        <div className="w-48 h-4 skeleton mb-2" />
        <div className="w-32 h-3 skeleton" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-6xl mb-6">🎬</div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>
            You've seen everything!
          </h2>
          <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
            {allMovies.length === 0
              ? 'No titles match your current filters.'
              : 'You swiped through all available titles.'}
          </p>
          <button
            onClick={onResetFilters}
            className="px-6 py-3 rounded-xl font-semibold transition-all"
            style={{
              background: 'var(--accent-gold)',
              color: 'var(--bg-primary)',
              border: 'none',
            }}
          >
            Expand Your Search
          </button>
        </motion.div>
      </div>
    );
  }

  const visibleCards = movies.slice(0, 3);

  return (
    <div className="h-full flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
        <h1 className="text-xl font-bold" style={{ color: 'var(--accent-gold)', fontFamily: 'Playfair Display, serif' }}>
          CineSwipe
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
            {movies.length} left
          </span>
          <button
            onClick={onResetFilters}
            className="p-2 rounded-lg transition-colors"
            style={{ background: 'var(--bg-surface)', border: 'none', color: 'var(--text-secondary)' }}
            title="Change filters"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/>
              <line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/>
              <line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/>
              <line x1="17" y1="16" x2="23" y2="16"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Card stack area */}
      <div className="flex-1 relative px-5 pb-2">
        <div className="relative w-full h-full max-w-sm mx-auto" style={{ perspective: '1000px' }}>
          <AnimatePresence>
            {visibleCards.map((movie, index) => {
              const isTop = index === 0;
              const scale = 1 - index * 0.04;
              const translateY = index * 8;
              return (
                <SwipeCard
                  key={movie.id}
                  movie={movie}
                  onSwipe={onSwipe}
                  onShowDetail={onShowDetail}
                  isTop={isTop}
                  style={{
                    scale,
                    y: translateY,
                    zIndex: 10 - index,
                    filter: isTop ? 'none' : `brightness(${1 - index * 0.15})`,
                  }}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-center gap-4 px-5 py-3 flex-shrink-0">
        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: canUndo ? 'var(--accent-gold)' : 'var(--text-tertiary)',
            opacity: canUndo ? 1 : 0.4,
          }}
          title="Undo (Ctrl+Z)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
          </svg>
        </button>

        {/* Skip */}
        <button
          onClick={() => handleButtonSwipe('left')}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '2px solid var(--accent-red)',
            color: 'var(--accent-red)',
          }}
          title="Skip (Left arrow)"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Already seen */}
        <button
          onClick={() => handleButtonSwipe('up')}
          className="w-11 h-11 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '2px solid var(--accent-blue)',
            color: 'var(--accent-blue)',
          }}
          title="Already Seen (Up arrow)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>

        {/* Want to watch */}
        <button
          onClick={() => handleButtonSwipe('right')}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all"
          style={{
            background: 'var(--bg-surface)',
            border: '2px solid var(--accent-green)',
            color: 'var(--accent-green)',
          }}
          title="Want to Watch (Right arrow)"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="tooltip-animated fixed bottom-28 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-sm z-50"
            style={{ background: 'var(--accent-gold)', color: 'var(--bg-primary)', fontWeight: 600, whiteSpace: 'nowrap' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onAnimationComplete={() => setTimeout(() => setShowTooltip(false), 4000)}
          >
            Swipe right to save, left to skip, up for already seen
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
