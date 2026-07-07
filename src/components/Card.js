import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, BorderRadius, Spacing } from '../constants/theme';

export default function Card({ children, style, onPress, noPadding = false }) {
  const Container = onPress ? TouchableOpacity : View;
  
  return (
    <Container 
      style={[
        styles.card, 
        !noPadding && styles.padding,
        style
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginVertical: Spacing.xs,
    overflow: 'hidden',
  },
  padding: {
    padding: Spacing.md,
  }
});
