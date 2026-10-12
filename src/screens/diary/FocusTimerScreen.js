import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Vibration } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLibrary } from '../../context/LibraryContext';
import { Card, Button, common } from '../../components/Basics';
import { Field, ChipSelect } from '../../components/Inputs';
import { Colors, Spacing, Font, Radius } from '../../theme';
import { today, isValidDate, showMessage } from '../../utils/helpers';

const PRESETS = [15, 25, 30, 45, 60];

function fmt(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function FocusTimerScreen({ route, navigation }) {
  const { bookId: presetBookId } = route.params || {};
  const { state, add } = useLibrary();

  const [bookId, setBookId] = useState(presetBookId || state.books[0]?.id || '');
  const [preset, setPreset] = useState(25 * 60);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [pagesRead, setPagesRead] = useState('');
  const [date, setDate] = useState(today());
  const intervalRef = useRef(null);
  const elapsed = useRef(0);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setDone(true);
            Vibration.vibrate([0, 300, 200, 300]);
            return 0;
          }
          elapsed.current += 1;
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const applyPreset = (mins) => {
    setPreset(mins * 60);
    setSecondsLeft(mins * 60);
    setRunning(false);
    setDone(false);
    elapsed.current = 0;
  };
  const toggle = () => { if (done) return; setRunning((r) => !r); };
  const reset = () => { clearInterval(intervalRef.current); setRunning(false); setDone(false); setSecondsLeft(preset); elapsed.current = 0; };

  const saveSession = () => {
    if (!bookId) { showMessage('Seleziona un libro', ''); return; }
    if (!isValidDate(date)) { showMessage('Data non valida', 'Usa il formato AAAA-MM-GG.'); return; }
    add('sessions', {
      bookId, date, pagesRead: Number(pagesRead) || 0,
      minutes: Math.max(1, Math.round(elapsed.current / 60)), notes: 'Sessione focus timer.',
    });
    navigation.goBack();
  };

  const pct = 1 - secondsLeft / preset;
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * (1 - pct);

  return (
    <ScrollView style={common.screen} contentContainerStyle={[common.scroll, { alignItems: 'center' }]}>
      <Text style={s.title}>Modalità Focus Lettura</Text>
      <Text style={common.muted}>Concentrati e registra le tue sessioni senza distrazioni.</Text>

      <View style={s.presetRow}>
        {PRESETS.map((m) => (
          <TouchableOpacity key={m} style={[s.presetBtn, preset === m * 60 && s.presetActive]} onPress={() => applyPreset(m)}>
            <Text style={[s.presetText, preset === m * 60 && { color: Colors.primaryDark }]}>{m}m</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer visivo */}
      <View style={s.timerOuter}>
        <Text style={[s.timerText, done && { color: Colors.success }]}>{done ? 'FATTO!' : fmt(secondsLeft)}</Text>
        {elapsed.current > 0 ? <Text style={s.elapsed}>{Math.round(elapsed.current / 60)} min letti</Text> : null}
      </View>

      <View style={s.controls}>
        <TouchableOpacity style={[s.ctrl, { backgroundColor: done ? Colors.border : Colors.primary }]} onPress={toggle} disabled={done}>
          <Icon name={running ? 'pause' : 'play'} size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={s.ctrl} onPress={reset}>
          <Icon name="refresh" size={28} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {done || elapsed.current > 0 ? (
        <Card style={{ width: '100%', marginTop: Spacing.lg }}>
          <Text style={s.saveTitle}>Salva la sessione</Text>
          <ChipSelect
            label="Libro"
            options={state.books.map((b) => ({ value: b.id, label: b.title }))}
            value={bookId}
            onChange={setBookId}
          />
          <Field label="Pagine lette (opzionale)" value={pagesRead} onChangeText={setPagesRead} keyboardType="numeric" placeholder="0" />
          <Button icon="content-save-outline" title="Salva sessione" onPress={saveSession} />
          <Button variant="ghost" title="Chiudi senza salvare" onPress={() => navigation.goBack()} style={{ marginTop: 8 }} />
        </Card>
      ) : null}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  title: { fontSize: Font.xl, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  presetRow: { flexDirection: 'row', marginVertical: Spacing.lg, flexWrap: 'wrap', justifyContent: 'center' },
  presetBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: Radius.round, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface, margin: 4 },
  presetActive: { backgroundColor: Colors.primarySoft, borderColor: Colors.primary },
  presetText: { fontSize: Font.md, color: Colors.textMuted, fontWeight: '600' },
  timerOuter: { width: 200, height: 200, borderRadius: 100, borderWidth: 8, borderColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginVertical: Spacing.lg, backgroundColor: Colors.primarySoft },
  timerText: { fontSize: Font.xxl + 10, fontWeight: '700', color: Colors.primaryDark },
  elapsed: { fontSize: Font.sm, color: Colors.textMuted, marginTop: 4 },
  controls: { flexDirection: 'row', gap: 20 },
  ctrl: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primarySoft, borderWidth: 1, borderColor: Colors.border },
  saveTitle: { fontSize: Font.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
});
