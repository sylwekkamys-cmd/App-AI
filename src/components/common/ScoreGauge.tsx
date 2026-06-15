import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RISK_COLORS } from '../../constants';
import { RiskLevel } from '../../types';

interface Props {
  score: number;
  riskLevel: RiskLevel;
}

export default function ScoreGauge({ score, riskLevel }: Props) {
  const color = RISK_COLORS[riskLevel];

  return (
    <View style={styles.container}>
      <View style={[styles.circle, { borderColor: color }]}>
        <Text style={[styles.score, { color }]}>{score}</Text>
        <Text style={styles.label}>/ 100</Text>
      </View>
      <Text style={[styles.riskText, { color }]}>Poziom ryzyka</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background.card,
  },
  score: {
    fontSize: 28,
    fontWeight: '800',
  },
  label: {
    fontSize: 12,
    color: COLORS.text.muted,
  },
  riskText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
