
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
import { ExternalLink } from "lucide-react";

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
  const [duration, setDuration] = useState(600); // Default 10 minutes
  const [progress, setProgress] = useState(savedProgress.progress);
  const watchTimeRef = useRef<number>(savedProgress.watchTimeMinutes * 60);
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const progressIntervalRef = useRef<number | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  // Extract video ID from YouTube URL
  const getYoutubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeVideoId(lesson.youtubeUrl);
  
  // Set video URL only once when modal opens or lesson changes
  useEffect(() => {
    if (isOpen && videoId) {
      const startTime = Math.floor(savedProgress.watchTimeMinutes * 60);
      const newVideoUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&start=${startTime}`;
      setVideoUrl(newVideoUrl);
    }
  }, [isOpen, videoId, lesson.id]);

  // Initialize progress when modal opens
  useEffect(() => {
    if (isOpen) {
      setProgress(savedProgress.progress);
      watchTimeRef.current = savedProgress.watchTimeMinutes * 60;
      lastUpdateTimeRef.current = Date.now();
    }
  }, [isOpen, savedProgress.progress, savedProgress.watchTimeMinutes]);
  
  // Start tracking progress when modal opens
  useEffect(() => {
    if (isOpen) {
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
        }
      }, 1000);
      
      return () => {
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }
      };
    }
  }, [isOpen, duration]);

  // Save progress when modal closes
  const handleClose = () => {
    // Save final progress when closing
    const finalProgress = progress;
    const finalWatchTime = Math.round(watchTimeRef.current / 60);
    
    console.log('Saving progress:', { 
      lessonId: lesson.id, 
      watchTime: finalWatchTime, 
      progress: finalProgress 
    });
    
    // Call the progress update function
    onProgressUpdate(lesson.id, finalWatchTime, finalProgress);
    
    if (finalProgress === 100) {
      toast({
        title: "Aula concluída!",
        description: "Parabéns! Você completou esta aula.",
      });
    }
    
    onClose();
  };

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

  const handleVideoLinkClick = () => {
    window.open(lesson.youtubeUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{lesson.title}</DialogTitle>
          <DialogDescription>
            Seu progresso será salvo quando você sair da aula
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 min-h-[50vh] relative">
          {videoUrl ? (
            <iframe
              key={`video-${lesson.id}`}
              width="100%"
              height="100%"
              src={videoUrl}
              title={lesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              {videoId ? "Carregando vídeo..." : "Não foi possível carregar o vídeo. URL inválida."}
            </div>
          )}
        </div>
        
        {/* Video link backup */}
        <div className="mt-2 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Link direto do vídeo (caso haja problemas):
            </span>
            <button
              onClick={handleVideoLinkClick}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Abrir no YouTube
              <ExternalLink size={16} />
            </button>
          </div>
          <div className="mt-1">
            <code className="text-xs text-gray-500 break-all">
              {lesson.youtubeUrl}
            </code>
          </div>
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
            Progresso será salvo quando você sair da aula
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerModal;
