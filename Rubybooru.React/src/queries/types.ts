export type SearchImagesOptions = {
  imagesPerPage: number;
  page: number;
  tags: number[];
};

export const imagesOptionsToKey = (options: SearchImagesOptions) => [
  options.imagesPerPage,
  options.page,
  options.tags.join(","),
];

export type UntaggedImagesOptions = {
  imagesPerPage: number;
  page: number;
  year?: number;
};

export const untaggedImagesOptionsToKey = (options: UntaggedImagesOptions) => [
  options.imagesPerPage,
  options.page,
  options.year,
];

export type DuplicatesOptions = {
  imagesPerPage: number;
  page: number;
};

export const duplicatesOptionsToKey = (options: DuplicatesOptions) => [
  options.imagesPerPage,
  options.page,
];
