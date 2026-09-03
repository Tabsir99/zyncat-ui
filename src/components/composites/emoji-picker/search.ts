import { getEmojiData, type EmojiData } from './data';

const MAX_RESULTS = 90;

interface IndexedEmoji {
  id: string;
  shortcodes: string[];
  words: string[];
  tagWords: string[];
  nameLen: number;
}

const splitWords = (s: string) =>
  s
    .toLowerCase()
    .split(/[\s_-]+/)
    .filter(Boolean);

let source: EmojiData | null = null;
let index: IndexedEmoji[] = [];

const buildIndex = (data: EmojiData) => {
  source = data;
  index = Object.values(data.emojis).map((e) => ({
    id: e.id,
    shortcodes: e.shortcodes.map((s) => s.toLowerCase()),
    words: [...new Set([...splitWords(e.name), ...e.shortcodes.flatMap(splitWords)])],
    tagWords: [...new Set(e.tags.flatMap(splitWords))],
    nameLen: e.name.length,
  }));
};

const rank = (word: string, t: string, exact: number, prefix: number, mid = 0) => {
  if (word === t) return exact;
  if (word.startsWith(t)) return prefix;
  return mid && t.length >= 3 && word.includes(t) ? mid : 0;
};

const scoreToken = (e: IndexedEmoji, t: string): number => {
  let best = 0;
  for (const s of e.shortcodes) best = Math.max(best, rank(s, t, 100, 60));
  if (best === 100) return best;
  for (const w of e.words) best = Math.max(best, rank(w, t, 70, 55, 15));
  for (const w of e.tagWords) best = Math.max(best, rank(w, t, 30, 22));
  return best;
};

export const getRankedEmojiIds = (query: string): string[] => {
  const data = getEmojiData();
  if (!data) return [];
  if (source !== data) buildIndex(data);

  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];

  const scored: { id: string; score: number; nameLen: number }[] = [];
  for (const e of index) {
    let total = 0;
    for (const t of tokens) {
      const s = scoreToken(e, t);
      if (!s) {
        total = 0;
        break;
      }
      total += s;
    }
    if (total) scored.push({ id: e.id, score: total, nameLen: e.nameLen });
  }

  scored.sort((a, b) => b.score - a.score || a.nameLen - b.nameLen);
  return scored.slice(0, MAX_RESULTS).map((s) => s.id);
};
