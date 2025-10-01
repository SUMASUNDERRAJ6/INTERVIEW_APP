import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setCurrentSession, setActiveTab } from '@/store/slices/interviewSlice';
import { TabNavigation } from '@/components/layout/TabNavigation';
import { IntervieweeView } from '@/components/interview/IntervieweeView';
import { InterviewerView } from '@/components/dashboard/InterviewerView';
import { WelcomeBackModal } from '@/components/modals/WelcomeBackModal';

const Index = () => {
  const dispatch = useAppDispatch();
  const { sessions, currentSessionId, activeTab } = useAppSelector(state => state.interview);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  useEffect(() => {
    // Check for unfinished sessions on app load
    const unfinishedSessions = sessions.filter(s => 
      s.status === 'in_progress' || s.status === 'paused' || s.status === 'collecting_info'
    );

    if (unfinishedSessions.length > 0 && !currentSessionId) {
      setShowWelcomeBack(true);
    }
  }, [sessions, currentSessionId]);

  const handleResumeSession = (sessionId: string) => {
    dispatch(setCurrentSession(sessionId));
    dispatch(setActiveTab('interviewee'));
    setShowWelcomeBack(false);
  };

  const handleStartNewSession = () => {
    dispatch(setCurrentSession(null));
    dispatch(setActiveTab('interviewee'));
    setShowWelcomeBack(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    // For now, just close the modal. In a real app, you'd dispatch a delete action
    setShowWelcomeBack(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TabNavigation />
      
      <main className="py-6">
        {activeTab === 'interviewee' ? (
          <IntervieweeView />
        ) : (
          <InterviewerView />
        )}
      </main>

      <WelcomeBackModal
        sessions={sessions}
        isOpen={showWelcomeBack}
        onResume={handleResumeSession}
        onStartNew={handleStartNewSession}
        onDelete={handleDeleteSession}
      />
    </div>
  );
};

export default Index;
