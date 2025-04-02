
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useTheme } from '../context/ThemeContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { colors, fontSize } = useTheme();

  const features = [
    {
      title: 'Medications',
      icon: <Ionicons name="medical" size={40} color={colors.primary} />,
      screen: 'Medication',
      description: 'Track and manage your medications',
    },
    {
      title: 'Emergency',
      icon: <MaterialCommunityIcons name="phone-alert" size={40} color={colors.error} />,
      screen: 'Emergency',
      description: 'Emergency contacts and SOS',
    },
    {
      title: 'Memory Games',
      icon: <Ionicons name="brain" size={40} color={colors.primary} />,
      screen: 'Games',
      description: 'Keep your mind active',
    },
    {
      title: 'Find Pharmacy',
      icon: <MaterialCommunityIcons name="pharmacy" size={40} color={colors.primary} />,
      screen: 'Pharmacy',
      description: 'Locate nearby pharmacies',
    },
    {
      title: 'Video Call',
      icon: <Ionicons name="videocam" size={40} color={colors.primary} />,
      screen: 'Telemedicine',
      description: 'Telehealth consultations',
    },
    {
      title: 'Social Club',
      icon: <MaterialCommunityIcons name="account-group" size={40} color={colors.primary} />,
      screen: 'Social',
      description: 'Connect with others',
    },
    {
      title: 'Mental Health',
      icon: <Ionicons name="heart" size={40} color={colors.primary} />,
      screen: 'MentalHealth',
      description: 'Support and resources',
    },
    {
      title: 'My Profile',
      icon: <Ionicons name="person" size={40} color={colors.primary} />,
      screen: 'Profile',
      description: 'View and edit your profile',
    },
  ];

  const handleSOSPress = () => {
    Alert.alert(
      'Emergency SOS',
      'Do you want to trigger the emergency SOS?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call Emergency',
          onPress: () => {
            // In a real app, this would trigger emergency calls and SMS
            Alert.alert('SOS Triggered', 'Emergency services are being contacted and caregivers notified');
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  const speakGreeting = () => {
    const greeting = `Welcome to Caring Voice Haven. How can I help you today?`;
    Speech.speak(greeting, {
      language: 'en',
      pitch: 1.0,
      rate: 0.9,
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text, fontSize: fontSize.large }]}>
          Welcome, Sara
        </Text>
        <TouchableOpacity onPress={speakGreeting} style={styles.voiceButton}>
          <Ionicons name="volume-high" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.reminderContainer}>
        <View style={[styles.reminder, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="notifications" size={24} color={colors.primary} style={styles.reminderIcon} />
          <View>
            <Text style={[styles.reminderTitle, { color: colors.text, fontSize: fontSize.medium }]}>
              Today's Reminders
            </Text>
            <Text style={[styles.reminderText, { color: colors.text, fontSize: fontSize.small }]}>
              Take Vitamin D at 8:00 AM
            </Text>
            <Text style={[styles.reminderText, { color: colors.text, fontSize: fontSize.small }]}>
              Blood pressure medicine at 9:00 AM
            </Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => navigation.navigate(feature.screen)}
            >
              <View style={styles.featureIconContainer}>{feature.icon}</View>
              <Text style={[styles.featureTitle, { color: colors.text, fontSize: fontSize.medium }]}>
                {feature.title}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.text, fontSize: fontSize.small }]}>
                {feature.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.sosButton, { backgroundColor: colors.error }]}
        onPress={handleSOSPress}
      >
        <Ionicons name="alert-circle" size={32} color="#FFFFFF" />
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontWeight: 'bold',
  },
  voiceButton: {
    padding: 8,
  },
  reminderContainer: {
    marginBottom: 20,
  },
  reminder: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  reminderIcon: {
    marginRight: 16,
  },
  reminderTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reminderText: {
    marginBottom: 2,
  },
  scrollView: {
    flex: 1,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 80, // Make room for the SOS button
  },
  featureCard: {
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
  featureIconContainer: {
    marginBottom: 12,
  },
  featureTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  featureDescription: {
    textAlign: 'center',
    opacity: 0.7,
  },
  sosButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sosText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginTop: 2,
  },
});

export default HomeScreen;
