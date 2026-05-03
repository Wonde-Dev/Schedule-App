import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Colors } from '@/constants/theme';
import type { Event, EventPriority } from '@/context/EventContext';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

interface EventModalProps {
  visible: boolean;
  event?: Event | null;
  onClose: () => void;
  onSave: (event: Omit<Event, 'id' | 'createdAt' | 'completed'>) => void;
  onDelete?: () => void;
}

export function EventModal({ visible, event, onClose, onSave, onDelete }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [priority, setPriority] = useState<EventPriority>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'tint');
  const cardBackground = useThemeColor({}, 'card');

  const translateY = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 25, stiffness: 300 });
      backdropOpacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(1000, { duration: 250 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, translateY, backdropOpacity]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '');
      setDate(parseISO(event.date));
      setStartTime(parseISO(`2000-01-01T${event.startTime}`));
      setEndTime(event.endTime ? parseISO(`2000-01-01T${event.endTime}`) : new Date());
      setPriority(event.priority);
    } else {
      resetForm();
    }
  }, [event, visible]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setPriority('medium');
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      date: format(date, 'yyyy-MM-dd'),
      startTime: format(startTime, 'HH:mm'),
      endTime: format(endTime, 'HH:mm'),
      priority,
    });
    onClose();
  };

  const formatTimeDisplay = (date: Date) => format(date, 'h:mm a');
  const formatDateDisplay = (date: Date) => format(date, 'EEE, MMM d, yyyy');

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const priorityOptions: { value: EventPriority; label: string; color: string; icon: string }[] = [
    { value: 'low', label: 'Low', color: Colors.light.success, icon: 'flag' },
    { value: 'medium', label: 'Medium', color: Colors.light.warning, icon: 'flag' },
    { value: 'high', label: 'High', color: Colors.light.danger, icon: 'flag' },
  ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <Animated.View style={[styles.overlay, backdropAnimatedStyle]}>
          <Pressable style={styles.backdropPressable} onPress={onClose} />
          
          <Animated.View style={[styles.container, modalAnimatedStyle]}>
            <View style={styles.handleBar} />
            
            <View style={[styles.header, { borderBottomColor: borderColor }]}>
              <Text style={[styles.headerTitle, { color: textColor }]}>{event ? 'Edit Event' : 'New Event'}</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <View style={[styles.closeButton, { backgroundColor: `${mutedColor}15` }]}>
                  <Ionicons name="close" size={24} color={mutedColor} />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>Event Title</Text>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor, backgroundColor: cardBackground }]}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="What are you planning?"
                  placeholderTextColor={mutedColor}
                  autoFocus
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>Description</Text>
                <TextInput
                  style={[styles.input, styles.textArea, { color: textColor, borderColor, backgroundColor: cardBackground }]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add notes..."
                  placeholderTextColor={mutedColor}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>Date</Text>
                <TouchableOpacity style={[styles.pickerButton, { borderColor, backgroundColor: cardBackground }]} onPress={() => setShowDatePicker(true)}>
                  <Ionicons name="calendar" size={20} color={tintColor} />
                  <Text style={[styles.pickerText, { color: textColor }]}>{formatDateDisplay(date)}</Text>
                  <Ionicons name="chevron-down" size={20} color={mutedColor} />
                </TouchableOpacity>
              </View>

              <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: textColor }]}>Start</Text>
                  <TouchableOpacity style={[styles.pickerButton, { borderColor, backgroundColor: cardBackground }]} onPress={() => setShowStartTimePicker(true)}>
                    <Ionicons name="time" size={18} color={tintColor} />
                    <Text style={[styles.pickerText, { color: textColor }]}>{formatTimeDisplay(startTime)}</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={[styles.label, { color: textColor }]}>End</Text>
                  <TouchableOpacity style={[styles.pickerButton, { borderColor, backgroundColor: cardBackground }]} onPress={() => setShowEndTimePicker(true)}>
                    <Ionicons name="time" size={18} color={tintColor} />
                    <Text style={[styles.pickerText, { color: textColor }]}>{formatTimeDisplay(endTime)}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: textColor }]}>Priority</Text>
                <View style={styles.priorityContainer}>
                  {priorityOptions.map(option => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.priorityOption,
                        priority === option.value ? { borderColor: option.color, backgroundColor: `${option.color}15` } : { borderColor, backgroundColor: cardBackground },
                      ]}
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setPriority(option.value); }}>
                      <View style={[styles.priorityDot, { backgroundColor: option.color }]} />
                      <Text style={[styles.priorityLabel, { color: textColor }]}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: borderColor }]}>
              {onDelete && (
                <TouchableOpacity style={styles.deleteButton} onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  Alert.alert('Delete Event', 'Delete this event?', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: onDelete }]);
                }}>
                  <Ionicons name="trash-outline" size={20} color={Colors.light.danger} />
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={[styles.cancelButtonText, { color: mutedColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.saveButton, { backgroundColor: tintColor }]} onPress={handleSave}>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>

        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={(event, selectedDate) => { setShowDatePicker(false); if (selectedDate) setDate(selectedDate); }} />
        )}
        {showStartTimePicker && (
          <DateTimePicker value={startTime} mode="time" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={(event, selectedTime) => { setShowStartTimePicker(false); if (selectedTime) setStartTime(selectedTime); }} />
        )}
        {showEndTimePicker && (
          <DateTimePicker value={endTime} mode="time" display={Platform.OS === 'ios' ? 'inline' : 'default'} onChange={(event, selectedTime) => { setShowEndTimePicker(false); if (selectedTime) setEndTime(selectedTime); }} />
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end' },
  backdropPressable: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  container: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '90%', overflow: 'hidden' },
  handleBar: { width: 36, height: 4, borderRadius: 2, backgroundColor: 'rgba(120,120,120,0.3)', alignSelf: 'center', marginTop: 8, marginBottom: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  closeButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 20 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 },
  input: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  textArea: { height: 90, paddingTop: 14 },
  pickerButton: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  pickerText: { fontSize: 16, flex: 1 },
  row: { flexDirection: 'row', gap: 12 },
  priorityContainer: { flexDirection: 'row', gap: 8 },
  priorityOption: { flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 12, padding: 14, gap: 8 },
  priorityDot: { width: 10, height: 10, borderRadius: 5 },
  priorityLabel: { fontSize: 14, fontWeight: '600' },
  footer: { flexDirection: 'row', gap: 10, padding: 20, borderTopWidth: 1, alignItems: 'center' },
  deleteButton: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.light.danger, alignItems: 'center', justifyContent: 'center' },
  cancelButton: { flex: 2, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.1)', alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600' },
  saveButton: { flex: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 12, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
