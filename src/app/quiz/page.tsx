"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  CHALLENGE_LABELS,
  challengeHeaderLabel,
  parseChallengeParam,
  type ChallengeColumn,
} from "@/lib/mockVerbs";
import {
  answerMatchesVerbColumn,
  findVerbByInfinitive,
  getVerbFieldRaw,
  spinnerLabel,
} from "@/lib/verbCatalog";

const COLUMN_ORDER: ChallengeColumn[] = [
  "infinitive",
  "simplePast",
  "participle",
  "translation",
];

const START_SECONDS = 30;
const LINEAR_TRACK_BG = "rgba(0, 82, 204, 0.15)";

/** Common browser/OS voice names that are typically female (Web Speech has no standard gender field). */
const EN_US_FEMALE_HINT =
  /\b(female|woman|zira|jenny|aria|samantha|karen|hazel|victoria|susan|linda|joanna|michelle|sara|ivy|allison|ashley)\b|microsoft\s+(aria|jenny|zira|michelle|ana|natasha)/i;

const PT_BR_FEMALE_HINT =
  /\b(female|mulher|francisca|maria|heloisa|luciana|fernanda|camila|juliana|vit[oó]ria)\b|microsoft.*(maria|francisca|heloisa)|google\s+portugu[eê]s.*brasil/i;

function normLang(l: string) {
  return l.toLowerCase().replace("_", "-");
}

function pickSpeechVoice(lang: "en-US" | "pt-BR"): SpeechSynthesisVoice | undefined {
  if (typeof window === "undefined") return undefined;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return undefined;

  if (lang === "en-US") {
    const us = voices.filter((v) => normLang(v.lang).startsWith("en-us"));
    const female = us.filter((v) => EN_US_FEMALE_HINT.test(v.name));
    return (
      female.find((v) => /united states|u\.s\.|us english/i.test(v.name)) ??
      female[0] ??
      us.find((v) => /google\s+us\s+english(?!.*\bmale\b)/i.test(v.name)) ??
      us.find((v) => /united states|u\.s\.|us english/i.test(v.name)) ??
      us[0] ??
      voices.find((v) => normLang(v.lang).startsWith("en"))
    );
  }

  const br = voices.filter((v) => normLang(v.lang).startsWith("pt-br"));
  const femaleBr = br.filter((v) => PT_BR_FEMALE_HINT.test(v.name));
  return (
    femaleBr.find((v) => /brazil|brasil/i.test(v.name)) ??
    femaleBr[0] ??
    br.find((v) => PT_BR_FEMALE_HINT.test(v.name)) ??
    br.find((v) => /brazil|brasil/i.test(v.name)) ??
    br[0] ??
    voices.find((v) => normLang(v.lang).startsWith("pt"))
  );
}

function speakWithLang(text: string, lang: "en-US" | "pt-BR") {
  if (typeof window === "undefined" || !text.trim()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.trim());
  u.lang = lang;
  const voice = pickSpeechVoice(lang);
  if (voice) u.voice = voice;
  window.speechSynthesis.speak(u);
}

function buildResultHref(
  outcome: "success" | "fail",
  challenge: ChallengeColumn | null,
  verbInfinitive: string | undefined,
) {
  const q = new URLSearchParams();
  q.set("outcome", outcome);
  if (challenge) q.set("challenge", challenge);
  if (verbInfinitive) q.set("verb", verbInfinitive);
  return `/result?${q.toString()}`;
}

function QuizPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const challenge = parseChallengeParam(searchParams.get("challenge"));
  const columnKey: ChallengeColumn = challenge ?? "infinitive";
  const verbParam = searchParams.get("verb");
  const pickedVerb = useMemo(() => findVerbByInfinitive(verbParam), [verbParam]);

  const otherColumns = useMemo(
    () => COLUMN_ORDER.filter((c) => c !== columnKey),
    [columnKey],
  );
  const totalSteps = otherColumns.length;

  const [step, setStep] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(START_SECONDS);
  const [answer, setAnswer] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Partial<Record<ChallengeColumn, string>>>({});
  const finishedRef = useRef(false);
  const answerInputRef = useRef<HTMLInputElement | null>(null);
  const [ended, setEnded] = useState(false);

  const verbQs = pickedVerb?.infinitive ?? "";

  const goResult = useCallback(
    (outcome: "success" | "fail") => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      setEnded(true);
      router.replace(buildResultHref(outcome, challenge, verbQs));
    },
    [challenge, router, verbQs],
  );

  useEffect(() => {
    setStep(1);
    setAnswer("");
    setRevealed({});
    setInputError(null);
    setEnded(false);
    finishedRef.current = false;
    setSecondsLeft(START_SECONDS);
  }, [verbParam, columnKey]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [verbParam, columnKey]);

  useEffect(() => {
    if (!pickedVerb || ended) return;
    const id = window.requestAnimationFrame(() => {
      const el = answerInputRef.current;
      if (!el || el.disabled) return;
      el.focus();
    });
    return () => window.cancelAnimationFrame(id);
  }, [pickedVerb, verbParam, columnKey, step, ended]);

  useEffect(() => {
    if (secondsLeft > 0) return;
    if (finishedRef.current) return;
    goResult("fail");
  }, [secondsLeft, goResult]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    const warmVoices = () => {
      void synth.getVoices();
    };
    warmVoices();
    synth.addEventListener("voiceschanged", warmVoices);
    return () => {
      synth.removeEventListener("voiceschanged", warmVoices);
      synth.cancel();
    };
  }, [verbParam, columnKey]);

  const handleSpeakVerb = useCallback(() => {
    if (!pickedVerb || ended || secondsLeft <= 0) return;
    const text = getVerbFieldRaw(pickedVerb, columnKey).trim();
    if (!text) return;
    const lang: "en-US" | "pt-BR" = columnKey === "translation" ? "pt-BR" : "en-US";
    speakWithLang(text, lang);
  }, [pickedVerb, columnKey, ended, secondsLeft]);

  const currentColumn = otherColumns[step - 1];
  const currentStepLabel = currentColumn
    ? challengeHeaderLabel(currentColumn)
    : "";

  const handleNext = () => {
    if (finishedRef.current || secondsLeft <= 0 || ended) return;
    if (!pickedVerb || !currentColumn) return;

    if (answer.trim() === "") {
      setInputError("No blanks! Give it a go 😜");
 
 
      return;
    }

    if (!answerMatchesVerbColumn(pickedVerb, currentColumn, answer)) {
      setInputError("Swing and a miss! Try again! 🚀");
 
      return;
    }

    setInputError(null);
    const display = getVerbFieldRaw(pickedVerb, currentColumn).trim();
    setRevealed((prev) => ({ ...prev, [currentColumn]: display }));

    if (step >= totalSteps) {
      goResult("success");
      return;
    }
    setStep((s) => s + 1);
    setAnswer("");
  };

  const ringRemainingPercent = (secondsLeft / START_SECONDS) * 100;
  const linearValue = totalSteps > 0 ? ((step - 1) / totalSteps) * 100 : 0;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#F5F6F8",
        px: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ width: "100%", my: "auto", py: { xs: 3, sm: 4 } }}>
        <Stack spacing={3} sx={{ alignItems: "center" }}>
          <Box sx={{ position: "relative", width: 140, height: 140 }}>
            <CircularProgress
              variant="determinate"
              value={100}
              size={140}
              thickness={4}
              sx={{
                color: "#E8C547",
                position: "absolute",
                left: 0,
              }}
            />
            <CircularProgress
              variant="determinate"
              value={ringRemainingPercent}
              size={140}
              thickness={4}
              sx={{
                color: "primary.main",
                position: "absolute",
                left: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {secondsLeft}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                SECONDS
              </Typography>
            </Box>
          </Box>

          {pickedVerb && (
            <Box sx={{ display: "flex", justifyContent: "center", width: "100%", px: 1 }}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  maxWidth: "min(100%, calc(100vw - 48px))",
                  textAlign: "center",
                }}
              >
                <Typography
                  variant="h6"
                  component="span"
                  sx={{
                    fontWeight: 800,
                    color: "text.primary",
                    letterSpacing: 0.04,
                    lineHeight: 1.2,
                    wordBreak: "break-word",
                  }}
                >
                  {spinnerLabel(pickedVerb, columnKey)}
                </Typography>
                <Tooltip title="Listen" placement="top">
                  <Box
                    component="span"
                    sx={{
                      position: "absolute",
                      left: "100%",
                      top: "50%",
                      transform: "translateY(-50%)",
                      ml: 0.25,
                      lineHeight: 0,
                    }}
                  >
                    <IconButton
                      color="primary"
                      size="small"
                      aria-label="Listen to pronunciation"
                      onClick={handleSpeakVerb}
                      disabled={secondsLeft <= 0 || ended}
                      sx={{ p: 0.5 }}
                    >
                      <VolumeUpIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          )}

          <Card
            elevation={2}
            sx={{
              width: "100%",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <Stack spacing={2} sx={{ p: 2.5 }}>
              <Stack
                direction="row"
                spacing={2}
                sx={{ justifyContent: "space-between", alignItems: "baseline" }}
              >
                <Typography
                  variant="caption"
                  color="primary.main"
                  sx={{ fontWeight: 800, letterSpacing: 1 }}
                >
                  STEP {step} OF {totalSteps}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 600, letterSpacing: 1 }}
                >
                  {currentStepLabel}
                </Typography>
              </Stack>

              <LinearProgress
                variant="determinate"
                value={linearValue}
                sx={{
                  height: 8,
                  borderRadius: 1,
                  bgcolor: LINEAR_TRACK_BG,
                  "& .MuiLinearProgress-bar": {
                    borderRadius: 1,
                    bgcolor: "#2E7D32",
                  },
                }}
              />

              <Stack spacing={1}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                  YOUR ANSWER ({currentColumn ? CHALLENGE_LABELS[currentColumn] : ""})
                </Typography>
                <TextField
                  fullWidth
                  inputRef={answerInputRef}
                  value={answer}
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleNext();
                    }
                  }}
                  disabled={secondsLeft <= 0 || ended || !pickedVerb}
                  error={Boolean(inputError)}
                  helperText={inputError ?? undefined}
                  placeholder="Type here..."
                  slotProps={{
                    input: { sx: { borderRadius: 2, fontSize: "1.1rem" } },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderWidth: 2,
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Stack>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={secondsLeft <= 0 || ended || !pickedVerb}
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                sx={{ py: 1.25, borderRadius: 2 }}
              >
                {step < totalSteps ? "NEXT" : "FINISH"}
              </Button>
            </Stack>
          </Card>

          <Stack
            direction="row"
            spacing={2}
            sx={{ width: "100%", maxWidth: 480, px: 1, justifyContent: "space-between" }}
          >
            {otherColumns.map((col) => (
              <Stack key={col} spacing={0.5} sx={{ flex: 1, textAlign: "center" }}>
                <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 700, letterSpacing: 0.5 }}>
                  {challengeHeaderLabel(col)}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                    color: revealed[col] ? "text.primary" : "text.disabled",
                    fontWeight: revealed[col] ? 600 : 400,
                  }}
                >
                  {revealed[col] ?? "---"}
                </Typography>
              </Stack>
            ))}
          </Stack>

          <Button component={Link} href="/" variant="text" size="small">
            Home
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", bgcolor: "#F5F6F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography color="text.secondary">Loading…</Typography>
        </Box>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}
