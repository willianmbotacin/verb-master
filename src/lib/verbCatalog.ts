import verbsJson from "@/data/verbs.json";
import type { ChallengeColumn, VerbEntry } from "@/lib/mockVerbs";

export type VerbSheetRecord = {
  infinitive: string;
  simplePast: string;
  participle: string;
  translation: string;
};

export const VERB_CATALOG: VerbSheetRecord[] = verbsJson as VerbSheetRecord[];

export function spinnerLabel(verb: VerbSheetRecord, challenge: ChallengeColumn): string {
  let raw: string;
  switch (challenge) {
    case "infinitive":
      raw = verb.infinitive;
      break;
    case "simplePast":
      raw = verb.simplePast;
      break;
    case "participle":
      raw = verb.participle;
      break;
    case "translation":
      raw = verb.translation;
      break;
    default:
      raw = verb.infinitive;
  }
  return raw.trim().toUpperCase();
}

export function filterVerbsForChallenge(
  verbs: VerbSheetRecord[],
  challenge: ChallengeColumn,
): VerbSheetRecord[] {
  const filtered = verbs.filter((v) => spinnerLabel(v, challenge).length > 0);
  return filtered.length > 0 ? filtered : verbs.filter((v) => v.infinitive.trim().length > 0);
}

export function findVerbByInfinitive(
  infinitive: string | null | undefined,
): VerbSheetRecord | undefined {
  if (!infinitive) return undefined;
  const key = decodeURIComponent(infinitive).trim().toLowerCase();
  return VERB_CATALOG.find((v) => v.infinitive.trim().toLowerCase() === key);
}

export function getVerbFieldRaw(verb: VerbSheetRecord, col: ChallengeColumn): string {
  switch (col) {
    case "infinitive":
      return verb.infinitive;
    case "simplePast":
      return verb.simplePast;
    case "participle":
      return verb.participle;
    case "translation":
      return verb.translation;
  }
}

function normAnswer(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Accepts exact match (case/spacing insensitive) or any slash-separated alternative for verb forms. */
export function answerMatchesVerbColumn(
  verb: VerbSheetRecord,
  col: ChallengeColumn,
  input: string,
): boolean {
  const user = normAnswer(input);
  if (!user) return false;
  const raw = getVerbFieldRaw(verb, col).trim();
  if (normAnswer(raw) === user) return true;
  if (col === "translation") {
    return raw
      .split(/[,;/]/)
      .map((p) => p.trim())
      .filter(Boolean)
      .some((part) => normAnswer(part) === user);
  }
  return raw
    .split(/\s*\/\s*/)
    .map((p) => p.trim())
    .filter(Boolean)
    .some((part) => normAnswer(part) === user);
}

/** Maps sheet row to the shape used by result / mock UI tables. */
export function sheetToVerbEntry(s: VerbSheetRecord): VerbEntry {
  const raw = s.infinitive.trim();
  const titled =
    raw.length > 0 ? raw.charAt(0).toUpperCase() + raw.slice(1) : raw;
  return {
    titleEn: /^to\s/i.test(titled) ? titled : `To ${titled}`,
    infinitive: s.infinitive.trim().toLowerCase(),
    simplePast: s.simplePast.trim().toLowerCase(),
    participle: s.participle.trim().toLowerCase(),
    translationPt: s.translation.trim(),
  };
}
