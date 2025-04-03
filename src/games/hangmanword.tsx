import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const HangmanGame: React.FC = () => {
  const { toast } = useToast();
  const [word, setWord] = useState('');
  const [maskedWord, setMaskedWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [category, setCategory] = useState('');
  
  const maxIncorrectGuesses = 6;
  
  const categories = {
    animals: ['elephant', 'giraffe', 'penguin', 'kangaroo', 'dolphin', 'butterfly', 'crocodile'],
    fruits: ['strawberry', 'pineapple', 'watermelon', 'blueberry', 'kiwifruit', 'dragonfruit'],
    countries: ['australia', 'brazil', 'canada', 'germany', 'japan', 'mexico', 'switzerland'],
    programming: ['javascript', 'python', 'typescript', 'react', 'component', 'function', 'variable']
  };
  
  const getRandomWord = () => {
    const categoryKeys = Object.keys(categories) as Array<keyof typeof categories>;
    const randomCategory = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
    const words = categories[randomCategory];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    setCategory(randomCategory);
    return randomWord;
  };
  
  const initializeGame = () => {
    const newWord = getRandomWord();
    setWord(newWord);
    setMaskedWord('_'.repeat(newWord.length));
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setGameStatus('playing');
  };
  
  const handleLetterGuess = (letter: string) => {
    if (gameStatus !== 'playing' || guessedLetters.includes(letter)) {
      return;
    }
    
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    
    if (word.includes(letter)) {
      // Update masked word
      let newMasked = '';
      for (let i = 0; i < word.length; i++) {
        if (word[i] === letter) {
          newMasked += letter;
        } else {
          newMasked += maskedWord[i];
        }
      }
      setMaskedWord(newMasked);
      
      // Check if won
      if (!newMasked.includes('_')) {
        setGameStatus('won');
        toast({
          title: "You win!",
          description: `Congratulations! You guessed the word: ${word}`,
          duration: 5000,
        });
      }
    } else {
      // Incorrect guess
      const newIncorrectGuesses = incorrectGuesses + 1;
      setIncorrectGuesses(newIncorrectGuesses);
      
      // Check if lost
      if (newIncorrectGuesses >= maxIncorrectGuesses) {
        setGameStatus('lost');
        toast({
          title: "Game Over",
          description: `You ran out of attempts. The word was: ${word}`,
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  };
  
  const renderHangman = () => {
    switch (incorrectGuesses) {
      case 0:
        return (
          <pre className="font-mono text-lg">
            {`
              +---+
              |   |
                  |
                  |
                  |
                  |
            =========
            `}
          </pre>
        );
      case 1:
        return (
          <pre className="font-mono text-lg">
            {`
              +---+
              |   |
              O   |
                  |
                  |
                  |
            =========
            `}
          </pre>
        );
      case 2:
        return (
          <pre className="font-mono text-lg">
            {`
              +---+
              |   |
              O   |
              |   |
                  |
                  |
            =========
            `}
          </pre>
        );
      case 3:
        return (
          <pre className="font-mono text-lg">
            {`
              +---+
              |   |
              O   |
             /|   |
                  |
                  |
            =========
            `}
          </pre>
        );
      case 4:
        return (
          <pre className="font-mono text-lg">
            {`
              +---+
              |   |
              O   |
             /|\\  |
                  |
                  |
            =========
            `}
          </pre>
        );
      case 5:
        return (
          <pre className="font-mono text-lg">
            {`
              +---+
              |   |
              O   |
             /|\\  |
             /    |
                  |
            =========
            `}
          </pre>
        );
      case 6:
        return (
          <pre className="font-mono text-lg">
            {`
              +---+
              |   |
              O   |
             /|\\  |
             / \\  |
                  |
            =========
            `}
          </pre>
        );
      default:
        return null;
    }
  };
  
  useEffect(() => {
    initializeGame();
  }, []);
  
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Hangman</h2>
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
            <span className="font-semibold">Category:</span> {category}
          </div>
          <div>
            <span className="font-semibold">Incorrect Guesses:</span> {incorrectGuesses}/{maxIncorrectGuesses}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-xl font-semibold mb-4">Guess the Word</h3>
          
          <div className="mb-8">
            {renderHangman()}
          </div>
          
          <div className="text-4xl font-mono tracking-widest mb-6">
            {maskedWord.split('').map((char, index) => (
              <span key={index} className="mx-1">{char}</span>
            ))}
          </div>
          
          {gameStatus === 'won' && (
            <div className="text-green-600 font-bold text-xl mb-4">
              You won! 🎉
            </div>
          )}
          
          {gameStatus === 'lost' && (
            <div className="text-red-600 font-bold text-xl mb-4">
              Game Over! The word was: {word}
            </div>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-6 text-center">Select a Letter</h3>
          
          <div className="grid grid-cols-7 gap-2">
            {alphabet.map((letter) => (
              <Button
                key={letter}
                onClick={() => handleLetterGuess(letter)}
                className={`h-12 w-12 ${
                  guessedLetters.includes(letter)
                    ? word.includes(letter)
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                    : 'bg-care-primary hover:bg-care-secondary'
                }`}
                disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
              >
                {letter.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HangmanGame;