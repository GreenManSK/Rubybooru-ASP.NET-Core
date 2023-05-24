import { useUntaggedImagesCount, useUntaggedYears } from "../../queries/images";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import React from "react";
import { useUntaggedYear } from "../../utils/navigation-helpers";
import { useUntaggedImagesOptions } from "../../utils/images";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";

const boxStyles = {
  marginTop: "2rem",
  textAlign: "center",
};

const UntaggedSidePanel = () => {
  const [year, setYear] = useUntaggedYear();
  const imagesOptions = useUntaggedImagesOptions();

  const { data: imageCount = 0, isSuccess } =
    useUntaggedImagesCount(imagesOptions);
  const { data: years } = useUntaggedYears();

  const handleChange = (event: SelectChangeEvent) => {
    setYear(parseInt(event.target.value));
  };
  return (
    <Stack sx={boxStyles} spacing={2}>
      {isSuccess ? (
        <Typography>
          You have <strong>{imageCount}</strong> images remaining!
        </Typography>
      ) : (
        <Skeleton variant="text" />
      )}
      <FormControl size="small" fullWidth>
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
    </Stack>
  );
};

export default UntaggedSidePanel;
