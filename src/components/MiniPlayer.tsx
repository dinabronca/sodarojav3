import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Radio } from 'lucide-react';

// Global state for the mini player (simple pub/sub)
type PlayerState = {
  visible: boolean;
  episodeTitle: string;
  city: string;
  imageUrl: string;
  episodeId: string;
};

let _state: PlayerState = { visible: false, episodeTitle: '', city: '', imageUrl: '', episodeId: '' };
let _listeners: Array<(s: PlayerState) => void> = [];

export const miniPlayerShow = (data: { episodeTitle: string; city: string; imageUrl: string; episodeId: string }) => {
  _state = { ...data, visible: true };
  _listeners.forEach(fn => fn(_state));
};

export const miniPlayerHide = () => {
  _state = { ..._state, visible: false };
  _listeners.forEach(fn => fn(_state));
};

const useMiniPlayer = () => {
  const [state, setState] = React.useState<PlayerState>(_state);
  React.useEffect(() => {
    _listeners.push(setState);
    return () => { _listeners = _listeners.filter(fn => fn !== setState); };
  }, []);
  return state;
};

export const MiniPlayer: React.FC = () => {
  const { visible, episodeTitle, city, imageUrl } = useMiniPlayer();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] w-[92vw] max-w-md"
        >
          <div className="relative flex items-center gap-3 bg-soda-deep/95 border border-soda-mist/15 rounded-sm px-3 py-2.5 backdrop-blur-md"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 12px rgba(196,85,85,0.08)' }}>

            {/* Episode image */}
            <div className="w-10 h-10 rounded-sm overflow-hidden flex-shrink-0 border border-soda-mist/10">
              {imageUrl ? (
                <img src={imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-soda-night flex items-center justify-center">
                  <Radio size={14} className="text-soda-red/50" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-soda-glow text-xs font-serif truncate leading-tight">&ldquo;{episodeTitle}&rdquo;</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-soda-red/70 text-[9px] tracking-wider">{city}</span>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-soda-red/60 animate-pulse" />
                  <span className="text-soda-lamp/40 text-[9px] tracking-wider">ESCUCHANDO</span>
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={miniPlayerHide}
              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-soda-fog/40 hover:text-soda-lamp transition-colors duration-300"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
