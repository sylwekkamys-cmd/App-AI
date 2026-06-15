import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../../constants';
import { analyzeMessage } from '../../services/aiService';
import { securityStore } from '../../store/securityStore';
import { MessageAnalysis } from '../../types';
import RiskBadge from '../../components/common/RiskBadge';
import ScoreGauge from '../../components/common/ScoreGauge';

const SENSITIVE_LABELS: Record<string, string> = {
  email: 'Adres email',
  phone: 'Numer telefonu',
  pesel: 'PESEL',
  credit_card: 'Karta płatnicza',
  bank_account: 'Konto bankowe',
  id_number: 'Numer dowodu',
  passport: 'Paszport',
  password: 'Hasło',
  address: 'Adres',
};

export default function MessageAnalyzerScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MessageAnalysis | null>(null);

  async function handleAnalyze() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzeMessage(input.trim());
      setResult(analysis);
      securityStore.addMessageResult(analysis);
    } catch (e) {
      Alert.alert('Błąd', 'Nie udało się przeprowadzić analizy. Sprawdź klucz API.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>🔍 Analiza Wiadomości</Text>
      <Text style={styles.subtitle}>
        Wklej wiadomość e-mail, SMS lub tekst do weryfikacji bezpieczeństwa
      </Text>

      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Wklej wiadomość tutaj..."
        placeholderTextColor={COLORS.text.muted}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.button, (!input.trim() || loading) && styles.buttonDisabled]}
        onPress={handleAnalyze}
        disabled={!input.trim() || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Analizuj wiadomość</Text>
        )}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <ScoreGauge score={result.score} riskLevel={result.riskLevel} />
            <RiskBadge level={result.riskLevel} size="lg" />
          </View>

          <Text style={styles.summary}>{result.summary}</Text>

          {result.sensitiveDataFound.length > 0 && (
            <View style={styles.sensitiveBox}>
              <Text style={styles.sensitiveTitle}>🔓 Wykryte wrażliwe dane</Text>
              <View style={styles.chips}>
                {result.sensitiveDataFound.map((type, i) => (
                  <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{SENSITIVE_LABELS[type] ?? type}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {result.detectedThreats.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🚨 Wykryte zagrożenia</Text>
              {result.detectedThreats.map((t, i) => (
                <Text key={i} style={styles.threatItem}>
                  • {t}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Rekomendacje</Text>
            {result.recommendations.map((r, i) => (
              <Text key={i} style={styles.recItem}>
                • {r}
              </Text>
            ))}
          </View>
        </View>
      )}
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
  button: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resultCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summary: { color: COLORS.text.primary, fontSize: 15, lineHeight: 22, marginBottom: 8 },
  sensitiveBox: {
    backgroundColor: COLORS.background.elevated,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.danger,
    gap: 10,
  },
  sensitiveTitle: { color: COLORS.danger, fontSize: 14, fontWeight: '700' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    backgroundColor: COLORS.background.dark,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  chipText: { color: COLORS.danger, fontSize: 12, fontWeight: '600' },
  section: { marginTop: 12 },
  sectionTitle: { color: COLORS.text.primary, fontSize: 14, fontWeight: '700', marginBottom: 8 },
  threatItem: { color: COLORS.warning, fontSize: 13, lineHeight: 22 },
  recItem: { color: COLORS.safe, fontSize: 13, lineHeight: 22 },
});
