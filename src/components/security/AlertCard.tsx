import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SecurityAlert } from '../../types';
import { COLORS, RISK_COLORS } from '../../constants';
import RiskBadge from '../common/RiskBadge';

interface Props {
  alert: SecurityAlert;
  onResolve?: (id: string) => void;
}

const TYPE_ICONS: Record<SecurityAlert['type'], string> = {
  phishing: '🎣',
  data_leak: '🔓',
  suspicious_message: '⚠️',
  malware_link: '🦠',
};

export default function AlertCard({ alert, onResolve }: Props) {
  const borderColor = RISK_COLORS[alert.riskLevel];
  const date = new Date(alert.timestamp).toLocaleString('pl-PL');

  return (
    <View style={[styles.card, { borderLeftColor: borderColor }, alert.resolved && styles.resolved]}>
      <View style={styles.header}>
        <Text style={styles.icon}>{TYPE_ICONS[alert.type]}</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{alert.title}</Text>
          <RiskBadge level={alert.riskLevel} size="sm" />
        </View>
      </View>
      <Text style={styles.description}>{alert.description}</Text>
      <View style={styles.footer}>
        <Text style={styles.date}>{date}</Text>
        {!alert.resolved && onResolve && (
          <TouchableOpacity onPress={() => onResolve(alert.id)}>
            <Text style={styles.resolveBtn}>Oznacz jako rozwiązane</Text>
          </TouchableOpacity>
        )}
        {alert.resolved && <Text style={styles.resolvedLabel}>✓ Rozwiązane</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    gap: 8,
  },
  resolved: {
    opacity: 0.6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  icon: {
    fontSize: 22,
  },
  titleRow: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    color: COLORS.text.secondary,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  date: {
    color: COLORS.text.muted,
    fontSize: 11,
  },
  resolveBtn: {
    color: COLORS.safe,
    fontSize: 12,
    fontWeight: '600',
  },
  resolvedLabel: {
    color: COLORS.safe,
    fontSize: 12,
    fontWeight: '600',
  },
});
