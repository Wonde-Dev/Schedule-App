import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO, isAfter, isBefore, startOfToday, isSameDay } from 'date-fns';

export type EventPriority = 'low' | 'medium' | 'high';

export type Event = {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date string
  startTime: string; // HH:mm format
  endTime?: string;
  priority: EventPriority;
  completed: boolean;
  color?: string;
  createdAt: string;
};

type EventContextType = {
  events: Event[];
  selectedDate: Date;
  addEvent: (event: Omit<Event, 'id' | 'createdAt' | 'completed'>) => Promise<void>;
  updateEvent: (event: Event) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  toggleEventComplete: (id: string) => Promise<void>;
  setSelectedDate: (date: Date) => void;
  getEventsForDate: (date: Date) => Event[];
  getTodayEvents: () => Event[];
  getUpcomingEvents: (days?: number) => Event[];
};

const EventContext = createContext<EventContextType | undefined>(undefined);

const STORAGE_KEY = '@schedula_events';

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const saveEvents = async (newEvents: Event[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newEvents));
    } catch (error) {
      console.error('Failed to save events:', error);
    }
  };

  const addEvent = async (eventData: Omit<Event, 'id' | 'createdAt' | 'completed'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  };

  const updateEvent = async (updatedEvent: Event) => {
    const updatedEvents = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  };

  const deleteEvent = async (id: string) => {
    const updatedEvents = events.filter(e => e.id !== id);
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  };

  const toggleEventComplete = async (id: string) => {
    const updatedEvents = events.map(e =>
      e.id === id ? { ...e, completed: !e.completed } : e
    );
    setEvents(updatedEvents);
    await saveEvents(updatedEvents);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, date);
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getTodayEvents = () => {
    const today = startOfToday();
    return events
      .filter(event => {
        const eventDate = parseISO(event.date);
        const isToday = isSameDay(eventDate, today);
        const isUpcoming = isAfter(parseISO(event.date), today);
        return isToday || isUpcoming;
      })
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare !== 0) return dateCompare;
        return a.startTime.localeCompare(b.startTime);
      });
  };

  const getUpcomingEvents = (days: number = 7) => {
    const today = startOfToday();
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + days);
    return events
      .filter(event => {
        const eventDate = parseISO(event.date);
        return isAfter(eventDate, today) && isBefore(endDate, parseISO(event.date));
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <EventContext.Provider
      value={{
        events,
        selectedDate,
        addEvent,
        updateEvent,
        deleteEvent,
        toggleEventComplete,
        setSelectedDate,
        getEventsForDate,
        getTodayEvents,
        getUpcomingEvents,
      }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
