export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export interface AnalysisResult {
  id: string;
  timestamp: number;
  riskLevel: RiskLevel;
  score: number; // 0-100
  summary: string;
  details: string[];
  recommendations: string[];
}

export interface PhishingAnalysis extends AnalysisResult {
  url?: string;
  suspiciousPatterns: string[];
  domainReputation?: 'unknown' | 'suspicious' | 'malicious' | 'safe';
}

export interface MessageAnalysis extends AnalysisResult {
  originalText: string;
  detectedThreats: string[];
  sensitiveDataFound: SensitiveDataType[];
}

export interface DataLeakEntry {
  id: string;
  timestamp: number;
  type: SensitiveDataType;
  context: string;
  riskLevel: RiskLevel;
  masked: string;
}

export type SensitiveDataType =
  | 'email'
  | 'phone'
  | 'pesel'
  | 'credit_card'
  | 'password'
  | 'address'
  | 'bank_account'
  | 'id_number'
  | 'passport';

export interface SecurityAlert {
  id: string;
  timestamp: number;
  type: 'phishing' | 'data_leak' | 'suspicious_message' | 'malware_link';
  title: string;
  description: string;
  riskLevel: RiskLevel;
  resolved: boolean;
}

export type RootStackParamList = {
  Main: undefined;
  PhishingDetector: undefined;
  MessageAnalyzer: undefined;
  DataLeakMonitor: undefined;
  Settings: undefined;
  AlertDetail: { alert: SecurityAlert };
};

export type BottomTabParamList = {
  Home: undefined;
  PhishingDetector: undefined;
  MessageAnalyzer: undefined;
  DataLeakMonitor: undefined;
  Settings: undefined;
};
