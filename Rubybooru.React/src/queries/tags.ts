import { ITag } from "./../entities/tag";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useHttpClient } from "../providers/http-client-provider";
import { getImageUrl } from "./images";
import React from "react";

const TagQueryKeys = {
  tags: "tags",
  imagesTags: "images-tags",
  imageTags: "image-tags",
};

export const useTags = () => {
  const client = useHttpClient();

  return useQuery<ITag[]>({
    queryKey: [TagQueryKeys.tags],
    queryFn: () => client.get<ITag[]>(getTagUrl()),
  });
};

export const useImagesTags = (
  ids: number[],
  options: UseQueryOptions<{ [key: string]: ITag[] }> = {}
) => {
  const client = useHttpClient();

  return useQuery<{ [key: string]: ITag[] }>({
    queryKey: [TagQueryKeys.imagesTags, ...ids],
    queryFn: () => client.get<{ [key: string]: ITag[] }>(getImagesTagsUrl(ids)),
    ...options,
  });
};

export const useImageTags = (id: number) => {
  const client = useHttpClient();
  return useQuery<ITag[]>({
    queryKey: [TagQueryKeys.imageTags, id],
    queryFn: () => client.get<ITag[]>(`${getImageUrl(id)}/tag`),
  });
};

const getTagUrl = (id?: number) => `/tag/${id ?? ""}`;

const getImagesTagsUrl = (ids: number[]) =>
  `${getImageUrl()}/tags?${ids.map((id) => `ids=${id}`).join("&")}`;
