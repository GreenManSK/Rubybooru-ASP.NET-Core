import { Box } from "@mui/material";
import { useTagUtils } from "../../providers/tag-utils-provider";
import { useAddImageTag } from "../../queries/tags";
import React from "react";
import { InputTextField } from "../utils/input-text-field";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import TagList from "../tag-list/tag-list";
import { useConfigContext } from "../../providers/config-provider";
import { ITag } from "../../entities/tag";

interface IAddImageTagFormProps {
  imageId: number;
}

const boxStyles = { marginTop: "1rem" };

export const AddImageTagForm = ({ imageId }: IAddImageTagFormProps) => {
  const { tagAddingWhispererLimit } = useConfigContext();
  const [value, setValue] = React.useState("");
  const { whisperer } = useTagUtils();
  const { mutate: addTag } = useAddImageTag(imageId);

  const onValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(value.trim());
    },
    []
  );

  const tagButton = React.useMemo(
    () => ({
      Icon: LibraryAddIcon,
      label: "Add tag",
      onClick: (tag: ITag) => {
        addTag(tag);
      },
    }),
    [addTag]
  );

  const whisperedTags = React.useMemo(() => {
    if (value.length < 1) return [];
    return whisperer(value.toLocaleLowerCase(), tagAddingWhispererLimit).map(
      (entity) => entity.entity
    );
  }, [whisperer, value, tagAddingWhispererLimit]);
  return (
    <Box sx={boxStyles}>
      <InputTextField value={value} onChange={onValueChange} />
      <TagList tags={whisperedTags} isLoading={false} button={tagButton} />
    </Box>
  );
};
