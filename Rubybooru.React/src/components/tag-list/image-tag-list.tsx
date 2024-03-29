import { Skeleton, Box, Theme, Link } from "@mui/material";
import TagList from "./tag-list";
import { useNavigate, useParams } from "react-router-dom";
import { useDeleteImage, useImage } from "../../queries/images";
import { filesize } from "filesize";
import { useImageTags, useRemoveImageTag } from "../../queries/tags";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ITag } from "../../entities/tag";
import { AddImageTagForm } from "../image/add-image-tag-form";
import { useGetImageFileUrl } from "../../queries/image-urls";

const infoStyles = {
  fontSize: "1.3rem",
  clear: "both",
  padding: ".5rem 1rem 0",
};

const lineStyles = (theme: Theme) => ({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const ImageTagList = () => {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const navigate = useNavigate();

  const { id: idParam = "1" } = useParams();
  const id = parseInt(idParam);

  const { data: image, isLoading } = useImage(id);
  const { data: tags, isLoading: isLoadingTags } = useImageTags(id);
  const { mutate: deleteImage, isSuccess: isDeleted } = useDeleteImage(id);
  const { mutate: removeTag } = useRemoveImageTag(id);

  React.useEffect(() => {
    if (isDeleted) {
      navigate("/");
    }
  }, [isDeleted, navigate]);

  const fileUrl = useGetImageFileUrl(id);

  const onDeleteClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (window.confirm("Do you want to delete this image?")) {
      deleteImage();
    }
  };

  const onRemoveTag = React.useCallback(
    (tag: ITag) => {
      if (window.confirm(`Do you want to remove ${tag.name} from the image?`)) {
        removeTag(tag.id);
      }
    },
    [removeTag]
  );

  return (
    <>
      {isLoading || !image ? (
        <>
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <Box sx={infoStyles}>
          <Box sx={lineStyles}>
            <>
              <strong>Date:</strong> {image?.addedDateTime}
            </>
          </Box>
          <Box sx={lineStyles}>
            <>
              <strong>Size:</strong>
              <Link href={fileUrl} title="Download image">
                {" "}
                <>
                  {image.width ?? "__"}x{image.height ?? "__"} [
                  {filesize(image.size, { base: 2, standard: "jedec" })}]
                </>
              </Link>
            </>
          </Box>
          {isEditMode && (
            <Box sx={lineStyles}>
              <Link title="Delete image" href="#" onClick={onDeleteClick}>
                Delete image
              </Link>
            </Box>
          )}
        </Box>
      )}
      <TagList
        tags={tags}
        isLoading={isLoadingTags}
        button={
          isEditMode
            ? { Icon: DeleteIcon, label: "Remove tag", onClick: onRemoveTag }
            : undefined
        }
      />
      {isEditMode && <AddImageTagForm imageId={id} />}
      <Box sx={infoStyles}>
        <Link
          title="Toggle edit mode"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setIsEditMode(!isEditMode);
          }}
        >
          Toggle edit mode
        </Link>
      </Box>
    </>
  );
};

export default ImageTagList;
