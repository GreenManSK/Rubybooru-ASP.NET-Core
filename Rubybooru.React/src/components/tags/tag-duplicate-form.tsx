import React from "react";
import { ITag } from "../../entities/tag";
import { useConfigContext } from "../../providers/config-provider";
import { useTagUtils } from "../../providers/tag-utils-provider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import TagList from "../tag-list/tag-list";
import { useSetTagDuplicate } from "../../queries/tags";

interface ITagDuplicateFormProps {
  tag: ITag;
}

export const TagDuplicateForm = (props: ITagDuplicateFormProps) => {
  const { tag } = props;
  const { tagAddingWhispererLimit } = useConfigContext();
  const [value, setValue] = React.useState("");
  const { whisperer } = useTagUtils();
  const { mutate: setTagDuplicate } = useSetTagDuplicate();

  React.useEffect(() => setValue(""), [tag]);

  const whisperedTags = React.useMemo(() => {
    if (value.length < 1) return [];
    return whisperer(value.toLocaleLowerCase(), tagAddingWhispererLimit)
      .map((entity) => entity.entity)
      .filter((t) => t.id !== tag.id);
  }, [whisperer, value, tagAddingWhispererLimit, tag]);

  const onTagClick = (duplicate: ITag) => {
    if (
      window.confirm(
        `Do you want to set ${duplicate.name} as duplicate of ${tag.name}? ${duplicate.name} will no longer show up.`
      )
    ) {
      setTagDuplicate({ originalId: tag.id, duplicateId: duplicate.id });
    }
  };

  return (
    <Stack spacing={2}>
      <TextField
        label="Tag name"
        size="small"
        fullWidth
        color="primary"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <TagList tags={whisperedTags} isLoading={false} onTagClick={onTagClick} />
    </Stack>
  );
};
