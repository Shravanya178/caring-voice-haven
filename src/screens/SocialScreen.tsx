
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Define interfaces
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  participants: number;
  image?: string;
}

interface Community {
  id: string;
  name: string;
  members: number;
  description: string;
  image?: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isUser: boolean;
}

const SocialScreen = () => {
  const { colors, fontSize } = useTheme();
  const [activeTab, setActiveTab] = useState('events');
  
  // Sample events data
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Virtual Bingo Night',
      date: 'Tomorrow',
      time: '7:00 PM',
      participants: 18
    },
    {
      id: '2',
      title: 'Book Club Discussion',
      date: 'Wed, Apr 12',
      time: '3:00 PM',
      participants: 12
    },
    {
      id: '3',
      title: 'Chair Yoga Class',
      date: 'Fri, Apr 14',
      time: '10:00 AM',
      participants: 24
    }
  ]);
  
  // Sample communities data
  const [communities] = useState<Community[]>([
    {
      id: '1',
      name: 'Photography Enthusiasts',
      members: 156,
      description: 'Share and discuss photography tips and favorite photos'
    },
    {
      id: '2',
      name: 'Gardening Club',
      members: 203,
      description: 'Discuss gardening tips, plant care, and seasonal planting'
    },
    {
      id: '3',
      name: 'Book Lovers',
      members: 178,
      description: 'Discussions about books, authors, and reading recommendations'
    }
  ]);
  
  // Sample chat messages
  const [messages] = useState<Message[]>([
    {
      id: '1',
      sender: 'John Smith',
      text: 'Hello everyone! How is everyone doing today?',
      time: '10:15 AM',
      isUser: false
    },
    {
      id: '2',
      sender: 'Mary Johnson',
      text: 'I'm doing great, thanks for asking! Looking forward to the bingo night tomorrow.',
      time: '10:18 AM',
      isUser: false
    },
    {
      id: '3',
      sender: 'You',
      text: 'I'm excited for bingo night too! Does anyone know if we need to prepare anything?',
      time: '10:22 AM',
      isUser: true
    },
    {
      id: '4',
      sender: 'Robert Davis',
      text: 'Just bring your enthusiasm! Everything else will be provided by the host.',
      time: '10:25 AM',
      isUser: false
    }
  ]);
  
  const [messageInput, setMessageInput] = useState('');
  
  // Render an event card
  const renderEventCard = (event: Event) => (
    <TouchableOpacity 
      key={event.id} 
      style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.eventHeader}>
        <Text style={[styles.eventTitle, { color: colors.text, fontSize: fontSize.medium }]}>
          {event.title}
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.badgeText, { fontSize: fontSize.small }]}>
            {event.participants} attending
          </Text>
        </View>
      </View>
      
      <View style={styles.eventDetails}>
        <View style={styles.eventDetail}>
          <Ionicons name="calendar" size={16} color={colors.text} style={styles.eventIcon} />
          <Text style={[styles.eventDetailText, { color: colors.text, fontSize: fontSize.small }]}>
            {event.date}
          </Text>
        </View>
        <View style={styles.eventDetail}>
          <Ionicons name="time" size={16} color={colors.text} style={styles.eventIcon} />
          <Text style={[styles.eventDetailText, { color: colors.text, fontSize: fontSize.small }]}>
            {event.time}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.joinButton, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.joinButtonText, { fontSize: fontSize.small }]}>
          Join Event
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  // Render a community card
  const renderCommunityCard = (community: Community) => (
    <TouchableOpacity 
      key={community.id} 
      style={[styles.communityCard, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.communityHeader}>
        <Text style={[styles.communityTitle, { color: colors.text, fontSize: fontSize.medium }]}>
          {community.name}
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.badgeText, { fontSize: fontSize.small }]}>
            {community.members} members
          </Text>
        </View>
      </View>
      
      <Text style={[styles.communityDescription, { color: colors.text, fontSize: fontSize.small }]}>
        {community.description}
      </Text>
      
      <TouchableOpacity 
        style={[styles.joinButton, { backgroundColor: colors.secondary }]}
      >
        <Text style={[styles.joinButtonText, { fontSize: fontSize.small }]}>
          Join Community
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  // Render a chat message
  const renderChatMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isUser ? styles.userMessageContainer : styles.otherMessageContainer
    ]}>
      {!item.isUser && (
        <View style={styles.messageSender}>
          <Text style={[styles.senderName, { color: colors.text, fontSize: fontSize.small }]}>
            {item.sender}
          </Text>
        </View>
      )}
      
      <View style={[
        styles.messageContent,
        item.isUser 
          ? { backgroundColor: colors.primary } 
          : { backgroundColor: colors.card, borderColor: colors.border }
      ]}>
        <Text style={[
          styles.messageText, 
          { color: item.isUser ? '#FFFFFF' : colors.text, fontSize: fontSize.small }
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.messageTime, 
          { color: item.isUser ? 'rgba(255,255,255,0.7)' : colors.text, fontSize: fontSize.small }
        ]}>
          {item.time}
        </Text>
      </View>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.text, fontSize: fontSize.large }]}>
        Virtual Social Club
      </Text>
      
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'events' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('events')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'events' ? colors.primary : colors.text, fontSize: fontSize.small }
          ]}>
            Events
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'communities' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('communities')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'communities' ? colors.primary : colors.text, fontSize: fontSize.small }
          ]}>
            Communities
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'chat' && { borderBottomColor: colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('chat')}
        >
          <Text style={[
            styles.tabText, 
            { color: activeTab === 'chat' ? colors.primary : colors.text, fontSize: fontSize.small }
          ]}>
            Group Chat
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Tab content */}
      {activeTab === 'events' && (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.medium }]}>
              Upcoming Events
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary, fontSize: fontSize.small }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {events.map(event => renderEventCard(event))}
        </ScrollView>
      )}
      
      {activeTab === 'communities' && (
        <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.medium }]}>
              Popular Communities
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary, fontSize: fontSize.small }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>
          
          {communities.map(community => renderCommunityCard(community))}
        </ScrollView>
      )}
      
      {activeTab === 'chat' && (
        <View style={styles.chatContainer}>
          <FlatList
            data={messages}
            renderItem={renderChatMessage}
            keyExtractor={item => item.id}
            style={styles.chatList}
          />
          
          <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              style={[styles.input, { color: colors.text, fontSize: fontSize.small }]}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={messageInput}
              onChangeText={setMessageInput}
            />
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  seeAllText: {
    fontWeight: '500',
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventTitle: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  eventDetails: {
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventIcon: {
    marginRight: 6,
  },
  eventDetailText: {
    opacity: 0.8,
  },
  joinButton: {
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 25,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  communityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  communityTitle: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  communityDescription: {
    marginBottom: 12,
    opacity: 0.8,
  },
  chatContainer: {
    flex: 1,
  },
  chatList: {
    flex: 1,
    marginBottom: 12,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageSender: {
    marginBottom: 4,
  },
  senderName: {
    fontWeight: '500',
  },
  messageContent: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  messageText: {
    marginBottom: 4,
  },
  messageTime: {
    textAlign: 'right',
    fontSize: 10,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 25,
    borderWidth: 1,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SocialScreen;
