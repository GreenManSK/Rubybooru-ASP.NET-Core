import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Image, ImageSkeleton } from "./image";
import { useImagesCount } from "../../queries/images";
import { PropsWithChildren } from "react";
import { Stack } from "@mui/material";
import React from "react";
import { Pagination } from "./pagination";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useSearchImages, useSearchImagesOptions } from "../../utils/images";

const gridStyles = {
  textAlign: "center",
  justifyContent: "center",
  flexDirection: "column",
  display: "flex",
};

const ImageItem: React.FC<PropsWithChildren> = ({ children }) => (
  <Grid xl={2} lg={3} sm={4} xs={12} sx={gridStyles}>
    {children}
  </Grid>
);

const ImageList = () => {
  const containerId = "images-container";
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchOptions = useSearchImagesOptions();
  const { page, imagesPerPage } = searchOptions;

  const images = useSearchImages();
  const { data: imageCount = 1 } = useImagesCount(searchOptions);
  const pageCount = Math.ceil(imageCount / imagesPerPage);

  const navigateToPage = (page: number) => {
    navigate({
      pathname: `/${page}`,
      search: searchParams.toString(),
    });
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
