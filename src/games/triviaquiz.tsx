import React, { useState, useEffect } from 'react';
import { RefreshCw, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { Progress } from "@/components/ui/progress";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const TriviaQuizGame: React.FC = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  const triviaQuestions: Question[] = [
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1
    },
    {
      question: "What is the capital city of Japan?",
      options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
      correctAnswer: 2
    },
    {
      question: "Which element has the chemical symbol 'O'?",
      options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
      correctAnswer: 1
    },
    {
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
      correctAnswer: 2
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: 3
    },
    {
      question: "Which programming language was developed by Apple Inc.?",
      options: ["Java", "Swift", "Python", "C#"],
      correctAnswer: 1
    },
    {
      question: "What is the tallest mountain in the world?",
      options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
      correctAnswer: 1
    },
    {
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Thailand", "Japan", "South Korea"],
      correctAnswer: 2
    },
    {
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correctAnswer: 2
    },
    {
      question: "Which of these is NOT a primary color?",
      options: ["Red", "Blue", "Green", "Yellow"],
      correctAnswer: 3
    }
  ];

  const initializeGame = () => {
    // Shuffle questions
    const shuffledQuestions = [...triviaQuestions].sort(() => Math.random() - 0.5);
    setQuestions(shuffledQuestions.slice(0, 5)); // Use 5 random questions
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedOption(null);
    setGameOver(false);
    setLoading(false);
  };

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    
    setSelectedOption(optionIndex);
    
    // Check if answer is correct
    if (optionIndex === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      toast({
        title: "Correct!",
        description: "Well done, that's the right answer!",
        duration: 2000,
      });
    } else {
      toast({
        title: "Incorrect",
        description: `The correct answer was: ${questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctAnswer]}`,
        variant: "destructive",
        duration: 3000,
      });
    }
    
    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedOption(null);
      } else {
        setGameOver(true);
      }
    }, 1500);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  if (loading) {
    return <div className="text-center p-12">Loading quiz questions...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Trivia Quiz</h2>
        <Button
          onClick={initializeGame}
          className="bg-care-primary hover:bg-care-secondary"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> New Quiz
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-center mb-6">
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 text-lg">
          <div>
            <span className="font-semibold">Question:</span> {currentQuestionIndex + 1}/{questions.length}
          </div>
          <div>
            <span className="font-semibold">Score:</span> {score}/{questions.length}
          </div>
        </div>
        <div className="mt-4">
          <Progress value={(currentQuestionIndex / questions.length) * 100} className="h-2" />
        </div>
      </div>

      {gameOver ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <Award className="mx-auto h-16 w-16 text-care-primary mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Quiz Completed!</h3>
          <p className="text-xl mb-6">Your final score: {score}/{questions.length}</p>
          
          {score === questions.length ? (
            <p className="text-green-600 font-semibold mb-6">Perfect score! You're a trivia master!</p>
          ) : score >= questions.length / 2 ? (
            <p className="text-blue-600 font-semibold mb-6">Good job! You know your stuff!</p>
          ) : (
            <p className="text-orange-600 font-semibold mb-6">Keep practicing to improve your score!</p>
          )}
          
          <Button
            onClick={initializeGame}
            className="bg-care-primary hover:bg-care-secondary"
          >
            Play Again
          </Button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-6">{questions[currentQuestionIndex].question}</h3>
          
          <div className="space-y-3">
            {questions[currentQuestionIndex].options.map((option, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedOption === null 
                    ? 'border-gray-200 hover:border-care-primary' 
                    : selectedOption === index
                      ? index === questions[currentQuestionIndex].correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : index === questions[currentQuestionIndex].correctAnswer && selectedOption !== null
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 opacity-60'
                }`}
                onClick={() => handleOptionSelect(index)}
              >
                <p className="text-lg">{option}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TriviaQuizGame;