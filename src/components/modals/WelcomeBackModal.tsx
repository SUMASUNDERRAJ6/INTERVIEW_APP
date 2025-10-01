import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InterviewSession } from '@/types/interview';
import { Clock, User, ArrowRight, Trash2 } from 'lucide-react';

interface WelcomeBackModalProps {
  sessions: InterviewSession[];
  isOpen: boolean;
  onResume: (sessionId: string) => void;
  onStartNew: () => void;
  onDelete: (sessionId: string) => void;
}

export const WelcomeBackModal = ({ 
  sessions, 
  isOpen, 
  onResume, 
  onStartNew, 
  onDelete 
}: WelcomeBackModalProps) => {
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  const unfinishedSessions = sessions.filter(s => 
    s.status === 'in_progress' || s.status === 'paused' || s.status === 'collecting_info'
  );

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'in_progress':
        return { label: 'In Progress', color: 'bg-info text-info-foreground' };
      case 'paused':
        return { label: 'Paused', color: 'bg-warning text-warning-foreground' };
      case 'collecting_info':
        return { label: 'Setting Up', color: 'bg-primary text-primary-foreground' };
      default:
        return { label: 'Unknown', color: 'bg-muted text-muted-foreground' };
    }
  };

  const getProgressText = (session: InterviewSession) => {
    if (session.status === 'collecting_info') {
      return 'Profile setup in progress';
    }
    return `Question ${session.currentQuestionIndex + 1} of ${session.questions.length}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Welcome Back!</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">
            You have unfinished interview sessions. Would you like to resume where you left off or start a new interview?
          </p>

          {unfinishedSessions.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Unfinished Sessions:</h3>
              {unfinishedSessions.map((session) => {
                const statusInfo = getStatusInfo(session.status);
                const isSelected = selectedSession === session.id;

                return (
                  <Card
                    key={session.id}
                    className={`cursor-pointer transition-all hover:shadow-medium ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedSession(session.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium">
                              {session.candidateProfile.name || 'Unnamed Candidate'}
                            </h4>
                            <Badge className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              {session.candidateProfile.email}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {getProgressText(session)}
                            </p>
                            {session.startTime && (
                              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>
                                  Started {new Date(session.startTime).toLocaleString()}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(session.id);
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {isSelected && (
                            <ArrowRight className="h-4 w-4 text-primary" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onStartNew}
            className="w-full sm:w-auto"
          >
            Start New Interview
          </Button>
          {selectedSession && (
            <Button
              onClick={() => onResume(selectedSession)}
              className="w-full sm:w-auto"
            >
              Resume Selected Session
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};