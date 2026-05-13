"use client";

import type { ReactNode } from "react";
import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import TimerOffOutlinedIcon from "@mui/icons-material/TimerOffOutlined";
import ViewWeekOutlinedIcon from "@mui/icons-material/ViewWeekOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import type { VerbEntry } from "@/lib/mockVerbs";
import { MOCK_VERBS, parseChallengeParam, type ChallengeColumn } from "@/lib/mockVerbs";
import { findVerbByInfinitive, sheetToVerbEntry } from "@/lib/verbCatalog";

const successVerb = MOCK_VERBS[0];
const correctionVerb = MOCK_VERBS[1];

function emphasizeForChallenge(
  challenge: ChallengeColumn | null,
): "infinitive" | "simplePast" | "participle" | "translation" {
  if (challenge === "simplePast") return "simplePast";
  if (challenge === "participle") return "participle";
  if (challenge === "translation") return "translation";
  return "infinitive";
}

function ResultPageContent() {
  const searchParams = useSearchParams();
  const challenge = parseChallengeParam(searchParams.get("challenge"));
  const verbParam = searchParams.get("verb");
  const outcome = searchParams.get("outcome");

  const pickedSheet = useMemo(() => findVerbByInfinitive(verbParam), [verbParam]);
  const pickedEntry = useMemo(
    () => (pickedSheet ? sheetToVerbEntry(pickedSheet) : null),
    [pickedSheet],
  );

  const sessionQs = useMemo(() => {
    const q = new URLSearchParams();
    if (challenge) q.set("challenge", challenge);
    if (verbParam) q.set("verb", verbParam);
    q.set("autospin", "1");
    return `?${q.toString()}`;
  }, [challenge, verbParam]);

  const drawHref = `/draw${sessionQs}`;

  const showFromQuiz = outcome === "success" || outcome === "fail";
  const emphasizeColumn =
    outcome === "fail" ? emphasizeForChallenge(challenge) : undefined;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#EEEEEE",
        px: 2,
      }}
    >
      <Container maxWidth="sm" sx={{ width: "100%", my: "auto", py: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          {showFromQuiz ? (
            pickedEntry ? (
              outcome === "success" ? (
                <VerbResultBlock variant="success" verb={pickedEntry} />
              ) : (
                <VerbResultBlock
                  variant="correction"
                  verb={pickedEntry}
                  emphasizeColumn={emphasizeColumn}
                />
              )
            ) : (
              <Typography color="text.secondary" textAlign="center">
                Missing verb data. Open the quiz from the draw screen.
              </Typography>
            )
          ) : (
            <>
              <VerbResultBlock variant="success" verb={successVerb} />
              <VerbResultBlock
                variant="correction"
                verb={correctionVerb}
                emphasizeColumn="simplePast"
              />
            </>
          )}
          <Stack spacing={1.5}>
            <Button
              component={Link}
              href={drawHref}
              variant="contained"
              size="large"
              fullWidth
              startIcon={<RefreshIcon />}
              sx={{ py: 1.25, borderRadius: 2 }}
            >
              Spin Again
            </Button>
            <Button
              component={Link}
              href="/"
              variant="outlined"
              size="large"
              fullWidth
              color="primary"
              startIcon={<ViewWeekOutlinedIcon />}
              sx={{
                py: 1.25,
                borderRadius: 2,
                borderWidth: 2,
                bgcolor: "secondary.main",
              }}
            >
              Choose Column
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ minHeight: "100vh", bgcolor: "#EEEEEE", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography color="text.secondary">Loading…</Typography>
        </Box>
      }
    >
      <ResultPageContent />
    </Suspense>
  );
}

function VerbResultBlock({
  variant,
  verb,
  emphasizeColumn,
}: {
  variant: "success" | "correction";
  verb: VerbEntry;
  emphasizeColumn?: "infinitive" | "simplePast" | "participle" | "translation";
}) {
  const isSuccess = variant === "success";

  return (
    <Stack spacing={0}>
      <Alert
        severity={isSuccess ? "success" : "error"}
        icon={
          isSuccess ? <CheckCircleOutlinedIcon /> : <TimerOffOutlinedIcon />
        }
        sx={{
          borderRadius: "12px 12px 0 0",
          fontWeight: 600,
        }}
      >
        {isSuccess
          ? "Congratulations! You got it right."
          : "Don't give up! Here is the answer. Try again!"}
      </Alert>
      <Card
        elevation={2}
        sx={{
          borderRadius: "0 0 12px 12px",
          overflow: "hidden",
          position: "relative",
          maxWidth: "100%",
        }}
      >
        {!isSuccess && (
          <BoltOutlinedIcon
            sx={{
              position: "absolute",
              top: { xs: 12, sm: 24 },
              right: { xs: 8, sm: 16 },
              fontSize: { xs: 72, sm: 120 },
              color: "action.disabledBackground",
              opacity: 0.45,
              pointerEvents: "none",
            }}
          />
        )}
        <CardContent
          sx={{
            position: "relative",
            zIndex: 1,
            px: { xs: 1, sm: 2 },
            py: { xs: 1.5, sm: 2 },
            "&:last-child": { pb: { xs: 1.5, sm: 2 } },
          }}
        >
          <Stack spacing={2}>
            <Stack spacing={0.25}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "1.15rem", sm: "1.5rem" },
                  wordBreak: "break-word",
                }}
                color={isSuccess ? "primary.main" : "error.dark"}
              >
                {verb.titleEn}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontStyle: "italic", fontSize: { xs: "0.85rem", sm: "1rem" } }}>
                {verb.translationPt}
              </Typography>
            </Stack>

            <TableContainer
              sx={{
                width: "100%",
                maxWidth: "100%",
                overflowX: "auto",
                mx: { xs: -0.5, sm: 0 },
              }}
            >
              <Table
                size="small"
                sx={{
                  width: "100%",
                  minWidth: 0,
                  tableLayout: "fixed",
                  borderRadius: 1,
                }}
              >
                <TableHead>
                  <TableRow
                    sx={{
                      bgcolor: isSuccess ? "primary.main" : "warning.main",
                    }}
                  >
                    {["INFINITIVE", "PAST", "PARTICIPLE", "TRANSLATION"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: { xs: "0.55rem", sm: "0.7rem" },
                          letterSpacing: { xs: 0, sm: 0.5 },
                          borderBottom: "none",
                          py: { xs: 0.75, sm: 1 },
                          px: { xs: 0.35, sm: 1.5 },
                          width: "25%",
                          lineHeight: 1.1,
                          wordBreak: "break-word",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <BodyCell bold={emphasizeColumn === "infinitive"}>{verb.infinitive}</BodyCell>
                    <BodyCell bold={emphasizeColumn === "simplePast"}>{verb.simplePast}</BodyCell>
                    <BodyCell bold={emphasizeColumn === "participle"}>{verb.participle}</BodyCell>
                    <BodyCell bold={emphasizeColumn === "translation"}>
                      {verb.translationPt.toLowerCase()}
                    </BodyCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

function BodyCell({ children, bold }: { children: ReactNode; bold?: boolean }) {
  return (
    <TableCell
      sx={{
        fontWeight: bold ? 700 : 400,
        color: "text.primary",
        borderBottom: "none",
        fontSize: { xs: "0.62rem", sm: "0.875rem" },
        py: { xs: 0.65, sm: 1 },
        px: { xs: 0.35, sm: 1.5 },
        width: "25%",
        verticalAlign: "top",
        lineHeight: 1.2,
        wordBreak: "break-word",
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </TableCell>
  );
}
