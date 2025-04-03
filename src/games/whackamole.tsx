import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const WhackAMoleGame: React.FC = () => {
  const { toast } = useToast();
  const [gameActive, setGameActive] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeMole, setActiveMole] = useState<number | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("highScore")) || 0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const moleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Difficulty settings for mole appearance time
  const difficultySettings = {
    easy: { minTime: 1200, maxTime: 2000 },
    medium: { minTime: 800, maxTime: 1400 },
    hard: { minTime: 500, maxTime: 900 }
  };

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setTimeLeft(30);
    setActiveMole(null);

    // Start game timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    spawnMole();
  };

  const spawnMole = () => {
    const { minTime, maxTime } = difficultySettings[difficulty];
    const randomTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
    const randomMole = Math.floor(Math.random() * 9); // 9 holes in the grid

    setActiveMole(randomMole);

    moleTimerRef.current = setTimeout(() => {
      setActiveMole(null);
      if (gameActive) spawnMole();
    }, randomTime);
  };

  const whackMole = (index: number) => {
    if (!gameActive || index !== activeMole) return;
    
    setScore((prevScore) => prevScore + 1);
    setActiveMole(null);
    spawnMole();
  };

  const endGame = () => {
    setGameActive(false);
    clearInterval(timerRef.current!);
    clearTimeout(moleTimerRef.current!);

    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("highScore", score.toString());
      toast({ title: "New High Score!", description: `You scored ${score} points!` });
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current!);
      clearTimeout(moleTimerRef.current!);
    };
  }, []);

  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Whack-A-Mole</h2>
        <Button onClick={startGame} className="bg-care-primary hover:bg-care-secondary">
          <RefreshCw className="mr-2 h-4 w-4" /> Restart Game
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-center mb-6">
        <div className="flex justify-center gap-8 text-lg">
          <div>
            <Clock className="inline-block mr-2" /> <span className="font-semibold">Time Left:</span> {timeLeft}s
          </div>
          <div>
            <span className="font-semibold">Score:</span> {score}
          </div>
          <div>
            <span className="font-semibold">High Score:</span> {highScore}
          </div>
        </div>
      </div>

      {!gameActive ? (
        <div className="text-center p-12">
          <h3 className="text-2xl font-semibold mb-4">Ready to play?</h3>
          <Button onClick={startGame} size="lg" className="bg-care-primary hover:bg-care-secondary">
            Start Game
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 9 }, (_, index) => (
            <div
              key={index}
              className={`h-24 w-24 flex items-center justify-center text-4xl rounded-full shadow cursor-pointer transition-all transform ${
                activeMole === index ? "bg-green-500" : "bg-gray-300"
              } hover:scale-105`}
              onClick={() => whackMole(index)}
            >
              {activeMole === index ? "🐹" : ""}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WhackAMoleGame;
