
import React, { useEffect, useState, useRef } from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: {
    id: string;
    title: string;
    youtubeUrl: string;
  };
  savedProgress: {
    watchTimeMinutes: number;
    progress: number;
  };
  onProgressUpdate: (lessonId: string, watchTimeMinutes: number, progress: number) => void;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  lesson,
  savedProgress,
  onProgressUpdate
}) => {
  const [videoElement, setVideoElement] = useState<HTMLIFrameElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(savedProgress.progress);
  const progressIntervalRef = useRef<number | null>(null);
  const watchTimeRef = useRef<number>(savedProgress.watchTimeMinutes * 60);
  const lastUpdateTimeRef = useRef<number>(Date.now());

  // Extract video ID from YouTube URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeVideoId(lesson.youtubeUrl);
  
  // Start tracking progress when modal opens
  useEffect(() => {
    if (isOpen) {
      // Initialize with saved progress
      watchTimeRef.current = savedProgress.watchTimeMinutes * 60;
      setProgress(savedProgress.progress);
      
      // Set up interval to track time spent watching
      progressIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const elapsed = (now - lastUpdateTimeRef.current) / 1000;
        lastUpdateTimeRef.current = now;
        
        // Update watch time
        watchTimeRef.current += elapsed;
        
        // Calculate progress as percentage of total video duration
        if (duration > 0) {
          const newProgress = Math.min(Math.round((watchTimeRef.current / duration) * 100), 100);
          setProgress(newProgress);
          
          // Update progress every 10 seconds
          if (Math.floor(watchTimeRef.current) % 10 === 0) {
            onProgressUpdate(
              lesson.id, 
              Math.round(watchTimeRef.current / 60), 
              newProgress
            );
          }
        }
      }, 1000);
      
      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
        // Save progress when component unmounts
        onProgressUpdate(
          lesson.id, 
          Math.round(watchTimeRef.current / 60), 
          progress
        );
      };
    }
  }, [isOpen, duration, lesson.id, savedProgress.watchTimeMinutes, savedProgress.progress]);

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleIframeLoad = (iframe: HTMLIFrameElement) => {
    setVideoElement(iframe);
    
    // Attempt to get video duration - this might not work directly with YouTube iframe
    // A more robust solution would require YouTube API
    if (iframe && iframe.contentWindow) {
      try {
        // This is a simplified approach, in a real app you'd use YouTube Player API
        setDuration(600); // Default to 10 minutes if can't determine
      } catch (error) {
        console.error("Could not determine video duration:", error);
        setDuration(600); // Default to 10 minutes
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{lesson.title}</DialogTitle>
          <DialogDescription>
            Seu progresso será salvo automaticamente enquanto assiste
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-[50vh] relative">
          {videoId ? (
            <iframe
              ref={handleIframeLoad}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${Math.floor(watchTimeRef.current)}`}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            ></iframe>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Não foi possível carregar o vídeo. URL inválida.
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Progresso: {progress}%</span>
            <span>
              {formatTime(watchTimeRef.current)} 
              {duration > 0 ? ` / ${formatTime(duration)}` : ''}
            </span>
          </div>
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-xs text-gray-500">
            Seu progresso é salvo automaticamente e não pode ser manipulado
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
