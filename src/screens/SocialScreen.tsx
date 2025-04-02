
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, FlatList } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Mock data for groups and events
const SOCIAL_GROUPS = [
  {
    id: '1',
    name: 'Book Club',
    members: 24,
    description: 'Weekly discussions on interesting books and novels',
    nextMeeting: 'Wednesday, 3:00 PM',
    image: 'https://source.unsplash.com/random/300x200/?books'
  },
  {
    id: '2',
    name: 'Gardening Group',
    members: 18,
    description: 'Tips and tricks for home gardening and plant care',
    nextMeeting: 'Saturday, 10:00 AM',
    image: 'https://source.unsplash.com/random/300x200/?garden'
  },
  {
    id: '3',
    name: 'Morning Yoga',
    members: 15,
    description: 'Gentle yoga sessions suitable for seniors',
    nextMeeting: 'Monday, 9:00 AM',
    image: 'https://source.unsplash.com/random/300x200/?yoga'
  },
  {
    id: '4',
    name: 'Chess Club',
    members: 12,
    description: 'Challenge your mind with strategic chess games',
    nextMeeting: 'Thursday, 2:00 PM',
    image: 'https://source.unsplash.com/random/300x200/?chess'
  },
  {
    id: '5',
    name: 'Music Appreciation',
    members: 20,
    description: 'Sharing and enjoying music together',
    nextMeeting: 'Friday, 4:00 PM',
    image: 'https://source.unsplash.com/random/300x200/?music'
  }
];

const UPCOMING_EVENTS = [
  {
    id: '1',
    title: 'Virtual Art Exhibition',
    date: 'June 15, 2023',
    time: '2:00 PM - 4:00 PM',
    participants: 35,
    image: 'https://source.unsplash.com/random/300x200/?art'
  },
  {
    id: '2',
    title: 'Movie Night: Classic Cinema',
    date: 'June 18, 2023',
    time: '7:00 PM - 9:30 PM',
    participants: 28,
    image: 'https://source.unsplash.com/random/300x200/?cinema'
  },
  {
    id: '3',
    title: 'Digital Photography Workshop',
    date: 'June 22, 2023',
    time: '10:00 AM - 11:30 AM',
    participants: 18,
    image: 'https://source.unsplash.com/random/300x200/?camera'
  }
];

// Mock group chat messages
const GROUP_CHAT_MESSAGES = [
  {
    id: '1',
    sender: 'Martha Johnson',
    message: 'Has anyone read the new mystery novel by James Patterson?',
    time: '10:30 AM',
    avatar: 'https://source.unsplash.com/random/100x100/?woman'
  },
  {
    id: '2',
    sender: 'Robert Williams',
    message: 'Yes, I just finished it. I think you\'ll enjoy the twist at the end!',
    time: '10:35 AM',
    avatar: 'https://source.unsplash.com/random/100x100/?man'
  },
  {
    id: '3',
    sender: 'Susan Miller',
    message: 'I\'m planning to start it this weekend. No spoilers please!',
    time: '10:42 AM',
    avatar: 'https://source.unsplash.com/random/100x100/?woman2'
  },
  {
    id: '4',
    sender: 'You',
    message: 'I\'ve heard great things about it. Can\'t wait to discuss at our next meeting.',
    time: '10:45 AM',
    isCurrentUser: true
  }
];

const SocialGroup = ({ group, onPress }) => {
  const { colors, fontSize } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.groupCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <Image source={{ uri: group.image }} style={styles.groupImage} />
      <View style={styles.groupInfo}>
        <Text style={[styles.groupName, { color: colors.text, fontSize: fontSize.medium }]}>
          {group.name}
        </Text>
        <Text style={[styles.groupMembers, { color: colors.text, fontSize: fontSize.small }]}>
          <Ionicons name="people" size={14} color={colors.primary} /> {group.members} members
        </Text>
        <Text style={[styles.groupDescription, { color: colors.text, fontSize: fontSize.small }]}>
          {group.description}
        </Text>
        <View style={styles.meetingInfo}>
          <Ionicons name="calendar" size={14} color={colors.primary} />
          <Text style={[styles.meetingText, { color: colors.text, fontSize: fontSize.small }]}>
            Next: {group.nextMeeting}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EventCard = ({ event, onPress }) => {
  const { colors, fontSize } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <Text style={[styles.eventTitle, { color: colors.text, fontSize: fontSize.medium }]}>
          {event.title}
        </Text>
        <View style={styles.eventDetail}>
          <Ionicons name="calendar" size={14} color={colors.primary} />
          <Text style={[styles.eventDetailText, { color: colors.text, fontSize: fontSize.small }]}>
            {event.date}
          </Text>
        </View>
        <View style={styles.eventDetail}>
          <Ionicons name="time" size={14} color={colors.primary} />
          <Text style={[styles.eventDetailText, { color: colors.text, fontSize: fontSize.small }]}>
            {event.time}
          </Text>
        </View>
        <View style={styles.eventDetail}>
          <Ionicons name="people" size={14} color={colors.primary} />
          <Text style={[styles.eventDetailText, { color: colors.text, fontSize: fontSize.small }]}>
            {event.participants} attending
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.joinButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.joinButtonText}>Join Event</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const ChatMessage = ({ message }) => {
  const { colors, fontSize } = useTheme();
  
  return (
    <View style={[
      styles.messageContainer,
      message.isCurrentUser ? styles.userMessage : styles.otherMessage
    ]}>
      {!message.isCurrentUser && (
        <Image source={{ uri: message.avatar }} style={styles.messageAvatar} />
      )}
      <View style={[
        styles.messageBubble,
        message.isCurrentUser 
          ? [styles.userBubble, { backgroundColor: colors.primary }]
          : [styles.otherBubble, { backgroundColor: colors.card, borderColor: colors.border }]
      ]}>
        {!message.isCurrentUser && (
          <Text style={[styles.messageSender, { color: colors.primary, fontSize: fontSize.small }]}>
            {message.sender}
          </Text>
        )}
        <Text style={[
          styles.messageText,
          { color: message.isCurrentUser ? '#FFFFFF' : colors.text, fontSize: fontSize.medium }
        ]}>
          {message.message}
        </Text>
        <Text style={[
          styles.messageTime,
          { 
            color: message.isCurrentUser ? 'rgba(255,255,255,0.7)' : colors.text,
            fontSize: fontSize.xsmall
          }
        ]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
};

const SocialScreen = () => {
  const { colors, fontSize } = useTheme();
  const [activeTab, setActiveTab] = useState('groups');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  const renderGroupDetails = () => (
    <View style={styles.groupDetailsContainer}>
      <View style={[styles.groupHeader, { backgroundColor: colors.card }]}>
        <Image source={{ uri: selectedGroup.image }} style={styles.groupDetailImage} />
        <View style={styles.groupHeaderInfo}>
          <Text style={[styles.groupDetailName, { color: colors.text, fontSize: fontSize.large }]}>
            {selectedGroup.name}
          </Text>
          <Text style={[styles.groupDetailMembers, { color: colors.text, fontSize: fontSize.small }]}>
            <Ionicons name="people" size={16} color={colors.primary} /> {selectedGroup.members} members
          </Text>
          <TouchableOpacity
            style={[styles.videoCallButton, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="videocam" size={20} color="#FFFFFF" />
            <Text style={styles.videoCallButtonText}>Start Video Call</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={[styles.chatSectionTitle, { color: colors.text, fontSize: fontSize.medium }]}>
        Group Chat
      </Text>
      
      <FlatList
        data={GROUP_CHAT_MESSAGES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatMessage message={item} />}
        contentContainerStyle={styles.chatContainer}
      />
      
      <View style={[styles.messageInputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <TextInput
          style={[styles.messageInput, { color: colors.text, backgroundColor: colors.background }]}
          placeholder="Type your message..."
          placeholderTextColor="gray"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: colors.primary }]}>
          <Ionicons name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {selectedGroup ? (
        <>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => setSelectedGroup(null)}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            <Text style={styles.backButtonText}>Back to Groups</Text>
          </TouchableOpacity>
          
          {renderGroupDetails()}
        </>
      ) : (
        <>
          <Text style={[styles.title, { color: colors.text, fontSize: fontSize.large }]}>
            Virtual Social Club
          </Text>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'groups' && [styles.activeTab, { borderColor: colors.primary }]
              ]}
              onPress={() => setActiveTab('groups')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'groups' && [styles.activeTabText, { color: colors.primary }],
                { color: colors.text, fontSize: fontSize.medium }
              ]}>
                Groups
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'events' && [styles.activeTab, { borderColor: colors.primary }]
              ]}
              onPress={() => setActiveTab('events')}
            >
              <Text style={[
                styles.tabText,
                activeTab === 'events' && [styles.activeTabText, { color: colors.primary }],
                { color: colors.text, fontSize: fontSize.medium }
              ]}>
                Events
              </Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView showsVerticalScrollIndicator={false}>
            {activeTab === 'groups' ? (
              <>
                <View style={styles.searchContainer}>
                  <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                      style={[styles.searchInput, { color: colors.text }]}
                      placeholder="Search social groups..."
                      placeholderTextColor="gray"
                    />
                  </View>
                </View>
                
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.medium }]}>
                    Your Groups
                  </Text>
                  
                  {SOCIAL_GROUPS.map((group) => (
                    <SocialGroup 
                      key={group.id} 
                      group={group} 
                      onPress={() => setSelectedGroup(group)}
                    />
                  ))}
                  
                  <TouchableOpacity
                    style={[styles.createGroupButton, { backgroundColor: colors.primary }]}
                  >
                    <Ionicons name="add-circle" size={20} color="#FFFFFF" />
                    <Text style={styles.createGroupButtonText}>Create New Group</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text, fontSize: fontSize.medium }]}>
                  Upcoming Events
                </Text>
                
                {UPCOMING_EVENTS.map((event) => (
                  <EventCard key={event.id} event={event} onPress={() => {}} />
                ))}
              </View>
            )}
          </ScrollView>
        </>
      )}
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
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  groupCard: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  groupImage: {
    width: '100%',
    height: 120,
  },
  groupInfo: {
    padding: 12,
  },
  groupName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupMembers: {
    marginBottom: 8,
  },
  groupDescription: {
    marginBottom: 8,
  },
  meetingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  eventCard: {
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: 12,
  },
  eventTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  eventDetailText: {
    marginLeft: 6,
  },
  joinButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  createGroupButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
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
  groupDetailsContainer: {
    flex: 1,
  },
  groupHeader: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  groupDetailImage: {
    width: '100%',
    height: 140,
  },
  groupHeaderInfo: {
    padding: 16,
  },
  groupDetailName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  groupDetailMembers: {
    marginBottom: 12,
  },
  videoCallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
  },
  videoCallButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  chatSectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  chatContainer: {
    paddingBottom: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  otherBubble: {
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  messageSender: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  messageText: {
    marginBottom: 4,
  },
  messageTime: {
    alignSelf: 'flex-end',
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
  },
  messageInput: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SocialScreen;
