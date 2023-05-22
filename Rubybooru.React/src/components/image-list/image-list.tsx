import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useConfigContext } from "../../providers/config-provider";
import { Image, ImageSkeleton } from "./image";
import { useImages, useImagesCount } from "../../queries/images";
import { PropsWithChildren } from "react";
import { Stack } from "@mui/material";
import React from "react";
import { Pagination } from "./pagination";

// TODO: Responsive

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
  const [page, setPage] = React.useState(1);
  const { imagesPerPage } = useConfigContext();

  const options = { imagesPerPage, page };

  const { data: images } = useImages(options);
  const { data: imageCount = 1 } = useImagesCount(options);
  const pageCount = Math.ceil(imageCount / imagesPerPage);

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
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
      <Pagination page={page} pageCount={pageCount} onPageChange={setPage} />
    </Stack>
  );
};

export default ImageList;
