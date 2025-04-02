
import React, { useState, useEffect } from 'react';
import { Dices, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface Card {
  id: number;
  content: string;
  flipped: boolean;
  matched: boolean;
}

const MemoryGame: React.FC = () => {
  const { toast } = useToast();
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);

  const emoji = ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒'];

  const initializeGame = () => {
    // Select 6 random emoji for 12 cards (pairs)
    const randomEmoji = [...emoji].sort(() => 0.5 - Math.random()).slice(0, 6);
    
    // Create pairs
    const cardPairs = [...randomEmoji, ...randomEmoji];
    
    // Shuffle
    const shuffledCards = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((content, index) => ({
        id: index,
        content,
        flipped: false,
        matched: false,
      }));
      
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameStarted(true);
  };

  const handleCardClick = (id: number) => {
    // Ignore if already two cards flipped or this card is already flipped or matched
    if (
      flippedCards.length === 2 ||
      cards[id].flipped ||
      cards[id].matched
    ) {
      return;
    }

    // Flip the card
    const newCards = [...cards];
    newCards[id].flipped = true;
    setCards(newCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);
    
    // Check for match if this is the second card
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstId, secondId] = newFlippedCards;
      if (cards[firstId].content === cards[secondId].content) {
        // Match found
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstId].matched = true;
          matchedCards[secondId].matched = true;
          setCards(matchedCards);
          setFlippedCards([]);
          setMatches(matches + 1);
          
          // Check if game is complete
          if (matches + 1 === cards.length / 2) {
            toast({
              title: "Congratulations!",
              description: `You completed the game in ${moves + 1} moves!`,
              duration: 5000,
            });
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstId].flipped = false;
          resetCards[secondId].flipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    // Initialize the game when component first loads
    initializeGame();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in mt-4 md:ml-64">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Memory Game</h2>
        <Button
          onClick={initializeGame}
          className="bg-care-primary hover:bg-care-secondary"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Restart Game
        </Button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow text-center mb-6">
        <div className="flex justify-center gap-8 text-lg">
          <div>
            <span className="font-semibold">Moves:</span> {moves}
          </div>
          <div>
            <span className="font-semibold">Matches:</span> {matches} of {cards.length / 2}
          </div>
        </div>
      </div>

      {!gameStarted ? (
        <div className="text-center p-12">
          <Dices className="mx-auto h-16 w-16 text-care-primary mb-4" />
          <h3 className="text-2xl font-semibold mb-4">Ready to play?</h3>
          <Button
            onClick={initializeGame}
            size="lg"
            className="bg-care-primary hover:bg-care-secondary"
          >
            Start Game
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`aspect-square flex items-center justify-center text-4xl rounded-lg shadow cursor-pointer transition-all transform ${
                card.flipped || card.matched
                  ? "bg-white rotate-0"
                  : "bg-care-primary text-white rotate-y-180"
              } ${card.matched ? "bg-green-100" : ""} hover:scale-105`}
              onClick={() => handleCardClick(card.id)}
            >
              {card.flipped || card.matched ? card.content : "?"}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
