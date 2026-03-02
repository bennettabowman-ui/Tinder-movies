import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SORT_OPTIONS = [
  { value: 'added', label: 'Date Added' },
  { value: 'rating', label: 'Rating' },
  { value: 'title', label: 'Title' },
  { value: 'year', label: 'Year' },
];

export default function WatchlistScreen({ watchlist, seenList, movies, onShowDetail, onRemove, onMarkWatched, onFeelingLucky }) {
  const [activeView, setActiveView] = useState('watchlist'); // 'watchlist' | 'watched'
  const [sortBy, setSortBy] = useState('added');
  const [filterGenre, setFilterGenre] = useState('all');

  const currentIds = activeView === 'watchlist' ? watchlist : seenList;
  const currentMovies = useMemo(() => {
    return currentIds.map(id => movies.find(m => m.id === id)).filter(Boolean);
  }, [currentIds, movies]);

  const allGenres = useMemo(() => {
    const genres = new Set();
    currentMovies.forEach(m => m.genres.forEach(g => genres.add(g)));
    return ['all', ...Array.from(genres).sort()];
  }, [currentMovies]);

  const filteredAndSorted = useMemo(() => {
    let result = [...currentMovies];

    if (filterGenre !== 'all') {
      result = result.filter(m => m.genres.includes(filterGenre));
    }

    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'title') result.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'year') result.sort((a, b) => b.year - a.year);

    return result;
  }, [currentMovies, filterGenre, sortBy]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            {activeView === 'watchlist' ? 'My Watchlist' : 'Already Seen'}
          </h1>
          {activeView === 'watchlist' && watchlist.length > 0 && (
            <button
              onClick={onFeelingLucky}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))',
                color: 'var(--bg-primary)',
                border: 'none',
              }}
            >
              Feeling Lucky?
            </button>
          )}
        </div>

        {/* View toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveView('watchlist')}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeView === 'watchlist' ? 'var(--accent-gold)' : 'var(--bg-surface)',
              color: activeView === 'watchlist' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: 'none',
            }}
          >
            Want to Watch ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveView('watched')}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeView === 'watched' ? 'var(--accent-gold)' : 'var(--bg-surface)',
              color: activeView === 'watched' ? 'var(--bg-primary)' : 'var(--text-secondary)',
              border: 'none',
            }}
          >
            Watched ({seenList.length})
          </button>
        </div>

        {/* Filters */}
        {currentMovies.length > 0 && (
          <div className="flex gap-3 items-center">
            <div className="flex gap-1.5 overflow-x-auto flex-1 pb-1" style={{ scrollbarWidth: 'none' }}>
              {allGenres.map(g => (
                <button
                  key={g}
                  onClick={() => setFilterGenre(g)}
                  className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0"
                  style={{
                    background: filterGenre === g ? 'rgba(245,197,24,0.2)' : 'var(--bg-surface)',
                    color: filterGenre === g ? 'var(--accent-gold)' : 'var(--text-tertiary)',
                    border: filterGenre === g ? '1px solid rgba(245,197,24,0.3)' : '1px solid transparent',
                  }}
                >
                  {g === 'all' ? 'All' : g}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-xs px-2 py-1 rounded-lg"
              style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none' }}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-5 pb-4" style={{ scrollbarWidth: 'thin' }}>
        {filteredAndSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-5xl mb-4">
              {activeView === 'watchlist' ? '🍿' : '👁️'}
            </div>
            <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {activeView === 'watchlist' ? 'Your watchlist is empty' : 'No watched titles yet'}
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {activeView === 'watchlist'
                ? 'Start swiping to add movies and shows!'
                : 'Mark titles as watched to track what you\'ve seen.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <AnimatePresence>
              {filteredAndSorted.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.03 }}
                  className="relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer group"
                  onClick={() => onShowDetail(movie)}
                  style={{
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 60%)' }}
                  >
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-xs font-semibold truncate">{movie.title}</p>
                      <p className="text-xs" style={{ color: 'var(--accent-gold)' }}>{'★'} {movie.rating}</p>
                    </div>
                  </div>

                  {/* Quick actions on hover */}
                  {activeView === 'watchlist' && (
                    <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); onMarkWatched(movie.id); }}
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(46,204,113,0.9)', border: 'none', color: '#fff' }}
                        title="Mark as watched"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemove(movie.id); }}
                        className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(231,76,60,0.9)', border: 'none', color: '#fff' }}
                        title="Remove"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Rating badge */}
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-xs font-bold"
                    style={{ background: 'rgba(0,0,0,0.7)', color: 'var(--accent-gold)' }}>
                    {'★'} {movie.rating}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
