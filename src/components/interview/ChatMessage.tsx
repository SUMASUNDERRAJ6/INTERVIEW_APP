import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bot, User, Clock } from 'lucide-react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp?: number;
  questionNumber?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit?: number;
  isTyping?: boolean;
}

export const ChatMessage = ({ 
  message, 
  isUser, 
  timestamp, 
  questionNumber, 
  difficulty,
  timeLimit,
  isTyping = false 
}: ChatMessageProps) => {
  const difficultyColors = {
    easy: 'bg-success text-success-foreground',
    medium: 'bg-warning text-warning-foreground',
    hard: 'bg-destructive text-destructive-foreground',
  };

  return (
    <div className={cn(
      "flex gap-3 animate-slide-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-3 shadow-soft",
        isUser 
          ? "bg-chat-bubble-user text-chat-bubble-user-foreground ml-auto" 
          : "bg-chat-bubble"
      )}>
        {questionNumber && difficulty && (
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              Question {questionNumber}
            </Badge>
            <Badge className={cn("text-xs", difficultyColors[difficulty])}>
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </Badge>
            {timeLimit && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {timeLimit}s
              </div>
            )}
          </div>
        )}
        
        <p className={cn(
          "text-sm whitespace-pre-wrap",
          isTyping && "animate-pulse-glow"
        )}>
          {message}
        </p>
        
        {timestamp && (
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
      
      {isUser && (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarFallback className="bg-muted">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};