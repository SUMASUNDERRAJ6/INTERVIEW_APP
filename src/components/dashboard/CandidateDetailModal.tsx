import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InterviewSession } from '@/types/interview';
import { Clock, User, Mail, Phone, FileText, Trophy, Target } from 'lucide-react';

interface CandidateDetailModalProps {
  session: InterviewSession;
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateDetailModal = ({ session, isOpen, onClose }: CandidateDetailModalProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'hard': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const formatDuration = (startTime?: number, endTime?: number) => {
    if (!startTime || !endTime) return 'N/A';
    const duration = Math.floor((endTime - startTime) / 1000 / 60);
    return `${duration} minutes`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Interview Details - {session.candidateProfile.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Candidate Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span>Candidate Profile</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{session.candidateProfile.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{session.candidateProfile.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{session.candidateProfile.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Interview Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{session.finalScore || 'N/A'}</p>
                <p className="text-sm text-muted-foreground">Final Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{session.questions.length}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{session.answers.length}</p>
                <p className="text-sm text-muted-foreground">Answered</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {formatDuration(session.startTime, session.endTime)}
                </p>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
            </CardContent>
          </Card>

          {/* AI Summary */}
          {session.aiSummary && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>AI Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{session.aiSummary}</p>
              </CardContent>
            </Card>
          )}

          {/* Questions and Answers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-4 w-4" />
                <span>Questions & Answers</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {session.questions.map((question, index) => {
                const answer = session.answers.find(a => a.questionId === question.id);
                return (
                  <div key={question.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">Question {index + 1}</Badge>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{question.timeLimit}s</span>
                          </div>
                        </div>
                        <p className="font-medium text-sm mb-3">{question.text}</p>
                      </div>
                      {answer?.score && (
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getScoreColor(answer.score)}`}>
                            {answer.score}/10
                          </p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Candidate Answer:</p>
                      {answer ? (
                        <div className="bg-muted/50 rounded p-3">
                          <p className="text-sm whitespace-pre-wrap">{answer.text}</p>
                          <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                            <span>Time spent: {Math.floor(answer.timeSpent)}s</span>
                            <span>{new Date(answer.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No answer provided</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};