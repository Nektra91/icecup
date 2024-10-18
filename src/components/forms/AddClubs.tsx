import { useState } from "react";
import { AddClubStep } from "../../models/interfaces";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  TextField,
  Theme,
  useTheme,
  FormHelperText,
  IconButton,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";
import { blue } from "@mui/material/colors";

export interface AddClubsProps {
  setClubsHandler: (clubs: string[]) => void;
  currentStep: AddClubStep;
  availableClubs: string[];
  setAvailableClubsHandler: (clubs: string[]) => void;
}
function getStyles(name: string, clubName: string[], theme: Theme) {
  return {
    fontWeight: clubName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
function AddClubs({
  setClubsHandler,
  setAvailableClubsHandler,
  currentStep,
  availableClubs,
}: AddClubsProps) {
  const theme = useTheme();
  const [newClubInput, setNewClubInput] = useState<string>("");

  function handleChange(event: SelectChangeEvent<typeof availableClubs>) {
    const {
      target: { value },
    } = event;
    const newClubs = typeof value === "string" ? value.split(",") : value;
    setClubsHandler(newClubs);
  }

  function addNewClub() {
    if (newClubInput && !availableClubs.includes(newClubInput)) {
      setAvailableClubsHandler([...availableClubs, newClubInput]);
      setNewClubInput("");
      handleChange({
        target: {
          value: [
            ...(currentStep?.curlingsClubs?.value as string[]),
            newClubInput,
          ],
        },
      } as SelectChangeEvent<typeof availableClubs>);
    }
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
        <TextField
          label="Add new curling Club"
          value={newClubInput}
          onChange={(e) => setNewClubInput(e.target.value)}
        />

        <IconButton onClick={addNewClub} sx={{ height: "56px" }}>
          <AddCircle sx={{ color: blue[700] }} />
        </IconButton>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <FormControl
          sx={{ m: 0, width: 300 }}
          error={!!currentStep.curlingsClubs.error}
        >
          <InputLabel id="demo-multiple-name-label">curling clubs</InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={currentStep.curlingsClubs.value as string[]}
            onChange={handleChange}
            input={<OutlinedInput label="curling clubs" />}
            MenuProps={MenuProps}
          >
            {availableClubs?.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(
                  name,
                  (currentStep?.curlingsClubs?.value as string[]) ?? [],
                  theme
                )}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText error={!!currentStep.curlingsClubs.error}>
            {currentStep.curlingsClubs.helperText}
          </FormHelperText>
        </FormControl>
      </Box>
    </Box>
  );
}
export default AddClubs;
