import React from "react";
import {
  Transgender,
  MedicalServices,
  SportsKabaddi,
  AttachMoney,
  Woman,
  Gavel,
} from "@mui/icons-material";
import { Box, Stack, Card } from "@mui/material";
import { Chip, Divider, Typography } from "@mui/joy";
const SafetyInfoWindow = ({ card }) => {
  return (
    <Card sx={{ width: "100%", maxWidth: 290 }}>
      <Box sx={{ my: 1, mx: 2 }}>
        <Chip sx={{ mb: 0.5 }} variant="outlined">
          Safety Score: {card.content.overall}
        </Chip>
        <Typography
          variant="h6"
          sx={{ fontSize: "md", fontWeight: "lg", color: "black" }}
          noWrap
        >
          {card.name}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ m: 1 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            size="sm"
            color="info"
            startDecorator={<Transgender />}
            variant="soft"
          >
            LGBTQ+: {card.content.lgbtq}
          </Chip>
          <Chip size="sm" startDecorator={<MedicalServices />} variant="soft">
            Medical: {card.content.medical}
          </Chip>
          <Chip
            size="sm"
            color="danger"
            startDecorator={<SportsKabaddi />}
            variant="soft"
          >
            Physical Harm: {card.content.physicalHarm}
          </Chip>
          <Chip
            size="sm"
            color="neutral"
            startDecorator={<Woman />}
            variant="soft"
          >
            Women: {card.content.women}
          </Chip>
          <Chip
            size="sm"
            color="warning"
            startDecorator={<Gavel />}
            variant="soft"
          >
            Political Freedom: {card.content.politicalFreedom}
          </Chip>
          <Chip
            size="sm"
            color="success"
            startDecorator={<AttachMoney />}
            variant="soft"
          >
            Theft: {card.content.theft}
          </Chip>
        </Stack>
      </Box>
    </Card>
  );
};
export default SafetyInfoWindow;
