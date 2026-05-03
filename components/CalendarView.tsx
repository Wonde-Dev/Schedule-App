import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { format, isSameDay, isToday } from 'date-fns';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEvents } from '@/context/EventContext';
import { EventCard } from '@/components/EventCard';
import { Ionicons } from '@expo/vector-icons';

export function CalendarView({ onAddEvent }: { onAddEvent: () => void }) {
  const { selectedDate, setSelectedDate, getEventsForDate, toggleEventComplete } = useEvents();

  const cardBackground = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');

  const todayEvents = getEventsForDate(selectedDate);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(new Date(day.dateString));
  };

  const renderDay = (day: any) => {
    const date = new Date(day.dateString);
    const isSelected = isSameDay(date, selectedDate);
    const isTodayDate = isToday(date);
    const eventsForDay = getEventsForDate(date);
    const hasEvents = eventsForDay.length > 0;

    return (
      <TouchableOpacity
        onPress={() => handleDayPress({ dateString: day.dateString })}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 2,
          backgroundColor: isSelected ? tintColor : 'transparent',
          borderWidth: isTodayDate && !isSelected ? 2 : 0,
          borderColor: tintColor,
        }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: isSelected ? '#FFFFFF' : isTodayDate ? tintColor : textColor,
          }}>
          {day.day}
        </Text>
        {hasEvents && !isSelected && (
          <View style={[styles.eventDot, { backgroundColor: tintColor }]} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: textColor }]}>
            {format(selectedDate, 'MMMM')}
          </Text>
          <Text style={{ color: mutedColor }}>
            {format(selectedDate, 'yyyy')}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: tintColor }]}
          onPress={onAddEvent}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={[styles.calendarContainer, { backgroundColor: cardBackground, borderColor }]}>
        <Calendar
          {...({ renderDay } as any)}
          theme={{
            textSectionTitleColor: textColor,
            selectedDayBackgroundColor: tintColor,
            selectedDayTextColor: '#FFFFFF',
            todayTextColor: tintColor,
            dayTextColor: textColor,
            textDisabledColor: mutedColor,
            arrowColor: tintColor,
            monthTextColor: tintColor,
            textDayFontWeight: '600',
            textMonthFontWeight: '700',
            textDayHeaderFontWeight: '600',
            textDayHeaderFontSize: 12,
            textMonthFontSize: 16,
            textDayFontSize: 14,
          }}
          hideExtraDays={true}
          markingType={'custom' as const}
          onDayPress={handleDayPress}
        />
      </View>

      {/* Events List */}
      <View style={styles.eventsSection}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>
          {format(selectedDate, 'EEE, MMM d')}
          {isToday(selectedDate) && ' (Today)'}
        </Text>

        {todayEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={mutedColor} />
            <Text style={[styles.emptyText, { color: mutedColor }]}>
              No events scheduled{!isToday(selectedDate) && ' for this day'}
            </Text>
            <TouchableOpacity
              style={[styles.emptyAddButton, { borderColor: tintColor }]}
              onPress={onAddEvent}>
              <Text style={[styles.emptyAddText, { color: tintColor }]}>Add Event</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={todayEvents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <EventCard
                event={item}
                onPress={() => {/* Navigate to edit - handled by parent */}}
                onToggleComplete={() => toggleEventComplete(item.id)}
              />
            )}
            showsVerticalScrollIndicator={false}
            style={styles.eventsList}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 20,
  },
  eventsSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  eventsList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyAddButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  emptyAddText: {
    fontSize: 16,
    fontWeight: '600',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: 'absolute',
    bottom: 4,
  },
});
