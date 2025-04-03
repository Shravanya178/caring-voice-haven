import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";


const NumberGuessGame: React.FC = () => {
  const { toast } = useToast();
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [maxAttempts] = useState(7);
  const [gameOver, setGameOver] = useState(false);
  const [hint, setHint] = useState('');
  const [history, setHistory] = useState<{guess: number; hint: string}[]>([]);

  const initializeGame = () => {
    const newTarget = Math.floor(Math.random() * 100) + 1;
    setTarget(newTarget);
    setGuess('');
    setAttempts(0);
    setGameOver(false);
    setHint("I'm thinking of a number between 1 and 100");
    setHistory([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numGuess = parseInt(guess);
    
    if (isNaN(numGuess) || numGuess < 1 || numGuess > 100) {
      toast({
        title: "Invalid input",
        description: "Please enter a number between 1 and 100",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let newHint = '';
    if (numGuess === target) {
      newHint = "You got it!";
      setGameOver(true);
      toast({
        title: "Congratulations!",
        description: `You guessed the number in ${newAttempts} attempts!`,
        duration: 5000,
      });
    } else if (newAttempts >= maxAttempts) {
      newHint = `Game over! The number was ${target}`;
      setGameOver(true);
      toast({
        title: "Game Over",
        description: `You've used all your attempts. The number was ${target}.`,
        variant: "destructive",
        duration: 5000,
      });
    } else if (numGuess < target) {
      newHint = "Too low! Try a higher number";
    } else {
      newHint = "Too high! Try a lower number";
    }

    setHint(newHint);
    setHistory([...history, {guess: numGuess, hint: newHint}]);
    setGuess('');
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Number Guess</h2>
        <Button
          onClick={initializeGame}
          className="bg-care-primary hover:bg-care-secondary"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> New Game
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-center mb-6">
        <div className="flex justify-center gap-8 text-lg">
          <div>
            <span className="font-semibold">Attempts:</span> {attempts}/{maxAttempts}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-6 text-center">Make a guess</h3>
          
          <div className="text-xl font-medium mb-6 text-center">
            <p>{hint}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="number"
              min="1"
              max="100"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              placeholder="Enter a number (1-100)"
              className="text-center text-xl p-6"
              disabled={gameOver}
            />
            <Button 
              type="submit" 
              className="bg-care-primary hover:bg-care-secondary"
              disabled={gameOver}
            >
              Submit Guess
            </Button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-2xl font-semibold mb-6 text-center">Guess History</h3>
          
          {history.length > 0 ? (
            <div className="space-y-2">
              {history.map((entry, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <span className="font-bold text-lg">{entry.guess}</span>
                  {entry.hint.includes("Too low") && <ArrowUp className="text-red-500" />}
                  {entry.hint.includes("Too high") && <ArrowDown className="text-blue-500" />}
                  {entry.hint.includes("You got it") && <span className="text-green-500 font-bold">✓</span>}
                  <span className="text-gray-600 flex-grow text-right">{entry.hint}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No guesses yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NumberGuessGame;