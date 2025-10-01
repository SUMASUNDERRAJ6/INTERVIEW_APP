import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Users } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setActiveTab } from '@/store/slices/interviewSlice';

export const TabNavigation = () => {
  const activeTab = useAppSelector(state => state.interview.activeTab);
  const dispatch = useAppDispatch();

  return (
    <div className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold gradient-text">
              AI Interview Assistant
            </h1>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={(value: string) => dispatch(setActiveTab(value as 'interviewee' | 'interviewer'))}
            className="w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="interviewee" className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Interviewee</span>
              </TabsTrigger>
              <TabsTrigger value="interviewer" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Interviewer</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
};