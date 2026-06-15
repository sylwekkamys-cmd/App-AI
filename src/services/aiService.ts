import Anthropic from '@anthropic-ai/sdk';
import { PhishingAnalysis, MessageAnalysis, RiskLevel } from '../types';
import { PHISHING_KEYWORDS, SENSITIVE_DATA_PATTERNS } from '../constants';

const client = new Anthropic({
  apiKey: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '',
});

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function detectSensitiveData(text: string) {
  const found: { type: string; masked: string }[] = [];
  for (const [type, pattern] of Object.entries(SENSITIVE_DATA_PATTERNS)) {
    const matches = text.match(pattern);
    if (matches) {
      matches.forEach((match) => {
        found.push({
          type,
          masked: match.slice(0, 3) + '*'.repeat(Math.max(match.length - 6, 3)) + match.slice(-3),
        });
      });
    }
  }
  return found;
}

export async function analyzePhishing(urlOrText: string): Promise<PhishingAnalysis> {
  const localKeywords = PHISHING_KEYWORDS.filter((kw) =>
    urlOrText.toLowerCase().includes(kw.toLowerCase())
  );

  const prompt = `Jesteś ekspertem ds. cyberbezpieczeństwa. Przeanalizuj poniższy URL lub tekst pod kątem phishingu i zagrożeń bezpieczeństwa.

Tekst/URL do analizy:
"""
${urlOrText}
"""

Oceń ryzyko i zwróć JSON w następującym formacie (bez markdown):
{
  "riskLevel": "safe|low|medium|high|critical",
  "score": <0-100>,
  "summary": "<krótkie podsumowanie po polsku>",
  "details": ["<szczegół 1>", "<szczegół 2>"],
  "recommendations": ["<rekomendacja 1>", "<rekomendacja 2>"],
  "suspiciousPatterns": ["<wzorzec 1>"],
  "domainReputation": "unknown|suspicious|malicious|safe"
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const parsed = JSON.parse(content.text);

  // Merge local keyword detection with AI result
  if (localKeywords.length > 0) {
    parsed.suspiciousPatterns = [...new Set([...parsed.suspiciousPatterns, ...localKeywords])];
    if (parsed.score < 40) parsed.score = Math.min(parsed.score + localKeywords.length * 10, 100);
  }

  return {
    id: generateId(),
    timestamp: Date.now(),
    url: urlOrText.startsWith('http') ? urlOrText : undefined,
    ...parsed,
  } as PhishingAnalysis;
}

export async function analyzeMessage(text: string): Promise<MessageAnalysis> {
  const sensitiveData = detectSensitiveData(text);

  const prompt = `Jesteś ekspertem ds. cyberbezpieczeństwa i analizy zagrożeń. Przeanalizuj poniższą wiadomość pod kątem:
1. Prób phishingu i socjotechniki
2. Podejrzanych linków lub żądań
3. Manipulacji emocjonalnej
4. Prób wyłudzenia danych

Wiadomość:
"""
${text}
"""

Zwróć JSON (bez markdown):
{
  "riskLevel": "safe|low|medium|high|critical",
  "score": <0-100>,
  "summary": "<podsumowanie po polsku>",
  "details": ["<szczegół>"],
  "recommendations": ["<rekomendacja>"],
  "detectedThreats": ["<zagrożenie>"],
  "sensitiveDataFound": []
}`;

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const parsed = JSON.parse(content.text);

  const sensitiveTypes = sensitiveData.map((d) => d.type) as any[];

  return {
    id: generateId(),
    timestamp: Date.now(),
    originalText: text,
    sensitiveDataFound: [...new Set([...parsed.sensitiveDataFound, ...sensitiveTypes])],
    ...parsed,
  } as MessageAnalysis;
}

export async function scanTextForLeaks(text: string) {
  const found = detectSensitiveData(text);
  return found;
}
