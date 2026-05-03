import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEvents } from '@/context/EventContext';
import { EventCard } from '@/components/EventCard';
import { format, startOfWeek, addDays, isSameDay, isToday, parseISO, differenceInDays } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInUp,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import type { Event } from '@/context/EventContext';

const ACTIVITY_COLORS = {
  gym: { primary: '#EF4444', secondary: '#F87171', name: 'Gym' },
  study: { primary: '#3B82F6', secondary: '#60A5FA', name: 'Study' },
  coding: { primary: '#8B5CF6', secondary: '#A78BFA', name: 'Code' },
  video: { primary: '#EC4899', secondary: '#F472B6', name: 'Video' },
  design: { primary: '#F59E0B', secondary: '#FBBF24', name: 'Design' },
  chill: { primary: '#10B981', secondary: '#34D399', name: 'Chill' },
  play: { primary: '#6366F1', secondary: '#818CF8', name: 'Play' },
  meal: { primary: '#F97316', secondary: '#FB923C', name: 'Meals' },
};

type ActivityKey = keyof typeof ACTIVITY_COLORS;

export default function ExploreScreen() {
  const { events, getTodayEvents, toggleEventComplete } = useEvents();
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  const todayEvents = getTodayEvents();

  // Statistics
  const activityCounts = Object.keys(ACTIVITY_COLORS).reduce((acc, key) => {
    const activityKey = key as ActivityKey;
    acc[activityKey] = events.filter(e => 
      e.title.toLowerCase().includes(ACTIVITY_COLORS[activityKey].name.toLowerCase())
    ).length;
    return acc;
  }, {} as Record<ActivityKey, number>);

  const totalCategories = Object.values(activityCounts).filter(c => c > 0).length;
  const completionRate = events.length > 0 
    ? Math.round((events.filter(e => e.completed).length / events.length) * 100)
    : 0;

  // Week view
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array(7).fill(null).map((_, i) => addDays(weekStart, i));

  const getEventsForDay = (day: Date) => {
    return events.filter(e => {
      const eventDate = parseISO(e.date);
      return isSameDay(eventDate, day);
    }).length;
  };

  const renderStatsCard = (activityKey: ActivityKey, count: number, index: number) => {
    const activity = ACTIVITY_COLORS[activityKey];
    
    return (
      <Animated.View 
        entering={FadeInUp.duration(500).delay(index * 100)}
        style={[styles.statCard, { backgroundColor: `${activity.primary}15` }]}>
        <View style={[styles.statIconContainer, { backgroundColor: `${activity.primary}30` }]}>
          <Text style={styles.statEmoji}>
            {activityKey === 'gym' ? '💪' :
             activityKey === 'study' ? '📚' :
             activityKey === 'coding' ? '💻' :
             activityKey === 'video' ? '🎬' :
             activityKey === 'design' ? '🎨' :
             activityKey === 'chill' ? '☕' :
             activityKey === 'play' ? '🎮' : '🍽️'}
          </Text>
        </View>
        <Text style={[styles.statCount, { color: textColor }]}>
          {count}
        </Text>
        <Text style={[styles.statLabel, { color: mutedColor }]}>
          {activity.name}
        </Text>
        {count > 0 && (
          <View style={[styles.statBar, { backgroundColor: `${activity.primary}30` }]}>
            <View style={[
              styles.statBarFill, 
              { 
                backgroundColor: activity.primary,
                width: `${Math.min(count * 20, 100)}%` 
              }
            ]} />
          </View>
        )}
      </Animated.View>
    );
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[tintColor, `${tintColor}CC`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Life Schedule</Text>
            <Text style={styles.headerSubtitle}>
              Track your {events.length} activities across {totalCategories} categories
            </Text>
          </View>
          <View style={[styles.headerCircle, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Ionicons name="calendar" size={32} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNumber}>{events.length}</Text>
            <Text style={styles.headerStatLabel}>Total Tasks</Text>
          </View>
          <View style={[styles.headerDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNumber}>{totalCategories}</Text>
            <Text style={styles.headerStatLabel}>Categories</Text>
          </View>
          {events.length > 0 && (
            <>
              <View style={[styles.headerDivider, { backgroundColor: 'rgba(255,255,255,0.2)' }]} />
              <View style={styles.headerStat}>
                <Text style={styles.headerStatNumber}>{completionRate}%</Text>
                <Text style={styles.headerStatLabel}>Completed</Text>
              </View>
            </>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {renderHeader()}

      {/* Activity Stats */}
      <View style={styles.statsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Activity Overview</Text>
          <View style={[styles.sectionDot, { backgroundColor: tintColor }]} />
        </View>
        <View style={styles.statsGrid}>
          {Object.entries(activityCounts)
            .filter(([_, count]) => count > 0)
            .map(([key, count], index) => (
              <Animated.View 
                key={key}
                entering={FadeInUp.duration(400).delay(200 + index * 100)}>
                {renderStatsCard(key as ActivityKey, count, index)}
              </Animated.View>
            ))}
        </View>
      </View>

      {/* Week Overview */}
      <View style={styles.weekSection}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>This Week</Text>
        <View style={[styles.weekCard, { backgroundColor: cardBackground, borderColor }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.weekRow}>
              {weekDays.map((day, index) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = isToday(day);
                const isPast = differenceInDays(day, new Date()) < 0 && !isToday(day);
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dayItem,
                      isSelected && { backgroundColor: `${tintColor}20` },
                      isPast && styles.dayPast,
                    ]}>
                    <Text style={[styles.dayName, { color: mutedColor }]}>
                      {format(day, 'EEE')}
                    </Text>
                    <View style={[
                      styles.dayNumberContainer,
                      isSelected && { backgroundColor: tintColor },
                    ]}>
                      <Text style={[
                        styles.dayNumber,
                        { color: isSelected ? '#FFFFFF' : textColor },
                      ]}>
                        {format(day, 'd')}
                      </Text>
                    </View>
                    {dayEvents > 0 && (
                      <View style={[styles.dayDot, { backgroundColor: tintColor }]} />
                    )}
                    {dayEvents > 0 && (
                      <Text style={[styles.dayCount, { color: tintColor }]}>
                        {dayEvents}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Today's Events */}
      <View style={styles.eventsSection}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>Today&apos;s Schedule</Text>
        {todayEvents.length === 0 ? (
          <Animated.View 
            entering={FadeInUp.duration(400)}
            style={[styles.emptyCard, { backgroundColor: cardBackground, borderColor }]}>
            <View style={[styles.emptyIconBox, { backgroundColor: `${tintColor}20` }]}>
              <Ionicons name="calendar-outline" size={36} color={tintColor} />
            </View>
            <Text style={[styles.emptyTitle, { color: textColor }]}>
              No scheduled activities
            </Text>
            <Text style={[styles.emptyDesc, { color: mutedColor }]}>
              Tap the + button to add your first event
            </Text>
          </Animated.View>
        ) : (
          <View style={styles.eventsList}>
            {todayEvents.map((event: Event, index: number) => (
              <Animated.View
                key={event.id}
                entering={FadeInUp.duration(300).delay(index * 50)}
                style={styles.eventWrapper}>
                <EventCard
                  event={event}
                  onPress={() => {}}
                  onToggleComplete={() => toggleEventComplete(event.id)}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 28,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  headerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    backdropFilter: 'blur(10px)',
  },
  headerStat: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  headerStatNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  headerDivider: {
    width: 1,
    height: 36,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  sectionDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    width: (Dimensions.get('window').width - 52) / 2,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statEmoji: {
    fontSize: 22,
  },
  statCount: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  statBar: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  statBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  weekSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  weekCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginTop: 12,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    minWidth: 60,
    position: 'relative',
  },
  dayPast: {
    opacity: 0.5,
  },
  dayName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  dayNumberContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '700',
  },
  dayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginBottom: 2,
  },
  dayCount: {
    fontSize: 10,
    fontWeight: '700',
  },
  eventsSection: {
    paddingHorizontal: 16,
  },
  eventsList: {
    gap: 12,
    marginTop: 16,
  },
  eventWrapper: {
    marginBottom: 8,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  emptyIconBox: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 60,
  },
});
