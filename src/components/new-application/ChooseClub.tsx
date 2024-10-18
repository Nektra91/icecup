import { Box, Container, Grid2, Typography } from "@mui/material";
import { Competition } from "../../models/interfaces";

export interface ChooseClubProps {
  competition: Competition;
}
function ChooseClub({ competition }: ChooseClubProps) {
  const availableClubs = Array.from(
    new Set(
      competition.applications
        .filter((app) => app.accepted)
        .map((app) => app.curlingsClubs)
        .flat()
        .sort()
    )
  );
  return (
    <Container maxWidth="sm">
      <Box>
        <Typography>Please select a curling club</Typography>
      </Box>
      <Grid2 container spacing={2}>
        {availableClubs.map((availableClub, index) => (
          <Box component="div" key={index}>
            {availableClub}
          </Box>
        ))}
      </Grid2>
    </Container>
  );
}

export default ChooseClub;
