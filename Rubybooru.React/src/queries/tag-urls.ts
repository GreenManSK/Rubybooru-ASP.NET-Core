import { getImageUrl } from "./image-urls";

export const getTagUrl = (id?: number) => `/tag/${id ?? ""}`;

export const getImagesTagsUrl = (ids: number[]) =>
  `${getImageUrl()}tags?${ids.map((id) => `ids=${id}`).join("&")}`;

export const getImageTagUrl = (imageId: number, tagId?: number) =>
  `${getImageUrl(imageId)}tag/${tagId ?? ""}`;

export const getTagDuplicateUrl = (originalId: number, duplicateId: number) =>
  `/tagduplicate/?originalId=${originalId}&duplicateId=${duplicateId}`;
