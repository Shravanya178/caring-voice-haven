
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const MentalHealthScreen = () => {
  const { colors, fontSize } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text, fontSize: fontSize.large }]}>
        Mental Health Support
      </Text>
      <Text style={[styles.subtitle, { color: colors.text, fontSize: fontSize.medium }]}>
        AI chatbot and resources coming soon
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default MentalHealthScreen;
