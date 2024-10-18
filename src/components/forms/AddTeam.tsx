import { Box, TextField } from "@mui/material";
import { AddTeamStep } from "../../models/interfaces";

export interface AddTeamProps {
  currentStep: AddTeamStep;
  setTeamName: (name: string) => void;
  setResponsibleName: (name: string) => void;
  setResponsibleEmail: (email: string) => void;
}

function AddTeam({
  currentStep,
  setTeamName,
  setResponsibleName,
  setResponsibleEmail,
}: AddTeamProps) {
  function handleTeamNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTeamName(event.target.value);
  }
  function handleResponsibleNameChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setResponsibleName(event.target.value);
  }
  function handleResponsibleEmailChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setResponsibleEmail(event.target.value);
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <TextField
        label="Team Name"
        required
        value={currentStep.teamName.value}
        error={!!currentStep.teamName.error}
        helperText={currentStep.teamName.helperText}
        onChange={handleTeamNameChange}
        style={{ minHeight: "79px" }}
      />
      <TextField
        label="Responsible Name"
        required
        value={currentStep.responsibleName.value}
        error={!!currentStep.responsibleName.error}
        helperText={currentStep.responsibleName.helperText}
        onChange={handleResponsibleNameChange}
        style={{ minHeight: "79px" }}
      />
      <TextField
        label="Responsible Email"
        required
        type="email"
        value={currentStep.responsibleEmail.value}
        error={!!currentStep.responsibleEmail.error}
        helperText={currentStep.responsibleEmail.helperText}
        onChange={handleResponsibleEmailChange}
        style={{ minHeight: "79px" }}
      />
    </Box>
  );
}

export default AddTeam;
