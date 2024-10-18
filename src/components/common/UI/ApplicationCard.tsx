import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid2,
  IconButton,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { Application } from "../../../models/interfaces";

export interface ApplicationCardProps {
  application: Application;
  isWaitingList?: boolean;
  canEdit?: boolean;
  competitionId?: string;
  isValid?: boolean;
  approveApplication?: (id: string) => void;
  moveApplicationToWaitingList?: (id: string) => void;
  deleteApplication?: (id: string) => void;
  moveApplicationOffWaitingList?: (id: string) => void;
  deleteApplicationFromWaitingList?: (id: string) => void;
}

export function ApplicationCard({
  application,
  isWaitingList = false,
  canEdit = false,
  competitionId = "",
  approveApplication = () => {},
  moveApplicationToWaitingList = () => {},
  deleteApplication = () => {},
  moveApplicationOffWaitingList = () => {},
  deleteApplicationFromWaitingList = () => {},
  isValid = false,
}: ApplicationCardProps) {
  const navigate = useNavigate();
  const editIcon = canEdit ? (
    <IconButton
      onClick={() =>
        navigate(`/edit-application/${application.id}`, {
          state: { application, competitionId: competitionId },
        })
      }
    >
      <EditIcon />
    </IconButton>
  ) : null;
  const actionButtons = canEdit ? (
    !application.accepted && (
      <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
        {!isWaitingList ? (
          <>
            <Button
              variant="contained"
              color="success"
              onClick={() => approveApplication(application.id)}
            >
              Confirm
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => moveApplicationToWaitingList(application.id)}
            >
              Move to waiting list
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteApplication(application.id)}
            >
              Delete
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => moveApplicationOffWaitingList(application.id)}
            >
              Move off waiting list
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => deleteApplicationFromWaitingList(application.id)}
            >
              Delete
            </Button>
          </>
        )}
      </Box>
    )
  ) : (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
      <Button
        variant="contained"
        disabled={!isValid}
        color="success"
        onClick={() => approveApplication(application.id)}
      >
        Confirm
      </Button>
    </Box>
  );
  const appliedOnElement = canEdit ? (
    <Typography variant="body2">Applied on: {application.appliedOn}</Typography>
  ) : null;
  return (
    <Card sx={{ mb: 2, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5" component="div" gutterBottom>
            {application.teamName}
          </Typography>
          {editIcon}
        </Box>
        <Grid2 container spacing={2}>
          <Grid2 sx={{ width: "50%" }}>
            <Typography variant="subtitle1" gutterBottom>
              Team Members:
            </Typography>
            {application.teamMembers.map((member: string, index: number) => (
              <Typography key={index} variant="body2">
                {member}
              </Typography>
            ))}
          </Grid2>
          <Grid2 sx={{ width: "50%" }}>
            <Typography variant="subtitle1" gutterBottom>
              Curling Clubs:
            </Typography>
            {application.curlingsClubs.map((club: string, index: number) => (
              <Chip key={index} label={club} sx={{ mr: 1, mb: 1 }} />
            ))}
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Nationalities:
            </Typography>
            {application.nationalities.map(
              (nationality: string, index: number) => (
                <Chip key={index} label={nationality} sx={{ mr: 1, mb: 1 }} />
              )
            )}
          </Grid2>
        </Grid2>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            Responsible: {application.responsibleName}
          </Typography>
          <Typography variant="body2">
            Email: {application.responsibleEmail}
          </Typography>
          {appliedOnElement}
        </Box>
        {application.accepted && (
          <Chip label="Application accepted" color="success" sx={{ mt: 2 }} />
        )}
        {actionButtons}
      </CardContent>
    </Card>
  );
}

export default ApplicationCard;
