import ImageList from "./image-list";
import { useImagesCount } from "../../queries/images";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useSearchImages, useSearchImagesOptions } from "../../utils/images";

export const SearchImageList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchOptions = useSearchImagesOptions();
  const { page, imagesPerPage } = searchOptions;

  const images = useSearchImages();
  const { data: imageCount = 1 } = useImagesCount(searchOptions);

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
