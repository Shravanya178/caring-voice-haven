
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const MemoryCard = ({ item, isFlipped, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: isFlipped ? colors.card : colors.primary,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      disabled={isFlipped}
    >
      {isFlipped ? (
        <Text style={[styles.cardText, { color: colors.text }]}>{item.value}</Text>
      ) : (
        <Ionicons name="help" size={30} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  );
};

const WordPuzzle = ({ onComplete }) => {
  const { colors, fontSize } = useTheme();
  const [userAnswer, setUserAnswer] = useState('');
  const [wordPair, setWordPair] = useState({ word: '', scrambled: '' });
  const [isCorrect, setIsCorrect] = useState(null);
  const [showHint, setShowHint] = useState(false);
  
  const wordsList = [
    'sunshine', 'butterfly', 'happiness', 'rainbow', 'garden',
    'mountain', 'friendship', 'laughter', 'melody', 'peaceful'
  ];
  
  const scrambleWord = (word) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join('');
  };
  
  const generateNewWord = () => {
    const randomIndex = Math.floor(Math.random() * wordsList.length);
    const selectedWord = wordsList[randomIndex];
    let scrambledVersion = scrambleWord(selectedWord);
    
    // Make sure the scrambled version is different from the original
    while (scrambledVersion === selectedWord) {
      scrambledVersion = scrambleWord(selectedWord);
    }
    
    setWordPair({ word: selectedWord, scrambled: scrambledVersion });
    setUserAnswer('');
    setIsCorrect(null);
    setShowHint(false);
  };
  
  const checkAnswer = () => {
    if (userAnswer.toLowerCase() === wordPair.word.toLowerCase()) {
      setIsCorrect(true);
      setTimeout(() => {
        onComplete && onComplete();
        generateNewWord();
      }, 1500);
    } else {
      setIsCorrect(false);
    }
  };
  
  useEffect(() => {
    generateNewWord();
  }, []);
  
  return (
    <View style={styles.puzzleContainer}>
      <Text style={[styles.puzzleTitle, { color: colors.text, fontSize: fontSize.large }]}>
        Unscramble the Word
      </Text>
      
      <Text style={[styles.scrambledWord, { color: colors.primary, fontSize: fontSize.xlarge }]}>
        {wordPair.scrambled}
      </Text>
      
      <TouchableOpacity 
        style={styles.hintButton}
        onPress={() => setShowHint(!showHint)}
      >
        <Text style={[styles.hintButtonText, { color: colors.primary }]}>
          {showHint ? 'Hide Hint' : 'Show Hint'}
        </Text>
      </TouchableOpacity>
      
      {showHint && (
        <Text style={[styles.hint, { color: colors.text }]}>
          Hint: The word starts with "{wordPair.word[0]}" and has {wordPair.word.length} letters
        </Text>
      )}
      
      <TouchableOpacity
        style={[styles.answerButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => {
          const letters = wordPair.scrambled.split('');
          setUserAnswer(letters.join(''));
          checkAnswer();
        }}
      >
        <Text style={[styles.answerButtonText, { color: colors.text }]}>
          Reveal Answer
        </Text>
      </TouchableOpacity>
      
      {isCorrect !== null && (
        <Text style={[
          styles.feedbackText,
          { color: isCorrect ? 'green' : 'red' }
        ]}>
          {isCorrect ? 'Correct! Well done!' : 'Not quite right. Try again!'}
        </Text>
      )}
      
      <TouchableOpacity
        style={[styles.newWordButton, { backgroundColor: colors.primary }]}
        onPress={generateNewWord}
      >
        <Text style={styles.newWordButtonText}>
          New Word
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const GamesScreen = () => {
  const { colors, fontSize } = useTheme();
  const [activeGame, setActiveGame] = useState(null);
  const [memoryCards, setMemoryCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  const createMemoryCards = () => {
    const icons = ['heart', 'star', 'flower', 'airplane', 'sunny', 'umbrella', 'planet', 'leaf'];
    let cards = [];
    
    // Create pairs
    icons.forEach((icon, index) => {
      // Add each icon twice (for pairs)
      cards.push({ id: index * 2, value: icon, matched: false });
      cards.push({ id: index * 2 + 1, value: icon, matched: false });
    });
    
    // Shuffle cards
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    
    return cards;
  };
  
  const startMemoryGame = () => {
    setLoading(true);
    setActiveGame('memory');
    setMemoryCards(createMemoryCards());
    setFlippedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameCompleted(false);
    setLoading(false);
  };
  
  const handleCardPress = (cardId) => {
    // Don't do anything if the same card is clicked or if two cards are already flipped
    if (flippedCards.includes(cardId) || flippedCards.length >= 2) {
      return;
    }
    
    // Add the card to flipped cards
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // If we have flipped two cards, check if they match
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      const firstCard = memoryCards.find(card => card.id === firstCardId);
      const secondCard = memoryCards.find(card => card.id === secondCardId);
      
      if (firstCard.value === secondCard.value) {
        // Cards match - add to matched pairs
        setMatchedPairs([...matchedPairs, firstCard.value]);
        setFlippedCards([]);
        
        // Check if all pairs are matched
        if (matchedPairs.length + 1 === memoryCards.length / 2) {
          setGameCompleted(true);
        }
      } else {
        // Cards don't match - flip them back after a delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };
  
  const renderMemoryGame = () => {
    return (
      <View style={styles.memoryGameContainer}>
        <View style={styles.gameInfo}>
          <Text style={[styles.gameInfoText, { color: colors.text, fontSize: fontSize.medium }]}>
            Moves: {moves}
          </Text>
          <Text style={[styles.gameInfoText, { color: colors.text, fontSize: fontSize.medium }]}>
            Matched: {matchedPairs.length} / {memoryCards.length / 2}
          </Text>
        </View>
        
        {gameCompleted ? (
          <View style={styles.completedContainer}>
            <Text style={[styles.completedText, { color: colors.primary, fontSize: fontSize.large }]}>
              Game Completed!
            </Text>
            <Text style={[styles.completedSubtext, { color: colors.text, fontSize: fontSize.medium }]}>
              You completed the game in {moves} moves.
            </Text>
            <TouchableOpacity
              style={[styles.newGameButton, { backgroundColor: colors.primary }]}
              onPress={startMemoryGame}
            >
              <Text style={styles.newGameButtonText}>
                Play Again
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cardsGrid}>
            {memoryCards.map((card) => (
              <MemoryCard
                key={card.id}
                item={card}
                isFlipped={flippedCards.includes(card.id) || matchedPairs.includes(card.value)}
                onPress={() => handleCardPress(card.id)}
              />
            ))}
          </View>
        )}
      </View>
    );
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: fontSize.large }]}>
        Memory Games
      </Text>
      
      {activeGame ? (
        <>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => setActiveGame(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Back to Games</Text>
          </TouchableOpacity>
          
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            activeGame === 'memory' ? (
              renderMemoryGame()
            ) : activeGame === 'word' ? (
              <WordPuzzle onComplete={() => {}} />
            ) : null
          )}
        </>
      ) : (
        <View style={styles.gamesGrid}>
          <TouchableOpacity
            style={[styles.gameOption, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={startMemoryGame}
          >
            <Ionicons name="grid" size={40} color={colors.primary} style={styles.gameIcon} />
            <Text style={[styles.gameTitle, { color: colors.text, fontSize: fontSize.medium }]}>
              Memory Match
            </Text>
            <Text style={[styles.gameDescription, { color: colors.text, fontSize: fontSize.small }]}>
              Find matching pairs of cards
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.gameOption, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => setActiveGame('word')}
          >
            <Ionicons name="text" size={40} color={colors.primary} style={styles.gameIcon} />
            <Text style={[styles.gameTitle, { color: colors.text, fontSize: fontSize.medium }]}>
              Word Scramble
            </Text>
            <Text style={[styles.gameDescription, { color: colors.text, fontSize: fontSize.small }]}>
              Unscramble words to train your brain
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.gameOption, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="calculator" size={40} color={colors.primary} style={styles.gameIcon} />
            <Text style={[styles.gameTitle, { color: colors.text, fontSize: fontSize.medium }]}>
              Math Challenge
            </Text>
            <Text style={[styles.gameDescription, { color: colors.text, fontSize: fontSize.small }]}>
              Coming Soon
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.gameOption, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name="timer" size={40} color={colors.primary} style={styles.gameIcon} />
            <Text style={[styles.gameTitle, { color: colors.text, fontSize: fontSize.medium }]}>
              Reaction Time
            </Text>
            <Text style={[styles.gameDescription, { color: colors.text, fontSize: fontSize.small }]}>
              Coming Soon
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
    marginBottom: 24,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameOption: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  gameIcon: {
    marginBottom: 12,
  },
  gameTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  gameDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  loader: {
    marginTop: 40,
  },
  memoryGameContainer: {
    flex: 1,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gameInfoText: {
    fontWeight: '500',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  completedContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  completedText: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  completedSubtext: {
    marginBottom: 24,
  },
  newGameButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  newGameButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  puzzleContainer: {
    alignItems: 'center',
    padding: 16,
  },
  puzzleTitle: {
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  scrambledWord: {
    fontWeight: 'bold',
    letterSpacing: 4,
    marginBottom: 24,
    padding: 12,
  },
  hintButton: {
    marginBottom: 12,
  },
  hintButtonText: {
    fontWeight: '500',
  },
  hint: {
    marginBottom: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  answerButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  answerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  feedbackText: {
    fontWeight: 'bold',
    marginBottom: 16,
    fontSize: 18,
  },
  newWordButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  newWordButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GamesScreen;
