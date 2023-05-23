import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Image, ImageSkeleton } from "./image";
import { PropsWithChildren } from "react";
import { Stack } from "@mui/material";
import React from "react";
import { Pagination } from "./pagination";
import { IImage } from "../../entities/image";

const gridStyles = {
  textAlign: "center",
  justifyContent: "center",
  flexDirection: "column",
  display: "flex",
};

export interface IImageListProps {
  images?: IImage[];
  page: number;
  imageCount: number;
  imagesPerPage: number;
  navigateToPage: (page: number) => void;
}

const ImageItem: React.FC<PropsWithChildren> = ({ children }) => (
  <Grid xl={2} lg={3} sm={4} xs={12} sx={gridStyles}>
    {children}
  </Grid>
);

const ImageList = (props: IImageListProps) => {
  const { imageCount, imagesPerPage, images, page } = props;
  const containerId = "images-container";

  const pageCount = Math.ceil(imageCount / imagesPerPage);

  const navigateToPage = (page: number) => {
    props.navigateToPage(page);
    document.getElementById(containerId)?.scrollIntoView();
  };

  return (
    <Stack spacing={2}>
      <Grid id={containerId} container spacing={2}>
        {images
          ? images.map((image) => (
              <ImageItem key={image.id}>
                <Image image={image} />
              </ImageItem>
            ))
          : [...new Array(imagesPerPage)].map((_, i) => (
              <ImageItem key={i}>
                <ImageSkeleton />
              </ImageItem>
            ))}
      </Grid>
      <Pagination
        items={imageCount}
        page={page}
        pageCount={pageCount}
        onPageChange={navigateToPage}
      />
    </Stack>
  );
};

export default ImageList;
