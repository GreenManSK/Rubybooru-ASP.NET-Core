import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { useConfigContext } from "../../providers/config-provider";
import { Image, ImageSkeleton } from "./image";
import { useImages } from "../../queries/images";
import { PropsWithChildren } from "react";

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
  const { imagesPerPage } = useConfigContext();
  const { data: images } = useImages({ imagesPerPage });

  return (
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
  );
};

export default ImageList;
