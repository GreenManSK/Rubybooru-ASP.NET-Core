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
import { ITag, TagType } from "../../entities/tag";
import { useAddTag, useEditTag } from "../../queries/tags";

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

interface ITagFormProps {
  id?: string;
  tag?: ITag;
  close?: () => void;
}

export const TagForm = (props: ITagFormProps) => {
  const { id, tag, close } = props;

  const [name, setName] = React.useState("");
  const [type, setType] = React.useState(TagType.General);

  React.useEffect(() => {
    setName(tag?.name ?? "");
    setType(tag?.type ?? TagType.General);
  }, [tag]);

  const { mutate: addTag } = useAddTag();
  const { mutate: editTag } = useEditTag();

  const onTypeChange = (event: SelectChangeEvent) => {
    setType(parseInt(event.target.value));
  };

  const onSubmit = () => {
    const normalizedName = name.trim().toLocaleLowerCase().replace(" ", "_");
    if (tag) {
      editTag({ ...tag, name: normalizedName, type: type });
    } else {
      addTag({ name: normalizedName, type: type });
    }
    setName("");
    setType(TagType.General);
  };

  return (
    <Grid container spacing={2}>
      <Grid item sm={6} xs={12}>
        <Stack spacing={2}>
          <Typography sx={headerStyle} variant="h2" id={id}>
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
          <Stack spacing={2} direction="row">
            <Button
              size="small"
              fullWidth
              color="primary"
              variant="contained"
              onClick={onSubmit}
            >
              {tag ? "Edit" : "Add"}
            </Button>
            {tag && close && (
              <Button
                size="small"
                fullWidth
                color="secondary"
                variant="contained"
                onClick={close}
              >
                Close
              </Button>
            )}
          </Stack>
        </Stack>
      </Grid>
      <Grid item sm={6} xs={12}></Grid>
    </Grid>
  );
};
