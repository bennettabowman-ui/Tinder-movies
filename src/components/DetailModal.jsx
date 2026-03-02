import { motion } from 'framer-motion';

export default function DetailModal({ movie, onClose, isInWatchlist, isWatched, onAddToWatchlist, onMarkWatched }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Modal */}
      <motion.div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl"
        style={{ background: 'var(--bg-card)', scrollbarWidth: 'thin' }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Backdrop image */}
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          <img
            src={movie.backdrop || movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-card), transparent 50%)' }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', backdropFilter: 'blur(5px)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 -mt-8 relative">
          {/* Title */}
          <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
            {movie.title}
          </h1>

          {/* Meta info */}
          <div className="flex items-center gap-3 mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>{movie.year}</span>
            <span className="flex items-center gap-1" style={{ color: 'var(--accent-gold)' }}>
              {'★'} {movie.rating}
            </span>
            <span>{movie.type === 'movie' ? `${movie.runtime} min` : `${movie.runtime} seasons`}</span>
            <span className="capitalize" style={{
              padding: '2px 8px',
              borderRadius: '4px',
              background: 'rgba(255,255,255,0.05)',
              fontSize: '0.7rem',
            }}>
              {movie.type}
            </span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 mb-5">
            {movie.genres.map(g => (
              <span key={g} className="genre-tag px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' }}>
                {g}
              </span>
            ))}
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-5">
            {movie.isHiddenGem && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(245,197,24,0.15)', color: 'var(--accent-gold)', border: '1px solid rgba(245,197,24,0.2)' }}>
                Hidden Gem
              </span>
            )}
            {movie.isCrowdFavorite && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: 'rgba(46,204,113,0.15)', color: 'var(--accent-green)', border: '1px solid rgba(46,204,113,0.2)' }}>
                Crowd Favorite
              </span>
            )}
          </div>

          {/* Synopsis */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Synopsis
            </h3>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.8)' }}>
              {movie.hook}
            </p>
          </div>

          {/* Cast */}
          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Cast
            </h3>
            <div className="flex flex-wrap gap-2">
              {movie.cast.map(name => (
                <span key={name} className="px-3 py-1.5 rounded-lg text-sm"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Streaming */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
              Available On
            </h3>
            <div className="flex gap-2">
              {movie.streamingOn.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{ background: 'rgba(245,197,24,0.1)', color: 'var(--accent-gold)', border: '1px solid rgba(245,197,24,0.2)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Trailer link */}
          {movie.trailerUrl && (
            <a
              href={movie.trailerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl mb-3 text-sm font-semibold transition-all"
              style={{
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(255,255,255,0.1)',
                textDecoration: 'none',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Watch Trailer
            </a>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {!isInWatchlist && !isWatched && (
              <button
                onClick={onAddToWatchlist}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))',
                  color: 'var(--bg-primary)',
                  border: 'none',
                }}
              >
                Add to Watchlist
              </button>
            )}
            {isInWatchlist && !isWatched && (
              <button
                onClick={onMarkWatched}
                className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: 'var(--accent-green)',
                  color: '#fff',
                  border: 'none',
                }}
              >
                Mark as Watched
              </button>
            )}
            {isWatched && (
              <div className="flex-1 py-3 rounded-xl text-sm font-semibold text-center"
                style={{ background: 'rgba(46,204,113,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(46,204,113,0.2)' }}>
                Watched
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
