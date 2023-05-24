import { Link, Theme, Skeleton } from "@mui/material";
import { IImage } from "../../entities/image";
import styled from "@emotion/styled";
import React from "react";
import {
  hiddenStyle,
  previewHeight,
  previewWidth,
} from "../../styles.constants";
import {
  useGetImageFileUrl,
  useGetImagePreviewUrl,
} from "../../queries/image-urls";
import { Link as RouterLink, LinkProps } from "react-router-dom";

export interface IImageProps {
  image: IImage;
}

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

export const Img = styled("img", {
  shouldForwardProp: (prop) => prop !== "isImgLoaded",
})<{ isImgLoaded?: boolean }>((props) => ({
  display: "inline-block",
  maxWidth: "100%",
  maxHeight: previewHeight,
  ...(props.isImgLoaded !== undefined && !props.isImgLoaded ? hiddenStyle : {}),
}));

export const StyledRouterLink = styled(RouterLink, {
  shouldForwardProp: (prop) => prop !== "isImgLoaded",
})<LinkProps & { isImgLoaded?: boolean }>((props) => ({
  ...imgLinkStyle(props.theme as unknown as any),
  ...(props.isImgLoaded !== undefined && !props.isImgLoaded ? hiddenStyle : {}),
}));

export const Image = ({ image }: IImageProps) => {
  const [isImgLoaded, setIsImgLoaded] = React.useState(false);
  const { id, name, width, height } = image;

  const previewUrl = useGetImagePreviewUrl(id, previewWidth, previewHeight);
  const fileUrl = useGetImageFileUrl(id);

  return (
    <>
      {!isImgLoaded && (
        <Skeleton variant="rectangular" height={previewHeight} />
      )}
      <StyledRouterLink to={`/image/${id}`} isImgLoaded={isImgLoaded}>
        <Img alt={name} src={previewUrl} onLoad={() => setIsImgLoaded(true)} />
      </StyledRouterLink>
      <Link href={fileUrl} target="_blank" sx={downloadLinkStyle}>
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
