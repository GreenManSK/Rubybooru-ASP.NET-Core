import { TagType } from "../entities/tag";
import { useConfigContext } from "../providers/config-provider";
import { SearchImagesOptions, UntaggedImagesOptions } from "./types";

export const getImageUrl = (id?: number) => `/image/${id ? `${id}/` : ""}`;

export const useGetImagePreviewUrl = (
  id: number,
  width: number,
  height: number,
  keepAspectRatio = true
) => {
  const { restUrl } = useConfigContext();
  return `${restUrl}${getImageUrl(
    id
  )}preview?width=${width}&height=${height}&keepAspectRatio=${keepAspectRatio}`;
};

export const useGetImageFileUrl = (id: number) => {
  const { restUrl } = useConfigContext();
  return `${restUrl}${getImageUrl(id)}file/`;
};

export const randomImageUrl = `${getImageUrl()}random/`;

export const getUntaggedBaseUrl = () => `${getImageUrl()}without-tag/`;

export const getImageSearchUrl = (options: SearchImagesOptions) =>
  `${getImageUrl()}${buildImagesQuery(options)}`;

export const getImageSearchCountUrl = (options: SearchImagesOptions) =>
  `${getImageUrl()}count/${buildImagesQuery(options)}`;

  export const getUntaggedUrl = (options: UntaggedImagesOptions) =>
  `${getUntaggedBaseUrl()}${buildUntaggedQuery(options)}`;

  export const getUntaggedCountUrl = (options: UntaggedImagesOptions) =>
    `${getUntaggedBaseUrl()}count/${buildUntaggedQuery(options)}`;

export const buildImagesQuery = (options: SearchImagesOptions) => {
  const queries: string[] = [];

  if (options.imagesPerPage) {
    queries.push(`limit=${options.imagesPerPage}`);
  }

  if (options.page) {
    queries.push(`offset=${options.imagesPerPage * (options.page - 1)}`);
  }

  if (options.tags.length) {
    options.tags.forEach((tag) => queries.push(`withTags=${tag}`));
  }

  return `?${queries.join("&")}`;
};

export const buildUntaggedQuery = (options: UntaggedImagesOptions) => {
  const queries: string[] = [];

  if (options.imagesPerPage) {
    queries.push(`limit=${options.imagesPerPage}`);
  }

  if (options.page) {
    queries.push(`offset=${options.imagesPerPage * (options.page - 1)}`);
  }

  queries.push(`tagType=${TagType.Copyright}`);

  return `?${queries.join("&")}`;
};
