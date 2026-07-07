import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';

export default function SearchBar({ value, onChangeText, placeholder = "Cerca..." }) {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="magnify" size={24} color={Colors.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        autoCorrect={false}
      />
      {value.length > 0 && (
        <MaterialCommunityIcons 
          name="close-circle" 
          size={20} 
          color={Colors.textMuted} 
          style={styles.clearIcon}
          onPress={() => onChangeText('')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.round,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginVertical: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSizes.md,
    height: '100%',
  },
  clearIcon: {
    padding: Spacing.xs,
  }
});
