/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  TextField,
} from "@mui/material";
import { AddTeamMembersStep } from "../../models/interfaces";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { Country } from "../../types";
import CountrySelect from "../common/UI/CountrySelect";
import { AddCircle } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

export interface AddTeamMembersProps {
  currentStep: AddTeamMembersStep;
  setTeamMembersHandler: (members: string[]) => void;
  setNationalitiesHandler: (nationalities: string[]) => void;
}
function AddTeamMembers({
  currentStep,
  setTeamMembersHandler,
  setNationalitiesHandler,
}: AddTeamMembersProps) {
  const [teamMembers, setTeamMembers] = useState<string[]>(
    (currentStep.teamMembers?.value as string[]) ?? []
  );
  const [nationalities, setNationalities] = useState<string[]>(
    (currentStep.nationalities?.value as string[]) ?? []
  );
  const [teamMembersInput, setTeamMembersInput] = useState<string>("");
  const [nationalitiesInput, setNationalitiesInput] = useState<Country | null>(
    null
  );

  function handleAddTeamMember() {
    if (teamMembersInput.length) {
      const newTeamMembers = [...teamMembers, teamMembersInput];
      setTeamMembers(newTeamMembers);
      setTeamMembersHandler(newTeamMembers);
      setTeamMembersInput("");
    }
  }
  function handleAddNationality(value: Country | null) {
    const newNationalities = [...nationalities, value?.name ?? ""];
    setNationalities(newNationalities);
    setNationalitiesHandler(newNationalities);
    setNationalitiesInput(null);
  }
  function handleTeamMembersChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newTeamMembers = event.target.value;
    setTeamMembersInput(newTeamMembers);
  }

  function handleRemoveTeamMember(index: number): void {
    const newTeamMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(newTeamMembers);
    setTeamMembersHandler(newTeamMembers);
  }
  function handleRemoveNationality(index: number): void {
    const newNationalities = nationalities.filter((_, i) => i !== index);
    setNationalities(newNationalities);
    setNationalitiesHandler(newNationalities);
  }

  return (
    <div css={teamMembersContainer}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          paddingBottom: "15px",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
          <TextField
            required
            label="Team Members"
            onChange={handleTeamMembersChange}
            value={teamMembersInput}
            error={!!currentStep?.teamMembers?.error}
            helperText={currentStep?.teamMembers?.helperText}
          />
          <IconButton onClick={handleAddTeamMember} sx={{ height: "56px" }}>
            <AddCircle sx={{ color: blue[700] }} />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <CountrySelect
            onChange={handleAddNationality}
            value={nationalitiesInput}
            error={!!currentStep?.nationalities?.error}
            helperText={currentStep?.nationalities?.helperText}
          />
        </Box>
      </Box>
      <Box css={listsContainer}>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            position: "relative",
            overflow: "auto",
            height: "100%",
            "& ul": { padding: 0 },
          }}
          subheader={<li />}
        >
          <li key="section-team-members">
            <ul>
              <ListSubheader>Team Members</ListSubheader>
              {teamMembers.length ? (
                teamMembers.map((member, index) => (
                  <ListItem key={`team-member-${index}`}>
                    <ListItemText primary={member} />
                    <IconButton onClick={() => handleRemoveTeamMember(index)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>No team members</ListItem>
              )}
            </ul>
          </li>
          <li key="section-nationalities">
            <ul>
              <ListSubheader>Nationalities</ListSubheader>
              {nationalities.length ? (
                nationalities.map((nationality, index) => (
                  <ListItem key={`nationality-${index}`}>
                    <ListItemText primary={nationality} />
                    <IconButton onClick={() => handleRemoveNationality(index)}>
                      <CloseIcon />
                    </IconButton>
                  </ListItem>
                ))
              ) : (
                <ListItem>No nationalities</ListItem>
              )}
            </ul>
          </li>
        </List>
      </Box>
    </div>
  );
}
const teamMembersContainer = css`
  display: flex;
  flex-direction: column;
`;

const listsContainer = css`
  display: flex;
  flex-direction: column;
  // height calculation - 56px header -330 px stepper section - 225px input section - 37px buttons at bottom - 42px header section for step with padding - 55px sum of top and bottom padding on page
  max-height: calc(100vh - 56px - 232px - 183px - 37px - 42px - 55px);
`;

export default AddTeamMembers;
