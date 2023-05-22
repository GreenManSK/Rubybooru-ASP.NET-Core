import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useConfigContext } from "../../providers/config-provider";
import { Image, ImageSkeleton } from "./image";
import { useImages, useImagesCount } from "../../queries/images";
import { PropsWithChildren } from "react";
import { Stack } from "@mui/material";
import React from "react";
import { Pagination } from "./pagination";
import { useParams, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { page: pageParam = "1" } = useParams();
  const page = parseInt(pageParam);
  const { imagesPerPage } = useConfigContext();
  const containerId = "images-container";

  const options = { imagesPerPage, page };

  const { data: images } = useImages(options);
  const { data: imageCount = 1 } = useImagesCount(options);
  const pageCount = Math.ceil(imageCount / imagesPerPage);

  const navigateToPage = (page: number) => {
    navigate(`/${page}`);
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
        page={page}
        pageCount={pageCount}
        onPageChange={navigateToPage}
      />
    </Stack>
  );
};

export default ImageList;
