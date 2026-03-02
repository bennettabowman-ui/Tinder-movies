import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '../components/SwipeCard';

function generateSessionId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function MatchHub({ movies, filteredMovies, sessionData, setSessionData, onShowDetail, onMatch }) {
  const [view, setView] = useState('hub'); // 'hub' | 'swipeA' | 'swipeB' | 'results'

  const startNewSession = useCallback(() => {
    const id = generateSessionId();
    setSessionData({
      id,
      active: true,
      role: 'personA',
      personA: [],
      personB: [],
      movieIds: filteredMovies.map(m => m.id),
    });
    setView('swipeA');
  }, [filteredMovies, setSessionData]);

  const switchToPersonB = useCallback(() => {
    setSessionData(prev => ({ ...prev, role: 'personB' }));
    setView('swipeB');
  }, [setSessionData]);

  const handleSwipe = useCallback((movieId, direction) => {
    if (!sessionData) return;
    const personKey = view === 'swipeA' ? 'personA' : 'personB';
    if (direction === 'right') {
      setSessionData(prev => ({
        ...prev,
        [personKey]: [...(prev[personKey] || []), movieId],
      }));
    }
  }, [sessionData, view, setSessionData]);

  const showResults = useCallback(() => {
    setView('results');
  }, []);

  const matches = useMemo(() => {
    if (!sessionData) return [];
    const aSet = new Set(sessionData.personA || []);
    const bSet = new Set(sessionData.personB || []);
    const matchIds = [...aSet].filter(id => bSet.has(id));
    return matchIds.map(id => movies.find(m => m.id === id)).filter(Boolean);
  }, [sessionData, movies]);

  const sessionMovies = useMemo(() => {
    if (!sessionData) return [];
    const swiped = new Set([
      ...(sessionData.personA || []),
      ...(sessionData.personB || []),
    ]);
    // For person B, only show movies that person A was shown
    return filteredMovies.filter(m => sessionData.movieIds?.includes(m.id));
  }, [sessionData, filteredMovies]);

  const swipedByCurrentPerson = useMemo(() => {
    if (!sessionData || !view.startsWith('swipe')) return new Set();
    const personKey = view === 'swipeA' ? 'personA' : 'personB';
    return new Set(sessionData[personKey] || []);
  }, [sessionData, view]);

  const resetSession = useCallback(() => {
    setSessionData(null);
    setView('hub');
  }, [setSessionData]);

  // Hub view
  if (view === 'hub') {
    return (
      <div className="h-full flex flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm"
        >
          <div className="text-6xl mb-6">🎬</div>
          <h1 className="text-3xl font-bold mb-3" style={{ fontFamily: 'Playfair Display, serif', color: 'var(--accent-gold)' }}>
            Tonight's Pick
          </h1>
          <p className="mb-8 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Can't decide what to watch? Swipe through movies with a friend — when you both swipe right on the same title, it's a match!
          </p>

          <button
            onClick={startNewSession}
            className="w-full py-4 rounded-2xl text-lg font-bold mb-4 transition-all"
            style={{
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))',
              color: 'var(--bg-primary)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(245, 197, 24, 0.3)',
            }}
          >
            Start New Session
          </button>

          {sessionData && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs mb-1" style={{ color: 'var(--text-tertiary)' }}>Active Session</p>
                <p className="text-lg font-bold font-mono tracking-wider" style={{ color: 'var(--accent-gold)' }}>
                  {sessionData.id}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  Person A: {sessionData.personA?.length || 0} likes · Person B: {sessionData.personB?.length || 0} likes
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setView('swipeA')}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--bg-surface)', color: 'var(--accent-gold)', border: '1px solid rgba(245,197,24,0.2)' }}
                >
                  Person A
                </button>
                <button
                  onClick={switchToPersonB}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold"
                  style={{ background: 'var(--bg-surface)', color: 'var(--accent-blue)', border: '1px solid rgba(52,152,219,0.2)' }}
                >
                  Person B
                </button>
              </div>

              <button
                onClick={showResults}
                className="w-full py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--accent-green)', color: '#fff', border: 'none' }}
              >
                See Matches ({matches.length})
              </button>

              <button
                onClick={resetSession}
                className="w-full py-2 text-xs"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)' }}
              >
                Reset Session
              </button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // Results view
  if (view === 'results') {
    return (
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex-shrink-0 flex items-center gap-3 px-5 py-4">
          <button
            onClick={() => setView('hub')}
            className="p-2 rounded-lg"
            style={{ background: 'var(--bg-surface)', border: 'none', color: 'var(--text-secondary)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <h2 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            Your Matches
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-4">
          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="text-5xl mb-4">😢</div>
              <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                No matches yet
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Both people need to swipe right on the same title. Keep swiping!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-3 rounded-xl cursor-pointer"
                  style={{ background: 'var(--bg-surface)', border: '1px solid rgba(245,197,24,0.1)' }}
                  onClick={() => {
                    onMatch(movie);
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-16 h-24 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-base font-semibold truncate" style={{ fontFamily: 'Playfair Display, serif' }}>
                        {movie.title}
                      </h3>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                        style={{ background: 'rgba(245,197,24,0.2)', color: 'var(--accent-gold)' }}>
                        Match!
                      </span>
                    </div>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                      {movie.year} · {'★'} {movie.rating} · {movie.genres.join(', ')}
                    </p>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>
                      {movie.hook}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Swipe view for Person A or B
  const personLabel = view === 'swipeA' ? 'Person A' : 'Person B';
  const personColor = view === 'swipeA' ? 'var(--accent-gold)' : 'var(--accent-blue)';
  const personKey = view === 'swipeA' ? 'personA' : 'personB';

  // Build the list of movies this person hasn't swiped on yet
  const personSwiped = sessionData ? (sessionData[personKey] || []) : [];
  const allSessionSwipedIds = useMemo(() => {
    // Track all movies this person has interacted with (liked or skipped)
    // Since we only store likes, we need a different tracking mechanism
    // We'll track by index progression instead
    return new Set(personSwiped);
  }, [personSwiped]);

  // Use a simple counter approach: show movies in order, skipping ones already decided
  const [currentIndex, setCurrentIndex] = useState(0);

  const remainingMovies = useMemo(() => {
    // Show all session movies that haven't been explicitly liked
    // In a real app we'd track skips too, but for the demo we show all non-liked
    return sessionMovies.filter(m => !allSessionSwipedIds.has(m.id));
  }, [sessionMovies, allSessionSwipedIds]);

  const handleSessionSwipe = useCallback((movieId, direction) => {
    handleSwipe(movieId, direction);
    if (remainingMovies.length <= 1) {
      // Done swiping
      setTimeout(() => {
        if (view === 'swipeA') {
          switchToPersonB();
        } else {
          showResults();
        }
      }, 300);
    }
  }, [handleSwipe, remainingMovies, view, switchToPersonB, showResults]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-5 py-3">
        <button
          onClick={() => setView('hub')}
          className="p-2 rounded-lg"
          style={{ background: 'var(--bg-surface)', border: 'none', color: 'var(--text-secondary)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(245,197,24,0.1)', color: personColor }}>
            {personLabel}
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            {remainingMovies.length} left
          </span>
        </div>
        <button
          onClick={view === 'swipeA' ? switchToPersonB : showResults}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{ background: 'var(--bg-surface)', border: 'none', color: 'var(--accent-gold)' }}
        >
          {view === 'swipeA' ? 'Next Person →' : 'See Results'}
        </button>
      </div>

      {/* Card stack */}
      <div className="flex-1 relative px-5 pb-2">
        {remainingMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {personLabel} is done!
            </h3>
            <button
              onClick={view === 'swipeA' ? switchToPersonB : showResults}
              className="px-6 py-3 rounded-xl font-semibold mt-4"
              style={{
                background: 'var(--accent-gold)',
                color: 'var(--bg-primary)',
                border: 'none',
              }}
            >
              {view === 'swipeA' ? "Hand to Person B" : "See Your Matches"}
            </button>
          </div>
        ) : (
          <div className="relative w-full h-full max-w-sm mx-auto" style={{ perspective: '1000px' }}>
            <AnimatePresence>
              {remainingMovies.slice(0, 3).map((movie, index) => {
                const isTop = index === 0;
                const scale = 1 - index * 0.04;
                const translateY = index * 8;
                return (
                  <SwipeCard
                    key={movie.id}
                    movie={movie}
                    onSwipe={handleSessionSwipe}
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
        )}
      </div>

      {/* Action buttons */}
      {remainingMovies.length > 0 && (
        <div className="flex items-center justify-center gap-4 px-5 py-3 flex-shrink-0">
          <button
            onClick={() => remainingMovies[0] && handleSessionSwipe(remainingMovies[0].id, 'left')}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--bg-surface)',
              border: '2px solid var(--accent-red)',
              color: 'var(--accent-red)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
          <button
            onClick={() => remainingMovies[0] && handleSessionSwipe(remainingMovies[0].id, 'right')}
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'var(--bg-surface)',
              border: '2px solid var(--accent-green)',
              color: 'var(--accent-green)',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
