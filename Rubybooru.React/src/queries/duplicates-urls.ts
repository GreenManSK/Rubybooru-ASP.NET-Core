import { DuplicatesOptions } from "./types";

export const getDuplicateUrl = (id?: number) =>
  `/duplicaterecord/${id ? `${id}/` : ""}`;

export const getDuplicatesUrl = (options: DuplicatesOptions) =>
  `${getDuplicateUrl()}${buildDuplicateQuery(options)}`;

export const getDuplicatesCountUrl = () => `${getDuplicateUrl()}count/`;

export const buildDuplicateQuery = (options: DuplicatesOptions) => {
  const queries: string[] = [];

  if (options.imagesPerPage) {
    queries.push(`limit=${options.imagesPerPage}`);
  }

  if (options.page) {
    queries.push(`offset=${options.imagesPerPage * (options.page - 1)}`);
  }

  return `?${queries.join("&")}`;
};
