import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions, ScrollView, Text } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEvents } from '@/context/EventContext';
import { EventCard } from '@/components/EventCard';
import { EventModal } from '@/components/EventModal';
import { format, isToday } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { Event } from '@/context/EventContext';

// Lifestyle category configurations with gradients and emojis
const LIFESTYLE_CATEGORIES = [
  { 
    id: 'gym', 
    name: 'Gym', 
    icon: 'barbell', 
    color: '#EF4444', 
    gradient: ['#EF4444', '#F87171'],
    emoji: '💪',
  },
  { 
    id: 'study', 
    name: 'Study', 
    icon: 'book', 
    color: '#3B82F6', 
    gradient: ['#3B82F6', '#60A5FA'],
    emoji: '📚',
  },
  { 
    id: 'coding', 
    name: 'Code', 
    icon: 'code-slash', 
    color: '#8B5CF6', 
    gradient: ['#8B5CF6', '#A78BFA'],
    emoji: '💻',
  },
  { 
    id: 'video', 
    name: 'Video', 
    icon: 'videocam', 
    color: '#EC4899', 
    gradient: ['#EC4899', '#F472B6'],
    emoji: '🎬',
  },
  { 
    id: 'design', 
    name: 'Design', 
    icon: 'brush', 
    color: '#F59E0B', 
    gradient: ['#F59E0B', '#FBBF24'],
    emoji: '🎨',
  },
  { 
    id: 'chill', 
    name: 'Chill', 
    icon: 'cafe', 
    color: '#10B981', 
    gradient: ['#10B981', '#34D399'],
    emoji: '☕',
  },
  { 
    id: 'play', 
    name: 'Play', 
    icon: 'game-controller', 
    color: '#6366F1', 
    gradient: ['#6366F1', '#818CF8'],
    emoji: '🎮',
  },
  { 
    id: 'meal', 
    name: 'Meals', 
    icon: 'restaurant', 
    color: '#F97316', 
    gradient: ['#F97316', '#FB923C'],
    emoji: '🍽️',
  },
];

// Animated category button component
function CategoryButton({ category }: { category: typeof LIFESTYLE_CATEGORIES[0] }) {
  const scale = useSharedValue(1);
  const onPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View 
      entering={FadeIn.duration(400).delay(0)}
      exiting={FadeOut.duration(200)}
      style={animatedStyle}>
      <TouchableOpacity
        onPressIn={() => {
          scale.value = withSpring(0.92, { damping: 15, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 15, stiffness: 400 });
          onPress();
        }}
        activeOpacity={1}>
        <LinearGradient
          colors={category.gradient as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.categoryButton, { shadowColor: category.color }]}>
          <View style={styles.categoryIconContainer}>
            <Text style={styles.emoji}>{category.emoji}</Text>
            <View style={[styles.iconBadge, { backgroundColor: 'rgba(255,255,255,0.4)' }]}>
              <Ionicons name={category.icon as any} size={16} color="#FFFFFF" />
            </View>
          </View>
          <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { selectedDate, getEventsForDate, addEvent, updateEvent, toggleEventComplete, deleteEvent } = useEvents();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const todayEvents = getEventsForDate(selectedDate);

  const handleAddEvent = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEditingEvent(null);
    setModalVisible(true);
  };

  const handleEditEvent = (event: Event) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingEvent(event);
    setModalVisible(true);
  };

  const handleSaveEvent = async (eventData: any) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (editingEvent) {
      await updateEvent({ ...editingEvent, ...eventData });
    } else {
      await addEvent(eventData);
    }
    setModalVisible(false);
    setEditingEvent(null);
  };

  const handleToggleComplete = async (eventId: string) => {
    await toggleEventComplete(eventId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleDeleteEvent = async () => {
    if (editingEvent) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await deleteEvent(editingEvent.id);
      setModalVisible(false);
      setEditingEvent(null);
    }
  };

  const renderEmptyState = () => {
    const emptyContainerStyle = [
      styles.emptyState,
      {
        backgroundColor: cardBackground,
        borderColor: borderColor,
      }
    ];
    const emptyIconContainerStyle = [
      styles.emptyIconContainer,
      { backgroundColor: `${tintColor}15` }
    ];

    return (
      <View style={emptyContainerStyle}>
        <View style={emptyIconContainerStyle}>
          <Ionicons name="calendar-outline" size={48} color={tintColor} />
        </View>
        <ThemedText style={[styles.emptyTitle, { color: textColor }]}>
          No events scheduled
        </ThemedText>
        <ThemedText style={[styles.emptySubtitle, { color: mutedColor }]}>
          {isToday(selectedDate) 
            ? "Start planning your day by adding activities"
            : `No events for ${format(selectedDate, 'MMMM d')}`}
        </ThemedText>
        <TouchableOpacity
          style={[styles.emptyAddButton, { backgroundColor: tintColor, shadowColor: tintColor }]}
          onPress={handleAddEvent}>
          <Ionicons name="add-circle" size={20} color="#FFFFFF" />
          <ThemedText style={styles.emptyAddText}>Add Event</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuickAddButtons = () => (
    <View style={styles.quickAddContainer}>
      <ThemedText style={[styles.quickAddTitle, { color: mutedColor }]}>
        Quick Add Activities
      </ThemedText>
      <View style={styles.categoryGrid}>
        {LIFESTYLE_CATEGORIES.map((category, index) => (
          <View key={category.id} style={{ width: (Dimensions.get('window').width - 52) / 4 }}>
            <CategoryButton category={category} />
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <ThemedText style={styles.greeting}>
            {isToday(selectedDate) ? "Today&apos;s Schedule" : format(selectedDate, 'MMMM d')}
          </ThemedText>
          <ThemedText style={[styles.dateText, { color: mutedColor }]}>
            {format(selectedDate, 'EEEE, MMMM yyyy')}
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.headerAddButton, { backgroundColor: tintColor, shadowColor: tintColor }]}
          onPress={handleAddEvent}>
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Quick Add Categories */}
      <View style={styles.contentSection}>
        {renderQuickAddButtons()}

        {/* Events List */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {isToday(selectedDate) ? "Today&apos;s Tasks" : 'Schedule'}
        </ThemedText>
        
        {todayEvents.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.eventsContainer}>
            {todayEvents.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeIn.duration(300).delay(index * 50)}
                style={styles.eventItem}>
                <EventCard
                  event={item}
                  onPress={() => handleEditEvent(item)}
                  onToggleComplete={() => handleToggleComplete(item.id)}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      {/* Bottom spacing for large screens */}
      <View style={{ height: 40 }} />

      {/* Event Modal */}
      <EventModal
        visible={modalVisible}
        event={editingEvent}
        onClose={() => {
          setModalVisible(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        onDelete={editingEvent ? handleDeleteEvent : undefined}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  headerAddButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginTop: -8,
  },
  contentSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
    letterSpacing: -0.3,
  },
  quickAddContainer: {
    marginBottom: 28,
  },
  quickAddTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    aspectRatio: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  emoji: {
    fontSize: 26,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.2,
  },
  eventsContainer: {
    gap: 12,
  },
  eventItem: {
    marginBottom: 8,
  },
  eventsList: {
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyAddText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
