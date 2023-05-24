import ImageList from "./image-list";
import { useImagesCount } from "../../queries/images";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useSearchImages, useSearchImagesOptions } from "../../utils/images";
import { DEFAULT_TITLE } from "../../constants";
import React from "react";
import { useImageSearchParams } from "../../utils/navigation-helpers";

export const SearchImageList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [{ tags }] = useImageSearchParams();
  const searchOptions = useSearchImagesOptions();
  const { page, imagesPerPage } = searchOptions;

  const images = useSearchImages();
  const { data: imageCount = 1 } = useImagesCount(searchOptions);

  React.useEffect(() => {
    document.title = tags.length
      ? tags.map((t) => t.name).join(" ")
      : DEFAULT_TITLE;
  }, [tags]);

  const navigateToPage = (page: number) => {
    navigate({
      pathname: `/${page}`,
      search: searchParams.toString(),
    });
  };

  return (
    <ImageList
      images={images}
      imageCount={imageCount}
      page={page}
      imagesPerPage={imagesPerPage}
      navigateToPage={navigateToPage}
    />
  );
};
export default SearchImageList;
