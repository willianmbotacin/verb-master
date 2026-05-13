"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState, type TransitionEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import BoltIcon from "@mui/icons-material/Bolt";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { parseChallengeParam, type ChallengeColumn } from "@/lib/mockVerbs";
import {
  VERB_CATALOG,
  filterVerbsForChallenge,
  spinnerLabel,
  type VerbSheetRecord,
} from "@/lib/verbCatalog";

const ITEM_H = 44;
const VISIBLE_ROWS = 5;
const VIEWPORT_H = ITEM_H * VISIBLE_ROWS;
const STRIP_LEN = 52;
const SPIN_MS = 2800;
const EASING = "cubic-bezier(0.12, 0.85, 0.2, 1)";

function centerTranslateY(slotIndex: number) {
  return -slotIndex * ITEM_H + VIEWPORT_H / 2 - ITEM_H / 2;
}

function buildStrip(
  pool: VerbSheetRecord[],
  winner: VerbSheetRecord,
  challenge: ChallengeColumn,
  winIdx: number,
): string[] {
  const labels: string[] = [];
  for (let i = 0; i < STRIP_LEN; i++) {
    if (i === winIdx) {
      labels.push(spinnerLabel(winner, challenge));
    } else {
      const v = pool[i % pool.length];
      labels.push(spinnerLabel(v, challenge));
    }
  }
  return labels;
}

function DrawPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", {
    defaultMatches: false,
  });

  const challenge: ChallengeColumn =
    parseChallengeParam(searchParams.get("challenge")) ?? "infinitive";
  const autoSpin = searchParams.get("autospin") === "1";

  const pool = useMemo(
    () => filterVerbsForChallenge(VERB_CATALOG, challenge),
    [challenge],
  );

  const initialStrip = useMemo(
    () =>
      Array.from({ length: Math.min(STRIP_LEN, Math.max(pool.length, 1)) }, (_, i) =>
        spinnerLabel(pool[i % pool.length], challenge),
      ),
    [pool, challenge],
  );

  const [strip, setStrip] = useState<string[]>(initialStrip);
  const [translateY, setTranslateY] = useState(() => centerTranslateY(3));
  const [transition, setTransition] = useState<string | undefined>(undefined);
  const [phase, setPhase] = useState<"idle" | "spinning" | "done">("idle");
  const spinTargetRef = useRef<{ infinitive: string } | null>(null);
  const navigateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runSpinRef = useRef<() => void>(() => {});

  useEffect(() => {
    setStrip(initialStrip);
    setTranslateY(centerTranslateY(3));
    setPhase("idle");
    setTransition(undefined);
    spinTargetRef.current = null;
  }, [initialStrip]);

  useEffect(() => {
    return () => {
      if (navigateTimer.current) clearTimeout(navigateTimer.current);
    };
  }, []);

  const goQuiz = useCallback(
    (infinitive: string) => {
      router.push(
        `/quiz?challenge=${challenge}&verb=${encodeURIComponent(infinitive)}`,
      );
    },
    [challenge, router],
  );

  const runSpin = useCallback(() => {
    if (phase === "spinning" || phase === "done") return;
    const win = pool[Math.floor(Math.random() * pool.length)];
    const winIdx = 32 + Math.floor(Math.random() * 10);
    const startIdx = 5 + Math.floor(Math.random() * 6);
    const newStrip = buildStrip(pool, win, challenge, winIdx);
    spinTargetRef.current = { infinitive: win.infinitive };
    setStrip(newStrip);
    setPhase("spinning");

    if (prefersReducedMotion) {
      setTransition(undefined);
      setTranslateY(centerTranslateY(winIdx));
      setPhase("done");
      navigateTimer.current = setTimeout(() => goQuiz(win.infinitive), 200);
      return;
    }

    setTransition("none");
    setTranslateY(centerTranslateY(startIdx));
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransition(`transform ${SPIN_MS / 1000}s ${EASING}`);
        setTranslateY(centerTranslateY(winIdx));
      });
    });
  }, [challenge, goQuiz, phase, pool, prefersReducedMotion]);

  runSpinRef.current = runSpin;

  useEffect(() => {
    if (!autoSpin || pool.length === 0) return;
    const id = window.setTimeout(() => {
      runSpinRef.current();
      const u = new URL(window.location.href);
      if (u.searchParams.has("autospin")) {
        u.searchParams.delete("autospin");
        const qs = u.searchParams.toString();
        window.history.replaceState(null, "", `${u.pathname}${qs ? `?${qs}` : ""}`);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, [autoSpin, pool.length]);

  const onTransitionEnd = useCallback(
    (e: TransitionEvent) => {
      if (e.propertyName !== "transform") return;
      if (phase !== "spinning") return;
      setPhase("done");
      setTransition(undefined);
      const target = spinTargetRef.current;
      navigateTimer.current = setTimeout(() => {
        if (target) goQuiz(target.infinitive);
      }, 450);
    },
    [goQuiz, phase],
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#F8FAFF",
        px: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ width: "100%", my: "auto", py: { xs: 3, sm: 4 } }}>
        <Stack spacing={4} sx={{ alignItems: "center" }}>
          <Typography
            variant="h5"
            component="h1"
            align="center"
            color="text.primary"
            sx={{ fontWeight: 600 }}
          >
            Drawing a verb...
          </Typography>

          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 300,
              borderRadius: 3,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: "primary.main",
                zIndex: 2,
                display: phase === "idle" ? "none" : "flex",
                alignItems: "center",
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </Box>
            <Box
              sx={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                color: "primary.main",
                zIndex: 2,
                display: phase === "idle" ? "none" : "flex",
                alignItems: "center",
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </Box>

            <Box
              sx={{
                height: VIEWPORT_H,
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {phase === "idle" ? (
                <HelpOutlineIcon
                  sx={{
                    fontSize: 120,
                    color: "action.active",
                    opacity: 0.85,
                  }}
                  aria-label="Verb hidden until you spin"
                />
              ) : (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    overflow: "hidden",
                    "&::before, &::after": {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      right: 0,
                      height: ITEM_H * 1.25,
                      zIndex: 1,
                      pointerEvents: "none",
                    },
                    "&::before": {
                      top: 0,
                      background:
                        "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
                    },
                    "&::after": {
                      bottom: 0,
                      background:
                        "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
                    },
                  }}
                >
                  <Box
                    sx={{
                      transform: `translateY(${translateY}px)`,
                      transition: transition,
                      willChange: phase === "spinning" ? "transform" : "auto",
                    }}
                    onTransitionEnd={onTransitionEnd}
                  >
                    {strip.map((word, i) => {
                      const dist = Math.abs(
                        translateY + i * ITEM_H + ITEM_H / 2 - VIEWPORT_H / 2,
                      );
                      const isCenter =
                        phase !== "spinning" && dist < ITEM_H * 0.35;
                      return (
                        <Box
                          key={`slot-${i}`}
                          sx={{
                            height: ITEM_H,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            px: 1,
                          }}
                        >
                          <Typography
                            component="p"
                            sx={{
                              m: 0,
                              width: "100%",
                              textAlign: "center",
                              fontWeight: isCenter ? 700 : 400,
                              letterSpacing: 0.06,
                              color: isCenter ? "primary.main" : "text.disabled",
                              fontSize: isCenter ? "1.35rem" : "0.95rem",
                              lineHeight: 1.2,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              opacity: isCenter ? 1 : 0.55,
                            }}
                          >
                            {word}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              )}
            </Box>
          </Paper>

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={phase === "spinning" || phase === "done"}
            startIcon={<BoltIcon />}
            onClick={runSpin}
            sx={{
              maxWidth: 320,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 700,
              boxShadow: 2,
            }}
          >
            {phase === "idle" && "Spin Now"}
            {phase === "spinning" && "Spinning…"}
            {phase === "done" && "Next…"}
          </Button>

          <Button component={Link} href="/" variant="text" size="small">
            Back to challenges
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default function DrawPage() {
  return (
    <Suspense
      fallback={
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "#F8FAFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">Loading…</Typography>
        </Box>
      }
    >
      <DrawPageContent />
    </Suspense>
  );
}
