import { useUntaggedYears } from "../../queries/images";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import React from "react";
import { useUntaggedYear } from "../../utils/navigation-helpers";

const boxStyles = {
  marginTop: "2rem",
};

const UntaggedSidePanel = () => {
  const { data: years } = useUntaggedYears();

  const [year, setYear] = useUntaggedYear();

  const handleChange = (event: SelectChangeEvent) => {
    setYear(parseInt(event.target.value));
  };
  return (
    <FormControl size="small" fullWidth sx={boxStyles}>
      <InputLabel id="untagged-year-label">Select year</InputLabel>
      <Select
        labelId="untagged-year-label"
        value={`${year ?? 0}`}
        label="Untagged year"
        onChange={handleChange}
      >
        <MenuItem value={0}>
          <em>All</em>
        </MenuItem>
        {years?.map((year) => (
          <MenuItem value={year} key={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default UntaggedSidePanel;
