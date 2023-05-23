import { Box, Skeleton, styled } from "@mui/material";
import { contentPadding } from "../../App.styles";
import { useParams } from "react-router-dom";
import { useImage } from "../../queries/images";
import React from "react";
import { hiddenStyle } from "../../styles.constants";
import { useFocusMode } from "../../providers/focus-mode-provider";
import { useGetImageFileUrl } from "../../queries/image-urls";

const boxStyles = {
  textAlign: "center",
};

const fullscreenBoxStyles = {
  position: "fixed",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  background: "#000",
  zIndex: 1000,
  "& img": {
    maxHeight: "100vh",
    maxWidth: "100vw",
  },
};

const imageStyles = {
  cursor: "pointer",
};

const miniImageStyles = {
  maxWidth: "100%",
  maxHeight: `calc(100vh - 2*${contentPadding})`,
};

const Img = styled("img")(imageStyles);

const Image = () => {
  const [isMini, setIsMini] = React.useState(true);
  const { isFocusMode } = useFocusMode();

  const { id: idParam = "1" } = useParams();
  const id = parseInt(idParam);
  const { data: image } = useImage(id);

  const fileUrl = useGetImageFileUrl(id);
  const [isImgLoaded, setIsImgLoaded] = React.useState(false);
  const previousImageRef = React.useRef<string>("");
  const currentImageRef = React.useRef<string>(fileUrl);

  React.useEffect(() => {
    previousImageRef.current = currentImageRef.current;
    currentImageRef.current = fileUrl;
    if (previousImageRef.current === currentImageRef.current) return;

    setIsImgLoaded(false);
  }, [fileUrl]);

  const havePreviousImage =
    previousImageRef.current !== currentImageRef.current;

  return (
    <Box sx={[boxStyles, isFocusMode ? fullscreenBoxStyles : {}]}>
      {!isImgLoaded && !havePreviousImage && (
        <Skeleton variant="rectangular" height={"95vh"} />
      )}
      {!isImgLoaded && havePreviousImage && (
        <>
          <Skeleton
            variant="rectangular"
            height={"95vh"}
            sx={{
              backgroundImage: `url(${previousImageRef.current})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </>
      )}
      <Img
        alt={image?.name}
        src={fileUrl}
        onLoad={() => setIsImgLoaded(true)}
        sx={[isMini ? miniImageStyles : {}, isImgLoaded ? {} : hiddenStyle]}
        onClick={() => setIsMini(!isMini)}
      />
    </Box>
  );
};

export default Image;
