import { Theme, MenuList, MenuItem, Box } from "@mui/material";
import React from "react";
import { useTagUtils } from "../../providers/tag-utils-provider";
import { tagTextStyles } from "../../styles.constants";
import { InputTextField, inputStyles } from "../utils/input-text-field";

const boxStyles = {
  position: "relative",
};

const menuStyles = (theme: Theme) => ({
  position: "absolute",
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.default,
  border: `1px solid ${theme.palette.divider}`,
  zIndex: 500,
});

const menuItemStyles = {
  ...inputStyles,
  minHeight: "auto",
};

export const splitValue = (value: string) => value.split(" ");
const blockedKeys = ["ArrowUp", "ArrowDown", "Tab", "Enter"];

interface ISearchBarProps {
  value: string;
  setValue: (value: string) => void;
  submit: () => void;
}

export const SearchBar = (props: ISearchBarProps) => {
  const { value, setValue, submit } = props;
  const [prefix, setPrefix] = React.useState("");
  const [hasFocus, setHasFocus] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const focusTimerRef = React.useRef<number>(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const { whisperer } = useTagUtils();

  React.useEffect(() => {
    const prefix = splitValue(value)?.pop()?.toLocaleLowerCase() ?? "";
    setPrefix(prefix);
  }, [value]);

  const onValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(value);
    },
    [setValue]
  );

  const addItemToValue = React.useCallback(
    (item: string) => {
      const valueParts = splitValue(value);
      valueParts.pop();
      valueParts.push(item);
      setValue(`${valueParts.join(" ")} `);
      setActiveIndex(-1);
      inputRef.current?.focus();
    },
    [value, setValue]
  );

  const whisperedTags = React.useMemo(() => {
    if (!hasFocus || !prefix) return [];
    const usedItems = splitValue(value);
    return whisperer(prefix).filter(
      ({ entity: { name } }) => !usedItems.includes(name)
    );
  }, [whisperer, prefix, hasFocus, value]);

  const onFocus = React.useCallback(() => {
    clearTimeout(focusTimerRef.current);
    setHasFocus(true);
  }, []);

  const onBlur = React.useCallback(() => {
    focusTimerRef.current = setTimeout(
      () => setHasFocus(false),
      150
    ) as unknown as number;
  }, []);

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (!blockedKeys.includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Enter") {
        if (activeIndex === -1) {
          submit();
        } else if (whisperedTags.length !== 0) {
          addItemToValue(whisperedTags[activeIndex].entity.name);
        }
        return;
      }
      if (whisperedTags.length === 0) return;
      let newIndex = activeIndex;
      if (event.key === "ArrowDown" || event.key === "Tab") {
        newIndex += 1;
      } else if (event.key === "ArrowUp") {
        newIndex -= 1;
      }
      if (newIndex < 0) {
        newIndex = -1;
      } else if (newIndex >= whisperedTags.length) {
        newIndex = 0;
      }
      setActiveIndex(newIndex);
    },
    [activeIndex, whisperedTags, addItemToValue, submit]
  );

  return (
    <Box sx={boxStyles}>
      <InputTextField
        inputRef={inputRef}
        value={value}
        onChange={onValueChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />
      <MenuList dense disablePadding={true} sx={menuStyles}>
        {whisperedTags.map((whisper, key) => {
          const { entity: tag } = whisper;
          return (
            <MenuItem
              key={tag.id ?? key}
              sx={[menuItemStyles, tagTextStyles[tag.type]]}
              onClick={() => addItemToValue(tag.name)}
              selected={key === activeIndex}
            >
              {whisper.highlightMatch(prefix)}
            </MenuItem>
          );
        })}
      </MenuList>
    </Box>
  );
};
