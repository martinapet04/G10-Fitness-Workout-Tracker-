import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, FontSizes } from '../constants/theme';
import { formatTimer } from '../utils/helpers';

export default function RestTimer({ initialSeconds = 90, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (onComplete) onComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete]);

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsActive(!isActive);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(initialSeconds);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  
  const addTime = (seconds) => {
    setTimeLeft(time => time + seconds);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const progress = initialSeconds > 0 ? timeLeft / initialSeconds : 0;

  return (
    <View style={styles.container}>
      <View style={styles.timerCircle}>
        <Text style={styles.timeText}>{formatTimer(timeLeft)}</Text>
        <Text style={styles.label}>Recupero</Text>
      </View>
      
      <View style={styles.controls}>
        <TouchableOpacity style={styles.iconButton} onPress={resetTimer}>
          <MaterialCommunityIcons name="replay" size={28} color={Colors.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.playButton, isActive && styles.pauseButton]} 
          onPress={toggleTimer}
        >
          <MaterialCommunityIcons 
            name={isActive ? "pause" : "play"} 
            size={36} 
            color={Colors.text} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton} onPress={() => addTime(30)}>
          <Text style={styles.addTimeText}>+30s</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    marginVertical: Spacing.md,
  },
  timerCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  timeText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: Colors.text,
  },
  label: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: -4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  iconButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 25,
  },
  addTimeText: {
    color: Colors.text,
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
  },
  playButton: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 35,
    elevation: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  pauseButton: {
    backgroundColor: Colors.warning,
    shadowColor: Colors.warning,
  },
});
