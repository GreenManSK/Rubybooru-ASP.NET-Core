import { Skeleton, Box, Theme, Link } from "@mui/material";
import TagList from "./tag-list";
import { useParams } from "react-router-dom";
import { useGetImageFileUrl, useImage } from "../../queries/images";
import { filesize } from "filesize";
import { useImageTags } from "../../queries/tags";

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
  const { id: idParam = "1" } = useParams();
  const id = parseInt(idParam);

  const { data: image, isLoading } = useImage(id);
  const { data: tags, isLoading: isLoadingTags } = useImageTags(id);

  const fileUrl = useGetImageFileUrl(id);

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
              <Link href={fileUrl}>
                <>
                  {image.width ?? "__"}x{image.height ?? "__"} [
                  {filesize(image.size, { base: 2, standard: "jedec" })}]
                </>
              </Link>
            </>
          </Box>
        </Box>
      )}
      <TagList tags={tags} isLoading={isLoadingTags} />
    </>
  );
};

export default ImageTagList;
