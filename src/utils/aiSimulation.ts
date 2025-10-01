import { Question, QuestionDifficulty } from '@/types/interview';

// Simulated AI functions
export const extractResumeData = async (file: File): Promise<{
  name?: string;
  email?: string;
  phone?: string;
}> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simulate extraction with some random results
  const mockResults = [
    { name: 'John Doe', email: 'john.doe@email.com', phone: '+1-555-0123' },
    { name: 'Jane Smith', email: '', phone: '+1-555-0456' },
    { name: '', email: 'alex.johnson@email.com', phone: '' },
    { name: 'Sarah Wilson', email: 'sarah.w@email.com', phone: '+1-555-0789' },
  ];
  
  return mockResults[Math.floor(Math.random() * mockResults.length)];
};

export const generateQuestions = (): Question[] => {
  const questionBank = {
    easy: [
      "What is the difference between let, const, and var in JavaScript?",
      "Explain the concept of React components and their types.",
      "What is the purpose of package.json in a Node.js project?",
      "How do you handle asynchronous operations in JavaScript?",
      "What is the difference between == and === in JavaScript?"
    ],
    medium: [
      "Explain React hooks and how useState and useEffect work.",
      "What is middleware in Express.js and how do you implement it?",
      "How would you optimize the performance of a React application?",
      "Explain the concept of closures in JavaScript with an example.",
      "What are the different ways to handle errors in Node.js applications?"
    ],
    hard: [
      "Design a scalable system for handling file uploads in a web application.",
      "Explain how you would implement authentication and authorization in a full-stack application.",
      "How would you handle state management in a large React application?",
      "Design a database schema for a social media platform with posts, users, and comments.",
      "Explain how you would implement real-time features in a web application."
    ]
  };

  const difficulties: QuestionDifficulty[] = ['easy', 'easy', 'medium', 'medium', 'hard', 'hard'];
  const timeLimits = { easy: 20, medium: 60, hard: 120 };

  return difficulties.map((difficulty, index) => ({
    id: `q${index + 1}`,
    text: questionBank[difficulty][Math.floor(Math.random() * questionBank[difficulty].length)],
    difficulty,
    timeLimit: timeLimits[difficulty]
  }));
};

export const simulateAIResponse = async (message: string): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
  
  const responses = [
    "That's an interesting perspective. Can you elaborate on that?",
    "I see. What would you do differently if you encountered this in a real project?",
    "Good thinking! How would you handle edge cases in this scenario?",
    "That's a solid approach. What are some potential drawbacks to consider?",
    "Excellent! Can you walk me through the implementation details?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export const calculateScore = (answers: any[]): number => {
  // Simulate AI scoring
  const baseScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
  return Math.min(100, baseScore);
};

export const generateSummary = (candidateName: string, score: number): string => {
  const summaries = [
    `${candidateName} demonstrated strong technical knowledge with clear explanations and good problem-solving skills. Shows potential for growth in a full-stack development role.`,
    `${candidateName} provided thoughtful responses with solid understanding of core concepts. Communication skills are clear and professional.`,
    `${candidateName} exhibited good grasp of fundamental concepts with room for improvement in advanced topics. Positive attitude and willingness to learn.`,
    `${candidateName} showed excellent technical depth and practical experience. Strong candidate with well-rounded full-stack development skills.`
  ];
  
  return summaries[Math.floor(Math.random() * summaries.length)];
};