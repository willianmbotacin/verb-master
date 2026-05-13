"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HistoryIcon from "@mui/icons-material/History";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TranslateIcon from "@mui/icons-material/Translate";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import type { ChallengeColumn } from "@/lib/mockVerbs";

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

export default function ChallengeHome() {
  const primary = "#0052CC";

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
        </Stack>
      </Container>
    </Box>
  );
}
