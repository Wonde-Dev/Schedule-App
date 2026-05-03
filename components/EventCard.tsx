import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import type { Event, EventPriority } from '@/context/EventContext';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onToggleComplete: () => void;
}

export function EventCard({ event, onPress, onToggleComplete }: EventCardProps) {
  const cardBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');

  const priorityColors: Record<EventPriority, string> = {
    low: Colors.light.success,
    medium: Colors.light.warning,
    high: Colors.light.danger,
  };

  const getPriorityColor = () => {
    return priorityColors[event.priority];
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          backgroundColor: cardBackground,
          borderColor: borderColor,
          opacity: event.completed ? 0.55 : 1,
        },
      ]}>
      <Animated.View 
        entering={FadeIn.duration(200)}
        style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: textColor },
              event.completed && styles.completedTitle,
            ]}
            numberOfLines={1}>
            {event.title}
          </Text>
          <TouchableOpacity onPress={onToggleComplete} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Animated.View 
              style={[
                styles.checkbox, 
                event.completed && styles.checkboxChecked,
                { borderColor: event.completed ? getPriorityColor() : borderColor }
              ]}>
              {event.completed && <Text style={styles.checkmark}>✓</Text>}
            </Animated.View>
          </TouchableOpacity>
        </View>
        {event.description ? (
          <Text style={[styles.description, { color: mutedColor }]} numberOfLines={2}>
            {event.description}
          </Text>
        ) : null}
        <View style={styles.footer}>
          <View style={styles.timeBadge}>
            <Ionicons name="time-outline" size={12} color={mutedColor} />
            <Text style={[styles.time, { color: mutedColor }]}>
              {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </Text>
          </View>
          {event.priority === 'high' && (
            <View style={[styles.priorityBadge, { backgroundColor: `${Colors.light.danger}15` }]}>
              <Text style={[styles.priorityText, { color: Colors.light.danger }]}>!</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priorityIndicator: {
    width: 5,
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.2,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
    opacity: 0.7,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.03)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  time: {
    fontSize: 13,
    fontWeight: '600',
  },
  priorityBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '800',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});
