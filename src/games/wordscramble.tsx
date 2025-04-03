import React, { useState, useEffect } from 'react';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";


const WordScrambleGame: React.FC = () => {
  const { toast } = useToast();
  const [originalWord, setOriginalWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [hints, setHints] = useState(3);
  const [isCorrect, setIsCorrect] = useState(false);

  const words = [
    'apple', 'banana', 'orange', 'mango', 'strawberry', 
    'pineapple', 'watermelon', 'grape', 'kiwi', 'peach',
    'coding', 'program', 'developer', 'computer', 'keyboard',
    'react', 'javascript', 'typescript', 'component', 'interface'
  ];

  const scrambleWord = (word: string): string => {
    const characters = word.split('');
    for (let i = characters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [characters[i], characters[j]] = [characters[j], characters[i]];
    }
    
    // Make sure the scrambled word is different from the original
    const scrambled = characters.join('');
    return scrambled === word ? scrambleWord(word) : scrambled;
  };

  const selectRandomWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setOriginalWord(randomWord);
    setScrambledWord(scrambleWord(randomWord));
    setUserGuess('');
    setIsCorrect(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userGuess.toLowerCase() === originalWord.toLowerCase()) {
      toast({
        title: "Correct!",
        description: `Great job! That's the right word.`,
        duration: 3000,
      });
      setScore(score + 1);
      setIsCorrect(true);
      setTimeout(selectRandomWord, 1500);
    } else {
      toast({
        title: "Try again",
        description: "That's not correct. Keep trying!",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const useHint = () => {
    if (hints > 0) {
      const firstLetter = originalWord.charAt(0);
      toast({
        title: "Hint",
        description: `The word starts with "${firstLetter}"`,
        duration: 3000,
      });
      setHints(hints - 1);
    } else {
      toast({
        title: "No hints left",
        description: "You've used all your hints!",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const resetGame = () => {
    setScore(0);
    setHints(3);
    selectRandomWord();
  };

  useEffect(() => {
    selectRandomWord();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Word Scramble</h2>
        <Button
          onClick={resetGame}
          className="bg-care-primary hover:bg-care-secondary"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Reset Game
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-center mb-6">
        <div className="flex justify-center gap-8 text-lg">
          <div>
            <span className="font-semibold">Score:</span> {score}
          </div>
          <div>
            <span className="font-semibold">Hints:</span> {hints}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow text-center">
        <h3 className="text-2xl font-semibold mb-6">Unscramble this word:</h3>
        <div className="text-5xl font-bold tracking-wide mb-8 text-care-primary">
          {scrambledWord}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            value={userGuess}
            onChange={(e) => setUserGuess(e.target.value)}
            placeholder="Your answer..."
            className="text-center text-xl p-6"
            disabled={isCorrect}
          />
          <div className="flex gap-4 justify-center">
            <Button 
              type="submit" 
              className="bg-care-primary hover:bg-care-secondary"
              disabled={isCorrect}
            >
              Submit
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={useHint}
              disabled={hints === 0 || isCorrect}
            >
              <Lightbulb className="mr-2 h-4 w-4" /> Use Hint
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WordScrambleGame;