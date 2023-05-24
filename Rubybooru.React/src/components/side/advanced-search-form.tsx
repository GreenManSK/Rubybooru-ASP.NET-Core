import React from "react";
import { ISizeCondition } from "../../entities/size-condition";
import { SizeConditionType } from "../../entities/size-condition";
import { SizeConditionOperation } from "../../entities/size-condition";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";

interface IAdvancedSearchFormProps {
  sizeConditions: ISizeCondition[];
  setSizeConditions: (sizeConditions: ISizeCondition[]) => void;
  submit: () => void;
}

const boxStyle = {
  marginTop: "1rem",
};

export const AdvancedSearchForm = (props: IAdvancedSearchFormProps) => {
  const { sizeConditions, setSizeConditions, submit } = props;

  const addCondition = React.useCallback(() => {
    setSizeConditions([
      ...sizeConditions,
      {
        type: SizeConditionType.SideSize,
        operation: SizeConditionOperation.Equals,
        ratioValue: 1,
      },
    ]);
  }, [sizeConditions, setSizeConditions]);

  React.useEffect(() => {
    if (sizeConditions.length > 0) return;
    addCondition();
  }, [sizeConditions, addCondition]);

  return (
    <Stack spacing={2} sx={boxStyle}>
      {sizeConditions.map((condition, index) => (
        <SizeCondition key={index} condition={condition} submit={submit} />
      ))}
      <Button variant="contained" size="small" onClick={addCondition}>
        +
      </Button>
    </Stack>
  );
};

interface ISizeConditionProps {
  condition: ISizeCondition;
  submit?: () => void;
}
const SizeCondition = ({ condition, submit }: ISizeConditionProps) => {
  const [type, setType] = React.useState(condition.type);

  return condition.type === SizeConditionType.SideSize ? (
    <SizeConditionSize
      condition={condition}
      type={type}
      setType={setType}
      submit={submit}
    />
  ) : (
    <SizeConditionRatio
      condition={condition}
      type={type}
      setType={setType}
      submit={submit}
    />
  );
};

interface ISpecificSizeConditionProps extends ISizeConditionProps {
  type: SizeConditionType;
  setType: (type: SizeConditionType) => void;
}

const SizeConditionSize = ({
  condition,
  type,
  setType,
}: ISpecificSizeConditionProps) => {
  return (
    <Grid container>
      <Grid item xs={7}>
        <ConditionTypeSelector
          condition={condition}
          type={type}
          setType={setType}
        />
      </Grid>
      <Grid item xs={5}>
        <ConditionOperationSelector condition={condition} />
      </Grid>
    </Grid>
  );
};

const SizeConditionRatio = ({
  condition,
  type,
  setType,
  submit,
}: ISpecificSizeConditionProps) => {
  const [ratio, setRatio] = React.useState(condition.ratioValue);

  const onRatioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value);
    setRatio(newValue);
    condition.ratioValue = newValue;
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      submit?.();
    }
  };

  return (
    <Grid container>
      <Grid item xs={6}>
        <ConditionTypeSelector
          condition={condition}
          type={type}
          setType={setType}
        />
      </Grid>
      <Grid item xs={3}>
        <ConditionOperationSelector condition={condition} />
      </Grid>
      <Grid item xs={3}>
        <TextField
          type="number"
          size="small"
          value={ratio}
          onChange={onRatioChange}
          onKeyDown={onKeyDown}
        />
      </Grid>
    </Grid>
  );
};

const ConditionTypeSelector = ({
  condition,
  type,
  setType,
}: ISpecificSizeConditionProps) => {
  const handleChange = (event: SelectChangeEvent) => {
    const newValue = parseInt(event.target.value);
    setType(newValue);
    condition.type = newValue;
  };

  return (
    <FormControl size="small" fullWidth>
      <Select value={`${type}`} onChange={handleChange}>
        <MenuItem value={SizeConditionType.SideSize}>Width ? Height</MenuItem>
        <MenuItem value={SizeConditionType.SideRatio}>Width / Height</MenuItem>
      </Select>
    </FormControl>
  );
};

const ConditionOperationSelector = ({ condition }: ISizeConditionProps) => {
  const [value, setValue] = React.useState(condition.operation);

  const handleChange = (event: SelectChangeEvent) => {
    const newValue = parseInt(event.target.value);
    setValue(newValue);
    condition.operation = newValue;
  };

  return (
    <FormControl size="small" fullWidth>
      <Select value={`${value}`} onChange={handleChange}>
        <MenuItem value={SizeConditionOperation.Equals}> = </MenuItem>
        <MenuItem value={SizeConditionOperation.GreaterEquals}> &ge; </MenuItem>
        <MenuItem value={SizeConditionOperation.LessEquals}> &le;</MenuItem>
        <MenuItem value={SizeConditionOperation.NotEquals}> &ne; </MenuItem>
      </Select>
    </FormControl>
  );
};
