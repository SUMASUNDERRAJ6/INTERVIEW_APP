import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Search, Eye, Users, TrendingUp, Clock, Trophy } from 'lucide-react';
import { CandidateDetailModal } from './CandidateDetailModal';
import { InterviewSession } from '@/types/interview';

export const InterviewerView = () => {
  const sessions = useAppSelector(state => state.interview.sessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<InterviewSession | null>(null);
  const [sortBy, setSortBy] = useState<'score' | 'name' | 'date'>('score');

  const filteredSessions = sessions
    .filter(session => 
      session.candidateProfile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.candidateProfile.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.finalScore || 0) - (a.finalScore || 0);
        case 'name':
          return a.candidateProfile.name.localeCompare(b.candidateProfile.name);
        case 'date':
          return (b.startTime || 0) - (a.startTime || 0);
        default:
          return 0;
      }
    });

  const completedSessions = sessions.filter(s => s.status === 'completed');
  const averageScore = completedSessions.length > 0 
    ? completedSessions.reduce((sum, s) => sum + (s.finalScore || 0), 0) / completedSessions.length 
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success text-success-foreground">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-info text-info-foreground">In Progress</Badge>;
      case 'paused':
        return <Badge className="bg-warning text-warning-foreground">Paused</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  const getScoreBadge = (score?: number) => {
    if (!score) return null;
    
    if (score >= 80) return <Badge className="bg-success text-success-foreground">{score}</Badge>;
    if (score >= 60) return <Badge className="bg-warning text-warning-foreground">{score}</Badge>;
    return <Badge className="bg-destructive text-destructive-foreground">{score}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{sessions.length}</p>
                <p className="text-sm text-muted-foreground">Total Candidates</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">{completedSessions.length}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-info" />
              <div>
                <p className="text-2xl font-bold">{Math.round(averageScore)}</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">
                  {sessions.filter(s => s.status === 'in_progress').length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle>Candidate Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search candidates by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'score' ? 'default' : 'outline'}
                onClick={() => setSortBy('score')}
                size="sm"
              >
                Sort by Score
              </Button>
              <Button
                variant={sortBy === 'name' ? 'default' : 'outline'}
                onClick={() => setSortBy('name')}
                size="sm"
              >
                Sort by Name
              </Button>
              <Button
                variant={sortBy === 'date' ? 'default' : 'outline'}
                onClick={() => setSortBy('date')}
                size="sm"
              >
                Sort by Date
              </Button>
            </div>
          </div>

          {/* Candidates Table */}
          {filteredSessions.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session) => (
                    <TableRow key={session.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {session.candidateProfile.name || 'Unnamed Candidate'}
                      </TableCell>
                      <TableCell>{session.candidateProfile.email}</TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell>
                        {session.finalScore ? getScoreBadge(session.finalScore) : '-'}
                      </TableCell>
                      <TableCell>
                        {session.startTime 
                          ? new Date(session.startTime).toLocaleDateString()
                          : 'Not started'
                        }
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedCandidate(session)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Candidates Found</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? 'No candidates match your search criteria.'
                  : 'No candidates have started interviews yet.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          session={selectedCandidate}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </div>
  );
};