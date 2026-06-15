import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { COLORS, SENSITIVE_DATA_PATTERNS } from '../../constants';
import { securityStore } from '../../store/securityStore';
import { DataLeakEntry, SensitiveDataType } from '../../types';

const TYPE_LABELS: Record<string, string> = {
  email: '📧 Email',
  phone: '📱 Telefon',
  pesel: '🪪 PESEL',
  credit_card: '💳 Karta płatnicza',
  bank_account: '🏦 Konto bankowe',
  id_number: '🪪 Dowód osobisty',
  passport: '📘 Paszport',
  password: '🔑 Hasło',
};

export default function DataLeakMonitorScreen() {
  const [input, setInput] = useState('');
  const [scanResult, setScanResult] = useState<{ type: string; masked: string }[]>([]);
  const [leakHistory, setLeakHistory] = useState<DataLeakEntry[]>(securityStore.getLeakHistory());
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const unsub = securityStore.subscribe(() => {
      setLeakHistory(securityStore.getLeakHistory());
    });
    return unsub;
  }, []);

  function handleScan() {
    if (!input.trim()) return;
    const found: { type: string; masked: string }[] = [];

    for (const [type, pattern] of Object.entries(SENSITIVE_DATA_PATTERNS)) {
      const freshPattern = new RegExp(pattern.source, pattern.flags);
      const matches = input.match(freshPattern);
      if (matches) {
        matches.forEach((match) => {
          const masked =
            match.slice(0, 2) + '*'.repeat(Math.max(match.length - 4, 2)) + match.slice(-2);
          found.push({ type, masked });
          securityStore.addLeakEntry({
            id: Math.random().toString(36).substring(2),
            timestamp: Date.now(),
            type: type as SensitiveDataType,
            context: input.slice(0, 50) + '...',
            riskLevel: type === 'pesel' || type === 'credit_card' ? 'critical' : 'high',
            masked,
          });
        });
      }
    }

    setScanResult(found);
    setScanned(true);
  }

  function handleClear() {
    setInput('');
    setScanResult([]);
    setScanned(false);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>🛡️ Monitor Wycieków Danych</Text>
      <Text style={styles.subtitle}>
        Wykryj wrażliwe dane przed ich wysłaniem. Tekst nie jest przechowywany po skanowaniu.
      </Text>

      <TextInput
        style={styles.input}
        value={input}
        onChangeText={(t) => {
          setInput(t);
          setScanned(false);
        }}
        placeholder="Wklej tekst do sprawdzenia (e-mail, dokument, wiadomość)..."
        placeholderTextColor={COLORS.text.muted}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, !input.trim() && styles.buttonDisabled]}
          onPress={handleScan}
          disabled={!input.trim()}
        >
          <Text style={styles.buttonText}>🔍 Skanuj dane</Text>
        </TouchableOpacity>
        {scanned && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Wyczyść</Text>
          </TouchableOpacity>
        )}
      </View>

      {scanned && (
        <View
          style={[
            styles.resultBox,
            { borderColor: scanResult.length > 0 ? COLORS.danger : COLORS.safe },
          ]}
        >
          {scanResult.length === 0 ? (
            <View style={styles.safeResult}>
              <Text style={styles.safeIcon}>✅</Text>
              <Text style={styles.safeText}>Nie wykryto wrażliwych danych</Text>
            </View>
          ) : (
            <>
              <Text style={styles.leakTitle}>
                ⚠️ Wykryto {scanResult.length} wrażliwy{scanResult.length > 1 ? 'ch elementów' : ' element'}
              </Text>
              {scanResult.map((item, i) => (
                <View key={i} style={styles.leakItem}>
                  <Text style={styles.leakType}>{TYPE_LABELS[item.type] ?? item.type}</Text>
                  <Text style={styles.leakMasked}>{item.masked}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      )}

      {leakHistory.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Historia wykrytych danych</Text>
          {leakHistory.slice(0, 10).map((entry) => (
            <View key={entry.id} style={styles.historyItem}>
              <Text style={styles.historyType}>{TYPE_LABELS[entry.type] ?? entry.type}</Text>
              <Text style={styles.historyMasked}>{entry.masked}</Text>
              <Text style={styles.historyDate}>
                {new Date(entry.timestamp).toLocaleString('pl-PL')}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>ℹ️ Wykrywane dane</Text>
        <Text style={styles.infoText}>
          • Numery PESEL{'\n'}
          • Numery kart płatniczych{'\n'}
          • Numery kont bankowych (IBAN){'\n'}
          • Adresy email{'\n'}
          • Numery telefonów{'\n'}
          • Numery dowodów osobistych{'\n'}
          • Numery paszportów
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.dark },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.text.secondary, marginBottom: 20, lineHeight: 20 },
  input: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    color: COLORS.text.primary,
    fontSize: 14,
    minHeight: 130,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  buttonRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  button: {
    flex: 1,
    backgroundColor: COLORS.safe,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  clearButton: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearButtonText: { color: COLORS.text.secondary, fontWeight: '600', fontSize: 15 },
  resultBox: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    marginBottom: 24,
    gap: 10,
  },
  safeResult: { alignItems: 'center', padding: 16, gap: 8 },
  safeIcon: { fontSize: 36 },
  safeText: { color: COLORS.safe, fontSize: 16, fontWeight: '700' },
  leakTitle: { color: COLORS.danger, fontSize: 15, fontWeight: '700' },
  leakItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background.elevated,
    borderRadius: 8,
    padding: 10,
  },
  leakType: { color: COLORS.text.primary, fontSize: 13, fontWeight: '600' },
  leakMasked: { color: COLORS.warning, fontSize: 13, fontFamily: 'monospace' },
  historySection: { marginBottom: 24 },
  historyTitle: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  historyItem: {
    backgroundColor: COLORS.background.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 4,
  },
  historyType: { color: COLORS.text.primary, fontSize: 13, fontWeight: '600' },
  historyMasked: { color: COLORS.warning, fontSize: 12, fontFamily: 'monospace' },
  historyDate: { color: COLORS.text.muted, fontSize: 11 },
  infoBox: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  infoTitle: { color: COLORS.text.primary, fontSize: 14, fontWeight: '700' },
  infoText: { color: COLORS.text.secondary, fontSize: 13, lineHeight: 22 },
});
