import { motion } from 'framer-motion';

const MOODS = [
  { label: 'Action', emoji: '\uD83D\uDD25' },
  { label: 'Comedy', emoji: '\uD83D\uDE02' },
  { label: 'Drama', emoji: '\uD83D\uDE22' },
  { label: 'Horror', emoji: '\uD83D\uDC7B' },
  { label: 'Thriller', emoji: '\uD83E\uDD2F' },
  { label: 'Sci-Fi', emoji: '\uD83D\uDE80' },
  { label: 'Romance', emoji: '\uD83D\uDC95' },
  { label: 'Family', emoji: '\uD83E\uDDF8' },
  { label: 'Documentary', emoji: '\uD83C\uDFAD' },
];

const CONTENT_TYPES = [
  { value: 'movies', label: 'Movies' },
  { value: 'shows', label: 'TV Shows' },
  { value: 'both', label: 'Both' },
];

const ERAS = [
  { value: 'any', label: 'Any Era' },
  { value: 'classic', label: 'Classic (pre-1990)' },
  { value: '90s-00s', label: '90s - 00s' },
  { value: 'modern', label: 'Modern (2010+)' },
];

const RUNTIMES = [
  { value: 'any', label: 'Any Length' },
  { value: 'quick', label: 'Quick (<90 min)' },
  { value: 'standard', label: 'Standard' },
  { value: 'epic', label: 'Epic (3h+)' },
];

const PLATFORMS = [
  { value: 'any', label: 'Any Platform' },
  { value: 'Netflix', label: 'Netflix' },
  { value: 'Hulu', label: 'Hulu' },
  { value: 'HBO', label: 'HBO' },
  { value: 'Disney+', label: 'Disney+' },
  { value: 'Prime', label: 'Prime' },
];

export default function OnboardingScreen({ filters, setFilters, onStart, movieCount }) {
  const toggleMood = (mood) => {
    setFilters(prev => ({
      ...prev,
      moods: prev.moods.includes(mood)
        ? prev.moods.filter(m => m !== mood)
        : [...prev.moods, mood],
    }));
  };

  return (
    <div className="h-full overflow-y-auto px-6 py-8" style={{ scrollbarWidth: 'thin' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h1
            className="text-4xl font-bold mb-3"
            style={{ color: 'var(--accent-gold)', fontFamily: 'Playfair Display, serif' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            CineSwipe
          </motion.h1>
          <motion.p
            className="text-base"
            style={{ color: 'var(--text-secondary)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            What are you in the mood for tonight?
          </motion.p>
        </div>

        {/* Mood selector */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Mood
          </h3>
          <div className="flex flex-wrap gap-2">
            {MOODS.map(({ label, emoji }) => {
              const selected = filters.moods.includes(label);
              return (
                <button
                  key={label}
                  onClick={() => toggleMood(label)}
                  className="genre-tag px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    background: selected ? 'var(--accent-gold)' : 'var(--bg-surface)',
                    color: selected ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    border: selected ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                    transform: selected ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  {emoji} {label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Content type */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Content Type
          </h3>
          <div className="flex gap-2">
            {CONTENT_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters(prev => ({ ...prev, contentType: value }))}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: filters.contentType === value ? 'var(--accent-gold)' : 'var(--bg-surface)',
                  color: filters.contentType === value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: filters.contentType === value ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Era */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Era
          </h3>
          <div className="flex flex-wrap gap-2">
            {ERAS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters(prev => ({ ...prev, era: value }))}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: filters.era === value ? 'var(--accent-gold)' : 'var(--bg-surface)',
                  color: filters.era === value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: filters.era === value ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Runtime */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Runtime
          </h3>
          <div className="flex flex-wrap gap-2">
            {RUNTIMES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters(prev => ({ ...prev, runtime: value }))}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: filters.runtime === value ? 'var(--accent-gold)' : 'var(--bg-surface)',
                  color: filters.runtime === value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: filters.runtime === value ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Platform */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-10"
        >
          <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            Streaming Platform
          </h3>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilters(prev => ({ ...prev, platform: value }))}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                style={{
                  background: filters.platform === value ? 'var(--accent-gold)' : 'var(--bg-surface)',
                  color: filters.platform === value ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  border: filters.platform === value ? '1px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Start button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="pb-8"
        >
          <button
            onClick={onStart}
            className="w-full py-4 rounded-2xl text-lg font-bold transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-gold-dim))',
              color: 'var(--bg-primary)',
              border: 'none',
              boxShadow: '0 4px 20px rgba(245, 197, 24, 0.3)',
            }}
          >
            Start Swiping ({movieCount} titles)
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
