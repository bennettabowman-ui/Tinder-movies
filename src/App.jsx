import { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useLocalStorage from './hooks/useLocalStorage';
import movies from './data/movies';
import OnboardingScreen from './screens/OnboardingScreen';
import SwipeScreen from './screens/SwipeScreen';
import WatchlistScreen from './screens/WatchlistScreen';
import MatchHub from './screens/MatchHub';
import DetailModal from './components/DetailModal';
import MatchScreen from './components/MatchScreen';

const TABS = ['discover', 'mylist', 'match'];

function App() {
  const [activeTab, setActiveTab] = useState('discover');
  const [hasOnboarded, setHasOnboarded] = useLocalStorage('cineswipe-onboarded', false);
  const [filters, setFilters] = useLocalStorage('cineswipe-filters', {
    moods: [],
    contentType: 'both',
    era: 'any',
    runtime: 'any',
    platform: 'any',
  });
  const [watchlist, setWatchlist] = useLocalStorage('cineswipe-watchlist', []);
  const [seenList, setSeenList] = useLocalStorage('cineswipe-seen', []);
  const [skippedList, setSkippedList] = useLocalStorage('cineswipe-skipped', []);
  const [swipeHistory, setSwipeHistory] = useLocalStorage('cineswipe-history', []);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [matchMovie, setMatchMovie] = useState(null);
  const [sessionData, setSessionData] = useLocalStorage('cineswipe-session', null);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (filters.moods && filters.moods.length > 0) {
      const moodToGenre = {
        'Action': 'Action', 'Comedy': 'Comedy', 'Drama': 'Drama',
        'Horror': 'Horror', 'Thriller': 'Thriller', 'Sci-Fi': 'Sci-Fi',
        'Romance': 'Romance', 'Family': 'Family', 'Documentary': 'Documentary',
      };
      const selectedGenres = filters.moods.map(m => moodToGenre[m]).filter(Boolean);
      if (selectedGenres.length > 0) {
        result = result.filter(m => m.genres.some(g => selectedGenres.includes(g)));
      }
    }

    if (filters.contentType === 'movies') {
      result = result.filter(m => m.type === 'movie');
    } else if (filters.contentType === 'shows') {
      result = result.filter(m => m.type === 'show');
    }

    if (filters.era && filters.era !== 'any') {
      result = result.filter(m => m.era === filters.era);
    }

    if (filters.runtime && filters.runtime !== 'any') {
      if (filters.runtime === 'quick') result = result.filter(m => m.type === 'show' || m.runtime < 90);
      else if (filters.runtime === 'standard') result = result.filter(m => m.type === 'show' || (m.runtime >= 90 && m.runtime <= 150));
      else if (filters.runtime === 'epic') result = result.filter(m => m.type === 'show' || m.runtime > 150);
    }

    if (filters.platform && filters.platform !== 'any') {
      result = result.filter(m => m.streamingOn.includes(filters.platform));
    }

    return result;
  }, [filters]);

  const availableMovies = useMemo(() => {
    const usedIds = new Set([...watchlist, ...seenList, ...skippedList]);
    return filteredMovies.filter(m => !usedIds.has(m.id));
  }, [filteredMovies, watchlist, seenList, skippedList]);

  const handleSwipe = useCallback((movieId, direction) => {
    const entry = { movieId, direction, timestamp: Date.now() };
    setSwipeHistory(prev => [...prev, entry]);

    if (direction === 'right') {
      setWatchlist(prev => [...prev, movieId]);
      if (sessionData && sessionData.active) {
        const personKey = sessionData.role;
        setSessionData(prev => ({
          ...prev,
          [personKey]: [...(prev[personKey] || []), movieId],
        }));
      }
    } else if (direction === 'up') {
      setSeenList(prev => [...prev, movieId]);
    } else {
      setSkippedList(prev => [...prev, movieId]);
    }
  }, [setWatchlist, setSeenList, setSkippedList, setSwipeHistory, sessionData, setSessionData]);

  const handleUndo = useCallback(() => {
    setSwipeHistory(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.direction === 'right') {
        setWatchlist(w => w.filter(id => id !== last.movieId));
      } else if (last.direction === 'up') {
        setSeenList(s => s.filter(id => id !== last.movieId));
      } else {
        setSkippedList(s => s.filter(id => id !== last.movieId));
      }
      return prev.slice(0, -1);
    });
  }, [setWatchlist, setSeenList, setSkippedList, setSwipeHistory]);

  const handleStartSession = useCallback(() => {
    setHasOnboarded(true);
  }, [setHasOnboarded]);

  const handleRemoveFromWatchlist = useCallback((movieId) => {
    setWatchlist(prev => prev.filter(id => id !== movieId));
  }, [setWatchlist]);

  const handleMarkWatched = useCallback((movieId) => {
    setWatchlist(prev => prev.filter(id => id !== movieId));
    setSeenList(prev => [...prev, movieId]);
  }, [setWatchlist, setSeenList]);

  const handleResetFilters = useCallback(() => {
    setHasOnboarded(false);
  }, [setHasOnboarded]);

  const handleFeelingLucky = useCallback(() => {
    if (watchlist.length === 0) return null;
    const watchlistMovies = movies.filter(m => watchlist.includes(m.id));
    const best = watchlistMovies.sort((a, b) => b.rating - a.rating)[0];
    if (best) setSelectedMovie(best);
    return best;
  }, [watchlist]);

  const tabIcons = {
    discover: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
      </svg>
    ),
    mylist: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    match: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
  };

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Ambient background */}
      {availableMovies.length > 0 && (
        <div
          className="ambient-bg"
          style={{ backgroundImage: `url(${availableMovies[0]?.backdrop})` }}
        />
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Screen area */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {!hasOnboarded && activeTab === 'discover' ? (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <OnboardingScreen
                  filters={filters}
                  setFilters={setFilters}
                  onStart={handleStartSession}
                  movieCount={filteredMovies.length}
                />
              </motion.div>
            ) : activeTab === 'discover' ? (
              <motion.div
                key="swipe"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <SwipeScreen
                  movies={availableMovies}
                  allMovies={filteredMovies}
                  onSwipe={handleSwipe}
                  onUndo={handleUndo}
                  onShowDetail={setSelectedMovie}
                  onResetFilters={handleResetFilters}
                  swipeHistory={swipeHistory}
                  canUndo={swipeHistory.length > 0}
                />
              </motion.div>
            ) : activeTab === 'mylist' ? (
              <motion.div
                key="watchlist"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <WatchlistScreen
                  watchlist={watchlist}
                  seenList={seenList}
                  movies={movies}
                  onShowDetail={setSelectedMovie}
                  onRemove={handleRemoveFromWatchlist}
                  onMarkWatched={handleMarkWatched}
                  onFeelingLucky={handleFeelingLucky}
                />
              </motion.div>
            ) : (
              <motion.div
                key="match"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <MatchHub
                  movies={movies}
                  filteredMovies={filteredMovies}
                  sessionData={sessionData}
                  setSessionData={setSessionData}
                  onShowDetail={setSelectedMovie}
                  onMatch={setMatchMovie}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom navigation */}
        <nav className="flex-shrink-0 flex items-center justify-around px-4 pb-2 pt-2"
          style={{ background: 'linear-gradient(to top, var(--bg-primary) 80%, transparent)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-200 ${
                activeTab === tab ? 'nav-active' : ''
              }`}
              style={{
                background: 'transparent',
                border: 'none',
                color: activeTab === tab ? 'var(--accent-gold)' : 'var(--text-secondary)',
              }}
            >
              {tabIcons[tab]}
              <span className="text-xs font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                {tab === 'discover' ? 'Discover' : tab === 'mylist' ? 'My List' : 'Match'}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selectedMovie && (
          <DetailModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            isInWatchlist={watchlist.includes(selectedMovie.id)}
            isWatched={seenList.includes(selectedMovie.id)}
            onAddToWatchlist={() => setWatchlist(prev => [...prev, selectedMovie.id])}
            onMarkWatched={() => handleMarkWatched(selectedMovie.id)}
          />
        )}
      </AnimatePresence>

      {/* Match screen overlay */}
      <AnimatePresence>
        {matchMovie && (
          <MatchScreen movie={matchMovie} onClose={() => setMatchMovie(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
