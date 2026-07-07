import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';

export default function FilterBar({ filters, activeFilter, onSelectFilter }) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <TouchableOpacity
              key={filter.value}
              style={[
                styles.chip,
                isActive && styles.chipActive
              ]}
              onPress={() => onSelectFilter(filter.value)}
            >
              <Text style={[
                styles.chipText,
                isActive && styles.chipTextActive
              ]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xs,
  },
  chip: {
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.round,
    marginHorizontal: Spacing.xs,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  chipText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.primaryLight,
    fontWeight: 'bold',
  },
});
