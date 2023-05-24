import { Grid, Stack, Typography } from "@mui/material";
import { useTagUtils } from "../../providers/tag-utils-provider";
import React, { PropsWithChildren } from "react";
import { InputTextField } from "../utils/input-text-field";
import DeleteIcon from "@mui/icons-material/Delete";
import TagList from "../tag-list/tag-list";
import { useConfigContext } from "../../providers/config-provider";
import { ITag } from "../../entities/tag";
import { useDeleteTag } from "../../queries/tags";
import { TagForm } from "./tag-form";

const headerStyle = {
  fontSize: "3.5rem",
  fontWeight: "bold",
};

const formId = "tag-edit-form";

const TagManager = () => {
  const { tagAddingWhispererLimit } = useConfigContext();
  const [value, setValue] = React.useState("");
  const { whisperer } = useTagUtils();
  const { mutate: deleteTag } = useDeleteTag();

  const [tag, setTag] = React.useState<ITag | undefined>(undefined);

  const onValueChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setValue(value.trim());
    },
    []
  );

  const tagButton = React.useMemo(
    () => ({
      Icon: DeleteIcon,
      label: "Delete tag",
      onClick: (tag: ITag) => {
        if (window.confirm(`Do you want to delete ${tag.name}?`)) {
          deleteTag(tag.id);
        }
      },
    }),
    [deleteTag]
  );

  const onSetTag = (tag: ITag) => {
    setTag(tag);
    const form = document.getElementById(formId);
    form?.scrollIntoView();
  };

  const whisperedTags = React.useMemo(() => {
    if (value.length < 1) return [];
    return whisperer(value.toLocaleLowerCase(), tagAddingWhispererLimit).map(
      (entity) => entity.entity
    );
  }, [whisperer, value, tagAddingWhispererLimit]);
  return (
    <Stack spacing={2}>
      <Typography sx={headerStyle} variant="h1">
        Tags
      </Typography>
      <InputTextField value={value} onChange={onValueChange} />
      <TagList
        tags={whisperedTags}
        isLoading={false}
        button={tagButton}
        ContainerElement={TagsContainer}
        TagElement={TagElement}
        onTagClick={onSetTag}
      />
      <hr />
      <TagForm id={formId} close={() => setTag(undefined)} tag={tag} />
    </Stack>
  );
};

const TagsContainer: React.FC<PropsWithChildren> = ({ children }) => (
  <Grid container>{children}</Grid>
);

const TagElementStyles = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};
const TagElement: React.FC<PropsWithChildren> = ({ children }) => (
  <Grid item xl={2} lg={3} sm={4} xs={12} sx={TagElementStyles}>
    {children}
  </Grid>
);

export default TagManager;
