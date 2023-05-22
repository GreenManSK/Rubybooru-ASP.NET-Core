import { Link, Theme, Skeleton } from "@mui/material";
import { IImage } from "../../entities/image";
import styled from "@emotion/styled";
import React from "react";
import { hiddenStyle } from "../../styles.constants";
import { useGetImagePreviewUrl } from "../../queries/images";

export interface IImageProps {
  image: IImage;
}

const previewWidth = 350;
const previewHeight = 180;

// TODO: Navigation link

const imgLinkStyle = (theme: Theme) => ({
  display: "block",
  lineHeight: 0,
  img: {
    border: `3px solid ${theme.palette.secondary.main}`,
  },
  "&:hover img": {
    borderColor: theme.palette.primary.main,
  },
});

const downloadLinkStyle = (theme: Theme) => ({
  fontSize: "1.1rem",
  opacity: 0.6,
  width: "100%",
  display: "block",
  background: theme.palette.primary.contrastText,
  "&:hover": {
    opacity: 1,
  },
});

const Img = styled("img")({
  display: "inline-block",
  maxWidth: "100%",
  maxHeight: previewHeight,
});

export const Image = ({ image }: IImageProps) => {
  const [isImgLoaded, setIsImgLoaded] = React.useState(false);
  const { id, name, path, width, height } = image;

  const previewUrl = useGetImagePreviewUrl(id, previewWidth, previewHeight);

  return (
    <>
      {!isImgLoaded && (
        <Skeleton variant="rectangular" height={previewHeight} />
      )}
      <Link href="#img" sx={[imgLinkStyle, !isImgLoaded ? hiddenStyle : {}]}>
        <Img alt={name} src={previewUrl} onLoad={() => setIsImgLoaded(true)} />
      </Link>
      <Link href={path} target="_blank" sx={downloadLinkStyle}>
        {width ?? "__"}x{height ?? "__"}
      </Link>
    </>
  );
};

export const ImageSkeleton = () => {
  return (
    <>
      <Skeleton variant="rectangular" height={previewHeight} />
      <Skeleton variant="text" />
    </>
  );
};
