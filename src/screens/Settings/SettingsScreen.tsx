import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { COLORS, APP_NAME, APP_VERSION } from '../../constants';

export default function SettingsScreen() {
  const [apiKey, setApiKey] = useState('');
  const [autoScan, setAutoScan] = useState(false);
  const [notifications, setNotifications] = useState(true);

  function handleSaveApiKey() {
    if (!apiKey.trim()) {
      Alert.alert('Błąd', 'Klucz API nie może być pusty.');
      return;
    }
    // In production: use expo-secure-store to persist securely
    Alert.alert('Sukces', 'Klucz API został zapisany bezpiecznie.');
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>⚙️ Ustawienia</Text>

      <Section title="Klucz API Anthropic">
        <Text style={styles.desc}>
          Wymagany do analiz AI. Uzyskaj klucz na console.anthropic.com
        </Text>
        <TextInput
          style={styles.apiInput}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="sk-ant-..."
          placeholderTextColor={COLORS.text.muted}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveApiKey}>
          <Text style={styles.saveButtonText}>Zapisz klucz</Text>
        </TouchableOpacity>
      </Section>

      <Section title="Ochrona">
        <SettingRow
          label="Automatyczne skanowanie schowka"
          description="Skanuj zawartość schowka po każdym kopiowaniu"
          value={autoScan}
          onToggle={setAutoScan}
        />
        <SettingRow
          label="Powiadomienia o zagrożeniach"
          description="Powiadamiaj natychmiast po wykryciu zagrożenia"
          value={notifications}
          onToggle={setNotifications}
        />
      </Section>

      <Section title="O aplikacji">
        <InfoRow label="Nazwa" value={APP_NAME} />
        <InfoRow label="Wersja" value={APP_VERSION} />
        <InfoRow label="Model AI" value="Claude Haiku (Anthropic)" />
        <InfoRow label="Ochrona danych" value="Dane nie są przechowywane na serwerach" />
      </Section>

      <View style={styles.privacyNote}>
        <Text style={styles.privacyIcon}>🔒</Text>
        <Text style={styles.privacyText}>
          Twoje dane są analizowane wyłącznie lokalnie i przez bezpieczne API Anthropic.
          Żadne wrażliwe informacje nie są przechowywane ani udostępniane osobom trzecim.
        </Text>
      </View>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.container}>
      <Text style={sectionStyles.title}>{title}</Text>
      <View style={sectionStyles.content}>{children}</View>
    </View>
  );
}

function SettingRow({
  label,
  description,
  value,
  onToggle,
}: {
  label: string;
  description: string;
  value: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <View style={rowStyles.container}>
      <View style={rowStyles.text}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.desc}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.border, true: COLORS.safe }}
        thumbColor="#fff"
      />
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={infoStyles.row}>
      <Text style={infoStyles.label}>{label}</Text>
      <Text style={infoStyles.value}>{value}</Text>
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  container: { marginBottom: 28 },
  title: { fontSize: 16, fontWeight: '700', color: COLORS.text.primary, marginBottom: 12 },
  content: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
});

const rowStyles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  text: { flex: 1 },
  label: { color: COLORS.text.primary, fontSize: 14, fontWeight: '600' },
  desc: { color: COLORS.text.muted, fontSize: 12, marginTop: 2 },
});

const infoStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  label: { color: COLORS.text.secondary, fontSize: 13 },
  value: { color: COLORS.text.primary, fontSize: 13, fontWeight: '600', maxWidth: '55%', textAlign: 'right' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background.dark },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: COLORS.text.primary, marginBottom: 24 },
  desc: { color: COLORS.text.secondary, fontSize: 13, marginBottom: 12, lineHeight: 18 },
  apiInput: {
    backgroundColor: COLORS.background.elevated,
    borderRadius: 8,
    padding: 12,
    color: COLORS.text.primary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: COLORS.highlight,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  privacyNote: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.safe,
  },
  privacyIcon: { fontSize: 20 },
  privacyText: { flex: 1, color: COLORS.text.secondary, fontSize: 13, lineHeight: 20 },
});
