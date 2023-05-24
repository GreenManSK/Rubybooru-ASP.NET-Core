import React from "react";
import { IDuplicateRecord } from "../../entities/duplicate-record";
import { useGetImagePreviewUrl } from "../../queries/image-urls";
import { previewHeight, previewWidth } from "../../styles.constants";
import { StyledRouterLink, Img } from "../image-list/image";
import Skeleton from "@mui/material/Skeleton";

interface IDuplicateItemProps {
  duplicateRecord: IDuplicateRecord;
}

export const DuplicateItem = ({ duplicateRecord }: IDuplicateItemProps) => {
  const { id, imageA, imageB } = duplicateRecord;
  const [isImgALoaded, setIsImgALoaded] = React.useState(false);
  const [isImgBLoaded, setIsImgBLoaded] = React.useState(false);

  const previewAUrl = useGetImagePreviewUrl(
    imageA.id,
    previewWidth,
    previewHeight
  );
  const previewBUrl = useGetImagePreviewUrl(
    imageB.id,
    previewWidth,
    previewHeight
  );

  return (
    <>
      <StyledRouterLink to={`/duplicate/${id}`}>
        {!isImgALoaded && <ImageSkeleton />}
        <Img
          alt={imageA.name}
          src={previewAUrl}
          onLoad={() => setIsImgALoaded(true)}
          isImgLoaded={isImgALoaded}
        />
        {!isImgBLoaded && <ImageSkeleton />}
        <Img
          alt={imageB.name}
          src={previewBUrl}
          onLoad={() => setIsImgBLoaded(true)}
          isImgLoaded={isImgBLoaded}
        />
      </StyledRouterLink>
    </>
  );
};

const imageSkeletonStyles = {
  margin: "1rem",
};
export const ImageSkeleton = () => (
  <Skeleton
    variant="rectangular"
    height={previewHeight}
    sx={imageSkeletonStyles}
  />
);
