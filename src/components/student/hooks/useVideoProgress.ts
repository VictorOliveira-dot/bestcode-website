import { useState, useRef, useCallback } from 'react';

interface UseVideoProgressProps {
  onProgressUpdate: (watchTimeMinutes: number, progress: number) => void;
  initialProgress?: number;
}

export const useVideoProgress = ({ onProgressUpdate, initialProgress = 0 }: UseVideoProgressProps) => {
  const [progress, setProgress] = useState(initialProgress);
  const [watchTimeMinutes, setWatchTimeMinutes] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedProgress = useRef(initialProgress);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setWatchTimeMinutes(prev => {
        const newTime = prev + 1;
        return newTime;
      });
    }, 60000); // Atualiza a cada minuto
  }, []);

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const updateProgress = useCallback((currentTime: number, duration: number) => {
    if (duration > 0) {
      const newProgress = Math.min(100, Math.round((currentTime / duration) * 100));
      setProgress(newProgress);
      
      // Salvar progresso a cada 10% ou no final
      if (newProgress >= 100 || newProgress - lastSavedProgress.current >= 10) {
        lastSavedProgress.current = newProgress;
        onProgressUpdate(watchTimeMinutes, newProgress);
      }
    }
  }, [watchTimeMinutes, onProgressUpdate]);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    startTimer();
  }, [startTimer]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    stopTimer();
  }, [stopTimer]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    stopTimer();
    setProgress(100);
    onProgressUpdate(watchTimeMinutes, 100);
  }, [stopTimer, watchTimeMinutes, onProgressUpdate]);

  return {
    progress,
    watchTimeMinutes,
    isPlaying,
    updateProgress,
    handlePlay,
    handlePause,
    handleEnded,
  };
};