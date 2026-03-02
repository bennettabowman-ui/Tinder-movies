import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const SWIPE_THRESHOLD = 100;
const SWIPE_UP_THRESHOLD = -80;

export default function SwipeCard({ movie, onSwipe, onShowDetail, isTop, style }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [dragging, setDragging] = useState(false);
  const cardRef = useRef(null);

  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const likeOpacity = useTransform(x, [0, 80, 150], [0, 0.6, 1]);
  const nopeOpacity = useTransform(x, [-150, -80, 0], [1, 0.6, 0]);
  const seenOpacity = useTransform(y, [-120, -60, 0], [1, 0.6, 0]);

  const handleDragEnd = (_, info) => {
    setDragging(false);
    const xVal = info.offset.x;
    const yVal = info.offset.y;

    if (yVal < SWIPE_UP_THRESHOLD && Math.abs(yVal) > Math.abs(xVal)) {
      animate(y, -600, { duration: 0.3 });
      animate(x, 0, { duration: 0.3 });
      setTimeout(() => onSwipe(movie.id, 'up'), 200);
    } else if (xVal > SWIPE_THRESHOLD) {
      animate(x, 500, { duration: 0.3 });
      setTimeout(() => onSwipe(movie.id, 'right'), 200);
    } else if (xVal < -SWIPE_THRESHOLD) {
      animate(x, -500, { duration: 0.3 });
      setTimeout(() => onSwipe(movie.id, 'left'), 200);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
      animate(y, 0, { type: 'spring', stiffness: 500, damping: 30 });
    }
  };

  if (!isTop) {
    return (
      <motion.div
        className="absolute inset-0"
        style={{
          ...style,
          borderRadius: 16,
          overflow: 'hidden',
          backgroundImage: `url(${movie.poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="film-grain" />
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        y,
        rotate,
        ...style,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 80px rgba(245,197,24,0.05)',
        zIndex: 50,
      }}
      drag={true}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragStart={() => setDragging(true)}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.98 }}
    >
      {/* Poster image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${movie.poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="film-grain" />

      {/* Bottom gradient + info */}
      <div
        className="absolute bottom-0 left-0 right-0 p-5"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, transparent 100%)',
          paddingTop: '80px',
        }}
        onClick={(e) => {
          if (!dragging) {
            e.stopPropagation();
            onShowDetail(movie);
          }
        }}
      >
        {/* Badges */}
        <div className="flex gap-2 mb-2">
          {movie.isHiddenGem && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(245,197,24,0.2)', color: 'var(--accent-gold)', border: '1px solid rgba(245,197,24,0.3)' }}>
              Hidden Gem
            </span>
          )}
          {movie.isCrowdFavorite && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background: 'rgba(46,204,113,0.2)', color: 'var(--accent-green)', border: '1px solid rgba(46,204,113,0.3)' }}>
              Crowd Favorite
            </span>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif' }}>
          {movie.title}
        </h2>

        <div className="flex items-center gap-3 mb-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <span>{movie.year}</span>
          <span style={{ color: 'var(--accent-gold)' }}>
            {'★'} {movie.rating}
          </span>
          <span>{movie.type === 'movie' ? `${movie.runtime} min` : `${movie.runtime} seasons`}</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {movie.genres.map(g => (
            <span key={g} className="genre-tag px-2.5 py-1 rounded-full text-xs"
              style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
              {g}
            </span>
          ))}
        </div>

        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
          {movie.hook}
        </p>

        {/* Streaming */}
        <div className="flex items-center gap-2 mt-3">
          {movie.streamingOn.map(s => (
            <span key={s} className="px-2 py-0.5 rounded text-xs"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'var(--text-tertiary)' }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Like overlay */}
      <motion.div className="swipe-overlay-like" style={{ opacity: likeOpacity }}>
        <div className="overlay-stamp like">WANT</div>
      </motion.div>

      {/* Nope overlay */}
      <motion.div className="swipe-overlay-nope" style={{ opacity: nopeOpacity }}>
        <div className="overlay-stamp nope">SKIP</div>
      </motion.div>

      {/* Seen overlay */}
      <motion.div className="swipe-overlay-seen" style={{ opacity: seenOpacity }}>
        <div className="overlay-stamp seen">SEEN</div>
      </motion.div>
    </motion.div>
  );
}
