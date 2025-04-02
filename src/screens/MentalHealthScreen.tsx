
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Mock AI responses for demonstration
const AI_RESPONSES = {
  'feeling sad': "I'm sorry to hear that you're feeling sad. Remember that it's okay to feel this way sometimes. Would you like some suggestions for activities that might help lift your mood?",
  'feeling anxious': "Anxiety can be challenging. Let's try a quick breathing exercise: breathe in for 4 counts, hold for 2, and exhale for 6. Would you like to explore some more techniques for managing anxiety?",
  'trouble sleeping': "Sleep issues can be frustrating. Some tips that might help include establishing a regular sleep schedule, avoiding screens before bed, and creating a calm environment. Would you like more specific suggestions?",
  'feeling lonely': "Feeling lonely is a common experience. Consider reaching out to a friend or family member, joining a local community group, or participating in our Virtual Social Club. Human connection is important for our wellbeing.",
  'meditation': "Meditation can be very beneficial for mental health. Would you like me to guide you through a short 5-minute meditation exercise right now?",
  'hello': "Hello there! I'm your mental health companion. How are you feeling today?",
  'help': "I'm here to provide mental health support and resources. You can talk about how you're feeling, ask for coping strategies, or learn about managing stress, anxiety, depression, or other mental health concerns."
};

const MoodButton = ({ mood, icon, selected, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.moodButton,
        { 
          backgroundColor: selected ? colors.primary : colors.card,
          borderColor: colors.border
        }
      ]}
      onPress={onPress}
    >
      <Ionicons 
        name={icon} 
        size={24} 
        color={selected ? '#FFFFFF' : colors.text} 
      />
      <Text 
        style={[
          styles.moodButtonText, 
          { color: selected ? '#FFFFFF' : colors.text }
        ]}
      >
        {mood}
      </Text>
    </TouchableOpacity>
  );
};

const ResourceCard = ({ title, description, icon }) => {
  const { colors, fontSize } = useTheme();
  
  return (
    <TouchableOpacity style={[styles.resourceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name={icon} size={24} color={colors.primary} style={styles.resourceIcon} />
      <View style={styles.resourceContent}>
        <Text style={[styles.resourceTitle, { color: colors.text, fontSize: fontSize.medium }]}>
          {title}
        </Text>
        <Text style={[styles.resourceDescription, { color: colors.text, fontSize: fontSize.small }]}>
          {description}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text} />
    </TouchableOpacity>
  );
};

const ChatBubble = ({ message, isUser }) => {
  const { colors, fontSize } = useTheme();
  
  return (
    <View style={[
      styles.chatBubble,
      isUser ? styles.userBubble : styles.aiBubble,
      { 
        backgroundColor: isUser ? colors.primary : colors.card,
        borderColor: isUser ? colors.primary : colors.border
      }
    ]}>
      <Text style={[
        styles.chatText,
        { 
          color: isUser ? '#FFFFFF' : colors.text,
          fontSize: fontSize.medium
        }
      ]}>
        {message.text}
      </Text>
    </View>
  );
};

const MentalHealthScreen = () => {
  const { colors, fontSize } = useTheme();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedMood, setSelectedMood] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', text: 'Hello! I\'m your mental health companion. How are you feeling today?', isUser: false },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef(null);
  
  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (flatListRef.current && chatMessages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);
  
  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
    
    // Add user's mood as a message
    const userMessage = { id: Date.now().toString(), text: `I'm feeling ${mood} today`, isUser: true };
    setChatMessages([...chatMessages, userMessage]);
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      let response;
      switch (mood) {
        case 'Great':
          response = "I'm glad to hear you're feeling great today! That's wonderful. Is there anything specific that contributed to your positive mood?";
          break;
        case 'Good':
          response = "It's good to hear you're feeling well! Maintaining a positive outlook can help with overall wellbeing. Any highlights from your day so far?";
          break;
        case 'Okay':
          response = "Sometimes feeling okay is just fine. Is there anything on your mind that you'd like to talk about or any way I can support you today?";
          break;
        case 'Sad':
          response = "I'm sorry to hear you're feeling sad. Remember that it's okay to feel this way sometimes. Would you like to talk about what's causing this feeling?";
          break;
        case 'Stressed':
          response = "Stress can be challenging to manage. Would you like some simple relaxation techniques that might help reduce your stress levels?";
          break;
        default:
          response = "Thank you for sharing how you're feeling. I'm here to listen and support you.";
      }
      
      const aiMessage = { id: (Date.now() + 1).toString(), text: response, isUser: false };
      setChatMessages([...chatMessages, userMessage, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleSendMessage = () => {
    if (chatInput.trim() === '') return;
    
    // Add user message
    const userMessage = { id: Date.now().toString(), text: chatInput, isUser: true };
    setChatMessages([...chatMessages, userMessage]);
    
    // Clear input
    setChatInput('');
    
    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      let response = "I understand you're sharing something important. I'm here to listen and support you. Can you tell me more about how you're feeling?";
      
      // Check for known keywords
      const lowerCaseInput = chatInput.toLowerCase();
      for (const keyword in AI_RESPONSES) {
        if (lowerCaseInput.includes(keyword)) {
          response = AI_RESPONSES[keyword];
          break;
        }
      }
      
      const aiMessage = { id: (Date.now() + 1).toString(), text: response, isUser: false };
      setChatMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const renderChatTab = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.chatContainer}
      keyboardVerticalOffset={100}
    >
      <View style={styles.moodTrackerContainer}>
        <Text style={[styles.moodPrompt, { color: colors.text, fontSize: fontSize.medium }]}>
          How are you feeling today?
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodButtonsScroll}>
          <MoodButton 
            mood="Great" 
            icon="happy" 
            selected={selectedMood === 'Great'} 
            onPress={() => handleMoodSelection('Great')}
          />
          <MoodButton 
            mood="Good" 
            icon="smile" 
            selected={selectedMood === 'Good'} 
            onPress={() => handleMoodSelection('Good')}
          />
          <MoodButton 
            mood="Okay" 
            icon="help-circle" 
            selected={selectedMood === 'Okay'} 
            onPress={() => handleMoodSelection('Okay')}
          />
          <MoodButton 
            mood="Sad" 
            icon="sad" 
            selected={selectedMood === 'Sad'} 
            onPress={() => handleMoodSelection('Sad')}
          />
          <MoodButton 
            mood="Stressed" 
            icon="flash" 
            selected={selectedMood === 'Stressed'} 
            onPress={() => handleMoodSelection('Stressed')}
          />
        </ScrollView>
      </View>
    
      <FlatList
        ref={flatListRef}
        data={chatMessages}
        renderItem={({ item }) => <ChatBubble message={item} isUser={item.isUser} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
      />
      
      {isTyping && (
        <View style={[styles.typingIndicator, { backgroundColor: colors.card }]}>
          <Text style={{ color: colors.text }}>AI assistant is typing</Text>
          <ActivityIndicator size="small" color={colors.primary} style={styles.typingDots} />
        </View>
      )}
      
      <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          style={[styles.textInput, { color: colors.text, backgroundColor: colors.background }]}
          placeholder="Type your message..."
          placeholderTextColor="gray"
          value={chatInput}
          onChangeText={setChatInput}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSendMessage}
        >
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
  
  const renderResourcesTab = () => (
    <ScrollView style={styles.resourcesContainer}>
      <View style={styles.resourceSection}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.medium }]}>
          Guided Meditations
        </Text>
        
        <ResourceCard
          title="5-Minute Breathing Exercise"
          description="A quick meditation for stress relief"
          icon="cloud"
        />
        <ResourceCard
          title="Sleep Meditation"
          description="Gentle guidance to help you fall asleep"
          icon="moon"
        />
        <ResourceCard
          title="Morning Mindfulness"
          description="Start your day with clarity and purpose"
          icon="sunny"
        />
      </View>
      
      <View style={styles.resourceSection}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.medium }]}>
          Mental Health Articles
        </Text>
        
        <ResourceCard
          title="Understanding Anxiety"
          description="Learn about symptoms and coping strategies"
          icon="information-circle"
        />
        <ResourceCard
          title="Improving Sleep Habits"
          description="Tips for better sleep quality"
          icon="bed"
        />
        <ResourceCard
          title="Building Resilience"
          description="Techniques to bounce back from challenges"
          icon="trending-up"
        />
      </View>
      
      <View style={styles.resourceSection}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.medium }]}>
          Crisis Support
        </Text>
        
        <ResourceCard
          title="Crisis Helpline"
          description="24/7 support for urgent mental health needs"
          icon="call"
        />
        <ResourceCard
          title="Find a Therapist"
          description="Connect with mental health professionals"
          icon="people"
        />
      </View>
    </ScrollView>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: fontSize.large }]}>
        Mental Health Support
      </Text>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'chat' && [styles.activeTab, { borderColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.text, fontSize: fontSize.medium },
              activeTab === 'chat' && { color: colors.primary, fontWeight: 'bold' }
            ]}
          >
            AI Chatbot
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'resources' && [styles.activeTab, { borderColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('resources')}
        >
          <Text
            style={[
              styles.tabText,
              { color: colors.text, fontSize: fontSize.medium },
              activeTab === 'resources' && { color: colors.primary, fontWeight: 'bold' }
            ]}
          >
            Resources
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'chat' ? renderChatTab() : renderResourcesTab()}
    </View>
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
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontWeight: '500',
  },
  chatContainer: {
    flex: 1,
  },
  moodTrackerContainer: {
    marginBottom: 16,
  },
  moodPrompt: {
    fontWeight: '500',
    marginBottom: 8,
  },
  moodButtonsScroll: {
    flexDirection: 'row',
  },
  moodButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    minWidth: 80,
  },
  moodButtonText: {
    marginTop: 4,
    fontWeight: '500',
  },
  chatList: {
    paddingVertical: 8,
  },
  chatBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderTopRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderTopLeftRadius: 4,
  },
  chatText: {
    lineHeight: 20,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 8,
    borderRadius: 16,
    marginBottom: 8,
  },
  typingDots: {
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resourcesContainer: {
    flex: 1,
  },
  resourceSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  resourceIcon: {
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resourceDescription: {
    opacity: 0.7,
  },
});

export default MentalHealthScreen;
