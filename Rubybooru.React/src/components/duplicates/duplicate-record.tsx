import Grid from "@mui/material/Grid";
import { Link, useParams } from "react-router-dom";
import { useDuplicate } from "../../queries/duplicates";
import { IImage } from "../../entities/image";
import Skeleton from "@mui/material/Skeleton";
import { useGetImageFileUrl } from "../../queries/image-urls";
import { contentPadding } from "../../App.styles";
import React from "react";
import { styled } from "@mui/material";
import { hiddenStyle } from "../../styles.constants";
import { filesize } from "filesize";

const DuplicateRecord = () => {
  const { id: idParam = "1" } = useParams();
  const id = parseInt(idParam);

  const { data } = useDuplicate(id);

  return (
    <Grid container spacing={2}>
      <Duplicate image={data?.imageA} />
      <Duplicate image={data?.imageB} />
    </Grid>
  );
};

interface IDuplicateProps {
  image?: IImage;
}

const boxStyles = {
  padding: "0 1rem",
  textAlign: "center",
};
const Img = styled("img")({
  maxWidth: "100%",
  maxHeight: `calc(100vh - 2*${contentPadding})`,
});

const Duplicate = ({ image }: IDuplicateProps) => {
  const [isImgLoaded, setIsImgLoaded] = React.useState(false);
  const fileUrl = useGetImageFileUrl(image?.id ?? 0);

  return (
    <Grid md={6} xs={12} sx={boxStyles} item>
      <>
        {image?.name ?? <Skeleton variant="text" />}
        <br />
        {image ? (
          `${image.width ?? "__"}x${image.height ?? "__"}`
        ) : (
          <Skeleton variant="text" />
        )}
        {image?.size
          ? ` [${filesize(image.size, { base: 2, standard: "jedec" })}]`
          : null}
        <br />
        <Link title={image?.name} to={`/image/${image?.id}`} target="_blank">
          {!isImgLoaded && <Skeleton variant="rectangular" height={"95vh"} />}
          <Img
            alt={image?.name}
            src={fileUrl}
            sx={isImgLoaded ? {} : hiddenStyle}
            onLoad={() => setIsImgLoaded(true)}
          />
        </Link>
      </>
    </Grid>
  );
};

export default DuplicateRecord;
