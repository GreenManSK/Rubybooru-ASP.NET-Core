import { useNavigate, useSearchParams } from "react-router-dom";
import { useUntaggedImagesOptions } from "../../utils/images";
import ImageList from "../image-list/image-list";
import {
  useUntaggedImages,
  useUntaggedImagesCount,
} from "../../queries/images";
import React from "react";

const UntaggedList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const imagesOptions = useUntaggedImagesOptions();

  const { data: images } = useUntaggedImages(imagesOptions);
  const { data: imageCount = 0 } = useUntaggedImagesCount(imagesOptions);

  React.useEffect(() => {
    document.title = `Untagged images`;
  });

  const navigateToPage = (page: number) => {
    navigate({
      pathname: `/untagged/${page}`,
      search: searchParams.toString(),
    });
  };

  return (
    <ImageList
      images={images}
      imageCount={imageCount}
      page={imagesOptions.page}
      imagesPerPage={imagesOptions.imagesPerPage}
      navigateToPage={navigateToPage}
    />
  );
};

export default UntaggedList;
