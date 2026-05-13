export type VerbEntry = {
  titleEn: string;
  infinitive: string;
  simplePast: string;
  participle: string;
  translationPt: string;
};

export const MOCK_VERBS: VerbEntry[] = [
  {
    titleEn: "To Go",
    infinitive: "go",
    simplePast: "went",
    participle: "gone",
    translationPt: "Ir",
  },
  {
    titleEn: "To See",
    infinitive: "see",
    simplePast: "saw",
    participle: "seen",
    translationPt: "Ver",
  },
  {
    titleEn: "To Make",
    infinitive: "make",
    simplePast: "made",
    participle: "made",
    translationPt: "Fazer",
  },
  {
    titleEn: "To Give",
    infinitive: "give",
    simplePast: "gave",
    participle: "given",
    translationPt: "Dar",
  },
  {
    titleEn: "To Take",
    infinitive: "take",
    simplePast: "took",
    participle: "taken",
    translationPt: "Pegar",
  },
];

export type ChallengeColumn =
  | "infinitive"
  | "simplePast"
  | "participle"
  | "translation";

export const CHALLENGE_LABELS: Record<ChallengeColumn, string> = {
  infinitive: "Infinitive",
  simplePast: "Simple Past",
  participle: "Participle",
  translation: "Translation",
};

export function parseChallengeParam(
  raw: string | null | undefined,
): ChallengeColumn | null {
  if (!raw) return null;
  if (raw in CHALLENGE_LABELS) return raw as ChallengeColumn;
  return null;
}

export function challengeHeaderLabel(column: ChallengeColumn | null): string {
  const key = column ?? "infinitive";
  return CHALLENGE_LABELS[key].toUpperCase();
}
