import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { allCountries } from "../../../data";
import { Country } from "../../../types";
import { useState, useRef } from "react";

export type CountrySelectProps = {
  onChange: (value: Country | null) => void;
  value: Country | null;
  error: boolean;
  helperText: string | undefined;
};
export function CountrySelect({
  onChange,
  value,
  error,
  helperText,
}: CountrySelectProps) {
  const [valueState, setValueState] = useState<Country | null>(value);
  const textFieldRef = useRef<HTMLInputElement | null>(null); // Create a ref

  function handleChange(event: React.SyntheticEvent, value: Country | null) {
    setValueState(value);
    if (value) {
      onChange(value);
      textFieldRef.current?.blur(); // Move focus away from the text field
    }
  }

  return (
    <Autocomplete
      id="country-select-demo"
      sx={{ width: 300 }}
      options={allCountries}
      autoHighlight
      onChange={handleChange}
      value={valueState}
      defaultValue={{
        code: "US",
        name: "United States",
        abbr: "US",
        icon: "ðŸ‡¦ðŸ‡«",
        suggested: true,
      }}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props; // Destructure key from props
        return (
          <Box
            component="li"
            key={key} // Pass key directly
            sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
            {...otherProps} // Spread the rest of the props
          >
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.abbr.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.abbr.toLowerCase()}.png 2x, https://flagcdn.com/w60/${option.abbr.toLowerCase()}.png 3x`}
              alt=""
            />
            {option.name} ({option.abbr}) +{option.code}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Choose a country"
          error={error}
          helperText={helperText}
          value={valueState?.name}
          inputRef={textFieldRef} // Attach the ref to the TextField
        />
      )}
    />
  );
}

export default CountrySelect;
