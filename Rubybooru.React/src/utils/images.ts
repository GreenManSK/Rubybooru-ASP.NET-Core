import { useParams } from "react-router";
import { useConfigContext } from "../providers/config-provider";
import { useImages } from "../queries/images";
import { useSearchTags, useUntaggedYear } from "./navigation-helpers";

export const useSearchImagesOptions = () => {
  const { imagesPerPage } = useConfigContext();
  const { page: pageParam = "1" } = useParams();
  const page = parseInt(pageParam);
  const [tags] = useSearchTags();
  return { imagesPerPage, page, tags: tags.map((x) => x.id) };
};

export const useSearchImages = () => {
  const options = useSearchImagesOptions();
  const { data } = useImages(options);
  return data;
};

export const useUntaggedImagesOptions = () => {
  const { imagesPerPage } = useConfigContext();
  const [year] = useUntaggedYear();
  const { page: pageParam = "1" } = useParams();
  const page = parseInt(pageParam);
  return { imagesPerPage, page, year };
};
