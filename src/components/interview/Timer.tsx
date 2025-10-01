import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Clock, AlertTriangle } from 'lucide-react';

interface TimerProps {
  duration: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  className?: string;
  initialTime?: number;
}

export const Timer = ({ duration, onTimeUp, isActive, className, initialTime }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime || duration);
  
  useEffect(() => {
    if (initialTime !== undefined) {
      setTimeLeft(initialTime);
    } else {
      setTimeLeft(duration);
    }
  }, [duration, initialTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            onTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeLeft, onTimeUp]);

  const percentage = (timeLeft / duration) * 100;
  const isLowTime = percentage <= 25;
  const isCriticalTime = percentage <= 10;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Clock className={cn(
            "h-4 w-4",
            isCriticalTime ? "text-destructive animate-pulse" : 
            isLowTime ? "text-warning" : "text-muted-foreground"
          )} />
          <span className={cn(
            "text-sm font-medium",
            isCriticalTime ? "text-destructive" : 
            isLowTime ? "text-warning" : "text-foreground"
          )}>
            Time Remaining
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {isCriticalTime && (
            <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
          )}
          <span className={cn(
            "text-lg font-bold tabular-nums",
            isCriticalTime ? "text-destructive" : 
            isLowTime ? "text-warning" : "text-foreground"
          )}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>
      
      <Progress 
        value={percentage} 
        className={cn(
          "h-2 transition-all duration-300",
          isCriticalTime && "animate-pulse"
        )}
      />
      
      {isCriticalTime && (
        <p className="text-xs text-destructive font-medium animate-pulse">
          ⚠️ Time is running out!
        </p>
      )}
    </div>
  );
};