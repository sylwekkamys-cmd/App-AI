import { useState, useCallback } from 'react';
import { SecurityAlert, PhishingAnalysis, MessageAnalysis, DataLeakEntry } from '../types';

// Simple in-memory store — replace with Zustand/Redux if app grows
let alerts: SecurityAlert[] = [];
let phishingHistory: PhishingAnalysis[] = [];
let messageHistory: MessageAnalysis[] = [];
let leakHistory: DataLeakEntry[] = [];

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

export const securityStore = {
  addAlert(alert: SecurityAlert) {
    alerts = [alert, ...alerts].slice(0, 100);
    notify();
  },
  resolveAlert(id: string) {
    alerts = alerts.map((a) => (a.id === id ? { ...a, resolved: true } : a));
    notify();
  },
  getAlerts() {
    return alerts;
  },
  addPhishingResult(result: PhishingAnalysis) {
    phishingHistory = [result, ...phishingHistory].slice(0, 50);
    if (result.riskLevel !== 'safe') {
      this.addAlert({
        id: result.id,
        timestamp: result.timestamp,
        type: 'phishing',
        title: 'Wykryto phishing',
        description: result.summary,
        riskLevel: result.riskLevel,
        resolved: false,
      });
    }
    notify();
  },
  addMessageResult(result: MessageAnalysis) {
    messageHistory = [result, ...messageHistory].slice(0, 50);
    if (result.riskLevel !== 'safe') {
      this.addAlert({
        id: result.id,
        timestamp: result.timestamp,
        type: 'suspicious_message',
        title: 'Podejrzana wiadomość',
        description: result.summary,
        riskLevel: result.riskLevel,
        resolved: false,
      });
    }
    notify();
  },
  addLeakEntry(entry: DataLeakEntry) {
    leakHistory = [entry, ...leakHistory].slice(0, 100);
    notify();
  },
  getPhishingHistory() {
    return phishingHistory;
  },
  getMessageHistory() {
    return messageHistory;
  },
  getLeakHistory() {
    return leakHistory;
  },
  getStats() {
    return {
      totalAlerts: alerts.length,
      unresolvedAlerts: alerts.filter((a) => !a.resolved).length,
      phishingScanned: phishingHistory.length,
      messagesAnalyzed: messageHistory.length,
      leaksDetected: leakHistory.length,
    };
  },
  subscribe(fn: () => void) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

export function useSecurityStore() {
  const [, forceUpdate] = useState(0);
  useCallback(() => {
    const unsub = securityStore.subscribe(() => forceUpdate((n) => n + 1));
    return unsub;
  }, []);

  return securityStore;
}
