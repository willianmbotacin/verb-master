"use client";

import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ClearIcon from "@mui/icons-material/Clear";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HistoryIcon from "@mui/icons-material/History";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TranslateIcon from "@mui/icons-material/Translate";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { ChallengeColumn } from "@/lib/mockVerbs";
import { searchVerbs, sheetToVerbEntry } from "@/lib/verbCatalog";

type ChallengeCardProps = {
  label: string;
  icon: ReactNode;
  iconColor: string;
  iconBg: string;
  href: string;
};

function ChallengeCard({ label, icon, iconColor, iconBg, href }: ChallengeCardProps) {
  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: { xs: 2, sm: 3 },
        width: "100%",
        height: { sm: "100%" },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea
        component={Link}
        href={href}
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: { xs: "flex-start", sm: "center" },
          py: { xs: 1.25, sm: 3 },
          px: { xs: 1.5, sm: 1 },
        }}
      >
        <Stack
          direction={{ xs: "row", sm: "column" }}
          spacing={{ xs: 1.5, sm: 1.5 }}
          sx={{
            alignItems: "center",
            justifyContent: { xs: "flex-start", sm: "center" },
            width: "100%",
          }}
        >
          <Box
            sx={{
              width: { xs: 48, sm: 72 },
              height: { xs: 48, sm: 72 },
              borderRadius: "50%",
              bgcolor: iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: iconColor,
              flexShrink: 0,
              "& svg": { fontSize: { xs: 24, sm: 36 } },
            }}
          >
            {icon}
          </Box>
          <Typography
            variant="subtitle2"
            color="text.primary"
            sx={{
              fontWeight: 700,
              fontSize: { xs: "1rem", sm: "0.875rem" },
              lineHeight: 1.25,
              textAlign: { xs: "left", sm: "center" },
              flex: { xs: 1, sm: "none" },
              minWidth: 0,
            }}
          >
            {label}
          </Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}

function drawHref(column: ChallengeColumn) {
  return `/draw?challenge=${column}`;
}

function VerbSearchTable({ query }: { query: string }) {
  const results = useMemo(() => searchVerbs(query).map(sheetToVerbEntry), [query]);

  if (results.length === 0) {
    return (
      <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>
        No verbs found for &ldquo;{query}&rdquo;.
      </Typography>
    );
  }

  return (
    <Card elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TableContainer sx={{ width: "100%", maxWidth: "100%", overflowX: "auto" }}>
        <Table
          size="small"
          sx={{
            width: "100%",
            minWidth: 0,
            tableLayout: "fixed",
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
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
            {results.map((verb) => (
              <TableRow key={verb.infinitive}>
                <SearchBodyCell>{verb.infinitive}</SearchBodyCell>
                <SearchBodyCell>{verb.simplePast}</SearchBodyCell>
                <SearchBodyCell>{verb.participle}</SearchBodyCell>
                <SearchBodyCell>{verb.translationPt.toLowerCase()}</SearchBodyCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
}

function SearchBodyCell({ children }: { children: ReactNode }) {
  return (
    <TableCell
      sx={{
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
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

export default function ChallengeHome() {
  const primary = "#0052CC";
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const trimmedQuery = searchQuery.trim();
  const showSearchResults = trimmedQuery.length > 0;

  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#F8F9FA",
        px: { xs: 1.5, sm: 2 },
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          width: "100%",
          my: { xs: 0, sm: "auto" },
          py: { xs: 0.75, sm: 4 },
          display: "flex",
          flexDirection: "column",
          justifyContent: { xs: "center", sm: "flex-start" },
          minHeight: { xs: "100dvh", sm: "auto" },
        }}
      >
        <Stack spacing={{ xs: 1.25, sm: 4 }} sx={{ alignItems: "stretch" }}>
          {showSearchResults ? (
            <Stack spacing={{ xs: 1.5, sm: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={clearSearch}
                sx={{
                  alignSelf: "flex-start",
                  borderRadius: 2,
                  borderWidth: 2,
                  bgcolor: "secondary.main",
                }}
              >
                Back
              </Button>
              <Stack spacing={0.5} sx={{ textAlign: "center" }}>
                <Typography variant="h5" component="h1" color="text.primary" sx={{ fontWeight: 600 }}>
                  Search results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Showing verbs matching &ldquo;{trimmedQuery}&rdquo;
                </Typography>
              </Stack>
            </Stack>
          ) : (
            <>
              <Stack spacing={{ xs: 0.5, sm: 1 }} sx={{ textAlign: "center", flexShrink: 0 }}>
                <Typography
                  variant="h5"
                  component="h1"
                  color="text.primary"
                  sx={{
                    fontWeight: 600,
                    fontSize: { sm: "2.125rem" },
                    lineHeight: 1.25,
                  }}
                >
                  Choose your challenge
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.35, px: { xs: 0.5, sm: 0 } }}>
                  Ready to master irregular verbs today?
                </Typography>
              </Stack>

              <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ flexShrink: 0 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ChallengeCard
                    label="Infinitive"
                    href={drawHref("infinitive")}
                    icon={<MenuBookIcon />}
                    iconColor={primary}
                    iconBg={alpha(primary, 0.12)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ChallengeCard
                    label="Simple Past"
                    href={drawHref("simplePast")}
                    icon={<HistoryIcon />}
                    iconColor="#2E7D32"
                    iconBg={alpha("#2E7D32", 0.12)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ChallengeCard
                    label="Participle"
                    href={drawHref("participle")}
                    icon={<AutoAwesomeIcon />}
                    iconColor="#B8860B"
                    iconBg={alpha("#FFC107", 0.2)}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ChallengeCard
                    label="Translation"
                    href={drawHref("translation")}
                    icon={<TranslateIcon />}
                    iconColor="#303F9F"
                    iconBg={alpha("#7E57C2", 0.15)}
                  />
                </Grid>
              </Grid>
            </>
          )}

          <TextField
            fullWidth
            placeholder="Search verbs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                inputRef: searchInputRef,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery ? (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Clear search"
                      onClick={clearSearch}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : undefined,
              },
            }}
            sx={{
              flexShrink: 0,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper",
              },
            }}
          />

          {showSearchResults && <VerbSearchTable query={trimmedQuery} />}
        </Stack>
      </Container>
    </Box>
  );
}
