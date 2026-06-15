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
import { analyzePhishing } from '../../services/aiService';
import { securityStore } from '../../store/securityStore';
import { PhishingAnalysis } from '../../types';
import RiskBadge from '../../components/common/RiskBadge';
import ScoreGauge from '../../components/common/ScoreGauge';

export default function PhishingDetectorScreen() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PhishingAnalysis | null>(null);

  async function handleAnalyze() {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const analysis = await analyzePhishing(input.trim());
      setResult(analysis);
      securityStore.addPhishingResult(analysis);
    } catch (e) {
      Alert.alert('Błąd', 'Nie udało się przeprowadzić analizy. Sprawdź klucz API.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>🎣 Detektor Phishingu</Text>
      <Text style={styles.subtitle}>Wklej URL lub podejrzany tekst do analizy</Text>

      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="https://example.com lub treść wiadomości..."
        placeholderTextColor={COLORS.text.muted}
        multiline
        numberOfLines={4}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={[styles.button, (!input.trim() || loading) && styles.buttonDisabled]}
        onPress={handleAnalyze}
        disabled={!input.trim() || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Analizuj z AI</Text>
        )}
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <ScoreGauge score={result.score} riskLevel={result.riskLevel} />
            <RiskBadge level={result.riskLevel} size="lg" />
          </View>

          <Text style={styles.summary}>{result.summary}</Text>

          {result.suspiciousPatterns.length > 0 && (
            <Section title="⚠️ Podejrzane wzorce">
              {result.suspiciousPatterns.map((p, i) => (
                <BulletItem key={i} text={p} color={COLORS.warning} />
              ))}
            </Section>
          )}

          <Section title="📋 Szczegóły">
            {result.details.map((d, i) => (
              <BulletItem key={i} text={d} />
            ))}
          </Section>

          <Section title="💡 Rekomendacje">
            {result.recommendations.map((r, i) => (
              <BulletItem key={i} text={r} color={COLORS.safe} />
            ))}
          </Section>
        </View>
      )}
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      {children}
    </View>
  );
}

function BulletItem({ text, color }: { text: string; color?: string }) {
  return (
    <View style={bulletStyles.row}>
      <Text style={[bulletStyles.dot, { color: color ?? COLORS.text.secondary }]}>•</Text>
      <Text style={[bulletStyles.text, color ? { color } : {}]}>{text}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { marginTop: 16 },
  title: { color: COLORS.text.primary, fontSize: 14, fontWeight: '700', marginBottom: 8 },
});

const bulletStyles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  dot: { fontSize: 14, lineHeight: 20 },
  text: { flex: 1, color: COLORS.text.secondary, fontSize: 13, lineHeight: 20 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.dark },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.text.secondary, marginBottom: 20 },
  input: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    color: COLORS.text.primary,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  button: {
    backgroundColor: COLORS.highlight,
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
    gap: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summary: { color: COLORS.text.primary, fontSize: 15, lineHeight: 22 },
});
