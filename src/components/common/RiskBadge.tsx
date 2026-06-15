import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RiskLevel } from '../../types';
import { RISK_COLORS } from '../../constants';

interface Props {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const LABELS: Record<RiskLevel, string> = {
  safe: 'BEZPIECZNY',
  low: 'NISKIE',
  medium: 'ŚREDNIE',
  high: 'WYSOKIE',
  critical: 'KRYTYCZNE',
};

export default function RiskBadge({ level, size = 'md' }: Props) {
  const color = RISK_COLORS[level];
  const fontSize = size === 'sm' ? 10 : size === 'lg' ? 14 : 12;
  const padding = size === 'sm' ? 4 : size === 'lg' ? 10 : 6;

  return (
    <View style={[styles.badge, { borderColor: color, paddingHorizontal: padding, paddingVertical: padding / 2 }]}>
      <Text style={[styles.label, { color, fontSize }]}>{LABELS[level]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
