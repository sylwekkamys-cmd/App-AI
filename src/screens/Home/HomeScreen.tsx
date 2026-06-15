import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../constants';
import { securityStore } from '../../store/securityStore';
import AlertCard from '../../components/security/AlertCard';
import { RootStackParamList } from '../../types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FEATURES = [
  {
    id: 'PhishingDetector',
    icon: '🎣',
    title: 'Detektor Phishingu',
    desc: 'Sprawdź URL lub tekst',
    color: '#E94560',
  },
  {
    id: 'MessageAnalyzer',
    icon: '🔍',
    title: 'Analiza Wiadomości',
    desc: 'Wykryj manipulację i zagrożenia',
    color: '#6C5CE7',
  },
  {
    id: 'DataLeakMonitor',
    icon: '🛡️',
    title: 'Monitor Wycieków',
    desc: 'Chroń wrażliwe dane',
    color: '#00B894',
  },
] as const;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [stats, setStats] = useState(securityStore.getStats());
  const [alerts, setAlerts] = useState(securityStore.getAlerts().slice(0, 3));

  useEffect(() => {
    const unsub = securityStore.subscribe(() => {
      setStats(securityStore.getStats());
      setAlerts(securityStore.getAlerts().slice(0, 3));
    });
    return unsub;
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.appName}>🛡️ SecureAI Guard</Text>
        <Text style={styles.subtitle}>Ochrona oparta na sztucznej inteligencji</Text>
      </View>

      <View style={styles.statsRow}>
        <StatBox label="Alerty" value={stats.unresolvedAlerts} color={COLORS.danger} />
        <StatBox label="Skanowania" value={stats.phishingScanned} color={COLORS.highlight} />
        <StatBox label="Wiadomości" value={stats.messagesAnalyzed} color={COLORS.accent} />
        <StatBox label="Wycieki" value={stats.leaksDetected} color={COLORS.warning} />
      </View>

      <Text style={styles.sectionTitle}>Funkcje ochrony</Text>
      <View style={styles.featuresGrid}>
        {FEATURES.map((f) => (
          <TouchableOpacity
            key={f.id}
            style={[styles.featureCard, { borderTopColor: f.color }]}
            onPress={() => navigation.navigate(f.id as any)}
          >
            <Text style={styles.featureIcon}>{f.icon}</Text>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {alerts.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Ostatnie alerty</Text>
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onResolve={(id) => securityStore.resolveAlert(id)}
            />
          ))}
        </>
      )}

      {alerts.length === 0 && (
        <View style={styles.safeBox}>
          <Text style={styles.safeIcon}>✅</Text>
          <Text style={styles.safeText}>Brak aktywnych zagrożeń</Text>
          <Text style={styles.safeSubtext}>Twoje urządzenie jest bezpieczne</Text>
        </View>
      )}
    </ScrollView>
  );
}

function StatBox({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={[styles.statBox, { borderTopColor: color }]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.dark },
  content: { padding: 20, paddingBottom: 40 },
  header: { marginBottom: 24, paddingTop: 10 },
  appName: { fontSize: 26, fontWeight: '800', color: COLORS.text.primary },
  subtitle: { fontSize: 14, color: COLORS.text.secondary, marginTop: 4 },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.background.card,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, color: COLORS.text.muted, marginTop: 2 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text.primary,
    marginBottom: 14,
  },
  featuresGrid: { gap: 12, marginBottom: 28 },
  featureCard: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 18,
    borderTopWidth: 3,
  },
  featureIcon: { fontSize: 28, marginBottom: 8 },
  featureTitle: {
    color: COLORS.text.primary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDesc: { color: COLORS.text.secondary, fontSize: 13 },
  safeBox: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: COLORS.background.card,
    borderRadius: 16,
    marginTop: 8,
    gap: 8,
  },
  safeIcon: { fontSize: 48 },
  safeText: { color: COLORS.safe, fontSize: 18, fontWeight: '700' },
  safeSubtext: { color: COLORS.text.secondary, fontSize: 13 },
});
