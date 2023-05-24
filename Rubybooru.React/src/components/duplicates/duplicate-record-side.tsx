import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DuplicateRecordResolution } from "../../entities/duplicate-record";
import { useResolveDuplicate } from "../../queries/duplicates";

const boxStyles = {
  marginTop: "1rem",
  textAlign: "center",
};

const switchStyles = {
  margin: "0 auto",
};

const DuplicateRecordSide = () => {
  const navigate = useNavigate();
  const { id: idParam = "1" } = useParams();
  const id = parseInt(idParam);

  const { mutate: resolve, isSuccess } = useResolveDuplicate(id);
  const [mergeTags, setMergeTags] = React.useState(true);

  const resolveDuplicate = (resolution: DuplicateRecordResolution) => {
    resolve({ resolution, mergeTags });
  };

  React.useEffect(() => {
    if (!isSuccess) return;
    navigate("/duplicates/");
  }, [isSuccess, navigate]);

  return (
    <Stack sx={boxStyles}>
      <FormControlLabel
        control={
          <Switch
            checked={mergeTags}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setMergeTags(event.target.checked)
            }
          />
        }
        label="Merge tags"
        sx={switchStyles}
      />
      <Grid container spacing={1}>
        <Grid item md={4} sm={12}>
          <Button
            variant="contained"
            onClick={() => resolveDuplicate(DuplicateRecordResolution.A)}
          >
            Left
          </Button>
        </Grid>
        <Grid item md={4} sm={12}>
          <Button
            variant="contained"
            onClick={() =>
              resolveDuplicate(DuplicateRecordResolution.NotDuplicate)
            }
          >
            Different
          </Button>
        </Grid>
        <Grid item md={4} sm={12}>
          <Button
            variant="contained"
            onClick={() => resolveDuplicate(DuplicateRecordResolution.B)}
          >
            Right
          </Button>
        </Grid>
      </Grid>
    </Stack>
  );
};

export default DuplicateRecordSide;
