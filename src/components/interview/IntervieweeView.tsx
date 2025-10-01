import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { 
  createSession, 
  updateCandidateProfile, 
  startInterview, 
  submitAnswer 
} from '@/store/slices/interviewSlice';
import { ResumeUpload } from './ResumeUpload';
import { ChatMessage } from './ChatMessage';
import { Timer } from './Timer';
import { generateQuestions, simulateAIResponse, extractResumeData } from '@/utils/aiSimulation';
import { Question, CandidateProfile } from '@/types/interview';
import { Send, Loader } from 'lucide-react';

export const IntervieweeView = () => {
  const dispatch = useAppDispatch();
  const currentSessionId = useAppSelector(state => state.interview.currentSessionId);
  const sessions = useAppSelector(state => state.interview.sessions);
  const currentSession = sessions.find(s => s.id === currentSessionId);

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isExtracting, setIsExtracting] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  useEffect(() => {
    if (!currentSession) {
      // Initialize with welcome message
      setChatMessages([{
        id: 1,
        message: "Hello! Welcome to the AI-powered interview assistant. I'll help you through the interview process today. Let's start by uploading your resume.",
        isUser: false,
        timestamp: Date.now()
      }]);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    setIsExtracting(true);
    
    // Add message about processing resume
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      message: "Perfect! I'm now processing your resume to extract your information...",
      isUser: false,
      timestamp: Date.now(),
      isTyping: true
    }]);

    // Simulate resume extraction
    const extractedData = await extractResumeData(file);
    
    const newProfile: CandidateProfile = {
      id: Date.now().toString(),
      name: extractedData.name || '',
      email: extractedData.email || '',
      phone: extractedData.phone || '',
      resumeFile: file
    };

    // Check for missing fields
    const missing: string[] = [];
    if (!newProfile.name) missing.push('name');
    if (!newProfile.email) missing.push('email');
    if (!newProfile.phone) missing.push('phone');

    setMissingFields(missing);
    setProfileForm({
      name: newProfile.name,
      email: newProfile.email,
      phone: newProfile.phone
    });

    dispatch(createSession(newProfile));
    setIsExtracting(false);

    // Add extraction complete message
    setTimeout(() => {
      if (missing.length > 0) {
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          message: `Great! I've extracted some information from your resume. However, I need you to provide the following missing details: ${missing.join(', ')}. Please fill them in below.`,
          isUser: false,
          timestamp: Date.now()
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          message: "Excellent! I've successfully extracted all your information. You're all set to begin the interview. Click 'Start Interview' when you're ready!",
          isUser: false,
          timestamp: Date.now()
        }]);
      }
    }, 1000);
  };

  const handleProfileUpdate = () => {
    dispatch(updateCandidateProfile(profileForm));
    setMissingFields([]);
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      message: "Perfect! All your information is now complete. You're ready to begin the interview. Click 'Start Interview' when you're ready!",
      isUser: false,
      timestamp: Date.now()
    }]);
  };

  const handleStartInterview = async () => {
    if (!currentSession) return;

    setChatMessages(prev => [...prev, {
      id: Date.now(),
      message: "I'm ready to start the interview!",
      isUser: true,
      timestamp: Date.now()
    }]);

    // Generate interview questions
    const questions = generateQuestions();
    dispatch(startInterview(questions));

    // Add first question
    setTimeout(() => {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        message: questions[0].text,
        isUser: false,
        timestamp: Date.now(),
        questionNumber: 1,
        difficulty: questions[0].difficulty,
        timeLimit: questions[0].timeLimit
      }]);
    }, 1000);
  };

  const handleSubmitAnswer = async () => {
    if (!currentSession || !currentAnswer.trim()) return;

    setIsSubmitting(true);

    const currentQuestion = currentSession.questions[currentSession.currentQuestionIndex];
    
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      message: currentAnswer,
      isUser: true,
      timestamp: Date.now()
    }]);

    const answer = {
      questionId: currentQuestion.id,
      text: currentAnswer,
      timestamp: Date.now(),
      timeSpent: currentQuestion.timeLimit - (currentSession.timeRemaining || 0)
    };

    dispatch(submitAnswer(answer));
    setCurrentAnswer('');

    // Check if there are more questions
    const nextIndex = currentSession.currentQuestionIndex + 1;
    if (nextIndex < currentSession.questions.length) {
      const nextQuestion = currentSession.questions[nextIndex];
      
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          message: nextQuestion.text,
          isUser: false,
          timestamp: Date.now(),
          questionNumber: nextIndex + 1,
          difficulty: nextQuestion.difficulty,
          timeLimit: nextQuestion.timeLimit
        }]);
      }, 1500);
    } else {
      // Interview completed
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          id: Date.now(),
          message: "🎉 Congratulations! You've completed the interview. I'm now analyzing your responses and calculating your final score...",
          isUser: false,
          timestamp: Date.now()
        }]);
      }, 1500);
    }

    setIsSubmitting(false);
  };

  const handleTimeUp = () => {
    handleSubmitAnswer();
  };

  const getCurrentQuestion = () => {
    if (!currentSession || currentSession.status !== 'in_progress') return null;
    return currentSession.questions[currentSession.currentQuestionIndex];
  };

  const canStartInterview = currentSession && 
    currentSession.candidateProfile.name && 
    currentSession.candidateProfile.email && 
    currentSession.candidateProfile.phone &&
    missingFields.length === 0;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid gap-6">
        {/* Chat Area */}
        <Card className="h-[500px] flex flex-col shadow-medium">
          <CardContent className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.map((msg) => (
                <ChatMessage key={msg.id} {...msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Area */}
          {currentSession?.status === 'in_progress' && (
            <div className="border-t p-4 space-y-4">
              {getCurrentQuestion() && (
                <Timer
                  duration={getCurrentQuestion()!.timeLimit}
                  onTimeUp={handleTimeUp}
                  isActive={true}
                  initialTime={currentSession.timeRemaining}
                />
              )}
              
              <div className="flex space-x-2">
                <Textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder="Type your answer here..."
                  className="flex-1 min-h-[80px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      handleSubmitAnswer();
                    }
                  }}
                />
                <Button 
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim() || isSubmitting}
                  size="lg"
                  className="px-6"
                >
                  {isSubmitting ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Ctrl+Enter to submit your answer
              </p>
            </div>
          )}
        </Card>

        {/* Resume Upload Section */}
        {!currentSession && (
          <ResumeUpload
            onFileUpload={handleFileUpload}
            uploadedFile={currentSession?.candidateProfile.resumeFile}
          />
        )}

        {/* Profile Information Form */}
        {currentSession && missingFields.length > 0 && (
          <Card className="shadow-medium">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                Complete Your Profile
              </h3>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className={missingFields.includes('name') ? 'border-destructive' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      className={missingFields.includes('email') ? 'border-destructive' : ''}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter your phone number"
                      className={missingFields.includes('phone') ? 'border-destructive' : ''}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleProfileUpdate}
                  disabled={!profileForm.name || !profileForm.email || !profileForm.phone}
                >
                  Save Information
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Interview Button */}
        {canStartInterview && currentSession?.status === 'collecting_info' && (
          <Card className="shadow-medium">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Ready to Begin?</h3>
              <p className="text-muted-foreground mb-4">
                You'll face 6 questions: 2 Easy (20s each), 2 Medium (60s each), and 2 Hard (120s each)
              </p>
              <Button onClick={handleStartInterview} size="lg" className="px-8">
                Start Interview
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};