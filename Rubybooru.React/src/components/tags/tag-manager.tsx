import { Grid } from "@mui/material";
import { useTagUtils } from "../../providers/tag-utils-provider";
import React, { PropsWithChildren } from "react";
import { InputTextField } from "../utils/input-text-field";
import DeleteIcon from "@mui/icons-material/Delete";
import TagList from "../tag-list/tag-list";
import { useConfigContext } from "../../providers/config-provider";
import { ITag } from "../../entities/tag";
import { useDeleteTag } from "../../queries/tags";

const TagManager = () => {
  const { tagAddingWhispererLimit } = useConfigContext();
  const [value, setValue] = React.useState("");
  const { whisperer } = useTagUtils();
  const { mutate: deleteTag } = useDeleteTag();

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

  const whisperedTags = React.useMemo(() => {
    if (value.length < 1) return [];
    return whisperer(value.toLocaleLowerCase(), tagAddingWhispererLimit).map(
      (entity) => entity.entity
    );
  }, [whisperer, value, tagAddingWhispererLimit]);
  return (
    <>
      <InputTextField value={value} onChange={onValueChange} />
      <TagList
        tags={whisperedTags}
        isLoading={false}
        button={tagButton}
        ContainerElement={TagsContainer}
        TagElement={TagElement}
      />
    </>
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
  // TODO: Overflow
  <Grid item xl={2} lg={3} sm={4} xs={12} sx={TagElementStyles}>
    {children}
  </Grid>
);

export default TagManager;
