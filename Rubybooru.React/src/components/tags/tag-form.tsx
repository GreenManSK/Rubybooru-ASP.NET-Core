import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { TagType } from "../../entities/tag";
import { useAddTag } from "../../queries/tags";

const headerStyle = {
  fontSize: "3rem",
  fontWeight: "bold",
};

const TagTypeOptions = [
  { value: TagType.General, label: "General" },
  { value: TagType.Author, label: "Author" },
  { value: TagType.Character, label: "Character" },
  { value: TagType.Copyright, label: "Copyright" },
  { value: TagType.System, label: "System" },
];

export const TagForm = () => {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState(TagType.General);

  const { mutate: addTag } = useAddTag();

  const onTypeChange = (event: SelectChangeEvent) => {
    setType(parseInt(event.target.value));
  };

  const onSubmit = () => {
    const normalizedName = name.trim().toLocaleLowerCase().replace(" ", "_");
    addTag({ name: normalizedName, type: type });
    setName("");
    setType(TagType.General);
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}>
        <Stack spacing={2}>
          <Typography sx={headerStyle} variant="h2">
            Tag form
          </Typography>
          <TextField
            label="Tag name"
            size="small"
            fullWidth
            color="primary"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <FormControl size="small" fullWidth>
            <InputLabel id="tag-type">Tag type</InputLabel>
            <Select
              labelId="tag-type"
              label="Tag type"
              value={`${type}`}
              onChange={onTypeChange}
            >
              {TagTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            size="small"
            fullWidth
            color="primary"
            variant="contained"
            onClick={onSubmit}
          >
            Add tag
          </Button>
        </Stack>
      </Grid>
      <Grid item sm={6} xs={12}></Grid>
    </Grid>
  );
};
