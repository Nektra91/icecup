import {
  Grid2,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  SxProps,
  Theme,
  Box,
  Chip,
} from "@mui/material";
import { Competition } from "../../models/interfaces";
import { grey } from "@mui/material/colors";
import icecupLogo from "../../logo/icecup-logo.jpg";
import Icon from "../common/UI/Icon";
export interface ChooseCompetitionProps {
  competitions: Competition[];
  handleCompetitionSelection: (competition: Competition) => void;
}

function ChooseCompetition({
  competitions,
  handleCompetitionSelection,
}: ChooseCompetitionProps): React.ReactElement {
  return (
    <Grid2
      container
      spacing={2}
      boxShadow="none"
      sx={{
        backgroundColor: grey[50],
        width: "100%",
      }}
    >
      {competitions.map((competition) => (
        <Card key={competition.id} sx={cardStyles}>
          <CardActionArea
            onClick={() => handleCompetitionSelection(competition)}
          >
            <CardContent>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="h6">{competition.name}</Typography>
                <Chip
                  icon={<Icon logo={icecupLogo} />}
                  label="Active"
                  color="primary"
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Max teams: {competition.maxTeams}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Available slots:{" "}
                {competition.maxTeams - competition.applications.length}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Grid2>
  );
}

// Update the ChooseCompetion component to use these card styles
const cardStyles: SxProps<Theme> = {
  backgroundColor: "white",
  borderRadius: "8px",
  width: "100%",
  // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.2)",
  },
};

export default ChooseCompetition;
